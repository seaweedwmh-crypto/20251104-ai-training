interface RequestOptions extends RequestInit {
  timeout?: number;
  retry?: number;
  retryDelay?: number;
}

/**
 * 发送请求，支持超时和重试
 * @param url 请求URL
 * @param options 请求选项
 * @returns Promise<any>
 */
export const request = async (url: string, options: RequestOptions = {}): Promise<any> => {
  const { timeout = 2000, retry = 2, retryDelay = 400, ...fetchOptions } = options;
  
  let attempt = 0;
  
  while (attempt <= retry) {
    const controller = new AbortController();
    const signal = controller.signal;
    const timeoutId = setTimeout(() => controller.abort(), timeout);
    
    try {
      const response = await fetch(url, { ...fetchOptions, signal });
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        throw new Error(`HTTP错误! 状态: ${response.status}`);
      }
      
      return response.json();
    } catch (error) {
      clearTimeout(timeoutId);
      
      if (attempt === retry || (error as Error).name === 'AbortError') {
        throw error;
      }
      
      // 指数退避重试
      const delay = retryDelay * Math.pow(2, attempt);
      await new Promise(resolve => setTimeout(resolve, delay));
      attempt++;
    }
  }
  
  throw new Error('请求失败');
};
