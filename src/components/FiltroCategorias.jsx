import { CATEGORIAS } from '../data/categorias';

// Botones de filtro por categoría. Es un componente "controlado":
// el estado (categoría seleccionada) vive en la página que lo usa.
export default function FiltroCategorias({ seleccionada, onSeleccionar, conteos }) {
  const opciones = ['Todas', ...CATEGORIAS];

  return (
    <div role="group" aria-label="Filtrar por categoría" className="mb-4 flex flex-wrap gap-2">
      {opciones.map((categoria) => {
        const activa = seleccionada === categoria;
        return (
          <button
            key={categoria}
            type="button"
            aria-pressed={activa}
            onClick={() => onSeleccionar(categoria)}
            className={`rounded-full border px-3 py-1 text-sm font-medium transition focus:outline-none focus:ring-2 focus:ring-brand-500 ${
              activa
                ? 'border-brand-600 bg-brand-600 text-white'
                : 'border-slate-300 bg-white text-slate-700 hover:bg-slate-100 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            {categoria} <span className="opacity-70">({conteos[categoria] ?? 0})</span>
          </button>
        );
      })}
    </div>
  );
}
