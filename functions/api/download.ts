export const onRequest: PagesFunction<Env> = async (context) => {
  const { request, env } = context;

  const url = new URL(request.url);
  const name = url.searchParams.get("name");

  if (!name) {
    return new Response("Missing 'name' parameter", { status: 400 });
  }

  try {
    // 查询当前 downloads 数值
    const getStmt = env.DB.prepare("SELECT downloads FROM components WHERE name = ?");
    const getResult = await getStmt.bind(name).first<{ downloads: number }>();

    if (!getResult) {
      return new Response(`Component '${name}' not found`, { status: 404 });
    }

    const currentDownloads = getResult.downloads ?? 0;
    const newDownloads = currentDownloads + 1;

    // 更新 downloads 字段
    const updateStmt = env.DB.prepare("UPDATE components SET downloads = ? WHERE name = ?");
    await updateStmt.bind(newDownloads, name).run();

    return new Response(`Updated '${name}' downloads to ${newDownloads}`, {
      status: 200,
    });
  } catch (err: any) {
    return new Response(`Error: ${err.message}`, { status: 500 });
  }
};
