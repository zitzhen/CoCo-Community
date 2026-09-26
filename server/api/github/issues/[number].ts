import { getCloudflareContext } from "~/server/utils/cloudflare"
import { assertAllowedOrigin, getGithubToken, githubHeaders } from "~/server/utils/github"

export default defineEventHandler(async (event) => {
  const { request } = getCloudflareContext(event);
  const forbidden = assertAllowedOrigin(request);
  if (forbidden) return forbidden;

  const token = getGithubToken(request);
  if (!token || token.length < 10) {
    return new Response(JSON.stringify({ authenticated: false }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  const number = getRouterParam(event, "number");
  if (!number) {
    return new Response(JSON.stringify({ error: "Missing issue number" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const githubResponse = await fetch(
    `https://api.github.com/repos/zitzhen/CoCo-Community/issues/${number}`,
    { headers: githubHeaders(token) },
  );

  if (!githubResponse.ok) {
    const errorText = await githubResponse.text();
    return new Response(JSON.stringify({ error: "GitHub API request failed", details: errorText }), {
      status: githubResponse.status,
      headers: { "Content-Type": "application/json" },
    });
  }

  return new Response(JSON.stringify(await githubResponse.json()), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "https://cc.zitzhen.cn",
    },
  });
});
