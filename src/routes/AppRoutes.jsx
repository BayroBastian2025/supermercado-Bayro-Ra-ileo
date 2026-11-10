import { lazy, Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';

// Lazy loading: cada página se descarga solo cuando se visita su ruta.
const Inventario = lazy(() => import('../pages/Inventario'));
const AgregarArticulo = lazy(() => import('../pages/AgregarArticulo'));
const DetalleArticulo = lazy(() => import('../pages/DetalleArticulo'));
const Carrito = lazy(() => import('../pages/Carrito'));
const NoEncontrada = lazy(() => import('../pages/NoEncontrada'));

export default function AppRoutes() {
  return (
    <Suspense fallback={<p className="p-8 text-center text-slate-500">Cargando…</p>}>
      <Routes>
        {/* Layout común (navbar + footer) con rutas anidadas renderizadas en <Outlet /> */}
        <Route element={<MainLayout />}>
          <Route index element={<Inventario />} />
          <Route path="agregar" element={<AgregarArticulo />} />
          {/* Ruta dinámica: /articulos/:articuloId */}
          <Route path="articulos/:articuloId" element={<DetalleArticulo />} />
          <Route path="carrito" element={<Carrito />} />
          <Route path="*" element={<NoEncontrada />} />
        </Route>
      </Routes>
    </Suspense>
  );
}
