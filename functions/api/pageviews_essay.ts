// @ts-nocheck
export const onRequest: PagesFunction<Env> = async (context) => {
  const { request, env } = context;

  const url = new URL(request.url);
  const name = url.searchParams.get("name");

  if (!name) {
    return new Response("Missing 'name' parameter", { status: 400 });
  }

  try {
    // 用原子操作更新 pageviews，避免类型转换和并发问题
    const updateStmt = env.DB.prepare("UPDATE essay SET pageviews = pageviews + 1 WHERE name = ?");
    const updateResult = await updateStmt.bind(name).run();

    if (!updateResult.success || updateResult.meta.changes === 0) {
      return new Response(`Essay '${name}' not found`, { status: 404 });
    }

    // 获取更新后的值
    const getStmt = env.DB.prepare("SELECT pageviews FROM essay WHERE name = ?");
    const getResult = await getStmt.bind(name).first<{ pageviews: number }>();

    return new Response(`Updated '${name}' pageviews to ${getResult?.pageviews}`, {
      status: 200,
    });
  } catch (err: any) {
    return new Response(`Error: ${err.message}`, { status: 500 });
  }
};