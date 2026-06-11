export type ControlCategory
  = | '开发工具'
    | 'AI'
    | '效率工具'
    | '文本工具'
    | '图片工具'
    | '网页工具'
    | '娱乐工具'

export interface ControlItem {
  id: number
  name: string
  size: string
  downloads: number
  likes: number
  collections: number
  author: string
  Pageviews: number
}

export interface ControlListResponse {
  list: ControlItem[]
}

export interface ControlInformation {
  Release_input: string
  Current_version: string
  author: string
  Latest_submission_time: string | false
  Version_number_list: string[]
}

export interface CommunityUser {
  username: string
  nickname: string | null
  number_of_controls: string
  avatar: string
  bio: string | null
  pageviews: number
}

export interface UserListResponse {
  list: CommunityUser[]
}

export interface UserControls {
  number_of_controls: string
  list_of_controls: string[]
}

export interface AuthUser {
  id: number
  login: string
  name: string | null
  avatar_url: string
  html_url: string
}

export interface AuthResponse {
  authenticated: boolean
  user?: AuthUser
}
