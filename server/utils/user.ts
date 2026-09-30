import type { CloudflareEnv } from './cloudflare'

/**
 * 原子 UPSERT 到 D1 user 表，统一解决两个问题：
 *
 * 1) 非原子操作：使用 INSERT ... ON CONFLICT(LOWER(username)) DO UPDATE，
 *    单条语句原子完成"不存在则插入，存在则更新"，杜绝 SELECT-then-INSERT 竞态。
 *
 * 2) GitHub 用户名大小写不敏感：依赖 user(LOWER(username)) 上的 UNIQUE 索引
 *    （建表迁移见下）。所有读写均按 LOWER(username) 匹配，"Oliver" 与 "oliver"
 *    视为同一用户，不会产生重复行。
 *
 * 必需迁移（本地 + 生产 D1 各执行一次）：
 *   CREATE UNIQUE INDEX IF NOT EXISTS idx_user_username_ci ON user (LOWER(username));
 *
 * 若索引尚未创建，本函数会捕获 ON CONFLICT 报错并退化为 SELECT-then-INSERT
 * （非原子，仅为兼容未迁移环境；迁移后自动走原子路径）。
 */
export type UserConflictField = 'nickname' | 'avatar' | 'bio'

export async function upsertUser(
  env: CloudflareEnv,
  username: string,
  row: { nickname?: string; avatar?: string; bio?: string },
  conflictUpdate: UserConflictField[] = ['avatar']
): Promise<void> {
  const nickname = row.nickname ?? username
  const avatar = row.avatar ?? ''
  const bio = row.bio ?? ''

  // 构造 ON CONFLICT 子句：根据调用方指定的字段做局部更新
  // 未列出的字段（如 nickname）在用户已存在时保持原值，不被覆盖
  const conflictSql =
    conflictUpdate.length > 0
      ? 'DO UPDATE SET ' + conflictUpdate.map((f) => `${f} = excluded.${f}`).join(', ')
      : 'DO NOTHING'

  try {
    await env.DB.prepare(
      `INSERT INTO user (username, nickname, number_of_controls, avatar, bio, pageviews)
       VALUES (?1, ?2, 0, ?3, ?4, 0)
       ON CONFLICT(LOWER(username)) ${conflictSql}`
    )
      .bind(username, nickname, avatar, bio)
      .run()
  } catch {
    // 回退路径：环境未建立 LOWER(username) UNIQUE 索引时
    // 退化为先查后写（非原子，但功能正确；大小写仍用 LOWER 匹配）
    const existing = await env.DB.prepare(
      'SELECT username FROM user WHERE LOWER(username) = LOWER(?1)'
    )
      .bind(username)
      .first()

    if (existing) {
      if (conflictUpdate.length > 0) {
        const setClause = conflictUpdate.map((f) => `${f} = ?`).join(', ')
        const values = conflictUpdate.map((f) => (f === 'nickname' ? nickname : f === 'avatar' ? avatar : bio))
        await env.DB.prepare(
          `UPDATE user SET ${setClause} WHERE LOWER(username) = LOWER(?)`
        )
          .bind(...values, username)
          .run()
      }
    } else {
      await env.DB.prepare(
        'INSERT INTO user (username, nickname, number_of_controls, avatar, bio, pageviews) VALUES (?1, ?2, 0, ?3, ?4, 0)'
      )
        .bind(username, nickname, avatar, bio)
        .run()
    }
  }
}

/**
 * 按用户名（大小写不敏感）读取单行用户。
 * 统一所有读路径的大小写语义，避免历史数据 author/login 大小写不一致导致查不到。
 */
export async function findUserByUsername(
  env: CloudflareEnv,
  username: string
): Promise<{ username: string; nickname: string; avatar: string; bio: string; pageviews: number } | null> {
  return env.DB.prepare(
    'SELECT username, nickname, avatar, bio, pageviews FROM user WHERE LOWER(username) = LOWER(?1)'
  )
    .bind(username)
    .first() as Promise<any>
}
