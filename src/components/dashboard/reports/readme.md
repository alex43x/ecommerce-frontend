# 📊 Report Components

Este directorio contiene los componentes de visualización y análisis de reportes del sistema PVS. Cada componente está enfocado en un tipo de métrica clave del negocio (ventas, categorías, métodos de pago, etc.).

---

## Componentes

### ✅ `CashClosingReport.jsx`
Muestra el reporte de cierre de caja. Resume las ventas del día por método de pago y calcula el total recaudado para control administrativo.

---

### 📦 `CategoryReport.jsx`
Renderiza un gráfico que representa las ventas totales agrupadas por categorías de productos. Incluye filtros de fecha y botón para refrescar los datos.

---

### 💳 `PaymentMethodReport.jsx`
Visualiza en un gráfico circular los métodos de pago más utilizados. Permite seleccionar un rango de fechas y actualizar los datos dinámicamente.

---

### 🛒 `ProductReport.jsx`
Muestra las ventas de variantes de productos en forma de gráficos (acumulado o semanal). Se actualiza según las variantes seleccionadas y el rango de fechas.

---

### 🎯 `ProductVariantSelector.jsx`
Permite seleccionar variantes específicas de productos para incluirlas en el reporte de productos. Usa búsqueda con debouncing y dropdown de selección múltiple.

---

### 👤 `SellerReport.jsx`
Desglosa las ventas por vendedor o usuario del sistema. Incluye control de fechas y botón para recargar la información desde el backend.

---

### ⌛ `useDebounce.jsx`
Hook personalizado que aplica un retardo (debounce) al valor de entrada. Ideal para evitar múltiples llamadas innecesarias al backend en inputs de búsqueda.

---

### 📆 `WeeklyReport.jsx`
Gráfico de barras que muestra las ventas por día en una semana. Se utiliza en el reporte principal para representar la actividad diaria de forma clara.

---

## 🧩 Integración
Todos estos componentes están diseñados para usarse dentro del componente principal `Reports.jsx`, utilizando datos y funciones proporcionadas por el contexto `ReportContext`.

---

## 🛠️ Requisitos
- `Chart.js` y sus componentes registrados.
- `dayjs` para manipulación de fechas.
- Estilos de TailwindCSS.
- Backend expuesto en las rutas `/api/reports` y `/api/sales`.

---



