const ESTILOS = {
  exito: 'border-brand-500 bg-brand-50 text-brand-900 dark:bg-brand-900/30 dark:text-brand-100',
  error: 'border-red-500 bg-red-50 text-red-800 dark:bg-red-900/30 dark:text-red-200',
};

export default function Alerta({ tipo = 'exito', children }) {
  return (
    <div role={tipo === 'error' ? 'alert' : 'status'} className={`mb-4 rounded-lg border-l-4 px-4 py-3 text-sm ${ESTILOS[tipo]}`}>
      {children}
    </div>
  );
}
