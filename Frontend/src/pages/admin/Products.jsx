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
  fetchDeletedProducts,
  deleteExistingProduct,
  restoreExistingProduct,
} from "../../redux/product/productSlice";

import "./Products.css";

const Products = () => {
  const dispatch = useDispatch();

  const {
    products = [],
    loading,
    error,
  } = useSelector((state) => state.products);

  const [search, setSearch] = useState("");
  const [showDeleted, setShowDeleted] = useState(false);

  // ==========================================
  // FETCH ACTIVE / DELETED PRODUCTS
  // ==========================================

  const loadProducts = () => {
    if (showDeleted) {
      dispatch(
        fetchDeletedProducts({
          page: 1,
          limit: 100,
        })
      );
    } else {
      dispatch(
        fetchProducts({
          page: 1,
          limit: 100,
        })
      );
    }
  };

  useEffect(() => {
    loadProducts();
  }, [dispatch, showDeleted]);

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

    if (deleteExistingProduct.fulfilled.match(result)) {
      toast.success(
        "Product deleted successfully"
      );

      loadProducts();
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
    const confirmed = window.confirm(
      "Are you sure you want to restore this product?"
    );

    if (!confirmed) return;

    const result = await dispatch(
      restoreExistingProduct(id)
    );

    if (
      restoreExistingProduct.fulfilled.match(result)
    ) {
      toast.success(
        "Product restored successfully"
      );

      loadProducts();
    } else {
      toast.error(
        result.payload ||
          "Failed to restore product"
      );
    }
  };

  // ==========================================
  // SEARCH
  // ==========================================

  const searchValue =
    search.trim().toLowerCase();

  const filteredProducts =
    products.filter((product) => {

      if (!searchValue) {
        return true;
      }

      return (
        product.name
          ?.toLowerCase()
          .includes(searchValue) ||

        product.category
          ?.toLowerCase()
          .includes(searchValue) ||

        product.slug
          ?.toLowerCase()
          .includes(searchValue)
      );
    });

  // ==========================================
  // HEADER TEXT
  // ==========================================

  const pageTitle = showDeleted
    ? "Deleted Products"
    : "Products";

  const pageDescription = showDeleted
    ? "View and restore products that have been deleted."
    : "Manage your Jeevan Sanjivani products.";

  return (
    <section className="admin-products-page">

      <Container>

        {/* ==================================
            HEADER
        ================================== */}

        <div className="admin-products-header">

          <div>

            <h1>
              {pageTitle}
            </h1>

            <p>
              {pageDescription}
            </p>

          </div>

          {!showDeleted && (
            <Link
              to="/admin/products/add"
              className="add-product-btn"
            >
              <Plus size={19} />
              Add Product
            </Link>
          )}

        </div>


        {/* ==================================
            CONTROLS
        ================================== */}

        <div className="products-admin-controls">

          {/* SEARCH */}

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


          {/* PRODUCT TABS */}

          <div className="product-filter-tabs">

            {/* ACTIVE */}

            <button
              type="button"
              className={
                !showDeleted
                  ? "product-filter-btn active"
                  : "product-filter-btn"
              }
              onClick={() =>
                setShowDeleted(false)
              }
            >
              <Eye size={17} />

              Active Products
            </button>


            {/* DELETED */}

            <button
              type="button"
              className={
                showDeleted
                  ? "product-filter-btn deleted-active"
                  : "product-filter-btn"
              }
              onClick={() =>
                setShowDeleted(true)
              }
            >
              <Trash2 size={17} />

              Deleted Products
            </button>

          </div>

        </div>


        {/* ==================================
            MODE INFORMATION
        ================================== */}

        <div className="product-mode-info">

          {showDeleted ? (
            <>
              <Trash2 size={18} />

              <div>

                <strong>
                  Deleted Products
                </strong>

                <p>
                  These products are no longer
                  available in the store.
                  You can restore them here.
                </p>

              </div>
            </>
          ) : (
            <>
              <Eye size={18} />

              <div>

                <strong>
                  Active Products
                </strong>

                <p>
                  These products are currently
                  available in your store.
                </p>

              </div>
            </>
          )}

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

                {filteredProducts.length === 0 ? (

                  <tr>

                    <td
                      colSpan="7"
                      className="no-products"
                    >

                      {showDeleted
                        ? "No deleted products found."
                        : "No active products found."}

                    </td>

                  </tr>

                ) : (

                  filteredProducts.map(
                    (product) => (

                      <tr
                        key={product._id}
                      >

                        {/* PRODUCT */}

                        <td>

                          <div className="admin-product-info">

                            <img
                              src={
                                product.images?.[0]?.url ||
                                "/placeholder-product.png"
                              }
                              alt={product.name}
                            />

                            <div>

                              <strong>
                                {product.name}
                              </strong>

                              <small>
                                {product.slug}
                              </small>

                            </div>

                          </div>

                        </td>


                        {/* CATEGORY */}

                        <td>
                          {product.category}
                        </td>


                        {/* MRP */}

                        <td>
                          ₹{product.Mrp}
                        </td>


                        {/* SELLING PRICE */}

                        <td className="selling-price">

                          ₹{product.SellingPrice}

                        </td>


                        {/* STOCK */}

                        <td>
                          {product.stock}
                        </td>


                        {/* STATUS */}

                        <td>

                          {product.isDeleted ? (

                            <span className="status deleted">
                              Deleted
                            </span>

                          ) : product.stock > 0 ? (

                            <span className="status active">
                              Active
                            </span>

                          ) : (

                            <span className="status out">
                              Out of Stock
                            </span>

                          )}

                        </td>


                        {/* ACTIONS */}

                        <td>

                          <div className="product-actions">

                            {/* ACTIVE PRODUCT */}

                            {!product.isDeleted && (
                              <>

                                {/* VIEW */}

                                <Link
                                  to={`/admin/products/${product.slug}`}
                                  className="view-action"
                                  title="View Product"
                                >
                                  <Eye size={17} />
                                </Link>


                                {/* EDIT */}

                                <Link
                                  to={`/admin/products/${product.slug}/edit`}
                                  className="edit-action"
                                  title="Edit Product"
                                >
                                  <Edit size={17} />
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


                            {/* DELETED PRODUCT */}

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

                                Restore

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