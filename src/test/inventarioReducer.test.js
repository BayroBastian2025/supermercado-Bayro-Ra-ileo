import { describe, expect, it } from 'vitest';
import { ACCIONES, inventarioReducer } from '../context/inventarioReducer';

const base = () => ({
  items: [
    { id: 1, nombre: 'Leche', marca: 'Colun', tipo: 'Lácteos', precio: 1000, stock: 10 },
    { id: 2, nombre: 'Pan', marca: 'Castaño', tipo: 'Panadería', precio: 2000, stock: 2 },
  ],
  carrito: [],
});
const stockDe = (state, id) => state.items.find((i) => i.id === id).stock;

describe('inventarioReducer', () => {
  it('agrega un artículo nuevo con id incremental', () => {
    const s = inventarioReducer(base(), {
      type: ACCIONES.AGREGAR_ARTICULO,
      payload: { nombre: 'Jugo', marca: 'Watts', tipo: 'Bebidas', precio: 900, stock: 5 },
    });
    expect(s.items).toHaveLength(3);
    expect(s.items[2].id).toBe(3);
  });

  it('agregar al carrito descuenta stock y suma si ya existe', () => {
    let s = inventarioReducer(base(), { type: ACCIONES.AGREGAR_AL_CARRITO, payload: { id: 1, cantidad: 3 } });
    expect(stockDe(s, 1)).toBe(7);
    s = inventarioReducer(s, { type: ACCIONES.AGREGAR_AL_CARRITO, payload: { id: 1, cantidad: 2 } });
    expect(stockDe(s, 1)).toBe(5);
    expect(s.carrito).toEqual([{ id: 1, cantidad: 5 }]);
  });

  it('no permite superar el stock disponible', () => {
    const s = inventarioReducer(base(), { type: ACCIONES.AGREGAR_AL_CARRITO, payload: { id: 2, cantidad: 99 } });
    expect(stockDe(s, 2)).toBe(0);
    expect(s.carrito[0].cantidad).toBe(2);
    const s2 = inventarioReducer(s, { type: ACCIONES.AUMENTAR_CANTIDAD, payload: 2 });
    expect(s2).toBe(s); // sin stock: no cambia nada
  });

  it('aumentar y disminuir actualizan carrito e inventario', () => {
    let s = inventarioReducer(base(), { type: ACCIONES.AGREGAR_AL_CARRITO, payload: { id: 1, cantidad: 1 } });
    s = inventarioReducer(s, { type: ACCIONES.AUMENTAR_CANTIDAD, payload: 1 });
    expect(s.carrito[0].cantidad).toBe(2);
    expect(stockDe(s, 1)).toBe(8);
    s = inventarioReducer(s, { type: ACCIONES.DISMINUIR_CANTIDAD, payload: 1 });
    expect(s.carrito[0].cantidad).toBe(1);
    expect(stockDe(s, 1)).toBe(9);
    // con 1 unidad no baja más
    expect(inventarioReducer(s, { type: ACCIONES.DISMINUIR_CANTIDAD, payload: 1 })).toBe(s);
  });

  it('eliminar y vaciar devuelven el stock', () => {
    let s = inventarioReducer(base(), { type: ACCIONES.AGREGAR_AL_CARRITO, payload: { id: 1, cantidad: 4 } });
    s = inventarioReducer(s, { type: ACCIONES.AGREGAR_AL_CARRITO, payload: { id: 2, cantidad: 2 } });
    s = inventarioReducer(s, { type: ACCIONES.ELIMINAR_DEL_CARRITO, payload: 1 });
    expect(stockDe(s, 1)).toBe(10);
    s = inventarioReducer(s, { type: ACCIONES.VACIAR_CARRITO });
    expect(stockDe(s, 2)).toBe(2);
    expect(s.carrito).toEqual([]);
  });

  it('finalizar compra vacía el carrito sin devolver stock', () => {
    let s = inventarioReducer(base(), { type: ACCIONES.AGREGAR_AL_CARRITO, payload: { id: 1, cantidad: 4 } });
    s = inventarioReducer(s, { type: ACCIONES.FINALIZAR_COMPRA });
    expect(s.carrito).toEqual([]);
    expect(stockDe(s, 1)).toBe(6);
  });

  it('no muta el estado original (inmutabilidad)', () => {
    const original = base();
    const copia = JSON.stringify(original);
    inventarioReducer(original, { type: ACCIONES.AGREGAR_AL_CARRITO, payload: { id: 1, cantidad: 3 } });
    expect(JSON.stringify(original)).toBe(copia);
  });
});
