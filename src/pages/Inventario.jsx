import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import EstadoVacio from '../components/EstadoVacio';
import FiltroCategorias from '../components/FiltroCategorias';
import PageHeader from '../components/PageHeader';
import TablaArticulos from '../components/TablaArticulos';
import { useInventario } from '../context/InventarioContext';

export default function Inventario() {
  const { items } = useInventario();

  // Estado local del filtro: solo esta página lo necesita.
  const [categoria, setCategoria] = useState('Todas');

  // El filtro NO modifica `items` (inventario original): se deriva una lista nueva.
  const articulosFiltrados = useMemo(
    () => (categoria === 'Todas' ? items : items.filter((item) => item.tipo === categoria)),
    [items, categoria]
  );

  // Cantidad de artículos por categoría (para mostrar en cada botón).
  const conteos = useMemo(() => {
    const resultado = { Todas: items.length };
    items.forEach((item) => {
      resultado[item.tipo] = (resultado[item.tipo] ?? 0) + 1;
    });
    return resultado;
  }, [items]);

  return (
    <>
      <PageHeader titulo="Inventario" descripcion="Artículos disponibles en el supermercado.">
        <Link to="/agregar" className="btn btn-primary">
          + Agregar artículo
        </Link>
      </PageHeader>

      <FiltroCategorias seleccionada={categoria} onSeleccionar={setCategoria} conteos={conteos} />

      <p className="mb-3 text-sm text-slate-500 dark:text-slate-400" aria-live="polite">
        Mostrando {articulosFiltrados.length} de {items.length} artículos
        {categoria !== 'Todas' && <> en <strong>{categoria}</strong></>}.
      </p>

      {articulosFiltrados.length > 0 ? (
        <TablaArticulos articulos={articulosFiltrados} />
      ) : (
        <EstadoVacio
          titulo="No hay artículos en esta categoría"
          descripcion="Agrega un nuevo artículo o prueba con otra categoría."
          enlace="/agregar"
          textoEnlace="Agregar artículo"
        />
      )}
    </>
  );
}
