import EstadoVacio from '../components/EstadoVacio';

export default function NoEncontrada() {
  return (
    <EstadoVacio
      titulo="404 · Página no encontrada"
      descripcion="La dirección que ingresaste no existe."
      enlace="/"
      textoEnlace="Volver al inventario"
    />
  );
}
