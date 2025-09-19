import axios from 'axios';
import { marked } from 'marked';
import { AgreementData } from '@types';

// 获取用户协议内容的函数
export async function fetchUserAgreementContent(): Promise<string> {
  try {
    const response = await axios.get('/src/assets/content/agreement/useragreement/content.md');
    return marked.parse(response.data);
  } catch (error: any) {
    console.error('请求出错:', error);
    throw error;
  }
}