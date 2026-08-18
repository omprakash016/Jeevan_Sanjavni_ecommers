import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";

import {
  Edit,
  Trash2,
  RotateCcw,
  Plus,
  Search,
  Eye,
} from "lucide-react";

import { toast } from "react-toastify";

import Container from "../../component/ui/Container";

import {
  fetchProducts,
  deleteExistingProduct,
  restoreExistingProduct,
} from "../../redux/product/productSlice";

import "./Products.css";

const Products = () => {
  const dispatch = useDispatch();

  const {
    products,
    loading,
    error,
  } = useSelector((state) => state.products);

  const [search, setSearch] = useState("");
  const [showDeleted, setShowDeleted] = useState(false);

  // ==========================================
  // FETCH PRODUCTS
  // ==========================================

  useEffect(() => {
    dispatch(
      fetchProducts({
        page: 1,
        limit: 100,
        includeDeleted: true,
      })
    );
  }, [dispatch]);

  // ==========================================
  // DELETE PRODUCT
  // ==========================================

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this product?"
    );

    if (!confirmed) return;

    const result = await dispatch(
      deleteExistingProduct(id)
    );

    if (
      deleteExistingProduct.fulfilled.match(result)
    ) {
      toast.success(
        "Product deleted successfully"
      );

      dispatch(
        fetchProducts({
          page: 1,
          limit: 100,
          includeDeleted: true,
        })
      );
    } else {
      toast.error(
        result.payload ||
          "Failed to delete product"
      );
    }
  };

  // ==========================================
  // RESTORE PRODUCT
  // ==========================================

  const handleRestore = async (id) => {
    const result = await dispatch(
      restoreExistingProduct(id)
    );

    if (
      restoreExistingProduct.fulfilled.match(result)
    ) {
      toast.success(
        "Product restored successfully"
      );

      dispatch(
        fetchProducts({
          page: 1,
          limit: 100,
          includeDeleted: true,
        })
      );
    } else {
      toast.error(
        result.payload ||
          "Failed to restore product"
      );
    }
  };

  // ==========================================
  // SEARCH + DELETE FILTER
  // ==========================================

  const filteredProducts = products.filter(
    (product) => {
      const searchValue =
        search.toLowerCase();

      const matchesSearch =
        product.name
          ?.toLowerCase()
          .includes(searchValue) ||
        product.category
          ?.toLowerCase()
          .includes(searchValue);

      const matchesDeleted = showDeleted
        ? product.isDeleted
        : !product.isDeleted;

      return (
        matchesSearch &&
        matchesDeleted
      );
    }
  );

  return (
    <section className="admin-products-page">

      <Container>

        {/* ==================================
            HEADER
        ================================== */}

        <div className="admin-products-header">

          <div>
            <h1>Products</h1>

            <p>
              Manage your Jeevan
              Sanjivani products.
            </p>
          </div>

          <Link
            to="/admin/products/add"
            className="add-product-btn"
          >
            <Plus size={19} />
            Add Product
          </Link>

        </div>

        {/* ==================================
            CONTROLS
        ================================== */}

        <div className="products-admin-controls">

          <div className="admin-search">

            <Search size={19} />

            <input
              type="text"
              placeholder="Search product..."
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
            />

          </div>

          <button
            className={
              showDeleted
                ? "deleted-toggle active"
                : "deleted-toggle"
            }
            onClick={() =>
              setShowDeleted(
                (prev) => !prev
              )
            }
          >
            {showDeleted
              ? "Active Products"
              : "Deleted Products"}
          </button>

        </div>

        {/* ==================================
            ERROR
        ================================== */}

        {error && (
          <div className="admin-error">
            {error}
          </div>
        )}

        {/* ==================================
            LOADING
        ================================== */}

        {loading && (
          <div className="admin-loading">
            Loading products...
          </div>
        )}

        {/* ==================================
            TABLE
        ================================== */}

        {!loading && (
          <div className="products-table-wrapper">

            <table className="products-table">

              <thead>

                <tr>

                  <th>Product</th>

                  <th>Category</th>

                  <th>MRP</th>

                  <th>Selling Price</th>

                  <th>Stock</th>

                  <th>Status</th>

                  <th>Actions</th>

                </tr>

              </thead>

              <tbody>

                {filteredProducts.length ===
                0 ? (

                  <tr>

                    <td
                      colSpan="7"
                      className="no-products"
                    >
                      No products found.
                    </td>

                  </tr>

                ) : (

                  filteredProducts.map(
                    (product) => (

                      <tr
                        key={product._id}
                      >

                        {/* =====================
                            PRODUCT
                        ====================== */}

                        <td>

                          <div className="admin-product-info">

                            <img
                              src={
                                product
                                  .images?.[0]
                                  ?.url
                              }
                              alt={
                                product.name
                              }
                            />

                            <div>

                              <strong>
                                {
                                  product.name
                                }
                              </strong>

                              <small>
                                {
                                  product.slug
                                }
                              </small>

                            </div>

                          </div>

                        </td>

                        {/* =====================
                            CATEGORY
                        ====================== */}

                        <td>
                          {
                            product.category
                          }
                        </td>

                        {/* =====================
                            MRP
                        ====================== */}

                        <td>
                          ₹{product.Mrp}
                        </td>

                        {/* =====================
                            SELLING PRICE
                        ====================== */}

                        <td className="selling-price">
                          ₹
                          {
                            product.SellingPrice
                          }
                        </td>

                        {/* =====================
                            STOCK
                        ====================== */}

                        <td>
                          {product.stock}
                        </td>

                        {/* =====================
                            STATUS
                        ====================== */}

                        <td>

                          {product.isDeleted ? (

                            <span className="status deleted">
                              Deleted
                            </span>

                          ) : product.stock >
                            0 ? (

                            <span className="status active">
                              Active
                            </span>

                          ) : (

                            <span className="status out">
                              Out of Stock
                            </span>

                          )}

                        </td>

                        {/* =====================
                            ACTIONS
                        ====================== */}

                        <td>

                          <div className="product-actions">

                            {/* ==================
                                ACTIVE PRODUCT
                            =================== */}

                            {!product.isDeleted && (
                              <>

                                {/* VIEW */}

                                <Link
                                  to={`/admin/products/${product.slug}`}
                                  className="view-action"
                                  title="View Product"
                                >
                                  <Eye
                                    size={17}
                                  />
                                </Link>

                                {/* EDIT */}

                                <Link
                                  to={`/admin/products/${product.slug}/edit`}
                                  className="edit-action"
                                  title="Edit Product"
                                >
                                  <Edit
                                    size={17}
                                  />
                                </Link>

                                {/* DELETE */}

                                <button
                                  type="button"
                                  className="delete-action"
                                  title="Delete Product"
                                  onClick={() =>
                                    handleDelete(
                                      product._id
                                    )
                                  }
                                >
                                  <Trash2
                                    size={17}
                                  />
                                </button>

                              </>
                            )}

                            {/* ==================
                                DELETED PRODUCT
                            =================== */}

                            {product.isDeleted && (
                              <button
                                type="button"
                                className="restore-action"
                                title="Restore Product"
                                onClick={() =>
                                  handleRestore(
                                    product._id
                                  )
                                }
                              >
                                <RotateCcw
                                  size={17}
                                />
                              </button>
                            )}

                          </div>

                        </td>

                      </tr>

                    )
                  )

                )}

              </tbody>

            </table>

          </div>
        )}

      </Container>

    </section>
  );
};

export default Products;