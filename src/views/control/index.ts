import { marked } from "marked";
import { ReadmeResult, AuthorInfo, ControlInfo } from '@types';

// README 候选路径
export async function fetchReadmeCandidate(id: string): Promise<ReadmeResult> {
  const candidates = [
    `/information/readme/control/${id}/README.md`,
    `/information/readme/control/${id}/readme.md`,
    `/information/readme/control/${id}/Readme.md`,
    `/information/readme/control/${id}/README.MD`,
    `/information/readme/control/${id}/README.markdown`,
    `/information/control/${id}/README.md`,
    `/information/control/${id}/readme.md`,
    `/readme/control/${id}/README.md`,
    `/readme/control/${id}/readme.md`,
  ];

  let firstHtml = null;

  for (const url of candidates) {
    try {
      const res = await fetch(url);
      const text = await res.text().catch(() => "");
      const ct = (res.headers.get("content-type") || "").toLowerCase();

      if (!res.ok) {
        console.debug("[ControlDetail] README 候选未命中：", url, res.status);
        continue;
      }

      if (ct.includes("text/html") || /<!doctype|<html/i.test(text)) {
        if (!firstHtml) firstHtml = { url, status: res.status, snippet: text.slice(0, 1024) };
        console.warn("[ControlDetail] README 返回 HTML（可能是 index.html）: ", url);
        continue;
      }

      return { url, text };
    } catch (err) {
      console.warn("[ControlDetail] 请求 README 异常：", url, err);
      continue;
    }
  }

  return { error: true, firstHtml };
}

// 获取控件信息的函数
export async function fetchControlData(id: string): Promise<{
  jsonData: ControlInfo;
  fileSize: string;
  introduceHtml: string;
  avatar: string;
  authorName: string;
  authorBio: string;
  downloadUrl: string;
  sourceUrl: string;
  versions: string[];
}> {
  // 1) information.json
  const infoUrl = `/information/control/${id}/information.json`;
  const infoRes = await fetch(infoUrl);
  if (!infoRes.ok) {
    const body = await infoRes.text().catch(() => "");
    console.warn("[ControlDetail] information.json 错误响应：", infoUrl, infoRes.status, body.slice?.(0, 500));
    throw new Error(`未找到 information.json：${infoUrl} （HTTP ${infoRes.status}）`);
  }
  const jsonData: ControlInfo = await infoRes.json();

  // 2) 控件文件（计算大小）
  const controlUrl = `/control/${id}/control.jsx`;
  const controlRes = await fetch(controlUrl);
  if (!controlRes.ok) {
    const body = await controlRes.text().catch(() => "");
    console.warn("[ControlDetail] control.jsx 错误响应：", controlUrl, controlRes.status, body.slice?.(0, 500));
    throw new Error(`未找到控件文件：${controlUrl} （HTTP ${controlRes.status}）`);
  }
  const controlBlob = await controlRes.blob();
  const fileSize = (controlBlob.size / 1024).toFixed(2);

  // 3) README
  const readmeResult = await fetchReadmeCandidate(id);
  let introduceHtml = "<p>正在处理</p>";
  if (readmeResult.error) {
    if (readmeResult.firstHtml) {
      introduceHtml =
        `<p style="color:#b33">未能正确加载 README.md（服务器返回 HTML 或 路径不匹配）。</p>` +
        `<p>请确认文件存在于 <code>public/information/readme/control/${id}/README.md</code>，并且文件名大小写完全匹配。</p>`;
    } else {
      introduceHtml =
        `<p style="color:#b33">未能找到 README.md（尝试了常见大小写与目录）。</p>` +
        `<p>请确认文件存在于 <code>public/information/readme/control/${id}/README.md</code>。</p>`;
    }
  } else {
    introduceHtml = marked.parse(readmeResult.text || "");
  }

  // 4) Github 作者信息
  let avatar = "";
  let authorName = "正在加载";
  let authorBio = "正在加载";
  
  if (jsonData && jsonData.author) {
    try {
      const creatorRes = await fetch(`https://api.github.com/users/${jsonData.author}`);
      if (creatorRes.ok) {
        const creator: AuthorInfo = await creatorRes.json();
        avatar = creator.avatar_url || "";
        authorName = creator.name || jsonData.author;
        authorBio = creator.bio || "";
      } else {
        authorName = jsonData.author;
      }
    } catch (err) {
      console.warn("[ControlDetail] 获取 Github 信息失败：", err);
      authorName = jsonData.author;
    }
  }

  const downloadUrl = `/control/${id}/control.jsx`;
  const sourceUrl = downloadUrl;
  const versions = Array.isArray(jsonData.Version_number_list) ? jsonData.Version_number_list : [];

  return {
    jsonData,
    fileSize,
    introduceHtml,
    avatar,
    authorName,
    authorBio,
    downloadUrl,
    sourceUrl,
    versions
  };
}