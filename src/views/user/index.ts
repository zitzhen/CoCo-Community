import { UserInfo, UserIntroduction } from '../../types';

// 获取URL最后一段的函数
export function getCurrentUrlLastSegment(): string {
  const currentUrl = window.location.href;
  const cleanedUrl = currentUrl.endsWith('/') ? currentUrl.slice(0, -1) : currentUrl;
  const url = new URL(cleanedUrl);
  const pathSegments = url.pathname.split('/').filter(segment => segment !== '');
  return pathSegments.length > 0 ? pathSegments[pathSegments.length - 1] : '';
}

// 获取GitHub用户信息的函数
export async function fetchGithubInformation(username: string): Promise<UserInfo | null> {
  const url = `https://api.github.com/users/${username}`;
  const res = await fetch(url);
  return res.ok ? res.json() : null;
}

// 获取用户介绍信息的函数
export async function fetchUserInformation(username: string): Promise<UserIntroduction | null> {
  const host = window.location.host;
  const url = `https://${host}/information/user/${username}.json`;
  const res = await fetch(url);
  return res.ok ? res.json() : null;
}

// 渲染用户信息的函数
export function renderInformation(information: UserInfo, setNickname: (name: string) => void, setBio: (bio: string) => void, setAvatar: (avatar: string) => void): void {
  const name = information.name || information.login || '';
  const bio = information.bio || '此人很懒，什么都没有';
  const avatar = information.avatar_url || '';
  
  setNickname(name);
  setBio(bio);
  setAvatar(avatar);
}