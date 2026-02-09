import {Outlet} from 'react-router-dom';

export default function UserLayout() {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-white border-b p-4 font-bold">📸 갤러리 (사용자 뷰)</header>

      {/* 👇 여기에 UserPage 내용이 들어옵니다 */}
      <main className="flex-1">
        <Outlet />
      </main>

      <footer className="bg-gray-100 p-4 text-center text-xs text-gray-500">© 2024 Gallery Service</footer>
    </div>
  );
}
