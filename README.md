# 🛒 Supermercado – Gestión de inventario

Proyecto de la **Semana 3 – Desarrollando sitios web con React avanzado**
Asignatura: Desarrollo Frontend II (PFY2202) · Autor: _Bayro Rañileo_

Aplicación web para gestionar el inventario de un supermercado: permite listar y filtrar artículos, agregarlos
al inventario, ver su detalle y comprarlos mediante un carrito que descuenta el stock en tiempo real.

🔗 **Sitio publicado (GitHub Pages):** `https://bayrobastian2025.github.io/supermercado-nombre-apellido-PFY2202/`
## Funcionalidades

| Requerimiento | Dónde está |
| --- | --- |
| **Agregar artículos** (formulario con validaciones: nombre, marca, tipo, precio y stock) | `src/pages/AgregarArticulo.jsx`, `src/components/FormularioArticulo.jsx` |
| **Listado de artículos** en tabla con toda su información | `src/pages/Inventario.jsx`, `src/components/TablaArticulos.jsx` |
| **Filtro por categoría** que actualiza la vista dinámicamente sin perder el inventario original | `Inventario.jsx` (estado local `categoria` + `useMemo`) y `FiltroCategorias.jsx` |
| **Detalle del artículo** (ruta dinámica) con selector de cantidad y botón "Agregar al carrito" | `src/pages/DetalleArticulo.jsx` |
| **Carrito de compras**: aumentar / disminuir / eliminar / vaciar / finalizar compra; el inventario se actualiza en cada cambio | `src/pages/Carrito.jsx` |
| **Framework CSS**: Tailwind CSS (responsive, modo oscuro, tema propio) | `tailwind.config.js`, `src/index.css` |

### Reglas del inventario y el carrito
- Al agregar al carrito, las unidades se **restan del stock** del inventario.
- Al aumentar la cantidad en el carrito se resta 1 más; al disminuir, se **devuelve** 1.
- Al eliminar un artículo o vaciar el carrito, todo el stock se **restituye**.
- No es posible superar el stock disponible; los artículos agotados no se pueden agregar.
- "Finalizar compra" vacía el carrito y deja el stock descontado (la compra se concretó).
- El estado se guarda en `localStorage`, por lo que se mantiene al recargar la página.

## Tecnologías

- **React 18** + **Vite**
- **React Router v6**: archivo de rutas centralizado (`AppRoutes.jsx`), layout con rutas anidadas (`<Outlet />`),
  parámetros dinámicos (`/articulos/:articuloId`), `React.lazy` + `Suspense` (carga bajo demanda) y `HashRouter`
  (compatible con GitHub Pages).
- **Gestión de estado global**: Context API + `useReducer` (`src/context/`). El reducer es una función pura e inmutable
  con acciones explícitas; el estado derivado (líneas del carrito, totales) se calcula con `useMemo`.
- **Tailwind CSS 3**: tema personalizado (`brand`, `accent`), clases reutilizables con `@apply`
  (`.btn`, `.card`, `.input`, …), variantes `hover`/`focus`/`disabled`, **dark mode** y purge de clases no usadas.
- **Vitest + Testing Library**: pruebas del reducer y del flujo completo (filtro → detalle → carrito).

## Estructura del proyecto

```
src/
├── components/   # Componentes reutilizables (Button, Navbar, TablaArticulos, FormularioArticulo, ...)
├── context/      # Estado global: InventarioContext (provider + hook) e inventarioReducer
├── data/         # Categorías e inventario inicial
├── hooks/        # Hooks personalizados (useTema: modo claro/oscuro)
├── layouts/      # MainLayout (navbar + <Outlet /> + footer)
├── pages/        # Inventario, AgregarArticulo, DetalleArticulo, Carrito, NoEncontrada
├── routes/       # AppRoutes: todas las rutas en un solo archivo
├── test/         # Pruebas automatizadas
└── utils/        # Utilidades (formato de precios CLP)
```

## Cómo ejecutarlo en local

Requisitos: [Node.js](https://nodejs.org) 18 o superior.

```bash
npm install      # instala dependencias
npm start        # levanta el sitio en http://localhost:5173
npm test         # ejecuta las pruebas
npm run build    # genera la versión de producción en /dist
```

## Cómo publicarlo en GitHub Pages

```bash
npm run deploy   # compila y sube /dist a la rama gh-pages
```

Luego, en GitHub: **Settings → Pages → Source: Deploy from a branch → rama `gh-pages` / carpeta `/ (root)`**.

## Rutas de la aplicación

| Ruta | Pantalla |
| --- | --- |
| `/` | Inventario (listado + filtro por categoría) |
| `/agregar` | Formulario para agregar artículos |
| `/articulos/:articuloId` | Detalle del artículo + agregar al carrito |
| `/carrito` | Carrito de compras |
