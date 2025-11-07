import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import App from './App';
import Calendar from './pages/Calendar';

// 创建路由
export const router = createBrowserRouter([
  { path: '/', element: <App /> },
  { path: '/calendar', element: <Calendar /> },
]);

// 路由提供者组件
export const AppRouter = () => {
  return <RouterProvider router={router} />;
};
