const formateadorCLP = new Intl.NumberFormat('es-CL', {
  style: 'currency',
  currency: 'CLP',
  maximumFractionDigits: 0,
});

/** Formatea un número como pesos chilenos. Ej: 1190 -> "$1.190" */
export const formatearPrecio = (valor) => formateadorCLP.format(valor);
