export async function checkLoginStatus() {
  try {
    const res = await fetch("/api/me", {
      credentials: "include",
    });

    if (!res.ok) return null;

    const data = await res.json();
    return data;
  } catch (err) {
    console.error("登录状态检查失败：", err);
    return null;
  }
}