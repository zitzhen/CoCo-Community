import { getCloudflareContext } from "~/server/utils/cloudflare"
export default defineEventHandler(async (event) => {
  const { request, env } = getCloudflareContext(event);

  const url = new URL(request.url);
  const name = url.searchParams.get("name");

  if (!name) {
    return new Response("Missing 'name' parameter", { status: 400 });
  }

  try {
    // 查询当前 Pageviews 数值
    const getStmt = env.DB.prepare("SELECT Pageviews FROM components WHERE name = ?");
    const getResult = await getStmt.bind(name).first<{ Pageviews: number }>();

    if (!getResult) {
      // 计数行缺失自愈：历史上提交接口的 D1 登记失败过，可能存在 R2 有控件、
      // D1 无计数行的不一致数据。R2 是控件的真实来源——控件确实存在则补建行
      // （初始 Pageviews 直接计 1，即本次访问），R2 不存在才判定 404。
      const infoObj = await env.RESOURCES.get(`${name}/information.json`);
      if (!infoObj) {
        return new Response(`Component '${name}' not found`, { status: 404 });
      }
      try {
        await env.DB.prepare(
          "INSERT INTO components (name, downloads, likes, collections, Pageviews) VALUES (?, 0, 0, 0, 1)"
        ).bind(name).run();
      } catch (insertErr: any) {
        // 并发下重复插入可忽略（如已建 name 唯一索引）
        console.warn("[pageviews] counter row create skipped:", insertErr?.message);
      }
      return new Response(`Updated '${name}' Pageviews to 1`, { status: 200 });
    }

    const currentPageviews = getResult.Pageviews ?? 0;
    const newPageviews = currentPageviews + 1;

    // 更新 Pageviews 字段
    const updateStmt = env.DB.prepare("UPDATE components SET Pageviews = ? WHERE name = ?");
    await updateStmt.bind(newPageviews, name).run();

    return new Response(`Updated '${name}' Pageviews to ${newPageviews}`, {
      status: 200,
    });
  } catch (err: any) {
    return new Response(`Error: ${err.message}`, { status: 500 });
  }
});