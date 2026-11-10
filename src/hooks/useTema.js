import { useEffect, useState } from 'react';

const STORAGE_KEY = 'supermercado-tema';

// Modo oscuro/claro: agrega o quita la clase "dark" en <html> (darkMode: 'class').
export function useTema() {
  const [oscuro, setOscuro] = useState(() => {
    try {
      const guardado = localStorage.getItem(STORAGE_KEY);
      if (guardado) return guardado === 'oscuro';
    } catch {
      /* ignorar */
    }
    return window.matchMedia?.('(prefers-color-scheme: dark)').matches ?? false;
  });

  useEffect(() => {
    document.documentElement.classList.toggle('dark', oscuro);
    try {
      localStorage.setItem(STORAGE_KEY, oscuro ? 'oscuro' : 'claro');
    } catch {
      /* ignorar */
    }
  }, [oscuro]);

  return { oscuro, alternarTema: () => setOscuro((valor) => !valor) };
}
