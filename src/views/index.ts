import axios from 'axios';
import { FileType, FileIcons } from '@types';

// 获取子目录的函数
export async function getSubDirs(): Promise<FileType[]> {
  const owner = 'zitzhen';
  const repo = 'CoCo-Community';
  const path = 'control';
  const url = `https://api.github.com/repos/${owner}/${repo}/contents/${path}`;
  
  try {
    const { data } = await axios.get(url);
    let dirs = data.filter((item: any) => item.type === "dir").map((item: any) => item.name);
    // 过滤掉 CS 和 JS 文件夹
    dirs = dirs.filter((name: string) => name !== 'css' && name !== 'js');
    console.log("Directories:", dirs);
    
    const fileObjs: FileType[] = dirs.map((name: string) => ({
      name: name,
      type: "code",
      size: "未知",
      date: "未知",
      downloads: "未知",
      url: `${window.location.origin}/control/${name}`
    }));
    
    return fileObjs;
  } catch (error: any) {
    console.error("Error fetching directories:", error.response?.status || error.message);
    throw error;
  }
}

// 获取文件图标类名的函数
export function getFileIconClass(fileType: string, fileIcons: FileIcons): string {
  return fileIcons[fileType] || fileIcons.default;
}

// 搜索文件的函数
export function searchFiles(term: string, files: FileType[]): FileType[] {
  const lowerTerm = term.toLowerCase();
  return files.filter(file => 
    file.name.toLowerCase().includes(lowerTerm)
  );
}