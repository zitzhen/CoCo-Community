// src/types/index.ts
// 全局类型定义文件

// 定义文件类型接口
export interface FileType {
  name: string;
  type: string;
  size: string;
  date: string;
  downloads: string;
  url: string;
}

// 定义文件图标映射接口
export interface FileIcons {
  [key: string]: string;
  pdf: string;
  exe: string;
  zip: string;
  word: string;
  video: string;
  code: string;
  default: string;
}

// 定义用户信息接口
export interface UserInfo {
  name?: string;
  login?: string;
  bio?: string;
  avatar_url?: string;
}

// 定义用户介绍接口
export interface UserIntroduction {
  number_of_controls?: string;
  list_of_controls?: string[];
}

// 定义协议数据接口
export interface AgreementData {
  loading: boolean;
  content: string;
}

// 定义隐私政策数据接口
export interface PrivacyPolicyData {
  loading: boolean;
  content: string;
}

// 定义控件数据接口
export interface ControlData {
  loading: boolean;
  errorVisible: boolean;
  errorVisibleSmall: boolean;
  errorMessage: string;
  filename: string;
  fileSize: string;
  versions: string[];
  introduceHtml: string;
  avatar: string;
  authorName: string;
  authorBio: string;
  downloadUrl: string;
  sourceUrl: string;
}

// 定义 README 候选路径结果接口
export interface ReadmeResult {
  error?: boolean;
  firstHtml?: {
    url: string;
    status: number;
    snippet: string;
  };
  url?: string;
  text?: string;
}

// 定义作者信息接口
export interface AuthorInfo {
  avatar_url?: string;
  name?: string;
  bio?: string;
}

// 定义控件信息接口
export interface ControlInfo {
  author?: string;
  Version_number_list?: string[];
}