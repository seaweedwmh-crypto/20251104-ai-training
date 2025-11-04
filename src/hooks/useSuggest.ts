import { useState, useEffect, useCallback } from 'react';
import { request } from '../utils/request';

interface SuggestItem {
  name?: string;
  title?: string;
  [key: string]: any;
}

interface UseSuggestOptions {
  debounceDelay?: number;
  maxCacheSize?: number;
}

/**
 * 计算两个字符串的相似度
 * @param a 字符串a
 * @param b 字符串b
 * @returns 相似度得分
 */
const calculateSimilarity = (a: string, b: string): number => {
  if (a === b) return 1;
  if (a.length < b.length) [a, b] = [b, a];
  
  let matches = 0;
  for (let i = 0; i < b.length; i++) {
    if (a.includes(b[i])) matches++;
  }
  
  return matches / a.length;
};

/**
 * 搜索建议Hook
 * @param apiUrl API地址模板
 * @param options 配置选项
 * @returns { keyword, setKeyword, suggestions, loading, error }}
 */
export const useSuggest = (apiUrl: string, options: UseSuggestOptions = {}) => {
  const { debounceDelay = 300, maxCacheSize = 5 } = options;
  
  const [keyword, setKeyword] = useState('');
  const [suggestions, setSuggestions] = useState<SuggestItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cache, setCache] = useState<Map<string, SuggestItem[]>>(new Map());
  
  const fetchSuggestions = useCallback(async (searchTerm: string) => {
    if (!searchTerm.trim()) {
      setSuggestions([]);
      return;
    }
    
    // 检查缓存
    if (cache.has(searchTerm)) {
      setSuggestions(cache.get(searchTerm)!);
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      const url = apiUrl.replace('<keyword>', encodeURIComponent(searchTerm));
      const response = await request(url);
      
      // 从响应中提取建议项
      let items: SuggestItem[] = [];
      if (response && typeof response === 'object') {
        if (Array.isArray(response)) {
          items = response;
        } else if (response.products) {
          items = response.products;
        } else if (response.results) {
          items = response.results;
        } else if (response.data) {
          items = response.data;
        }
      }
      
      // 去重
      const uniqueItems = Array.from(
        new Map(items.map(item => [item.name || item.title, item])).values()
      );
      
      // 排序
      const sortedItems = [...uniqueItems].sort((a, b) => {
        const aName = a.name || a.title || '';
        const bName = b.name || b.title || '';
        
        // 完全匹配排在最前面
        if (aName.toLowerCase() === searchTerm.toLowerCase()) return -1;
        if (bName.toLowerCase() === searchTerm.toLowerCase()) return 1;
        
        // 按相似度排序
        const aSimilarity = calculateSimilarity(aName.toLowerCase(), searchTerm.toLowerCase());
        const bSimilarity = calculateSimilarity(bName.toLowerCase(), searchTerm.toLowerCase());
        
        if (aSimilarity !== bSimilarity) {
          return bSimilarity - aSimilarity;
        }
        
        // 相似度相同时按长度排序
        return aName.length - bName.length;
      });
      
      setSuggestions(sortedItems);
      
      // 更新缓存
      setCache(prevCache => {
        const newCache = new Map(prevCache);
        newCache.set(searchTerm, sortedItems);
        
        // 保持缓存大小不超过最大值
        if (newCache.size > maxCacheSize) {
          const firstKey = newCache.keys().next().value;
          if (firstKey !== undefined) {
            newCache.delete(firstKey);
          }
        }
        
        return newCache;
      });
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : '发生未知错误';
      setError(errorMsg);
      setSuggestions([]);
    } finally {
      setLoading(false);
    }
  }, [apiUrl, cache, maxCacheSize]);
  
  // 防抖处理
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchSuggestions(keyword);
    }, debounceDelay);
    
    return () => clearTimeout(timer);
  }, [keyword, fetchSuggestions, debounceDelay]);
  
  return {
    keyword,
    setKeyword,
    suggestions,
    loading,
    error
  };
};
