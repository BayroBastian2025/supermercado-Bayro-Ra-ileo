import { useState } from 'react';
import { CATEGORIAS } from '../data/categorias';
import Button from './Button';

const VALORES_INICIALES = { nombre: '', marca: '', tipo: '', precio: '', stock: '' };

// Validación pura: devuelve un objeto { campo: 'mensaje' } (vacío si todo está bien).
function validar(valores, existentes) {
  const errores = {};
  const nombre = valores.nombre.trim();
  const marca = valores.marca.trim();

  if (nombre.length < 2) errores.nombre = 'Ingresa un nombre (mínimo 2 caracteres).';
  if (marca.length < 2) errores.marca = 'Ingresa una marca (mínimo 2 caracteres).';
  if (!valores.tipo) errores.tipo = 'Selecciona un tipo de producto.';

  const precio = Number(valores.precio);
  if (valores.precio === '' || !Number.isInteger(precio) || precio <= 0) {
    errores.precio = 'El precio debe ser un número entero mayor a 0.';
  }
  const stock = Number(valores.stock);
  if (valores.stock === '' || !Number.isInteger(stock) || stock < 0) {
    errores.stock = 'El stock debe ser un número entero igual o mayor a 0.';
  }

  const duplicado = existentes.some(
    (item) => item.nombre.toLowerCase() === nombre.toLowerCase() && item.marca.toLowerCase() === marca.toLowerCase()
  );
  if (!errores.nombre && !errores.marca && duplicado) {
    errores.nombre = 'Ya existe un artículo con ese nombre y marca.';
  }
  return errores;
}

export default function FormularioArticulo({ existentes, onGuardar }) {
  const [valores, setValores] = useState(VALORES_INICIALES);
  const [errores, setErrores] = useState({});

  const manejarCambio = (evento) => {
    const { name, value } = evento.target;
    setValores((anterior) => ({ ...anterior, [name]: value }));
    // Al corregir un campo se limpia su error.
    if (errores[name]) setErrores((anterior) => ({ ...anterior, [name]: undefined }));
  };

  const manejarEnvio = (evento) => {
    evento.preventDefault();
    const nuevosErrores = validar(valores, existentes);
    setErrores(nuevosErrores);
    if (Object.keys(nuevosErrores).length > 0) return;

    onGuardar({
      nombre: valores.nombre.trim(),
      marca: valores.marca.trim(),
      tipo: valores.tipo,
      precio: Number(valores.precio),
      stock: Number(valores.stock),
    });
    setValores(VALORES_INICIALES);
  };

  // Props comunes de cada campo para no repetir código.
  const campo = (name) => ({
    id: name,
    name,
    value: valores[name],
    onChange: manejarCambio,
    'aria-invalid': Boolean(errores[name]),
    'aria-describedby': errores[name] ? `${name}-error` : undefined,
    className: `input ${errores[name] ? 'input-error' : ''}`,
  });

  const mensaje = (name) =>
    errores[name] && (
      <p id={`${name}-error`} className="error-text">
        {errores[name]}
      </p>
    );

  return (
    <form onSubmit={manejarEnvio} noValidate className="card grid gap-4 sm:grid-cols-2">
      <div>
        <label htmlFor="nombre" className="label">Nombre</label>
        <input type="text" placeholder="Ej: Leche descremada 1 L" {...campo('nombre')} />
        {mensaje('nombre')}
      </div>

      <div>
        <label htmlFor="marca" className="label">Marca</label>
        <input type="text" placeholder="Ej: Soprole" {...campo('marca')} />
        {mensaje('marca')}
      </div>

      <div>
        <label htmlFor="tipo" className="label">Tipo de producto</label>
        <select {...campo('tipo')}>
          <option value="">Selecciona una categoría…</option>
          {CATEGORIAS.map((categoria) => (
            <option key={categoria} value={categoria}>
              {categoria}
            </option>
          ))}
        </select>
        {mensaje('tipo')}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="precio" className="label">Precio (CLP)</label>
          <input type="number" min="1" step="1" inputMode="numeric" placeholder="1990" {...campo('precio')} />
          {mensaje('precio')}
        </div>
        <div>
          <label htmlFor="stock" className="label">Stock</label>
          <input type="number" min="0" step="1" inputMode="numeric" placeholder="20" {...campo('stock')} />
          {mensaje('stock')}
        </div>
      </div>

      <div className="sm:col-span-2">
        <Button type="submit">Agregar al inventario</Button>
      </div>
    </form>
  );
}
