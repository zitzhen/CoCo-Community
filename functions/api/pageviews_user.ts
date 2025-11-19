// @ts-nocheck
export const onRequest: PagesFunction<Env> = async (context) => {
  const { request, env } = context;

  const url = new URL(request.url);
  const username = url.searchParams.get("username");

  if (!username) {
    return new Response("Missing 'username' parameter", { status: 400 });
  }

  try {
    // 查询当前 pageviews 数值
    const getStmt = env.DB.prepare("SELECT pageviews FROM user WHERE username = ?");
    const getResult = await getStmt.bind(username).first<{ pageviews: number }>();

    if (!getResult) {
      return new Response(`Component '${username}' not found`, { status: 404 });
    }

    const currentpageviews = getResult.pageviews ?? 0;
    const newpageviews = currentpageviews + 1;

    // 更新 pageviews 字段
    const updateStmt = env.DB.prepare("UPDATE user SET pageviews = ? WHERE username = ?");
    await updateStmt.bind(newpageviews, username).run();

    return new Response(`Updated '${username}' pageviews to ${newpageviews}`, {
      status: 200,
    });
  } catch (err: any) {
    return new Response(`Error: ${err.message}`, { status: 500 });
  }
};