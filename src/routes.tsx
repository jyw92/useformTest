import {createBrowserRouter} from 'react-router-dom';
import UserLayout from './layouts/UserLayout';
import UserPage from './pages/UserPage';
import AdminLayout from './layouts/AdminLayout';
import AdminPage from './pages/AdminPage';
import AdminPageBak from './pages/AdminPageBak';
import AdminPageStudy from './pages/AdminPageStudy';
import AdminPostDetail from './pages/AdminPostDetail'; // 🟢 새로 만든 상세/수정 페이지

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
    children: [
      {index: true, element: <AdminPage />}, // 🟢 메인 목록 및 등록 폼
      {path: ':id', element: <AdminPostDetail />}, // 🟢 상세보기 및 수정 페이지
    ],
  },
  {
    path: '/admin/bak',
    element: <AdminLayout />,
    children: [{index: true, element: <AdminPageBak />}],
  },
  {
    path: '/admin/study',
    element: <AdminLayout />,
    children: [{index: true, element: <AdminPageStudy />}],
  },
]);
