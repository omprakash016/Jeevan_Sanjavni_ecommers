import { Link } from "react-router-dom";
import { ShoppingCart } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { addProductToCart } from "../../redux/cart/cartSlice";
import "./ProductCard.css";


const ProductCard = ({ product }) => {
const dispatch = useDispatch();

const { isAuthenticated } = useSelector(
  (state) => state.auth
);
  const image =
    product.images?.[0]?.url ||
    "";

 const handleAddToCart = async () => {

  if (!isAuthenticated) {
    toast.info("Please login first");
    return;
  }

  try {

    const result = await dispatch(
      addProductToCart({
        productId: product._id,
        quantity: 1,
      })
    );

    if (addProductToCart.fulfilled.match(result)) {
      toast.success("Added to cart");
    } else {
      toast.error(result.payload);
    }

  } catch {
    toast.error("Unable to add product");
  }

};
  return (
    <article className="product-card">

      {/* Product Image */}

      <Link
        to={`/products/${product.slug}`}
        className="product-image-link"
      >
        <div className="product-image-wrapper">

          {product.featured && (
            <span className="product-badge">
              Featured
            </span>
          )}

          {product.bestSeller && (
            <span className="product-badge bestseller">
              Best Seller
            </span>
          )}

          <img
            src={image}
            alt={product.name}
            className="product-image"
          />

        </div>
      </Link>


      {/* Product Information */}

      <div className="product-content">

        <span className="product-category">
          {product.category}
        </span>

        <Link
          to={`/products/${product.slug}`}
          className="product-name"
        >
          {product.name}
        </Link>

        <p className="product-short-description">
          {product.shortDescription}
        </p>


        {/* Price */}

        <div className="product-price">

          <span className="selling-price">
            ₹{product.SellingPrice}
          </span>

          {product.Mrp > product.SellingPrice && (
            <span className="mrp">
              ₹{product.Mrp}
            </span>
          )}

        </div>


        {/* Stock */}

        <div className="product-bottom">

          {product.stock > 0 ? (
            <span className="stock available">
              In Stock
            </span>
          ) : (
            <span className="stock unavailable">
              Out of Stock
            </span>
          )}

          <button
              className="product-cart-btn"
              disabled={product.stock <= 0}
              onClick={handleAddToCart}
          >
            <ShoppingCart size={17} />

            {product.stock > 0
              ? "Add to Cart"
              : "Unavailable"}
          </button>

        </div>

      </div>

    </article>
  );
};


export default ProductCard;