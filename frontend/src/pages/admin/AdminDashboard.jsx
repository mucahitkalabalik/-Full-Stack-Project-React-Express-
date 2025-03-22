import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getProducts } from "../../redux/productSlice";
import { MdEditNote, MdDeleteOutline } from "react-icons/md";

const AdminDashboard = () => {
  const dispatch = useDispatch();
  const { products, totalPages, loading } = useSelector((state) => state.products);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    console.log(currentPage,'current');
    
    dispatch(getProducts());
  }, [dispatch, currentPage]);

  const handlePageChange = (newPage) => {
    console.log(newPage,'test',totalPages);
    
    if (newPage > 0 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  return (
    <div >
      <h2 className="text-center text-2xl font-semibold mb-5">ÜRÜNLER</h2>

      {loading ? (
        <p className="text-center">Loading...</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-2 border-gray-300 dark:border-zinc-900 shadow-md rounded-lg">
            <thead className="bg-gray-100 dark:bg-zinc-800 text-gray-700 dark:text-gray-200">
              <tr className="border-b border-gray-300 dark:border-zinc-900">
                <th className="text-left p-3">Name</th>
                <th className="text-left p-3">Price</th>
                <th className="text-left p-3">Stock</th>
                <th className="text-left p-3">Category</th>
                <th className="text-left p-3">Edit</th>
                <th className="text-left p-3">Delete</th>
              </tr>
            </thead>
            <tbody className="divide-y-2 divide-gray-300 dark:divide-zinc-900">
              {products?.products?.length > 0 ? (
                products.products.map((product) => (
                  <tr key={product._id} className="hover:bg-gray-50 dark:hover:bg-zinc-900 transition">
                    <td className="p-3">{product.name}</td>
                    <td className="p-3">{product.price} TL</td>
                    <td className="p-3">{product.countInStock}</td>
                    <td className="p-3">{product.category}</td>
                    <td className="p-3">
                      <button className="btn-admin">
                        <MdEditNote size={20} />
                      </button>
                    </td>
                    <td className="p-3">
                      <button className="btn-admin">
                        <MdDeleteOutline size={20} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="text-center p-3 text-gray-500">
                    No products available
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          {/* Pagination */}
          <div className="flex justify-center mt-4">
            <button 
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-4 py-2 mx-2 bg-gray-200 dark:bg-zinc-800 rounded disabled:opacity-50"
            >
              Previous
            </button>
            <span className="px-4 py-2 bg-gray-100 dark:bg-zinc-700 rounded">
              Page {currentPage} of {totalPages}
            </span>
            <button 
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-4 py-2 mx-2 bg-gray-200 dark:bg-zinc-800 rounded disabled:opacity-50 cursor-pointer"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
