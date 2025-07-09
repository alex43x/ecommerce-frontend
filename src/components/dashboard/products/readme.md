# 📦 Components: `products`

Esta carpeta contiene todos los componentes relacionados con la gestión de productos en el sistema POS (Punto de Venta). Cada archivo representa un componente reutilizable dentro del dashboard administrativo.

---

## 📄 Archivos y descripción

### `CategoriesMenu.jsx`
Componente para **administrar las categorías de productos**. Permite agregar, editar y eliminar categorías de forma interactiva, con validaciones y uso de modales.

---

### `DashboardTabs.jsx`
Contiene las pestañas del dashboard. Organiza visualmente las distintas secciones como productos, variantes o categorías.

---

### `FilterDropdown.jsx`
Dropdown reutilizable que permite **filtrar productos** por orden, categoría, etc. Recibe opciones dinámicas y maneja selección de forma controlada.

---

### `NewProductForm.jsx`
Formulario utilizado dentro del modal para **crear nuevos productos**. Incluye campos de nombre, imagen, categorías y variantes.

---

### `ProductFormModal.jsx`
Componente genérico de **modal para formularios**. Se utiliza principalmente para mostrar el formulario de nuevo producto o la edición de categorías.

---

### `ProductTable.jsx`
Componente principal que **renderiza la tabla de productos**. Utiliza `ProductRow` para cada fila y maneja el estado de edición, carga y props de actualización.

---

### `ProductRow.jsx`
Representa una **fila de producto en la tabla**, mostrando sus datos. También permite la edición directa en línea del producto, incluyendo sus variantes y categorías.

---

### `VariantsTable.jsx`
Tabla interna para **gestionar variantes de un producto**. Soporta edición en línea, validación de datos y agregado/eliminado dinámico de variantes.

---

## ✅ Uso

Todos estos componentes son utilizados dentro de la vista de administración de productos, integrándose con el contexto global (`ProductContext`) para cargar, modificar y visualizar datos.

---

## 🧩 Requisitos

- React
- Context API (`useProduct`)
- `sweetalert2` (para confirmaciones)
- Estilos personalizados o framework como TailwindCSS
- Imágenes (íconos) importadas localmente


