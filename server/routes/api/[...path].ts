import { onRequestPost as commentEssay } from '~~/functions/api/comment-essay'
import { onRequest as download } from '~~/functions/api/download'
import { onRequest as collectEssay } from '~~/functions/api/essay/collect'
import { onRequest as likeEssay } from '~~/functions/api/essay/like'
import { onRequestGet as fetchCommentEssay } from '~~/functions/api/fetch-comment-essay'
import { onRequestGet as githubIssues } from '~~/functions/api/github/issues'
import { onRequestGet as githubUser } from '~~/functions/api/github/user'
import { onRequestGet as log } from '~~/functions/api/log'
import { onRequest as logout } from '~~/functions/api/logout'
import { onRequestGet as me } from '~~/functions/api/me'
import { onRequest as pageviews } from '~~/functions/api/pageviews'
import { onRequest as pageviewsEssay } from '~~/functions/api/pageviews_essay'
import { onRequest as pageviewsUser } from '~~/functions/api/pageviews_user'
import { onRequest as updateNickname } from '~~/functions/api/update_nickname'
import { onRequest as user } from '~~/functions/api/user'

const handlers = {
  'comment-essay': commentEssay,
  'download': download,
  'essay/collect': collectEssay,
  'essay/like': likeEssay,
  'fetch-comment-essay': fetchCommentEssay,
  'github/issues': githubIssues,
  'github/user': githubUser,
  'log': log,
  'logout': logout,
  'me': me,
  'pageviews': pageviews,
  'pageviews_essay': pageviewsEssay,
  'pageviews_user': pageviewsUser,
  'update_nickname': updateNickname,
  'user': user,
} as const

export default defineEventHandler(async (event) => {
  const path = getRouterParam(event, 'path') ?? ''
  const handler = handlers[path as keyof typeof handlers]

  if (!handler) {
    throw createError({ statusCode: 404, statusMessage: 'API endpoint not found' })
  }

  return runPagesFunction(event, handler)
})
