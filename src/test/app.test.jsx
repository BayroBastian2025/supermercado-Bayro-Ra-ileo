import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { beforeEach, describe, expect, it } from 'vitest';
import App from '../App';
import { InventarioProvider } from '../context/InventarioContext';

const estado = () => ({
  items: [
    { id: 1, nombre: 'Leche entera', marca: 'Colun', tipo: 'Lácteos', precio: 1000, stock: 5 },
    { id: 2, nombre: 'Marraqueta', marca: 'Local', tipo: 'Panadería', precio: 2000, stock: 3 },
    { id: 3, nombre: 'Yogurt', marca: 'Soprole', tipo: 'Lácteos', precio: 500, stock: 8 },
  ],
  carrito: [],
});

const renderizar = (ruta = '/') =>
  render(
    <MemoryRouter initialEntries={[ruta]}>
      <InventarioProvider initialState={estado()}>
        <App />
      </InventarioProvider>
    </MemoryRouter>
  );

beforeEach(() => localStorage.clear());

describe('Flujo completo de la aplicación', () => {
  it('lista el inventario y filtra por categoría sin perder datos originales', async () => {
    const user = userEvent.setup();
    renderizar();
    expect(await screen.findByText('Leche entera')).toBeInTheDocument();
    expect(screen.getByText(/Mostrando 3 de 3/)).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /Lácteos/ }));
    expect(screen.queryByText('Marraqueta')).not.toBeInTheDocument();
    expect(screen.getByText(/Mostrando 2 de 3/)).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /Todas/ }));
    expect(screen.getByText('Marraqueta')).toBeInTheDocument();
    expect(screen.getByText(/Mostrando 3 de 3/)).toBeInTheDocument();
  });

  it('agrega un artículo nuevo desde el formulario y valida campos', async () => {
    const user = userEvent.setup();
    renderizar('/agregar');
    await user.click(await screen.findByRole('button', { name: /Agregar al inventario/ }));
    expect(screen.getByText(/Ingresa un nombre/)).toBeInTheDocument();

    await user.type(screen.getByLabelText('Nombre'), 'Jugo de naranja');
    await user.type(screen.getByLabelText('Marca'), 'Watts');
    await user.selectOptions(screen.getByLabelText('Tipo de producto'), 'Bebidas');
    await user.type(screen.getByLabelText(/Precio/), '1200');
    await user.type(screen.getByLabelText('Stock'), '15');
    await user.click(screen.getByRole('button', { name: /Agregar al inventario/ }));
    expect(screen.getByText(/se agregó al inventario/)).toBeInTheDocument();

    await user.click(screen.getByRole('link', { name: 'Inventario' }));
    expect(await screen.findByText('Jugo de naranja')).toBeInTheDocument();
  });

  it('detalle → carrito: descuenta y devuelve stock al cambiar cantidades', async () => {
    const user = userEvent.setup();
    renderizar('/articulos/1');
    expect(await screen.findByRole('heading', { name: 'Leche entera' })).toBeInTheDocument();
    expect(screen.getByText('Quedan 5')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /Aumentar cantidad/ }));
    await user.click(screen.getByRole('button', { name: /Agregar al carrito/ }));
    expect(screen.getByText(/Quedan 3/)).toBeInTheDocument(); // 5 - 2

    await user.click(screen.getByRole('link', { name: /^Carrito/ }));
    await screen.findByRole('heading', { name: 'Carrito de compras' });
    const fila = screen.getByText('Leche entera').closest('tr');
    expect(within(fila).getByText(/quedan 3 en inventario/)).toBeInTheDocument();

    await user.click(within(fila).getByRole('button', { name: /Aumentar cantidad/ }));
    expect(within(fila).getByText(/quedan 2 en inventario/)).toBeInTheDocument();
    await user.click(within(fila).getByRole('button', { name: /Disminuir cantidad/ }));
    await user.click(within(fila).getByRole('button', { name: /Disminuir cantidad/ }));
    expect(within(fila).getByText(/quedan 4 en inventario/)).toBeInTheDocument();

    await user.click(within(fila).getByRole('button', { name: /Eliminar/ }));
    expect(screen.getByText(/Tu carrito está vacío/)).toBeInTheDocument();

    await user.click(screen.getByRole('link', { name: 'Inventario' }));
    expect(await screen.findAllByText('Quedan 5')).toHaveLength(1); // stock restituido
  });

  it('muestra mensaje si el artículo no existe', async () => {
    renderizar('/articulos/999');
    expect(await screen.findByText('Artículo no encontrado')).toBeInTheDocument();
  });
});
