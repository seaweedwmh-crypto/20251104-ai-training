
import { createBrowserRouter, RouterProvider, Outlet } from 'react-router-dom';
import './App.css';
import HomePage from './components/HomePage';

// 创建布局组件
const Layout: React.FC = () => {
  return (
    <div className="app-container">
      <header className="app-header">
        <div className="logo-container">
          <a href="/" className="logo-link">
            <h1 className="app-title">产品搜索</h1>
          </a>
        </div>
      </header>
      
      <main className="app-main">
        <Outlet />
      </main>
      
      <footer className="app-footer">
        <p>© {new Date().getFullYear()} 产品搜索应用</p>
      </footer>
    </div>
  );
};

// 创建路由
const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
