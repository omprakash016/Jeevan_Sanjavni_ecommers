import "./CartSummary.css";

import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";

import { clearUserCart } from "../../redux/cart/cartSlice";

const CartSummary = () => {
  const { subtotal, totalQuantity } = useSelector(
    (state) => state.cart
  );
  const dispatch = useDispatch();

  const handleClearCart = async () => {

  const result = await dispatch(clearUserCart());

  if (clearUserCart.fulfilled.match(result)) {
    toast.success("Cart cleared");
  } else {
    toast.error(result.payload);
  }

};
  return (
    <div className="cart-summary">

      <h2>Order Summary</h2>

      <div className="summary-row">
        <span>Total Items</span>
        <span>{totalQuantity}</span>
      </div>

      <div className="summary-row">
        <span>Subtotal</span>
        <span>₹{subtotal}</span>
      </div>

      <div className="summary-row">
        <span>Shipping</span>
        <span className="free">FREE</span>
      </div>

      <hr />

      <div className="summary-total">
        <span>Total</span>
        <span>₹{subtotal}</span>
      </div>

      <Link
        to="/checkout"
        className="checkout-btn"
      >
        Proceed to Checkout
      </Link>
        <button
        className="clear-cart-btn"
        onClick={handleClearCart}
        >
            Clear Cart
        </button>
      <Link
        to="/products"
        className="continue-shopping"
      >
        Continue Shopping
      </Link>

    </div>
  );
};

export default CartSummary;