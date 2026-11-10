import { useState } from 'react';
import { Link } from 'react-router-dom';
import Alerta from '../components/Alerta';
import Button from '../components/Button';
import EstadoVacio from '../components/EstadoVacio';
import PageHeader from '../components/PageHeader';
import SelectorCantidad from '../components/SelectorCantidad';
import { useInventario } from '../context/InventarioContext';
import { formatearPrecio } from '../utils/formato';

export default function Carrito() {
  const {
    lineasCarrito,
    totalUnidades,
    totalPrecio,
    aumentarCantidad,
    disminuirCantidad,
    eliminarDelCarrito,
    vaciarCarrito,
    finalizarCompra,
  } = useInventario();

  const [compraRealizada, setCompraRealizada] = useState(null);

  const confirmarCompra = () => {
    setCompraRealizada({ unidades: totalUnidades, total: totalPrecio });
    finalizarCompra();
  };

  if (lineasCarrito.length === 0) {
    return (
      <>
        <PageHeader titulo="Carrito de compras" />
        {compraRealizada && (
          <Alerta>
            ✅ ¡Compra realizada! {compraRealizada.unidades} unidad(es) por{' '}
            <strong>{formatearPrecio(compraRealizada.total)}</strong>.
          </Alerta>
        )}
        <EstadoVacio
          titulo="Tu carrito está vacío"
          descripcion="Agrega artículos desde el detalle de cada producto."
          enlace="/"
          textoEnlace="Ir al inventario"
        />
      </>
    );
  }

  return (
    <>
      <PageHeader titulo="Carrito de compras" descripcion="Ajusta las cantidades: el inventario se actualiza al instante.">
        <Link to="/" className="btn btn-secondary">
          ← Seguir comprando
        </Link>
      </PageHeader>

      <div className="grid gap-6 lg:grid-cols-[1fr_18rem]">
        <div className="card overflow-x-auto p-0">
          <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
            <thead className="bg-slate-50 dark:bg-slate-800/60">
              <tr>
                <th scope="col" className="tabla-th">Artículo</th>
                <th scope="col" className="tabla-th text-right">Precio</th>
                <th scope="col" className="tabla-th">Cantidad</th>
                <th scope="col" className="tabla-th text-right">Subtotal</th>
                <th scope="col" className="tabla-th"><span className="sr-only">Quitar</span></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
              {lineasCarrito.map((linea) => (
                <tr key={linea.id}>
                  <td className="tabla-td">
                    <Link to={`/articulos/${linea.id}`} className="font-medium text-brand-700 hover:underline dark:text-brand-100">
                      {linea.nombre}
                    </Link>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {linea.marca} · quedan {linea.stock} en inventario
                    </p>
                  </td>
                  <td className="tabla-td text-right tabular-nums">{formatearPrecio(linea.precio)}</td>
                  <td className="tabla-td">
                    <SelectorCantidad
                      cantidad={linea.cantidad}
                      max={linea.cantidad + linea.stock}
                      etiqueta={linea.nombre}
                      onAumentar={() => aumentarCantidad(linea.id)}
                      onDisminuir={() => disminuirCantidad(linea.id)}
                    />
                  </td>
                  <td className="tabla-td text-right font-semibold tabular-nums">{formatearPrecio(linea.subtotal)}</td>
                  <td className="tabla-td text-right">
                    <button
                      type="button"
                      onClick={() => eliminarDelCarrito(linea.id)}
                      aria-label={`Eliminar ${linea.nombre} del carrito`}
                      className="rounded px-2 py-1 text-sm text-red-600 hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-400 dark:text-red-400 dark:hover:bg-red-900/30"
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <aside className="card h-fit" aria-label="Resumen del pedido">
          <h2 className="mb-3 text-lg font-semibold">Resumen</h2>
          <dl className="space-y-2 text-sm">
            <div className="flex justify-between">
              <dt className="text-slate-500 dark:text-slate-400">Unidades</dt>
              <dd className="font-medium">{totalUnidades}</dd>
            </div>
            <div className="flex justify-between border-t border-slate-100 pt-2 text-base dark:border-slate-700">
              <dt className="font-semibold">Total</dt>
              <dd className="font-bold text-brand-700 dark:text-brand-100">{formatearPrecio(totalPrecio)}</dd>
            </div>
          </dl>
          <div className="mt-4 flex flex-col gap-2">
            <Button onClick={confirmarCompra}>Finalizar compra</Button>
            <Button variant="secondary" onClick={vaciarCarrito}>
              Vaciar carrito
            </Button>
          </div>
        </aside>
      </div>
    </>
  );
}
