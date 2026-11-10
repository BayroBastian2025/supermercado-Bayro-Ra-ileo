import { NavLink } from 'react-router-dom';
import { useInventario } from '../context/InventarioContext';
import { useTema } from '../hooks/useTema';

const enlaceClase = ({ isActive }) =>
  `rounded-lg px-3 py-2 text-sm font-medium transition ${
    isActive
      ? 'bg-white/20 text-white'
      : 'text-brand-100 hover:bg-white/10 hover:text-white'
  }`;

export default function Navbar() {
  const { totalUnidades } = useInventario();
  const { oscuro, alternarTema } = useTema();

  return (
    <header className="bg-brand-700 shadow dark:bg-brand-900">
      <nav
        aria-label="Navegación principal"
        className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-2 px-4 py-3"
      >
        <span className="text-lg font-bold text-white">🛒 Supermercado</span>

        <ul className="flex flex-wrap items-center gap-1">
          <li>
            <NavLink to="/" end className={enlaceClase}>
              Inventario
            </NavLink>
          </li>
          <li>
            <NavLink to="/agregar" className={enlaceClase}>
              Agregar artículo
            </NavLink>
          </li>
          <li>
            <NavLink to="/carrito" className={enlaceClase}>
              Carrito
              {totalUnidades > 0 && (
                <span
                  aria-label={`${totalUnidades} unidades en el carrito`}
                  className="badge ml-2 bg-accent-500 text-white"
                >
                  {totalUnidades}
                </span>
              )}
            </NavLink>
          </li>
          <li>
            <button
              type="button"
              onClick={alternarTema}
              aria-label={oscuro ? 'Activar modo claro' : 'Activar modo oscuro'}
              className="rounded-lg px-3 py-2 text-sm text-white hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/60"
            >
              {oscuro ? '☀️' : '🌙'}
            </button>
          </li>
        </ul>
      </nav>
    </header>
  );
}
