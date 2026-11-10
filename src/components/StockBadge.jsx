// Indicador visual del stock: agotado / poco stock / disponible.
export default function StockBadge({ stock }) {
  if (stock === 0) {
    return <span className="badge bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300">Agotado</span>;
  }
  if (stock <= 10) {
    return (
      <span className="badge bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300">
        Quedan {stock}
      </span>
    );
  }
  return (
    <span className="badge bg-brand-100 text-brand-700 dark:bg-brand-900/50 dark:text-brand-100">
      {stock} disponibles
    </span>
  );
}
