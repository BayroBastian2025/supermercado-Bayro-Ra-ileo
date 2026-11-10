const VARIANTES = {
  primary: 'btn-primary',
  secondary: 'btn-secondary',
  danger: 'btn-danger',
};

// Botón reutilizable: aplica estilos base + variante (primary, secondary, danger).
export default function Button({ variant = 'primary', className = '', type = 'button', children, ...props }) {
  return (
    <button type={type} className={`btn ${VARIANTES[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
}
