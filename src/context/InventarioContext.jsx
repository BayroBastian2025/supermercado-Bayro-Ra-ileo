import { createContext, useCallback, useContext, useEffect, useMemo, useReducer } from 'react';
import { INVENTARIO_INICIAL } from '../data/inventarioInicial';
import { ACCIONES, inventarioReducer } from './inventarioReducer';

const STORAGE_KEY = 'supermercado-estado-v1';

const estadoInicial = () => ({ items: INVENTARIO_INICIAL, carrito: [] });

// Recupera el estado guardado en el navegador (si existe y es válido).
function cargarEstado() {
  try {
    const guardado = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (guardado && Array.isArray(guardado.items) && Array.isArray(guardado.carrito)) {
      return guardado;
    }
  } catch {
    /* si el JSON está corrupto o no hay acceso a localStorage se usa el estado inicial */
  }
  return estadoInicial();
}

const InventarioContext = createContext(null);

export function InventarioProvider({ children, initialState }) {
  const [state, dispatch] = useReducer(inventarioReducer, initialState, (inicial) =>
    inicial ?? cargarEstado()
  );

  // Persistencia: el inventario y el carrito sobreviven a recargar la página.
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      /* sin persistencia, la app sigue funcionando */
    }
  }, [state]);

  // Acciones expuestas a los componentes (referencias estables con useCallback).
  const agregarArticulo = useCallback(
    (articulo) => dispatch({ type: ACCIONES.AGREGAR_ARTICULO, payload: articulo }),
    []
  );
  const agregarAlCarrito = useCallback(
    (id, cantidad) => dispatch({ type: ACCIONES.AGREGAR_AL_CARRITO, payload: { id, cantidad } }),
    []
  );
  const aumentarCantidad = useCallback(
    (id) => dispatch({ type: ACCIONES.AUMENTAR_CANTIDAD, payload: id }),
    []
  );
  const disminuirCantidad = useCallback(
    (id) => dispatch({ type: ACCIONES.DISMINUIR_CANTIDAD, payload: id }),
    []
  );
  const eliminarDelCarrito = useCallback(
    (id) => dispatch({ type: ACCIONES.ELIMINAR_DEL_CARRITO, payload: id }),
    []
  );
  const vaciarCarrito = useCallback(() => dispatch({ type: ACCIONES.VACIAR_CARRITO }), []);
  const finalizarCompra = useCallback(() => dispatch({ type: ACCIONES.FINALIZAR_COMPRA }), []);

  // Datos derivados: se calculan a partir del estado, no se guardan aparte.
  const lineasCarrito = useMemo(
    () =>
      state.carrito
        .map((linea) => {
          const articulo = state.items.find((item) => item.id === linea.id);
          return articulo ? { ...articulo, cantidad: linea.cantidad, subtotal: articulo.precio * linea.cantidad } : null;
        })
        .filter(Boolean),
    [state.carrito, state.items]
  );
  const totalUnidades = useMemo(
    () => lineasCarrito.reduce((suma, l) => suma + l.cantidad, 0),
    [lineasCarrito]
  );
  const totalPrecio = useMemo(
    () => lineasCarrito.reduce((suma, l) => suma + l.subtotal, 0),
    [lineasCarrito]
  );

  const value = useMemo(
    () => ({
      items: state.items,
      lineasCarrito,
      totalUnidades,
      totalPrecio,
      agregarArticulo,
      agregarAlCarrito,
      aumentarCantidad,
      disminuirCantidad,
      eliminarDelCarrito,
      vaciarCarrito,
      finalizarCompra,
    }),
    [
      state.items,
      lineasCarrito,
      totalUnidades,
      totalPrecio,
      agregarArticulo,
      agregarAlCarrito,
      aumentarCantidad,
      disminuirCantidad,
      eliminarDelCarrito,
      vaciarCarrito,
      finalizarCompra,
    ]
  );

  return <InventarioContext.Provider value={value}>{children}</InventarioContext.Provider>;
}

// Hook personalizado para consumir el estado global.
export function useInventario() {
  const contexto = useContext(InventarioContext);
  if (!contexto) {
    throw new Error('useInventario debe usarse dentro de <InventarioProvider>');
  }
  return contexto;
}
