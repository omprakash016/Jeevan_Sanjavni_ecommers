import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Edit,
  Package,
  Tag,
  ShoppingBag,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { toast } from "react-toastify";

import Container from "../../component/ui/Container";

import { getProductBySlug } from "../../services/productService";

import "./AdminProductDetails.css";

const AdminProductDetails = () => {
  const { slug } = useParams();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  const [selectedImage, setSelectedImage] =
    useState(0);

  // ==========================================
  // LOAD PRODUCT
  // ==========================================

  useEffect(() => {
    loadProduct();
  }, [slug]);

  const loadProduct = async () => {
    try {
      setLoading(true);

      const response =
        await getProductBySlug(slug);

      const productData =
        response?.data?.product ||
        response?.product ||
        response?.data;

      if (!productData) {
        toast.error("Product not found");
        return;
      }

      setProduct(productData);
      setSelectedImage(0);

    } catch (error) {
      console.error(
        "Product details error:",
        error
      );

      toast.error(
        error.response?.data?.message ||
          "Failed to load product"
      );

    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {
    return (
      <section className="admin-product-details-page">
        <Container>
          <div className="product-details-loading">
            Loading product details...
          </div>
        </Container>
      </section>
    );
  }

  // ==========================================
  // NOT FOUND
  // ==========================================

  if (!product) {
    return (
      <section className="admin-product-details-page">
        <Container>

          <div className="product-not-found">

            <h2>
              Product not found
            </h2>

            <Link
              to="/admin/products"
              className="back-products-btn"
            >
              <ArrowLeft size={18} />
              Back to Products
            </Link>

          </div>

        </Container>
      </section>
    );
  }

  const images = product.images || [];

  const currentImage =
    images[selectedImage]?.url ||
    images[0]?.url ||
    "";

  // ==========================================
  // DISCOUNT
  // ==========================================

  const discount =
    product.Mrp > 0 &&
    product.Mrp > product.SellingPrice
      ? Math.round(
          ((product.Mrp -
            product.SellingPrice) /
            product.Mrp) *
            100
        )
      : 0;

  return (
    <section className="admin-product-details-page">

      <Container>

        {/* ==================================
            HEADER
        ================================== */}

        <div className="product-details-header">

          <div>

            <Link
              to="/admin/products"
              className="back-products-link"
            >
              <ArrowLeft size={18} />
              Back to Products
            </Link>

            <h1>
              Product Details
            </h1>

            <p>
              View complete product
              information.
            </p>

          </div>

          <Link
            to={`/admin/products/${product.slug}/edit`}
            className="edit-product-btn"
          >
            <Edit size={18} />
            Edit Product
          </Link>

        </div>

        {/* ==================================
            PRODUCT MAIN CARD
        ================================== */}

        <div className="product-details-card">

          {/* =================================
              IMAGE SECTION
          ================================= */}

          <div className="product-gallery">

            <div className="main-product-image">

              {currentImage ? (

                <img
                  src={currentImage}
                  alt={product.name}
                />

              ) : (

                <div className="no-product-image">
                  No Image Available
                </div>

              )}

            </div>

            {/* Thumbnails */}

            {images.length > 1 && (

              <div className="product-thumbnails">

                {images.map(
                  (image, index) => (

                    <button
                      key={image.fileId || index}
                      type="button"
                      className={
                        selectedImage === index
                          ? "thumbnail active"
                          : "thumbnail"
                      }
                      onClick={() =>
                        setSelectedImage(
                          index
                        )
                      }
                    >
                      <img
                        src={image.url}
                        alt={`${product.name} ${
                          index + 1
                        }`}
                      />
                    </button>

                  )
                )}

              </div>

            )}

          </div>

          {/* =================================
              PRODUCT INFORMATION
          ================================= */}

          <div className="product-details-info">

            {/* Badges */}

            <div className="product-badges">

              {product.featured && (
                <span className="product-badge featured">
                  Featured
                </span>
              )}

              {product.bestSeller && (
                <span className="product-badge bestseller">
                  Best Seller
                </span>
              )}

              {product.stock > 0 ? (
                <span className="product-badge stock-active">
                  In Stock
                </span>
              ) : (
                <span className="product-badge stock-out">
                  Out of Stock
                </span>
              )}

            </div>

            {/* Name */}

            <h2>
              {product.name}
            </h2>

            {/* Category */}

            <div className="product-category">

              <Tag size={17} />

              <span>
                {product.category}
              </span>

            </div>

            {/* Short Description */}

            <p className="product-short-description">
              {product.shortDescription}
            </p>

            {/* Pricing */}

            <div className="product-price-box">

              <div className="selling-price-large">
                ₹{product.SellingPrice}
              </div>

              {product.Mrp >
                product.SellingPrice && (
                <div className="mrp-price">
                  ₹{product.Mrp}
                </div>
              )}

              {discount > 0 && (
                <div className="discount-badge">
                  {discount}% OFF
                </div>
              )}

            </div>

            {/* Stock */}

            <div className="stock-info">

              <Package size={20} />

              <span>
                <strong>
                  {product.stock}
                </strong>{" "}
                units available
              </span>

            </div>

          </div>

        </div>

        {/* ==================================
            DESCRIPTION
        ================================== */}

        <div className="details-section">

          <h2>
            Product Description
          </h2>

          <p className="description-text">
            {product.description ||
              "No description available."}
          </p>

        </div>

        {/* ==================================
            BENEFITS + INGREDIENTS
        ================================== */}

        <div className="details-two-column">

          {/* Benefits */}

          <div className="details-section">

            <h2>
              Benefits
            </h2>

            {product.benefits?.length > 0 ? (

              <ul className="details-list">

                {product.benefits.map(
                  (benefit, index) => (

                    <li key={index}>

                      <CheckCircle
                        size={19}
                      />

                      <span>
                        {benefit}
                      </span>

                    </li>

                  )
                )}

              </ul>

            ) : (

              <p className="empty-detail">
                No benefits added.
              </p>

            )}

          </div>

          {/* Ingredients */}

          <div className="details-section">

            <h2>
              Ingredients
            </h2>

            {product.ingredients?.length >
            0 ? (

              <ul className="details-list">

                {product.ingredients.map(
                  (
                    ingredient,
                    index
                  ) => (

                    <li key={index}>

                      <CheckCircle
                        size={19}
                      />

                      <span>
                        {ingredient}
                      </span>

                    </li>

                  )
                )}

              </ul>

            ) : (

              <p className="empty-detail">
                No ingredients added.
              </p>

            )}

          </div>

        </div>

        {/* ==================================
            DIRECTIONS + WARNINGS
        ================================== */}

        <div className="details-two-column">

          {/* Directions */}

          <div className="details-section">

            <h2>
              Directions
            </h2>

            <p className="description-text">
              {product.directions ||
                "No directions provided."}
            </p>

          </div>

          {/* Warnings */}

          <div className="details-section warning-section">

            <h2>
              Warnings
            </h2>

            <p className="description-text">
              {product.warnings ||
                "No warnings provided."}
            </p>

          </div>

        </div>

        {/* ==================================
            PRODUCT STATUS
        ================================== */}

        <div className="details-section product-status-section">

          <h2>
            Product Status
          </h2>

          <div className="status-grid">

            <div className="status-item">

              <ShoppingBag size={20} />

              <div>
                <span>
                  Product Status
                </span>

                <strong>
                  {product.isDeleted
                    ? "Deleted"
                    : "Active"}
                </strong>
              </div>

            </div>

            <div className="status-item">

              {product.featured ? (
                <CheckCircle
                  size={20}
                />
              ) : (
                <XCircle
                  size={20}
                />
              )}

              <div>
                <span>
                  Featured
                </span>

                <strong>
                  {product.featured
                    ? "Yes"
                    : "No"}
                </strong>
              </div>

            </div>

            <div className="status-item">

              {product.bestSeller ? (
                <CheckCircle
                  size={20}
                />
              ) : (
                <XCircle
                  size={20}
                />
              )}

              <div>
                <span>
                  Best Seller
                </span>

                <strong>
                  {product.bestSeller
                    ? "Yes"
                    : "No"}
                </strong>
              </div>

            </div>

            <div className="status-item">

              <Package size={20} />

              <div>
                <span>
                  Stock
                </span>

                <strong>
                  {product.stock}
                </strong>
              </div>

            </div>

          </div>

        </div>

      </Container>

    </section>
  );
};

export default AdminProductDetails;