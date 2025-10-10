async function checkLoginStatus() {
  try {
    const res = await fetch("/api/me", {
      credentials: "include", //  自动携带 HttpOnly Cookie
    });

    if (!res.ok) {
      console.log("未登录");
      return null;
    }

    const data = await res.json();

    if (data.authenticated && data.user) {
      console.log("已登录用户：", data.user);
      return data.user; //  返回用户信息
    } else {
      console.log("未登录");
      return null;
    }
  } catch (err) {
    console.error("登录状态检查失败：", err);
    return null;
  }
}