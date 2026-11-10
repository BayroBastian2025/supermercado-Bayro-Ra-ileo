/**
 * Reducer del estado global.
 *
 * Forma del estado:
 *   items: Artículo[]                 -> inventario general (stock disponible)
 *   carrito: { id, cantidad }[]       -> solo guarda id y cantidad; el detalle
 *                                        del artículo se obtiene desde `items`
 *                                        (así no se duplica información).
 *
 * Regla de negocio: lo que está en el carrito se descuenta del stock del
 * inventario; al quitarlo o disminuirlo, el stock se devuelve.
 */

export const ACCIONES = {
  AGREGAR_ARTICULO: 'AGREGAR_ARTICULO',
  AGREGAR_AL_CARRITO: 'AGREGAR_AL_CARRITO',
  AUMENTAR_CANTIDAD: 'AUMENTAR_CANTIDAD',
  DISMINUIR_CANTIDAD: 'DISMINUIR_CANTIDAD',
  ELIMINAR_DEL_CARRITO: 'ELIMINAR_DEL_CARRITO',
  VACIAR_CARRITO: 'VACIAR_CARRITO',
  FINALIZAR_COMPRA: 'FINALIZAR_COMPRA',
};

// Devuelve una copia de `items` modificando el stock de un artículo (inmutable).
const cambiarStock = (items, id, delta) =>
  items.map((item) => (item.id === id ? { ...item, stock: item.stock + delta } : item));

// Devuelve una copia del carrito con la cantidad de un artículo modificada.
// Si la cantidad resultante es 0 o menos, el artículo sale del carrito.
const cambiarCantidad = (carrito, id, delta) =>
  carrito
    .map((linea) => (linea.id === id ? { ...linea, cantidad: linea.cantidad + delta } : linea))
    .filter((linea) => linea.cantidad > 0);

export function inventarioReducer(state, action) {
  switch (action.type) {
    case ACCIONES.AGREGAR_ARTICULO: {
      const nuevoId = state.items.reduce((max, item) => Math.max(max, item.id), 0) + 1;
      const nuevo = { ...action.payload, id: nuevoId };
      return { ...state, items: [...state.items, nuevo] };
    }

    case ACCIONES.AGREGAR_AL_CARRITO: {
      const { id, cantidad } = action.payload;
      const articulo = state.items.find((item) => item.id === id);
      if (!articulo) return state;

      // Nunca se puede llevar más que el stock disponible.
      const cantidadReal = Math.min(Math.floor(cantidad), articulo.stock);
      if (!(cantidadReal > 0)) return state;

      const yaEnCarrito = state.carrito.some((linea) => linea.id === id);
      const carrito = yaEnCarrito
        ? cambiarCantidad(state.carrito, id, cantidadReal)
        : [...state.carrito, { id, cantidad: cantidadReal }];

      return { items: cambiarStock(state.items, id, -cantidadReal), carrito };
    }

    case ACCIONES.AUMENTAR_CANTIDAD: {
      const articulo = state.items.find((item) => item.id === action.payload);
      const enCarrito = state.carrito.some((linea) => linea.id === action.payload);
      if (!articulo || !enCarrito || articulo.stock < 1) return state;
      return {
        items: cambiarStock(state.items, action.payload, -1),
        carrito: cambiarCantidad(state.carrito, action.payload, 1),
      };
    }

    case ACCIONES.DISMINUIR_CANTIDAD: {
      const linea = state.carrito.find((l) => l.id === action.payload);
      // Con 1 unidad no se disminuye más: para sacarlo existe "Eliminar".
      if (!linea || linea.cantidad <= 1) return state;
      return {
        items: cambiarStock(state.items, action.payload, 1),
        carrito: cambiarCantidad(state.carrito, action.payload, -1),
      };
    }

    case ACCIONES.ELIMINAR_DEL_CARRITO: {
      const linea = state.carrito.find((l) => l.id === action.payload);
      if (!linea) return state;
      return {
        items: cambiarStock(state.items, action.payload, linea.cantidad),
        carrito: state.carrito.filter((l) => l.id !== action.payload),
      };
    }

    case ACCIONES.VACIAR_CARRITO: {
      // Devuelve todas las unidades al inventario.
      const items = state.carrito.reduce(
        (acc, linea) => cambiarStock(acc, linea.id, linea.cantidad),
        state.items
      );
      return { items, carrito: [] };
    }

    case ACCIONES.FINALIZAR_COMPRA:
      // La compra se concreta: el carrito se vacía y el stock queda descontado.
      return { ...state, carrito: [] };

    default:
      return state;
  }
}
