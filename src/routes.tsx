import {createBrowserRouter} from 'react-router-dom';
import UserLayout from './layouts/UserLayout';
import UserPage from './pages/UserPage';
import AdminLayout from './layouts/AdminLayout';
import AdminPage from './pages/AdminPage';

export const router = createBrowserRouter([
  // 1. 사용자 모드 (localhost:5173/)
  {
    path: '/',
    element: <UserLayout />,
    children: [{index: true, element: <UserPage />}],
  },

  // 2. 관리자 모드 (localhost:5173/admin)
  {
    path: '/admin',
    element: <AdminLayout />,
    children: [{index: true, element: <AdminPage />}],
  },
]);
