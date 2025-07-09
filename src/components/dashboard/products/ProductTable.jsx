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
      <thead className="sticky top-0 bg-neutral-200 z-10">
        <tr className="border-b-2 border-neutral-300">
          <th className="text-green-800 font-medium text-md pl-2 py-2">
            Producto
          </th>
          <th className="text-green-800 font-medium text-md">Categorías</th>
          <th className="text-green-800 font-medium text-md">Variantes</th>
          <th className="text-green-800 font-medium text-md">Registro</th>
          <th className="text-green-800 font-medium text-md pl-2">URL</th>
          <th className="text-green-800 font-medium text-md pl-2">Imagen</th>
          <th className="text-green-800 font-medium text-md pl-2">Opciones</th>
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
