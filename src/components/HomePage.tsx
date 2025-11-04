import reactLogo from '../assets/react.svg'
import { useState } from 'react'
import viteLogo from '/vite.svg'
import '../App.css'
import SearchAutocomplete from './SearchAutocomplete'

const HomePage: React.FC = () => {
  // 使用公开的产品搜索API
  const API_URL = 'https://dummyjson.com/products/search?q=<keyword>'
  const [searchResults, setSearchResults] = useState<any[]>([])
  const [searchLoading, setSearchLoading] = useState(false)
  const [searchError, setSearchError] = useState<string | null>(null)

  const handleSearch = (keyword: string) => {
    if (!keyword.trim()) {
      setSearchResults([])
      return
    }

    setSearchLoading(true)
    setSearchError(null)

    fetch(API_URL.replace('<keyword>', encodeURIComponent(keyword))) 
      .then(response => response.json())
      .then(data => {
        setSearchResults(data.products || [])
      })
      .catch(error => {
        setSearchError(error.message)
        setSearchResults([])
      })
      .finally(() => {
        setSearchLoading(false)
      })
  }

  return (
    <div className="home-container">
      <div className="home-content">
        <div className="search-container">
          <SearchAutocomplete 
            apiUrl={API_URL}
            placeholder="请输入产品名称..."
            onSearch={handleSearch}
          />
        </div>
        
        <p className="read-the-docs">
          输入关键词查看搜索建议，支持防抖、超时重试、结果去重和排序
        </p>
      </div>

      {/* 搜索结果区域 */}
      <div className="search-results-container">
        {searchLoading && (
          <div className="loading-indicator">
            <span>搜索中...</span>
          </div>
        )}

        {searchError && (
          <div className="error-message">
            <span>错误: {searchError}</span>
          </div>
        )}

        {!searchLoading && !searchError && searchResults.length > 0 && (
          <div className="products-list">
            {searchResults.map(product => (
              <div key={product.id} className="product-item">
                {product.thumbnail && (
                  <img 
                    src={product.thumbnail} 
                    alt={product.title} 
                    className="product-image"
                  />
                )}
                <div className="product-details">
                  <h3 className="product-title">{product.title}</h3>
                  <p className="product-description">{product.description}</p>
                  <p className="product-price">${product.price}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {!searchLoading && !searchError && searchResults.length === 0 && (
          <div className="no-results">
            <span>没有找到匹配的产品</span>
          </div>
        )}
      </div>
      
      <style>
        {
          `.home-container {
            width: 100%;
            min-height: 100vh;
            display: flex;
            flex-direction: column;
            align-items: center;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
          }
          
          .home-content {
            text-align: center;
            margin-bottom: 2rem;
          }
          
          .search-results-container {
            width: 100%;
            max-width: 1200px;
            padding: 0 2rem;
            box-sizing: border-box;
            margin-bottom: 2rem;
          }
          
          .loading-indicator,
          .error-message,
          .no-results {
            text-align: center;
            padding: 2rem;
            background-color: rgba(255, 255, 255, 0.1);
            border-radius: 8px;
            margin-bottom: 2rem;
          }
          
          .products-list {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
            gap: 1.5rem;
          }
          
          .product-item {
            background-color: white;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
            transition: transform 0.3s ease;
          }
          
          .product-item:hover {
            transform: translateY(-5px);
          }
          
          .product-image {
            width: 100%;
            height: 200px;
            object-fit: cover;
          }
          
          .product-details {
            padding: 1rem;
            color: #333;
          }
          
          .product-title {
            font-size: 1.2rem;
            margin-bottom: 0.5rem;
            font-weight: 600;
          }
          
          .product-description {
            font-size: 0.9rem;
            margin-bottom: 1rem;
            height: 60px;
            overflow: hidden;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-line-clamp: 3;
            -webkit-box-orient: vertical;
          }
          
          .product-price {
            font-size: 1.1rem;
            font-weight: 600;
            color: #2ecc71;
          }
          
          /* 响应式设计 */
          @media (max-width: 768px) {
            .products-list {
              grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
              gap: 1rem;
            }
            
            .product-image {
              height: 180px;
            }
            
            .product-title {
              font-size: 1.1rem;
            }
          }
          
          @media (max-width: 576px) {
            .products-list {
              grid-template-columns: 1fr;
            }
            
            .product-image {
              height: 200px;
            }
          }
            max-width: 800px;
            width: 100%;
            padding: 0 2rem;
            box-sizing: border-box;
          }
          
          
          h1 {
            font-size: 2.5rem;
            margin-bottom: 2rem;
            font-weight: 700;
            text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          }
          
          .search-container {
            margin: 2rem 0;
            width: 100%;
            display: flex;
            justify-content: center;
          }
          
          .read-the-docs {
            color: rgba(255, 255, 255, 0.8);
            font-size: 1.1rem;
            line-height: 1.5;
            max-width: 600px;
            margin: 0 auto;
          }
          
          /* 响应式设计 */
          @media (max-width: 768px) {
            h1 {
              font-size: 2rem;
            }
            
            .logo {
              height: 5em;
            }
          }
          
          @media (max-width: 576px) {
            h1 {
              font-size: 1.8rem;
            }
            
            
            .logo {
              height: 4em;
            }
            
            .read-the-docs {
              font-size: 1rem;
            }
          }
        `}
      </style>
    </div>
  )
}

export default HomePage;
