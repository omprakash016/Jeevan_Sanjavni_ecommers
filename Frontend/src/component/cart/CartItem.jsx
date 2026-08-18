import "./CartItem.css";

import { useDispatch } from "react-redux";
import { toast } from "react-toastify";

import {
  updateProductQuantity,
  removeProduct,
} from "../../redux/cart/cartSlice";

import {
  Minus,
  Plus,
  Trash2,
} from "lucide-react";


const CartItem = ({ item }) => {

  const dispatch = useDispatch();


  // =====================================================
  // INCREASE QUANTITY
  // =====================================================

  const increaseQuantity = async () => {

    if (item.quantity >= item.stock) {

      toast.error("Maximum stock reached");

      return;
    }


    const result = await dispatch(
      updateProductQuantity({
        productId: item.productId,
        quantity: item.quantity + 1,
      })
    );


    if (
      updateProductQuantity.fulfilled.match(result)
    ) {

      toast.success("Quantity updated");

    } else {

      toast.error(
        result.payload ||
          "Failed to update quantity"
      );

    }

  };


  // =====================================================
  // DECREASE QUANTITY
  // =====================================================

  const decreaseQuantity = async () => {

    if (item.quantity <= 1) {
      return;
    }


    const result = await dispatch(
      updateProductQuantity({
        productId: item.productId,
        quantity: item.quantity - 1,
      })
    );


    if (
      updateProductQuantity.fulfilled.match(result)
    ) {

      toast.success("Quantity updated");

    } else {

      toast.error(
        result.payload ||
          "Failed to update quantity"
      );

    }

  };


  // =====================================================
  // REMOVE
  // =====================================================

  const handleRemove = async () => {

    const confirmed = window.confirm(
      "Are you sure you want to remove this product from your cart?"
    );


    if (!confirmed) {
      return;
    }


    const result = await dispatch(
      removeProduct(item.productId)
    );


    if (
      removeProduct.fulfilled.match(result)
    ) {

      toast.success(
        "Removed from cart"
      );

    } else {

      toast.error(
        result.payload ||
          "Failed to remove product"
      );

    }

  };


  return (

    <div className="cart-item">


      {/* =================================================
          PRODUCT IMAGE
      ================================================= */}

      <div className="cart-image">

        <img
          src={item.image}
          alt={item.name}
          loading="lazy"
        />

      </div>


      {/* =================================================
          PRODUCT DETAILS
      ================================================= */}

      <div className="cart-details">

        <h3>
          {item.name}
        </h3>


        <p className="cart-price">
          ₹
          {Number(
            item.SellingPrice || 0
          ).toLocaleString("en-IN")}
        </p>


        <div className="quantity-box">

          <button
            type="button"
            onClick={decreaseQuantity}
            disabled={item.quantity <= 1}
            aria-label="Decrease quantity"
          >

            <Minus size={17} />

          </button>


          <span>
            {item.quantity}
          </span>


          <button
            type="button"
            onClick={increaseQuantity}
            disabled={
              item.quantity >= item.stock
            }
            aria-label="Increase quantity"
          >

            <Plus size={17} />

          </button>

        </div>

      </div>


      {/* =================================================
          TOTAL + REMOVE
      ================================================= */}

      <div className="cart-right">

        <h3>
          ₹
          {Number(
            item.itemTotal || 0
          ).toLocaleString("en-IN")}
        </h3>


        <button
          type="button"
          className="remove-btn"
          onClick={handleRemove}
        >

          <Trash2 size={17} />

          Remove

        </button>

      </div>


    </div>

  );

};


export default CartItem;