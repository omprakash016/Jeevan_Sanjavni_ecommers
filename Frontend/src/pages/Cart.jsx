import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import Container from "../component/ui/Container";

import CartItem from "../component/cart/CartItem";
import CartSummary from "../component/cart/CartSummary";

import {
  fetchCart,
} from "../redux/cart/cartSlice";

import "../component/cart/Cart.css";


const Cart = () => {

  const dispatch = useDispatch();


  const {
    items,
    loading,
  } = useSelector(
    (state) => state.cart
  );


  useEffect(() => {

    dispatch(fetchCart());

  }, [dispatch]);


  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {

    return (

      <section className="cart-page">

        <Container>

          <div className="empty-cart">

            <h3>
              Loading Cart...
            </h3>

            <p>
              Please wait while we load your cart.
            </p>

          </div>

        </Container>

      </section>

    );

  }


  return (

    <section className="cart-page">

      <Container>


        {/* =================================================
            TITLE
        ================================================= */}

        <h2 className="cart-title">
          Shopping Cart
        </h2>


        {/* =================================================
            EMPTY CART
        ================================================= */}

        {items.length === 0 ? (

          <div className="empty-cart">

            <h3>
              Your Cart is Empty
            </h3>

            <p>
              Add some products to continue shopping.
            </p>

          </div>

        ) : (

          /* =================================================
             CART CONTENT
          ================================================= */

          <div className="cart-layout">


            {/* PRODUCTS */}

            <div className="cart-items">

              {items.map((item) => (

                <CartItem
                  key={item.productId}
                  item={item}
                />

              ))}

            </div>


            {/* SUMMARY */}

            <CartSummary />

          </div>

        )}

      </Container>

    </section>

  );

};


export default Cart;