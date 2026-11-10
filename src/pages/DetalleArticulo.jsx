import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import Alerta from '../components/Alerta';
import Button from '../components/Button';
import EstadoVacio from '../components/EstadoVacio';
import PageHeader from '../components/PageHeader';
import SelectorCantidad from '../components/SelectorCantidad';
import StockBadge from '../components/StockBadge';
import { useInventario } from '../context/InventarioContext';
import { formatearPrecio } from '../utils/formato';

export default function DetalleArticulo() {
  // Parámetro dinámico de la URL: /articulos/:articuloId
  const { articuloId } = useParams();
  const { items, lineasCarrito, agregarAlCarrito } = useInventario();

  const [cantidad, setCantidad] = useState(1);
  const [mensaje, setMensaje] = useState('');

  const articulo = items.find((item) => item.id === Number(articuloId));

  if (!articulo) {
    return (
      <EstadoVacio
        titulo="Artículo no encontrado"
        descripcion="El artículo que buscas no existe en el inventario."
        enlace="/"
        textoEnlace="Volver al inventario"
      />
    );
  }

  // El stock cambia al agregar al carrito, así que la cantidad se ajusta al máximo disponible.
  const cantidadValida = Math.min(Math.max(1, cantidad), Math.max(1, articulo.stock));
  const sinStock = articulo.stock === 0;
  const enCarrito = lineasCarrito.find((linea) => linea.id === articulo.id)?.cantidad ?? 0;

  const agregar = () => {
    agregarAlCarrito(articulo.id, cantidadValida);
    setMensaje(`Agregaste ${cantidadValida} × ${articulo.nombre} al carrito.`);
    setCantidad(1);
  };

  return (
    <>
      <PageHeader titulo={articulo.nombre} descripcion={`${articulo.marca} · ${articulo.tipo}`}>
        <Link to="/" className="btn btn-secondary">
          ← Volver al inventario
        </Link>
      </PageHeader>

      {mensaje && (
        <Alerta>
          ✅ {mensaje}{' '}
          <Link to="/carrito" className="font-semibold underline">
            Ir al carrito
          </Link>
        </Alerta>
      )}

      <section className="card grid gap-6 sm:grid-cols-2" aria-label="Detalle del artículo">
        <dl className="space-y-3 text-sm">
          <div className="flex justify-between border-b border-slate-100 pb-2 dark:border-slate-700">
            <dt className="text-slate-500 dark:text-slate-400">Marca</dt>
            <dd className="font-medium">{articulo.marca}</dd>
          </div>
          <div className="flex justify-between border-b border-slate-100 pb-2 dark:border-slate-700">
            <dt className="text-slate-500 dark:text-slate-400">Tipo</dt>
            <dd className="font-medium">{articulo.tipo}</dd>
          </div>
          <div className="flex justify-between border-b border-slate-100 pb-2 dark:border-slate-700">
            <dt className="text-slate-500 dark:text-slate-400">Precio</dt>
            <dd className="text-lg font-bold text-brand-700 dark:text-brand-100">{formatearPrecio(articulo.precio)}</dd>
          </div>
          <div className="flex items-center justify-between">
            <dt className="text-slate-500 dark:text-slate-400">Disponibilidad</dt>
            <dd>
              <StockBadge stock={articulo.stock} />
            </dd>
          </div>
          {enCarrito > 0 && (
            <p className="pt-1 text-xs text-slate-500 dark:text-slate-400">
              Ya tienes {enCarrito} unidad(es) de este artículo en tu carrito.
            </p>
          )}
        </dl>

        <div className="flex flex-col justify-center gap-4">
          {sinStock ? (
            <Alerta tipo="error">Este artículo está agotado y no se puede agregar al carrito.</Alerta>
          ) : (
            <>
              <div>
                <span className="label">Cantidad</span>
                <SelectorCantidad
                  cantidad={cantidadValida}
                  max={articulo.stock}
                  etiqueta={articulo.nombre}
                  onAumentar={() => setCantidad(cantidadValida + 1)}
                  onDisminuir={() => setCantidad(cantidadValida - 1)}
                />
              </div>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Subtotal: <strong>{formatearPrecio(articulo.precio * cantidadValida)}</strong>
              </p>
            </>
          )}
          <Button onClick={agregar} disabled={sinStock}>
            🛒 Agregar al carrito
          </Button>
        </div>
      </section>
    </>
  );
}
