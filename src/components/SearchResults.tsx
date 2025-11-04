import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { request } from '../utils/request';

interface Product {
  id: number;
  title: string;
  description: string;
  price: number;
  thumbnail: string;
  [key: string]: any;
}

const SearchResults: React.FC = () => {
  const { keyword } = useParams<{ keyword: string }>();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    if (!keyword) {
      setProducts([]);
      setLoading(false);
      return;
    }
    
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const url = `https://dummyjson.com/products/search?q=${encodeURIComponent(keyword)}`;
        const response = await request(url);
        
        if (response && response.products) {
          setProducts(response.products);
        } else {
          setProducts([]);
        }
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : '发生未知错误';
        setError(errorMsg);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };
    
    fetchProducts();
  }, [keyword]);
  
  if (loading) {
    return (
      <div className="search-results-container">
        <div className="loading">加载中...</div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="search-results-container">
        <div className="error">错误: {error}</div>
        <Link to="/" className="back-link">返回首页</Link>
      </div>
    );
  }
  
  return (
    <div className="search-results-container">
      <h2>搜索结果: {keyword}</h2>
      
      {products.length > 0 ? (
        <div className="products-list">
          {products.map((product) => (
            <div key={product.id} className="product-item">
              <img 
                src={product.thumbnail} 
                alt={product.title} 
                className="product-image"
              />
              <div className="product-details">
                <h3 className="product-title">{product.title}</h3>
                <p className="product-description">{product.description}</p>
                <p className="product-price">${product.price.toFixed(2)}</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="no-results">
          <p>没有找到匹配的产品</p>
          <Link to="/" className="back-link">返回首页</Link>
        </div>
      )}
      
      <style>{`
        .search-results-container {
          width: 100%;
          padding: 2rem;
          box-sizing: border-box;
        }
        
        h2 {
          margin-bottom: 1.5rem;
          font-size: 2rem;
        }
        
        .loading, .error, .no-results {
          text-align: center;
          padding: 4rem;
          font-size: 1.2rem;
        }
        
        .error {
          color: #ff4444;
        }
        
        .back-link {
          display: inline-block;
          margin-top: 1rem;
          padding: 0.6rem 1.2rem;
          background-color: #646cff;
          color: white;
          text-decoration: none;
          border-radius: 4px;
          transition: background-color 0.2s;
        }
        
        .back-link:hover {
          background-color: #535bf2;
        }
        
        .products-list {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 1.5rem;
        }
        
        /* 响应式设计 */
        @media (max-width: 768px) {
          .search-results-container {
            padding: 1rem;
          }
          
          h2 {
            font-size: 1.5rem;
            margin-bottom: 1rem;
          }
          
          .products-list {
            grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
            gap: 1rem;
          }
          
          .product-details {
            padding: 0.8rem;
          }
          
          .product-title {
            font-size: 1.1rem;
          }
          
          .product-description {
            font-size: 0.9rem;
          }
        }
        
        @media (max-width: 576px) {
          .search-results-container {
            padding: 0.5rem;
          }
          
          h2 {
            font-size: 1.3rem;
          }
          
          .products-list {
            grid-template-columns: 1fr;
          }
          
          .product-image {
            height: 180px;
          }
        }
        
        .product-item {
          border: 1px solid #ccc;
          border-radius: 8px;
          overflow: hidden;
          transition: transform 0.2s, box-shadow 0.2s;
        }
        
        .product-item:hover {
          transform: translateY(-5px);
          box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
        }
        
        .product-image {
          width: 100%;
          height: 200px;
          object-fit: cover;
        }
        
        .product-details {
          padding: 1rem;
        }
        
        .product-title {
          margin: 0 0 0.5rem 0;
          font-size: 1.2rem;
        }
        
        .product-description {
          margin: 0 0 0.5rem 0;
          color: #666;
          line-height: 1.4;
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
        }
        
        .product-price {
          margin: 0;
          font-weight: 500;
          color: #2ecc71;
        }
        
        /* 深色模式支持 */
        @media (prefers-color-scheme: dark) {
          .product-item {
            border-color: #555;
            background-color: #333;
          }
          
          .product-title, .product-price {
            color: white;
          }
          
          .product-description {
            color: #ddd;
          }
        }
      `}</style>
    </div>
  );
};

export default SearchResults;
