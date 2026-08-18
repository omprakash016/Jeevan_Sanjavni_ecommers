import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  Search,
  SlidersHorizontal,
  ShoppingBag,
  PackageOpen,
  X,
} from "lucide-react";

import Container from "../component/ui/Container";
import { getProducts } from "../services/productService";

import "./Products.css";

const Products = () => {
  const [products, setProducts] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  // ==========================================
  // FETCH PRODUCTS
  // ==========================================

  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await getProducts({
          page: 1,
          limit: 100,
        });

        console.log("PRODUCTS API RESPONSE:", response);

        /*
          This handles common backend response structures:

          {
            data: {
              products: []
            }
          }

          OR

          {
            data: []
          }

          OR

          {
            products: []
          }
        */

        const productData =
          response?.data?.products ||
          response?.data?.data ||
          response?.products ||
          response?.data ||
          [];

        setProducts(
          Array.isArray(productData)
            ? productData
            : []
        );

      } catch (err) {
        console.error(
          "Failed to fetch products:",
          err
        );

        setError(
          err.response?.data?.message ||
            "Unable to load products. Please try again."
        );

      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  // ==========================================
  // CATEGORIES
  // ==========================================

  const categories = useMemo(() => {
    const uniqueCategories = [
      ...new Set(
        products
          .map((product) => product.category)
          .filter(Boolean)
      ),
    ];

    return ["All", ...uniqueCategories];
  }, [products]);

  // ==========================================
  // FILTER PRODUCTS
  // ==========================================

  const filteredProducts = useMemo(() => {
    const searchValue = search
      .trim()
      .toLowerCase();

    return products.filter((product) => {
      const matchesSearch =
        !searchValue ||
        product.name
          ?.toLowerCase()
          .includes(searchValue) ||
        product.category
          ?.toLowerCase()
          .includes(searchValue) ||
        product.shortDescription
          ?.toLowerCase()
          .includes(searchValue);

      const matchesCategory =
        selectedCategory === "All" ||
        product.category === selectedCategory;

      return (
        matchesSearch &&
        matchesCategory &&
        !product.isDeleted
      );
    });
  }, [
    products,
    search,
    selectedCategory,
  ]);

  // ==========================================
  // DISCOUNT
  // ==========================================

  const getDiscount = (mrp, sellingPrice) => {
    if (
      !mrp ||
      !sellingPrice ||
      mrp <= sellingPrice
    ) {
      return 0;
    }

    return Math.round(
      ((mrp - sellingPrice) / mrp) * 100
    );
  };

  // ==========================================
  // CLEAR SEARCH
  // ==========================================

  const clearSearch = () => {
    setSearch("");
  };

  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {
    return (
      <section className="products-page">
        <Container>

          <div className="products-loading">

            <div className="products-spinner"></div>

            <h3>
              Loading products...
            </h3>

            <p>
              Please wait while we load our
              products.
            </p>

          </div>

        </Container>
      </section>
    );
  }

  // ==========================================
  // ERROR
  // ==========================================

  if (error) {
    return (
      <section className="products-page">
        <Container>

          <div className="products-error">

            <PackageOpen size={50} />

            <h2>
              Unable to load products
            </h2>

            <p>
              {error}
            </p>

            <button
              type="button"
              onClick={() =>
                window.location.reload()
              }
            >
              Try Again
            </button>

          </div>

        </Container>
      </section>
    );
  }

  // ==========================================
  // MAIN
  // ==========================================

  return (
    <section className="products-page">

      <Container>

        {/* ====================================
            PAGE HEADER
        ==================================== */}

        <div className="products-page-header">

          <div className="products-heading">

            <span className="products-eyebrow">
              JEEVAN SANJIVANI
            </span>

            <h2>
              Our Products
            </h2>

            <p>
              Discover natural wellness products
              carefully selected for your everyday
              health and wellbeing.
            </p>

          </div>

          <div className="products-count">

            <ShoppingBag size={19} />

            <span>
              {filteredProducts.length} Products
            </span>

          </div>

        </div>


        {/* ====================================
            FILTER AREA
        ==================================== */}

        <div className="products-toolbar">

          {/* Search */}

          <div className="product-search">

            <Search size={20} />

            <input
              type="text"
              placeholder="Search products..."
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
            />

            {search && (
              <button
                type="button"
                className="clear-search"
                onClick={clearSearch}
                aria-label="Clear search"
              >
                <X size={17} />
              </button>
            )}

          </div>


          {/* Category */}

          <div className="category-filter">

            <SlidersHorizontal size={19} />

            <select
              value={selectedCategory}
              onChange={(e) =>
                setSelectedCategory(
                  e.target.value
                )
              }
            >

              {categories.map((category) => (
                <option
                  key={category}
                  value={category}
                >
                  {category}
                </option>
              ))}

            </select>

          </div>

        </div>


        {/* ====================================
            ACTIVE FILTER INFO
        ==================================== */}

        {(search || selectedCategory !== "All") && (
          <div className="active-filters">

            <span>
              Showing{" "}
              <strong>
                {filteredProducts.length}
              </strong>{" "}
              result
              {filteredProducts.length !== 1
                ? "s"
                : ""}
            </span>

            {selectedCategory !== "All" && (
              <button
                type="button"
                onClick={() =>
                  setSelectedCategory("All")
                }
              >
                Category: {selectedCategory}
                <X size={14} />
              </button>
            )}

          </div>
        )}


        {/* ====================================
            NO PRODUCTS
        ==================================== */}

        {filteredProducts.length === 0 ? (

          <div className="no-products-found">

            <div className="no-products-icon">
              <PackageOpen size={42} />
            </div>

            <h2>
              No products found
            </h2>

            <p>
              We couldn't find any products
              matching your search.
            </p>

            {(search ||
              selectedCategory !== "All") && (
              <button
                type="button"
                onClick={() => {
                  setSearch("");
                  setSelectedCategory("All");
                }}
              >
                Clear Filters
              </button>
            )}

          </div>

        ) : (

          /* ==================================
             PRODUCT GRID
          ================================== */

          <div className="products-grid">

            {filteredProducts.map((product) => {

              const discount = getDiscount(
                product.Mrp,
                product.SellingPrice
              );

              const image =
                product.images?.[0]?.url ||
                "/placeholder-product.png";

              const outOfStock =
                Number(product.stock) <= 0;

              return (

                <article
                  className="product-card"
                  key={product._id}
                >

                  {/* Image */}

                  <div className="product-card-image">

                    <img
                      src={image}
                      alt={product.name}
                      loading="lazy"
                    />


                    {/* Badges */}

                    <div className="product-badges">

                      {product.featured && (
                        <span className="featured-badge">
                          Featured
                        </span>
                      )}

                      {product.bestSeller && (
                        <span className="bestseller-badge">
                          Best Seller
                        </span>
                      )}

                    </div>


                    {/* Discount */}

                    {discount > 0 && (
                      <span className="discount-badge">
                        {discount}% OFF
                      </span>
                    )}

                  </div>


                  {/* Content */}

                  <div className="product-card-content">

                    <span className="product-category">
                      {product.category}
                    </span>

                    <h2>
                      {product.name}
                    </h2>

                    <p className="product-short-description">
                      {product.shortDescription}
                    </p>


                    {/* Price */}

                    <div className="product-price">

                      <span className="selling-price">
                        ₹
                        {Number(
                          product.SellingPrice || 0
                        ).toLocaleString("en-IN")}
                      </span>

                      {Number(product.Mrp) >
                        Number(
                          product.SellingPrice
                        ) && (
                        <span className="mrp-price">
                          ₹
                          {Number(
                            product.Mrp || 0
                          ).toLocaleString(
                            "en-IN"
                          )}
                        </span>
                      )}

                    </div>


                    {/* Stock */}

                    <div className="product-stock">

                      {outOfStock ? (
                        <span className="out-of-stock">
                          Out of Stock
                        </span>
                      ) : (
                        <span className="in-stock">
                          In Stock
                        </span>
                      )}

                    </div>


                    {/* Action */}

                    <Link
                      to={`/products/${product.slug}`}
                      className="view-product-btn"
                    >
                      View Details
                    </Link>

                  </div>

                </article>

              );
            })}

          </div>

        )}

      </Container>

    </section>
  );
};

export default Products;