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
        <tr className="border-b-2 border-neutral-300">
          <th>Producto</th>
          <th>Categorías</th>
          <th>Variantes</th>
          <th>URL</th>
          <th>Fecha de Registro</th>
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
