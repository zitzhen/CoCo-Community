export const onRequest: PagesFunction<Env> = async (context) => {
  const { request, env } = context;

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
      return new Response(`Component '${name}' not found`, { status: 404 });
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
};