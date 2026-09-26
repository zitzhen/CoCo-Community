import { getCloudflareContext } from "~/server/utils/cloudflare"
// @ts-nocheck
import { jwtVerify } from 'jose'

// 控件提交：仅允许已登录 GitHub 用户，写入 R2 并在 D1 登记计数行
// - 新控件：创建 <name>/information.json + <name>/<version>/control.jsx（+ 可选 README.md）
// - 已有控件：仅作者本人可提交新版本，合并版本列表并更新 Current_version
const MAX_JSX_SIZE = 100 * 1024 // 100 KiB
const MAX_README_SIZE = 100 * 1024 // 100 KiB
const NAME_RE = /^[A-Za-z0-9][A-Za-z0-9_-]{0,63}$/
const VERSION_RE = /^\d{1,4}(\.\d{1,4}){0,3}$/

export default defineEventHandler(async (event) => {
  const { request, env } = getCloudflareContext(event)

  try {
    // ---------- 1. 登录校验（与 /api/me 相同的 Cookie + JWT 双令牌模式） ----------
    const cookieHeader = request.headers.get("Cookie") || "";
    const tokenMatch = cookieHeader.match(/(?:^|;\s*)token=([^;]+)/);
    const token = tokenMatch ? decodeURIComponent(tokenMatch[1]) : null;
    const maximum_lifespan_token = cookieHeader
      .split(';')
      .find(row => row.trim().startsWith('maximum_lifespan='))
      ?.split('=')[1] || null;

    if (!token || token.length < 10 || !maximum_lifespan_token) {
      return new Response(JSON.stringify({ error: "unauthenticated" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }

    const secretKey = env.COCO_COMMUNITY_JWT;
    if (!secretKey) {
      return new Response(JSON.stringify({ error: "server_configuration_error" }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }

    let decodedToken;
    try {
      const secret = new TextEncoder().encode(secretKey);
      const { payload } = await jwtVerify(maximum_lifespan_token, secret);
      decodedToken = payload;
    } catch {
      return new Response(JSON.stringify({ error: "invalid_session" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }

    const githubRes = await fetch("https://api.github.com/user", {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
        "User-Agent": "Cloudflare-Worker-OAuth",
      },
    });

    if (!githubRes.ok) {
      return new Response(JSON.stringify({ error: "invalid_github_token" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }

    const user = await githubRes.json();
    if (decodedToken.username !== user.login) {
      return new Response(JSON.stringify({ error: "username_mismatch" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }

    // ---------- 2. 解析 multipart 表单 ----------
    const parts = await readMultipartFormData(event);
    if (!parts || parts.length === 0) {
      return new Response(JSON.stringify({ error: "invalid_form" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const name = (parts.find((p) => p.name === "name")?.data.toString("utf-8") || "").trim();
    const version = (parts.find((p) => p.name === "version")?.data.toString("utf-8") || "").trim();
    const readmePart = parts.find((p) => p.name === "readme");
    const filePart = parts.find((p) => p.name === "file");

    if (!NAME_RE.test(name)) {
      return new Response(JSON.stringify({ error: "invalid_name" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    if (!VERSION_RE.test(version)) {
      return new Response(JSON.stringify({ error: "invalid_version" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    if (!filePart || !filePart.data || filePart.data.length === 0) {
      return new Response(JSON.stringify({ error: "missing_file" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    if (!/\.jsx$/i.test(filePart.filename || "")) {
      return new Response(JSON.stringify({ error: "invalid_file_type" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    if (filePart.data.length > MAX_JSX_SIZE) {
      return new Response(JSON.stringify({ error: "file_too_large" }), {
        status: 413,
        headers: { "Content-Type": "application/json" },
      });
    }

    const readmeText = readmePart?.data ? readmePart.data.toString("utf-8") : "";
    if (readmeText.length > MAX_README_SIZE) {
      return new Response(JSON.stringify({ error: "readme_too_large" }), {
        status: 413,
        headers: { "Content-Type": "application/json" },
      });
    }

    // ---------- 3. 读取已有 information.json，校验归属 ----------
    const infoKey = `${name}/information.json`;
    const existingObj = await env.RESOURCES.get(infoKey);
    let info;
    if (existingObj) {
      try {
        info = JSON.parse(await existingObj.text());
      } catch {
        info = null;
      }
      if (!info || typeof info !== "object") {
        return new Response(JSON.stringify({ error: "control_info_corrupted" }), {
          status: 409,
          headers: { "Content-Type": "application/json" },
        });
      }
      // 已有作者且不是当前登录用户 → 拒绝（作者信息缺失的旧数据允许认领）
      if (info.author && info.author !== user.login) {
        return new Response(JSON.stringify({ error: "name_taken_by_other" }), {
          status: 403,
          headers: { "Content-Type": "application/json" },
        });
      }
      const versions = Array.isArray(info.Version_number_list) ? info.Version_number_list : [];
      if (!versions.includes(version)) versions.push(version);
      info.Version_number_list = versions;
      info.Current_version = version;
      if (!info.author) info.author = user.login;
    } else {
      info = {
        author: user.login,
        Current_version: version,
        Version_number_list: [version],
      };
    }

    // ---------- 4. 写入 R2 ----------
    await env.RESOURCES.put(`${name}/${version}/control.jsx`, filePart.data, {
      httpMetadata: { contentType: "text/javascript; charset=utf-8" },
    });

    await env.RESOURCES.put(infoKey, JSON.stringify(info, null, 2) + "\n", {
      httpMetadata: { contentType: "application/json; charset=utf-8" },
    });

    if (readmeText.trim()) {
      await env.RESOURCES.put(`${name}/README.md`, readmeText, {
        httpMetadata: { contentType: "text/markdown; charset=utf-8" },
      });
    }

    // ---------- 5. D1 登记计数行（已存在则不动，失败不影响提交） ----------
    try {
      await env.DB.prepare(
        "INSERT INTO components (name, downloads, likes, collections, Pageviews) VALUES (?1, 0, 0, 0, 0) ON CONFLICT(name) DO NOTHING"
      )
        .bind(name)
        .run();
    } catch {
      // D1 不可用（如本地未建表）不影响控件提交
    }

    return new Response(
      JSON.stringify({ ok: true, name, version, existing: Boolean(existingObj) }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (err: any) {
    return new Response(JSON.stringify({ error: "server_error", message: err.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
});
