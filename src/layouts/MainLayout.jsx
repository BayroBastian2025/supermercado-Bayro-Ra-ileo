import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';

export default function MainLayout() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8">
        <Outlet />
      </main>
      <footer className="border-t border-slate-200 py-4 text-center text-xs text-slate-500 dark:border-slate-700">
        Supermercado · Gestión de inventario · Desarrollo Frontend II (PFY2202)
      </footer>
    </div>
  );
}
