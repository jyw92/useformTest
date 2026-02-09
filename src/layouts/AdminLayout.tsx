import {Outlet} from 'react-router-dom';

export default function AdminLayout() {
  return (
    <div className="min-h-screen flex">
      <aside className="w-64 bg-gray-900 text-white p-6">
        <h1 className="text-xl font-bold mb-6">Admin</h1>
        <nav>
          <ul>
            <li className="mb-2">대시보드</li>
            <li className="mb-2 text-blue-400">게시글 관리</li>
          </ul>
        </nav>
      </aside>

      {/* 👇 여기에 AdminPage 내용이 들어옵니다 */}
      <main className="flex-1 bg-gray-50 p-6">
        <Outlet />
      </main>
    </div>
  );
}
