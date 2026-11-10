import { Link } from 'react-router-dom';
import { formatearPrecio } from '../utils/formato';
import StockBadge from './StockBadge';

// Tabla de artículos. Solo muestra datos: recibe la lista por props.
export default function TablaArticulos({ articulos }) {
  return (
    <div className="card overflow-x-auto p-0">
      <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
        <thead className="bg-slate-50 dark:bg-slate-800/60">
          <tr>
            <th scope="col" className="tabla-th">Nombre</th>
            <th scope="col" className="tabla-th">Marca</th>
            <th scope="col" className="tabla-th">Tipo</th>
            <th scope="col" className="tabla-th text-right">Precio</th>
            <th scope="col" className="tabla-th">Stock</th>
            <th scope="col" className="tabla-th"><span className="sr-only">Acciones</span></th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
          {articulos.map((articulo) => (
            <tr key={articulo.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/40">
              <td className="tabla-td font-medium">
                <Link
                  to={`/articulos/${articulo.id}`}
                  className="text-brand-700 hover:underline dark:text-brand-100"
                >
                  {articulo.nombre}
                </Link>
              </td>
              <td className="tabla-td">{articulo.marca}</td>
              <td className="tabla-td">{articulo.tipo}</td>
              <td className="tabla-td text-right tabular-nums">{formatearPrecio(articulo.precio)}</td>
              <td className="tabla-td">
                <StockBadge stock={articulo.stock} />
              </td>
              <td className="tabla-td text-right">
                <Link to={`/articulos/${articulo.id}`} className="btn btn-secondary px-3 py-1">
                  Ver detalle
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
