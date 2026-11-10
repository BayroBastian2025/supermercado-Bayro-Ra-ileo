import { Link } from 'react-router-dom';

export default function EstadoVacio({ titulo, descripcion, enlace, textoEnlace }) {
  return (
    <div className="card py-12 text-center">
      <p className="text-lg font-semibold">{titulo}</p>
      {descripcion && <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{descripcion}</p>}
      {enlace && (
        <Link to={enlace} className="btn btn-primary mt-4">
          {textoEnlace}
        </Link>
      )}
    </div>
  );
}
