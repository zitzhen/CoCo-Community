// @ts-nocheck
import type { Env } from "./types";

export const onRequestGet: PagesFunction<Env> = async (context) => {
  try {
    const { request, env } = context;
    const url = new URL(request.url);

    // 获取客户端 IP
    const ip =
      request.headers.get("CF-Connecting-IP") ||
      request.headers.get("x-forwarded-for") ||
      "unknown";

    // 获取 GET 参数 ?url=xxx
    const targetUrl = url.searchParams.get("url") || url.pathname;

    // 写入数据库
    await env.DB.prepare(
      "INSERT INTO log (ip, url) VALUES (?1, ?2)"
    ).bind(ip, targetUrl).run();

    return new Response(
      JSON.stringify({
        status: "success",
        ip,
        url: targetUrl,
        time: new Date().toISOString(),
      }),
      {
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (err: any) {
    return new Response(
      JSON.stringify({ status: "error", message: err.message }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
};