import type { R2Bucket } from "~/server/utils/cloudflare"

export type ControlInfo = {
  author: string
  currentVersion: string
  versions: string[]
}

// 读取并解析 <name>/information.json
export async function readControlInfo(bucket: R2Bucket, name: string): Promise<ControlInfo | null> {
  const obj = await bucket.get(`${name}/information.json`)
  if (!obj || !obj.text) return null
  try {
    const info = JSON.parse(await obj.text())
    return {
      author: info.author ?? "",
      currentVersion: info.Current_version ?? "1.0.0",
      versions: Array.isArray(info.Version_number_list) ? info.Version_number_list : [],
    }
  } catch {
    return null
  }
}

// "1.0.0" / "1.0" 归一化，用于容忍版本号写法不一致
function normalizeVersion(v: string): string {
  const parts = v.split(".").map((p) => (Number.isNaN(Number(p)) ? p : String(Number(p))))
  while (parts.length > 1 && parts[parts.length - 1] === "0") parts.pop()
  return parts.join(".")
}

function versionRank(v: string): number[] {
  return v.split(".").map((p) => Number(p) || 0)
}

function compareRank(a: number[], b: number[]): number {
  const len = Math.max(a.length, b.length)
  for (let i = 0; i < len; i++) {
    const d = (a[i] || 0) - (b[i] || 0)
    if (d !== 0) return d
  }
  return 0
}

function versionOf(key: string, name: string): string {
  const rest = key.slice(name.length + 1)
  const seg = rest.split("/")[0]
  return seg
}

async function listJsxKeys(bucket: R2Bucket, name: string): Promise<string[]> {
  const keys: string[] = []
  let cursor: string | undefined
  do {
    const page = await bucket.list({ prefix: `${name}/`, cursor, limit: 1000 })
    for (const o of page.objects) {
      if (/\.jsx$/i.test(o.key)) keys.push(o.key)
    }
    cursor = page.truncated ? page.cursor : undefined
  } while (cursor)
  return keys
}

/**
 * 解析控件实际的 R2 文件 key。
 * information.json 的版本号 / 目录名 / control.jsx 文件名可能与实际对象不一致，
 * 因此在首选路径失效时，枚举该控件下所有 .jsx（含 contronl.jsx 等拼写）并按版本择优。
 */
export async function resolveControlKey(
  bucket: R2Bucket,
  name: string,
  info: ControlInfo | null,
): Promise<string | null> {
  const current = info?.currentVersion
  if (current) {
    const direct = await bucket.get(`${name}/${current}/control.jsx`, { onlyMetadata: true })
    if (direct) return direct.key
  }

  const listed = await listJsxKeys(bucket, name)
  if (listed.length === 0) return null

  if (current) {
    const norm = normalizeVersion(current)
    // 版本号归一化匹配（如 1.0 vs 1.0.0），文件名拼写不限
    const byNorm = listed.find((k) => normalizeVersion(versionOf(k, name)) === norm)
    if (byNorm) return byNorm
  }

  // 按 Version_number_list 的顺序（偏好高版本）
  if (info?.versions.length) {
    for (let i = info.versions.length - 1; i >= 0; i--) {
      const v = info.versions[i]
      const match = listed.find(
        (k) =>
          versionOf(k, name) === v || normalizeVersion(versionOf(k, name)) === normalizeVersion(v),
      )
      if (match) return match
    }
  }

  // 最后：取实际对象中版本最高的一个
  return listed.sort((a, b) =>
    compareRank(versionRank(versionOf(b, name)), versionRank(versionOf(a, name))),
  )[0]
}
