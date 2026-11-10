import { useState } from 'react';
import { Link } from 'react-router-dom';
import Alerta from '../components/Alerta';
import FormularioArticulo from '../components/FormularioArticulo';
import PageHeader from '../components/PageHeader';
import { useInventario } from '../context/InventarioContext';

export default function AgregarArticulo() {
  const { items, agregarArticulo } = useInventario();
  const [ultimoAgregado, setUltimoAgregado] = useState(null);

  const guardar = (articulo) => {
    agregarArticulo(articulo);
    setUltimoAgregado(articulo.nombre);
  };

  return (
    <>
      <PageHeader titulo="Agregar artículo" descripcion="Ingresa un nuevo producto al inventario." />

      {ultimoAgregado && (
        <Alerta>
          ✅ <strong>{ultimoAgregado}</strong> se agregó al inventario.{' '}
          <Link to="/" className="font-semibold underline">
            Ver inventario
          </Link>
        </Alerta>
      )}

      <FormularioArticulo existentes={items} onGuardar={guardar} />
    </>
  );
}
