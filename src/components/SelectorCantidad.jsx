// Control +/- para elegir una cantidad entre `min` y `max`.
export default function SelectorCantidad({ cantidad, min = 1, max, onAumentar, onDisminuir, etiqueta = 'artículo' }) {
  return (
    <div className="inline-flex items-center overflow-hidden rounded-lg border border-slate-300 dark:border-slate-600">
      <button
        type="button"
        onClick={onDisminuir}
        disabled={cantidad <= min}
        aria-label={`Disminuir cantidad de ${etiqueta}`}
        className="px-3 py-1.5 text-lg font-bold hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-brand-500 disabled:cursor-not-allowed disabled:opacity-40 dark:hover:bg-slate-700"
      >
        −
      </button>
      <span aria-live="polite" className="min-w-[2.5rem] px-2 text-center text-sm font-semibold tabular-nums">
        {cantidad}
      </span>
      <button
        type="button"
        onClick={onAumentar}
        disabled={cantidad >= max}
        aria-label={`Aumentar cantidad de ${etiqueta}`}
        className="px-3 py-1.5 text-lg font-bold hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-brand-500 disabled:cursor-not-allowed disabled:opacity-40 dark:hover:bg-slate-700"
      >
        +
      </button>
    </div>
  );
}
