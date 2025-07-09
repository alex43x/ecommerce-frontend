# 📄 RecentSales.jsx

Componente de React para mostrar una **tabla de ventas recientes** en un sistema POS (Punto de Venta). Permite visualizar detalles clave de cada venta y realizar la acción de **anulación** con confirmación mediante `SweetAlert2`.

---

## 🔧 Props

| Prop      | Tipo     | Descripción                                                                 |
|-----------|----------|-----------------------------------------------------------------------------|
| `sales`   | `Array`  | Lista de ventas a mostrar. Cada venta debe incluir productos, fecha, total, etc. |
| `onCancel`| `Function` | Función que se ejecuta al confirmar la anulación de una venta (recibe `saleId`). |

---

## 🧩 Funcionalidades

- ✅ Muestra:
  - Fecha y hora de la venta.
  - Lista de productos vendidos.
  - Total de la venta en Guaraníes (`PYG`).
  - RUC del cliente.
  - Métodos de pago utilizados.
  - Estado de la venta.
  - Usuario que registró la venta.

- ❌ Permite anular ventas **no anuladas** con confirmación (`SweetAlert2`).

---

## 🖼️ Estados soportados

- `completed`: Completado
- `ordered`: Pedido
- `pending`: Pendiente
- `canceled`: Cancelado
- `annulled`: Anulado

Cada uno tiene estilos visuales propios definidos en `statusLabels`.

---

## 💡 Detalles técnicos

- Se usa `Swal.fire()` para confirmar la anulación.
- Los métodos de pago se traducen desde claves internas (`cash`, `card`, etc.) a textos legibles.
- Si no hay ventas, se muestra un mensaje amigable.
- Usa clases TailwindCSS para estilos adaptables y modernos.

---

## 🗃️ Dependencias

- `react`
- `sweetalert2`
- `tailwindcss` (para estilos)

---

