import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Minus,
  Plus,
  ShoppingCart,
  CheckCircle,
  AlertCircle,
  Leaf,
  FlaskConical,
  ClipboardList,
  ShieldAlert,
} from "lucide-react";
import { toast } from "react-toastify";

import Container from "../component/ui/Container";

import {
  getProductBySlug,
} from "../services/productService";

import api from "../services/api";

import "./ProductDetails.css";


const ProductDetails = () => {

  const { slug } = useParams();

  const navigate = useNavigate();


  // =====================================================
  // STATE
  // =====================================================

  const [product, setProduct] = useState(null);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  const [selectedImage, setSelectedImage] = useState(0);

  const [quantity, setQuantity] = useState(1);

  const [addingToCart, setAddingToCart] = useState(false);


  // =====================================================
  // FETCH PRODUCT
  // =====================================================

  useEffect(() => {

    const loadProduct = async () => {

      try {

        setLoading(true);

        setError("");

        const response =
          await getProductBySlug(slug);

        console.log(
          "PRODUCT DETAILS API RESPONSE:",
          response
        );


        /*
          Handles common backend response structures:

          {
            data: {
              product: {...}
            }
          }

          OR

          {
            product: {...}
          }
        */

        const productData =
          response?.data?.product ||
          response?.product ||
          response?.data;


        if (!productData) {

          setError(
            "Product not found."
          );

          return;
        }


        if (productData.isDeleted) {

          setError(
            "This product is no longer available."
          );

          return;
        }


        setProduct(productData);

      } catch (err) {

        console.error(
          "Failed to load product:",
          err
        );

        setError(
          err.response?.data?.message ||
            "Unable to load product."
        );

      } finally {

        setLoading(false);

      }

    };


    if (slug) {
      loadProduct();
    }

  }, [slug]);


  // =====================================================
  // QUANTITY
  // =====================================================

  const increaseQuantity = () => {

    if (!product) return;

    if (quantity >= product.stock) {

      toast.info(
        `Only ${product.stock} item(s) available in stock`
      );

      return;
    }

    setQuantity((prev) => prev + 1);

  };


  const decreaseQuantity = () => {

    setQuantity((prev) =>
      prev > 1 ? prev - 1 : 1
    );

  };


  // =====================================================
  // DISCOUNT
  // =====================================================

  const getDiscount = () => {

    if (
      !product?.Mrp ||
      !product?.SellingPrice ||
      product.Mrp <= product.SellingPrice
    ) {
      return 0;
    }

    return Math.round(
      ((product.Mrp - product.SellingPrice) /
        product.Mrp) *
        100
    );

  };


  // =====================================================
  // ADD TO CART
  // =====================================================

  const handleAddToCart = async () => {

    if (!product) return;


    if (!product.stock || product.stock <= 0) {

      toast.error(
        "This product is currently out of stock."
      );

      return;
    }


    try {

      setAddingToCart(true);


      const response = await api.post(
        "/cart",
        {
          productId: product._id,
          quantity,
        }
      );


      if (response.data?.success) {

        toast.success(
          `${product.name} added to cart`
        );

        // Go to cart after successful addition
        navigate("/cart");

      } else {

        toast.error(
          response.data?.message ||
            "Unable to add product to cart"
        );

      }

    } catch (err) {

      console.error(
        "Add to cart error:",
        err
      );


      // Authentication required
      if (
        err.response?.status === 401 ||
        err.response?.status === 403
      ) {

        toast.info(
          "Please login to add products to cart."
        );

        navigate("/login");

        return;
      }


      toast.error(
        err.response?.data?.message ||
          "Failed to add product to cart"
      );

    } finally {

      setAddingToCart(false);

    }

  };


  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {

    return (

      <section className="product-details-page">

        <Container>

          <div className="product-details-loading">

            <div className="product-details-spinner"></div>

            <h3>
              Loading product...
            </h3>

            <p>
              Please wait while we load the
              product details.
            </p>

          </div>

        </Container>

      </section>

    );

  }


  // =====================================================
  // ERROR
  // =====================================================

  if (error || !product) {

    return (

      <section className="product-details-page">

        <Container>

          <div className="product-details-error">

            <AlertCircle size={50} />

            <h2>
              Product Not Found
            </h2>

            <p>
              {error ||
                "The product you are looking for is not available."}
            </p>

            <Link
              to="/products"
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


  // =====================================================
  // DATA
  // =====================================================

  const images =
    product.images?.length > 0
      ? product.images
      : [];


  const discount = getDiscount();

  const outOfStock =
    Number(product.stock) <= 0;


  return (

    <section className="product-details-page">

      <Container>


        {/* =================================================
            BACK BUTTON
        ================================================= */}

        <Link
          to="/products"
          className="product-back-link"
        >

          <ArrowLeft size={18} />

          Back to Products

        </Link>


        {/* =================================================
            PRODUCT MAIN SECTION
        ================================================= */}

        <div className="product-details-container">


          {/* =================================================
              IMAGE SECTION
          ================================================= */}

          <div className="product-gallery">


            {/* Main Image */}

            <div className="product-main-image">

              <img
                src={
                  images[selectedImage]?.url ||
                  "/placeholder-product.png"
                }
                alt={product.name}
              />


              {/* Badges */}

              <div className="details-badges">

                {product.featured && (

                  <span className="details-featured">
                    Featured
                  </span>

                )}

                {product.bestSeller && (

                  <span className="details-bestseller">
                    Best Seller
                  </span>

                )}

              </div>


              {discount > 0 && (

                <span className="details-discount">
                  {discount}% OFF
                </span>

              )}

            </div>


            {/* Thumbnail Images */}

            {images.length > 1 && (

              <div className="product-thumbnails">

                {images.map(
                  (image, index) => (

                    <button
                      key={
                        image.fileId ||
                        index
                      }
                      type="button"
                      className={
                        selectedImage === index
                          ? "product-thumbnail active"
                          : "product-thumbnail"
                      }
                      onClick={() =>
                        setSelectedImage(
                          index
                        )
                      }
                    >

                      <img
                        src={image.url}
                        alt={`${product.name} ${index + 1}`}
                      />

                    </button>

                  )
                )}

              </div>

            )}

          </div>


          {/* =================================================
              PRODUCT INFORMATION
          ================================================= */}

          <div className="product-details-info">


            {/* Category */}

            <span className="details-category">
              {product.category}
            </span>


            {/* Product Name */}

            <h1>
              {product.name}
            </h1>


            {/* Short Description */}

            <p className="details-short-description">
              {product.shortDescription}
            </p>


            {/* Rating / Trust */}

            <div className="product-trust">

              <span>
                <CheckCircle size={16} />
                Quality Product
              </span>

              <span>
                <Leaf size={16} />
                Wellness Care
              </span>

            </div>


            {/* Price */}

            <div className="details-price">

              <span className="details-selling-price">

                ₹
                {Number(
                  product.SellingPrice || 0
                ).toLocaleString("en-IN")}

              </span>


              {Number(product.Mrp) >
                Number(product.SellingPrice) && (

                <>

                  <span className="details-mrp">

                    ₹
                    {Number(
                      product.Mrp || 0
                    ).toLocaleString("en-IN")}

                  </span>


                  <span className="details-save">

                    Save ₹
                    {Number(
                      product.Mrp -
                        product.SellingPrice
                    ).toLocaleString("en-IN")}

                  </span>

                </>

              )}

            </div>


            {/* Stock */}

            <div className="details-stock">

              {outOfStock ? (

                <span className="stock-out">
                  <AlertCircle size={17} />
                  Out of Stock
                </span>

              ) : (

                <span className="stock-in">
                  <CheckCircle size={17} />
                  In Stock
                </span>

              )}

              {!outOfStock &&
                product.stock <= 10 && (

                <small>
                  Only {product.stock} left
                </small>

              )}

            </div>


            {/* =================================================
                QUANTITY + CART
            ================================================= */}

            <div className="purchase-section">

              <div className="quantity-wrapper">

                <span>
                  Quantity
                </span>

                <div className="quantity-control">

                  <button
                    type="button"
                    onClick={
                      decreaseQuantity
                    }
                    disabled={
                      quantity <= 1 ||
                      outOfStock
                    }
                    aria-label="Decrease quantity"
                  >
                    <Minus size={17} />
                  </button>


                  <strong>
                    {quantity}
                  </strong>


                  <button
                    type="button"
                    onClick={
                      increaseQuantity
                    }
                    disabled={
                      outOfStock ||
                      quantity >=
                        product.stock
                    }
                    aria-label="Increase quantity"
                  >
                    <Plus size={17} />
                  </button>

                </div>

              </div>


              <button
                type="button"
                className="add-to-cart-btn"
                onClick={
                  handleAddToCart
                }
                disabled={
                  outOfStock ||
                  addingToCart
                }
              >

                <ShoppingCart
                  size={20}
                />

                {addingToCart
                  ? "Adding..."
                  : outOfStock
                  ? "Out of Stock"
                  : "Add to Cart"}

              </button>

            </div>


            {/* Security / delivery info */}

            <div className="product-service-info">

              <div>
                <CheckCircle size={17} />

                <span>
                  Genuine Product
                </span>
              </div>

              <div>
                <ShoppingCart size={17} />

                <span>
                  Easy Ordering
                </span>
              </div>

              <div>
                <ShieldAlert size={17} />

                <span>
                  Secure Checkout
                </span>
              </div>

            </div>

          </div>

        </div>


        {/* =================================================
            PRODUCT DESCRIPTION
        ================================================= */}

        <div className="product-information-section">


          {/* Description */}

          <div className="product-description-box">

            <div className="information-heading">

              <div className="information-icon">
                <ClipboardList
                  size={21}
                />
              </div>

              <div>

                <h2>
                  Product Description
                </h2>

                <span>
                  Everything you need to know
                </span>

              </div>

            </div>


            <p>
              {product.description}
            </p>

          </div>


          {/* Benefits */}

          {product.benefits?.length > 0 && (

            <div className="product-detail-box">

              <div className="detail-box-heading">

                <Leaf size={20} />

                <h2>
                  Benefits
                </h2>

              </div>


              <ul>

                {product.benefits.map(
                  (benefit, index) => (

                    <li key={index}>

                      <CheckCircle
                        size={16}
                      />

                      <span>
                        {benefit}
                      </span>

                    </li>

                  )
                )}

              </ul>

            </div>

          )}


          {/* Ingredients */}

          {product.ingredients?.length > 0 && (

            <div className="product-detail-box">

              <div className="detail-box-heading">

                <FlaskConical
                  size={20}
                />

                <h2>
                  Ingredients
                </h2>

              </div>


              <div className="ingredients-list">

                {product.ingredients.map(
                  (ingredient, index) => (

                    <span
                      key={index}
                    >
                      {ingredient}
                    </span>

                  )
                )}

              </div>

            </div>

          )}


          {/* Directions */}

          {product.directions && (

            <div className="product-detail-box">

              <div className="detail-box-heading">

                <ClipboardList
                  size={20}
                />

                <h2>
                  Directions
                </h2>

              </div>

              <p>
                {product.directions}
              </p>

            </div>

          )}


          {/* Warnings */}

          {product.warnings && (

            <div className="product-warning-box">

              <div className="detail-box-heading">

                <ShieldAlert
                  size={20}
                />

                <h2>
                  Warnings
                </h2>

              </div>

              <p>
                {product.warnings}
              </p>

            </div>

          )}

        </div>

      </Container>

    </section>

  );

};


export default ProductDetails;