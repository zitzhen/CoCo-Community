import { onRequestGet } from '~~/functions/auth/github'

export default defineEventHandler(event => runPagesFunction(event, onRequestGet))
