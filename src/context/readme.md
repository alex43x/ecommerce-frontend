# 🧩 Contextos y Providers de la Aplicación

Módulos de estado global usando React Context API, organizados por funcionalidades clave.

## 🧩 Módulos Disponibles

| Contexto       | Descripción                                 |
|----------------|---------------------------------------------|
| **`Auth`**     | Autenticación, permisos y sesión de usuario |
| **`Cart`**     | Gestión del carrito de compras para el POS  |
| **`Customer`** | CRUD de clientes y datos asociados          |
| **`Product`**  | CRUD de Productos+Categorías                |
| **`Report`**   | Generación de reportes y analytics          |
| **`Sale`**     | Proceso de ventas y transacciones           |
| **`User`**     | Administración de usuarios del sistema      |

## 🚀 Implementación

### Estructura estándar
Cada módulo contiene:
```javascript
[Nombre]Context.jsx   // → Crea el contexto
[Nombre]Provider.jsx  // → Lógica y proveedor
```

## ℹ️Ejemplo de Uso

### 1. Consumir un Contexto
```jsx
import { useCart } from './context/cart/CartContext';

function ProductCard({ product }) {
  // Extrae solo lo necesario del contexto
  const { addToCart, items } = useCartContext();
  const isInCart = items.some(item => item.id === product.id);

  return (
    <div>
      <h3>{product.name}</h3>
      <button 
        onClick={() => addToCart(product)}
        disabled={isInCart}
      >
        {isInCart ? '✔ En carrito' : 'Añadir al carrito'}
      </button>
    </div>
  );
}
```
## Nota⚠️
Se debe envolver la pagina que usa el contexto en ```App.jsx```
### Ejemplo:
```
<Route
    path="/dashboard"
    element={
        <CustomerProvider>
            <UserProvider>
                <SaleProvider>
                    <ProductProvider>
                      <ReportProvider>
                           <Dashboard />
                      </ReportProvider>
                    </ProductProvider>
                </SaleProvider>
            </UserProvider>
        </CustomerProvider>
    }
/>
```