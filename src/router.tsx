import { createBrowserRouter, Navigate } from 'react-router-dom';
import App from './App';
import { TaskList } from './pages/TaskList';
import { TaskDetail } from './pages/TaskDetail';
import { TaskForm } from './components/TaskForm';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      { index: true, element: <Navigate to="/tasks" replace /> },
      {
        path: '/tasks',
        element: <TaskList />,
      },
      {
        path: '/tasks/new',
        element: <TaskForm />,
      },
      {
        path: '/tasks/:id',
        element: <TaskDetail />,
      },
      {
        path: '/tasks/:id/edit',
        element: <TaskForm />,
      },
    ],
  },
]);

export default router;