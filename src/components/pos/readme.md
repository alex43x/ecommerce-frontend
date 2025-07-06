# Componentes del Punto de Venta (POS)

Este directiorio contiene a los componentes propios del Punto de Venta

---

##  PosTabs.jsx

Componente central del sistema POS que actúa como un _switch_ de vistas. Renderiza uno de los siguientes componentes según la pestaña activa:

- 🍴 `Foods` → productos tipo comida
- 🥤 `Drinks` → productos tipo bebida
- ⏳ `PendingSales` → ventas en espera

---

###  Props

| Prop        | Tipo     | Descripción                                      |
|-------------|----------|--------------------------------------------------|
| `activeTab` | `string` | Define la vista activa (`foods`, `drinks`, `pending`). Default: `"foods"` |

---

###  Hooks usados

- `useEffect()`: Llama a `getCategories()` al montar el componente.
- `useProduct()`: Contexto de productos, extrae las `categories` necesarias para el componente `Foods`.

---

###  Lógica de renderizado

```jsx
{activeTab === "foods" && <Foods categories={categories} />}
{activeTab === "drinks" && <Drinks />}
{activeTab === "pending" && <PendingSales />}
```

##  Foods.jsx &  Drinks.jsx

Componentes responsables de mostrar productos por categoría dentro del Pos. Ambos permiten:

- Buscar por nombre o código de barras.
- Agregar productos al carrito automáticamente desde un escaneo.
- Renderizar productos usando el componente `ProductContainer`.

---

###  Similitudes

| Característica                     | Descripción                                                                 |
|-----------------------------------|-----------------------------------------------------------------------------|
| 🔍 Búsqueda por nombre            | Input controlado con `lodash.debounce(500ms)` para filtrar productos.      |
| 📷 Búsqueda por código de barras | Al presionar Enter, busca el producto y lo agrega al carrito si existe.    |
| 🛒 Agregado al carrito           | Verifica existencia, cantidad previa y agrega producto + variante.         |
| 🧰 Hooks usados                   | `useProduct`, `useCart`, `useState`, `useEffect`.                          |
| 📦 Render de productos           | Muestra productos usando `<ProductContainer />` en una grilla.             |
| ⚠️ Errores                       | Si no se encuentra el producto por código, muestra un modal de error.      |

---

###  Diferencias principales

| Aspecto                        | Foods.jsx                                  | Drinks.jsx                        |
|--------------------------------|---------------------------------------------|-----------------------------------|
| 📂 Categoría inicial           | `"noBebidas"` (puede cambiar)              | `"Bebidas"` (fijo)                |
| 🔄 Cambio de categoría         | Permite seleccionar otras no-bebidas       | No permite cambiar de categoría   |
| 📄 Paginación                  | Incluye control de páginas y total por cat | No tiene paginación (solo página 1) |
| 🔢 Límite de productos         | 27 por página                              | 24 por búsqueda                   |
| 🧱 Grid                        | 3 columnas                                 | 2 columnas                        |

---

###  Estado común (ambos)

- `searchInput`: texto de búsqueda por nombre
- `barcode`: texto ingresado para escanear
- `triggeredByScan`: bandera para controlar agregados por escaneo

---

###  Función clave: búsqueda por código

```js
if (e.key === "Enter") {
  getProductByBarcode(barcode);
  setTriggeredByScan(true);
  setBarcode("");
}

```

#  PendingSales.jsx

## 📄 Descripción General

Componente encargado de mostrar, gestionar y filtrar las órdenes del día según su estado (`pending`, `ordered`, `completed`, etc.). Permite:

- Visualizar órdenes por estado
- Ver detalle de productos y total
- Cancelar o marcar como listo
- Reabrir una orden para continuar con el pago

---

##  Estado Interno

| Estado            | Tipo     | Descripción                                                                 |
|-------------------|----------|-----------------------------------------------------------------------------|
| `confirmOrder`    | boolean  | Controla visibilidad del modal de pago (`OrderDetail`)                     |
| `order`           | object   | Venta seleccionada para procesar el pago                                   |
| `selectedStatus`  | string   | Filtro de estado de las órdenes (`all`, `pending`, etc.)                    |

---

##  Contexto: `useSale()`

Accede a:

- `getSales`: obtener las ventas por página y filtros
- `sales`: lista de ventas actuales
- `updateSaleStatus`: actualizar estado (`canceled`, `ready`, etc.)
- `page`, `setPage`, `totalPages`: control de paginación

---

##  Filtros disponibles

Los filtros se manejan con botones y modifican el estado `selectedStatus`. Las opciones disponibles son:

- Todos (`all`)
- Completados (`completed`)
- Reservados (`pending`)
- Pedidos (`ordered`)
- Cancelados (`canceled`)

---

##  Renderizado de ventas

Cada venta muestra:

- ID corto de la orden (`#ABC`)
- Estado visual (con íconos según `stage`)
- Lista de productos, cantidades y precios
- Total general

###  Etapas posibles (`stage`)

| Etapa        | Color        | Icono        |
|--------------|--------------|--------------|
| delivered    | Verde claro  | ✅ `listo.png`      |
| finished     | Lima         | 🟢 `terminado.png`  |
| processed    | Amarillo     | ⏳ `pendiente.png`  |
| closed       | Rojo claro   | ❌ `cancelar.png`   |

---

##  Acciones posibles (por estado)

Solo si `status` es `pending` o `ordered`:

| Acción         | Descripción                                                                 |
|----------------|-----------------------------------------------------------------------------|
| **Pagar**      | Abre modal con `OrderDetail` para continuar la venta                       |
| **Cancelar**   | Muestra confirmación con `Swal` y actualiza estado a `canceled`            |
| **Listo**      | Cambia el `stage` a `"ready"` (preparado para entregar)                    |

---

##  Fechas y filtros

- El componente filtra órdenes del **día actual** (`startDate = endDate = hoy`)
- Fecha se genera con `toLocaleDateString("sv-SE")` en zona horaria `America/Asuncion`

---

##  Paginación

Si hay más de una página:

- Botones de **Anterior** y **Siguiente**
- Indica página actual y total

---

##  Modal de Confirmación

Utiliza `ProductFormModal` con el componente `OrderDetail`:

```jsx
<OrderDetail onExit={() => setConfirmOrder(false)} saleData={order} paymentMode="complete" />
````

#  ProductContainer.jsx

## 📄 Descripción General

Componente visual y funcional para mostrar un producto individual dentro del POS. Permite:

- Visualizar la imagen, nombre y precio del producto
- Cambiar variantes (tamaños, presentaciones, etc.)
- Ajustar cantidades manualmente o manteniendo presionado (+/-)
- Agregar o quitar productos del carrito (`useCart()`)

---

##  Props

| Propiedad | Tipo   | Requerido | Descripción                          |
|-----------|--------|-----------|--------------------------------------|
| `product` | object | ✅ Sí      | Objeto del producto con variantes    |

---

##  Estados Internos y Refs

| Nombre                | Tipo    | Uso                                                                 |
|-----------------------|---------|----------------------------------------------------------------------|
| `selectedVariant`     | object  | Variante actualmente seleccionada                                   |
| `intervalRef`         | ref     | Para mantener la función activa durante un hold (+/- mantenido)     |
| `activeVariantIdRef`  | ref     | Identificador actual de la variante activa                          |
| `lastQuantityRef`     | ref     | Última cantidad agregada (para hold continuo)                       |

---

##  Contexto: `useCart()`

- `cart`: carrito actual
- `addToCart({product, variant, quantity})`: agrega o remueve productos

---

##  Interacción

###  Cambio de variante

Renderiza botones según `variants`, muestra abreviación, y cambia el estado `selectedVariant`.

### Cambiar cantidad

Se puede modificar de tres formas:

1. Campo de entrada (número)
2. Botón `+` o `-` (clic simple)
3. Botón `+` o `-` mantenido (hold con `setInterval()`)

---

##  Formato de precios

```js
price.toLocaleString("es-PY", {
  style: "currency",
  currency: "PYG"
})
````


#  OrderView.jsx

##  Descripción General

Componente de interfaz principal para gestionar y visualizar una nueva orden en el sistema POS. Permite al usuario:

- Seleccionar el modo de venta (en local, para llevar, delivery)
- Visualizar, vaciar y modificar el carrito
- Ver detalles del total (subtotal, IVA, total general)
- Iniciar el proceso de confirmación de venta

---

##  Estado Interno

| Estado         | Tipo     | Descripción                                                   |
|----------------|----------|---------------------------------------------------------------|
| `saleMode`     | string   | Modo de venta activo (`local`, `carry`, `delivery`)           |
| `confirmOrder` | boolean  | Controla la visibilidad del modal de confirmación de venta     |

---

##  Contexto Usado (`useCart`)

Accede a:
- `cart`: productos seleccionados
- `setCart`: para vaciar el carrito
- `removeFromCart`: para eliminar productos individuales
- `totalAmount`: total acumulado de la venta
- `paymentMethod`: define si se puede confirmar la venta

---

## Funcionalidad del componente

###  Carrito
- Muestra los productos agregados.
- Permite eliminar productos con un botón.
- Si el carrito está vacío, muestra imagen + mensaje amigable.

###  Detalle de totales
Calcula:
- Subtotal (`totalAmount / 1.1`)
- IVA 10% (`totalAmount / 11`)
- Total (`totalAmount`)

Todos los valores están formateados con `.toLocaleString("es-PY", { currency: "PYG" })`.

###  Modo de venta
- El usuario puede seleccionar entre tres modos:
  - `"local"` (En Local)
  - `"carry"` (Para Llevar)
  - `"delivery"` (Entrega a domicilio)

Se usa para modificar la lógica del backend al confirmar la venta.

###  Confirmación de venta
- Botón `Terminar Venta` abre un modal (`ProductFormModal`) con el componente `OrderDetail`.
- Se desactiva si no hay carrito, método de pago o modo de venta seleccionado.

---

##  Modal: `ProductFormModal`

Contiene el componente:

```jsx
<OrderDetail onExit={() => setConfirmOrder(false)} mode={saleMode} paymentMode="first" />
````

#  OrderConfirm.jsx

##  Descripción General

Componente para realizar el pago de una venta en el POS. Se adapta al caso dependiendo si ya se realizo una seña anteriormente.

## Funciones

- ✅ Visualización de los productos y totales de una orden
- 💳 Procesamiento de pagos (soporta métodos simples y múltiples)
- 👥 Gestión de datos del cliente (RUC, nombre, tipo)
- 🧾 Confirmación final de la venta y generación del comprobante

---

##  Props

| Propiedad | Tipo     | Requerido | Valor por Defecto | Descripción                                      |
|-----------|----------|-----------|--------------------|--------------------------------------------------|
| `onExit`  | function | No        | `() => {}`         | Función para cerrar el componente                |
| `saleData`| object   | No        | `null`             | Datos de una venta pendiente (si aplica)         |
| `mode`    | string   | No        | `"local"`          | Define el modo de operación (local/remoto/etc.)  |

---

## Validaciones

- `RUC` requerido para ventas normales (cuando el cliente no es “Final”)
- El monto total ingresado debe **cubrir al menos el total de la venta**
- Se previene que el usuario pague **más del total requerido**

---

##  Formatos

- **Moneda:** `formatCurrency(value)`
- **Fechas:** ISO 8601 → `YYYY-MM-DD`



