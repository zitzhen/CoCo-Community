// @ts-nocheck
export const onRequest: PagesFunction<Env> = async (context) => {
  const { request, env } = context;

  const url = new URL(request.url);
  const name = url.searchParams.get("name");

  if (!name) {
    return new Response("Missing 'name' parameter", { status: 400 });
  }

  try {
    // 查询当前 pageviews 数值
    const getStmt = env.DB.prepare("SELECT pageviews FROM user WHERE name = ?");
    const getResult = await getStmt.bind(name).first<{ pageviews: number }>();

    if (!getResult) {
      return new Response(`Component '${name}' not found`, { status: 404 });
    }

    const currentpageviews = getResult.pageviews ?? 0;
    const newpageviews = currentpageviews + 1;

    // 更新 pageviews 字段
    const updateStmt = env.DB.prepare("UPDATE user SET pageviews = ? WHERE name = ?");
    await updateStmt.bind(newpageviews, name).run();

    return new Response(`Updated '${name}' pageviews to ${newpageviews}`, {
      status: 200,
    });
  } catch (err: any) {
    return new Response(`Error: ${err.message}`, { status: 500 });
  }
};