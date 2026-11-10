export default function PageHeader({ titulo, descripcion, children }) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">{titulo}</h1>
        {descripcion && <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{descripcion}</p>}
      </div>
      {children}
    </div>
  );
}
