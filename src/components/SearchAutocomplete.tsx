import { useState, useRef, useEffect } from 'react';
import { useSuggest } from '../hooks/useSuggest';

interface SearchAutocompleteProps {
  apiUrl: string;
  placeholder?: string;
  onSearch?: (keyword: string) => void;
}

/**
 * 搜索自动完成组件
 * @param apiUrl API地址模板
 * @param placeholder 输入框占位符
 */
const SearchAutocomplete: React.FC<SearchAutocompleteProps> = ({ 
  apiUrl, 
  placeholder = '请输入搜索内容...',
  onSearch
}) => {
  const { keyword, setKeyword, suggestions, loading, error } = useSuggest(apiUrl);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  
  // 点击外部关闭下拉菜单
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current && 
        !dropdownRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  // 输入框聚焦时打开下拉菜单
  const handleFocus = () => {
    if (suggestions.length > 0) {
      setIsOpen(true);
    }
  };
  
  // 选择建议项
  const handleSelectSuggestion = (suggestion: { name?: string; title?: string }) => {
    const value = suggestion.name || suggestion.title || '';
    setKeyword(value);
    setIsOpen(false);
    // 触发搜索回调
    if (onSearch) {
      onSearch(value);
    }
  };
  
  // 处理回车键搜索
  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' && keyword.trim()) {
      // 触发搜索回调
      if (onSearch) {
        onSearch(keyword.trim());
      }
    }
  };
  
  return (
    <div className="search-autocomplete" ref={dropdownRef}>
      <input
        ref={inputRef}
        type="text"
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
        onFocus={handleFocus}
        onKeyPress={handleKeyPress}
        placeholder={placeholder}
        className="search-input"
      />
      
      {(isOpen || loading) && (
        <div className="suggestions-dropdown">
          {loading && (
            <div className="suggestion-item loading">
              <span>加载中...</span>
            </div>
          )}
          
          {!loading && error && (
            <div className="suggestion-item error">
              <span>错误: {error}</span>
            </div>
          )}
          
          {!loading && !error && suggestions.length > 0 && (
            <>
              {suggestions.map((suggestion, index) => {
                const displayText = suggestion.name || suggestion.title || '';
                return (
                  <div
                    key={index}
                    className="suggestion-item"
                    onClick={() => handleSelectSuggestion(suggestion)}
                  >
                    <span>{displayText}</span>
                  </div>
                );
              })}
            </>
          )}
          
          {!loading && !error && suggestions.length === 0 && keyword.trim() !== '' && (
            <div className="suggestion-item empty">
              <span>没有找到匹配的结果</span>
            </div>
          )}
        </div>
      )}
      
      <style>{`
        .search-autocomplete {
          position: relative;
          width: 100%;
          max-width: 400px;
          margin: 0 auto;
        }
        
        /* 响应式设计 */
        @media (max-width: 768px) {
          .search-autocomplete {
            max-width: 100%;
          }
          
          .search-input {
            padding: 0.7em 0.9em;
            font-size: 0.95em;
          }
        }
        
        @media (max-width: 576px) {
          .search-input {
            padding: 0.6em 0.8em;
            font-size: 0.9em;
          }
          
          .suggestion-item {
            padding: 0.7em 0.9em;
            font-size: 0.95em;
          }
        }
        
        .search-input {
          width: 100%;
          padding: 0.8em 1em;
          font-size: 1em;
          border: 1px solid #ccc;
          border-radius: 4px;
          box-sizing: border-box;
        }
        
        .suggestions-dropdown {
          position: absolute;
          top: 100%;
          left: 0;
          right: 0;
          background-color: white;
          border: 1px solid #ccc;
          border-top: none;
          border-radius: 0 0 4px 4px;
          box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
          z-index: 1000;
          max-height: 250px;
          overflow-y: auto;
        }
        
        .suggestion-item {
          padding: 0.8em 1em;
          cursor: pointer;
          transition: background-color 0.2s;
          display: flex;
          align-items: center;
          color: #333;
        }
        
        .suggestion-item:hover {
          background-color: #f0f0f0;
        }
        
        .suggestion-item.loading {
          color: #888;
          cursor: not-allowed;
        }
        
        .suggestion-item.error {
          color: #ff4444;
          cursor: not-allowed;
        }
        
        .suggestion-item.empty {
          color: #888;
          cursor: not-allowed;
        }
        
        /* 深色模式支持 */
        @media (prefers-color-scheme: dark) {
          .search-input {
            background-color: #333;
            border-color: #555;
            color: white;
          }
          
          .suggestions-dropdown {
            background-color: #333;
            border-color: #555;
          }
          
          .suggestion-item {
            color: white;
          }
          
          .suggestion-item:hover {
            background-color: #444;
          }
          
          .search-input:focus {
            outline: none;
            border-color: #646cff;
          }
        }
      `}</style>
    </div>
  );
};

export default SearchAutocomplete;
