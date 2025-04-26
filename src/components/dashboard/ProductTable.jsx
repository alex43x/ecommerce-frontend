import ProductRow from "./ProductRow";

export default function ProductTable({
  products,
  loading,
  categories,
  editProductId,
  setEditProductId,
  editForm,
  setEditForm,
  updateProduct,
  deleteProduct,
  refreshProducts,
}) {
  return (
    <table>
      <thead>
        <tr>
          <th>Producto</th>
          <th>Precio</th>
          <th>Fecha</th>
          <th>Categoría</th>
          <th>Variantes</th>
          <th>URL</th>
          <th>Opciones</th>
        </tr>
      </thead>
      <tbody>
        {loading ? (
          <tr>
            <td>Cargando...</td>
          </tr>
        ) : (
          products.map((product) => (
            <ProductRow
              key={product._id}
              product={product}
              categories={categories}
              editProductId={editProductId}
              setEditProductId={setEditProductId}
              editForm={editForm}
              setEditForm={setEditForm}
              updateProduct={updateProduct}
              deleteProduct={deleteProduct}
              refreshProducts={refreshProducts}
            />
          ))
        )}
      </tbody>
    </table>
  );
}
