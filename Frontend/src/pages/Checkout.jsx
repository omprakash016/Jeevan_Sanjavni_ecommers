import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import {
  MapPin,
  Plus,
  CheckCircle,
  ShoppingBag,
  ArrowLeft,
  Trash2,
} from "lucide-react";

import { toast } from "react-toastify";

import Container from "../component/ui/Container";

import {
  fetchCart,
} from "../redux/cart/cartSlice";

import {
  getAddresses,
  createAddress,
  deleteAddress,
  setDefaultAddress,
} from "../services/addressService";

import {
  placeOrder,
} from "../services/orderService";

import "./Checkout.css";


const Checkout = () => {

  const dispatch = useDispatch();

  const navigate = useNavigate();


  // =====================================================
  // CART
  // =====================================================

  const {
    items,
    subtotal,
    totalQuantity,
    loading: cartLoading,
  } = useSelector(
    (state) => state.cart
  );


  // =====================================================
  // ADDRESS STATE
  // =====================================================

  const [addresses, setAddresses] =
    useState([]);

  const [selectedAddress, setSelectedAddress] =
    useState("");

  const [addressLoading, setAddressLoading] =
    useState(true);

  const [showAddressForm, setShowAddressForm] =
    useState(false);

  const [savingAddress, setSavingAddress] =
    useState(false);


  // =====================================================
  // ORDER STATE
  // =====================================================

  const [placingOrder, setPlacingOrder] =
    useState(false);


  // =====================================================
  // ADDRESS FORM
  // =====================================================

  const [formData, setFormData] = useState({

    fullName: "",
    phone: "",
    addressLine1: "",
    addressLine2: "",
    landmark: "",
    city: "",
    state: "",
    postalCode: "",
    country: "India",
    addressType: "Home",

  });


  // =====================================================
  // FETCH CART + ADDRESSES
  // =====================================================

  useEffect(() => {

    dispatch(fetchCart());

    loadAddresses();

  }, [dispatch]);


  // =====================================================
  // LOAD ADDRESSES
  // =====================================================

  const loadAddresses = async () => {

    try {

      setAddressLoading(true);

      const response =
        await getAddresses();

      const addressList =
        response?.data?.addresses || [];

      setAddresses(addressList);


      // Automatically select default address

      const defaultAddress =
        addressList.find(
          (address) =>
            address.isDefault
        );


      if (defaultAddress) {

        setSelectedAddress(
          defaultAddress._id
        );

      } else if (
        addressList.length > 0
      ) {

        setSelectedAddress(
          addressList[0]._id
        );

      }

    } catch (error) {

      console.error(
        "Address loading error:",
        error
      );

      toast.error(
        error.response?.data?.message ||
          "Failed to load addresses"
      );

    } finally {

      setAddressLoading(false);

    }

  };


  // =====================================================
  // FORM CHANGE
  // =====================================================

  const handleChange = (e) => {

    const {
      name,
      value,
    } = e.target;


    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

  };


  // =====================================================
  // ADD ADDRESS
  // =====================================================

  const handleAddAddress = async (
    e
  ) => {

    e.preventDefault();


    try {

      setSavingAddress(true);


      const response =
        await createAddress(
          formData
        );


      const newAddress =
        response?.data?.address;


      if (!newAddress) {

        throw new Error(
          "Address was not returned"
        );

      }


      toast.success(
        "Address added successfully"
      );


      setAddresses((prev) => [

        ...prev,

        newAddress,

      ]);


      setSelectedAddress(
        newAddress._id
      );


      setShowAddressForm(false);


      setFormData({

        fullName: "",
        phone: "",
        addressLine1: "",
        addressLine2: "",
        landmark: "",
        city: "",
        state: "",
        postalCode: "",
        country: "India",
        addressType: "Home",

      });

    } catch (error) {

      console.error(
        "Add address error:",
        error
      );


      const validationErrors =
        error.response?.data?.errors;


      if (
        Array.isArray(
          validationErrors
        ) &&
        validationErrors.length > 0
      ) {

        toast.error(
          validationErrors[0].msg
        );

      } else {

        toast.error(
          error.response?.data?.message ||
            "Failed to add address"
        );

      }

    } finally {

      setSavingAddress(false);

    }

  };


  // =====================================================
  // DELETE ADDRESS
  // =====================================================

  const handleDeleteAddress = async (
    addressId
  ) => {

    const confirmed =
      window.confirm(
        "Are you sure you want to delete this address?"
      );


    if (!confirmed) {
      return;
    }


    try {

      await deleteAddress(
        addressId
      );


      toast.success(
        "Address deleted successfully"
      );


      await loadAddresses();

    } catch (error) {

      console.error(
        "Delete address error:",
        error
      );

      toast.error(
        error.response?.data?.message ||
          "Failed to delete address"
      );

    }

  };


  // =====================================================
  // SET DEFAULT
  // =====================================================

  const handleSetDefault = async (
    addressId
  ) => {

    try {

      await setDefaultAddress(
        addressId
      );


      toast.success(
        "Default address updated"
      );


      await loadAddresses();

    } catch (error) {

      console.error(
        "Default address error:",
        error
      );

      toast.error(
        error.response?.data?.message ||
          "Failed to update default address"
      );

    }

  };


  // =====================================================
  // PLACE ORDER
  // =====================================================

  const handlePlaceOrder = async () => {

    if (!selectedAddress) {

      toast.error(
        "Please select a delivery address"
      );

      return;

    }


    if (
      !items ||
      items.length === 0
    ) {

      toast.error(
        "Your cart is empty"
      );

      navigate("/products");

      return;

    }


    try {

      setPlacingOrder(true);


      /*
        IMPORTANT:

        Backend only requires:

        {
          addressId
        }

        Cart items, prices and stock are
        calculated by the backend.
      */

      const response =
        await placeOrder(
          selectedAddress
        );


      const order =
        response?.data?.order;


      if (!order) {

        throw new Error(
          "Order information was not returned"
        );

      }


      toast.success(
        "Order placed successfully!"
      );


      /*
        Send customer to order details.
      */

      navigate(
        `/orders/${order._id}`
      );

    } catch (error) {

      console.error(
        "Place order error:",
        error
      );


      toast.error(
        error.response?.data?.message ||
          "Failed to place order"
      );

    } finally {

      setPlacingOrder(false);

    }

  };


  // =====================================================
  // CART LOADING
  // =====================================================

  if (cartLoading) {

    return (

      <section className="checkout-page">

        <Container>

          <div className="checkout-loading">

            <h2>
              Loading Checkout...
            </h2>

            <p>
              Please wait.
            </p>

          </div>

        </Container>

      </section>

    );

  }


  // =====================================================
  // EMPTY CART
  // =====================================================

  if (
    !items ||
    items.length === 0
  ) {

    return (

      <section className="checkout-page">

        <Container>

          <div className="checkout-empty">

            <ShoppingBag
              size={55}
            />

            <h2>
              Your Cart is Empty
            </h2>

            <p>
              Add products before proceeding
              to checkout.
            </p>

            <Link
              to="/products"
              className="checkout-back-btn"
            >
              Continue Shopping
            </Link>

          </div>

        </Container>

      </section>

    );

  }


  // =====================================================
  // RENDER
  // =====================================================

  return (

    <section className="checkout-page">

      <Container>


        {/* =================================================
            HEADER
        ================================================= */}

        <div className="checkout-header">

          <Link
            to="/cart"
            className="checkout-back-link"
          >

            <ArrowLeft
              size={18}
            />

            Back to Cart

          </Link>


          <h1>
            Checkout
          </h1>

          <p>
            Complete your order securely
          </p>

        </div>


        <div className="checkout-layout">


          {/* =================================================
              LEFT SIDE
          ================================================= */}

          <div className="checkout-left">


            {/* =================================================
                DELIVERY ADDRESS
            ================================================= */}

            <div className="checkout-card">

              <div className="checkout-card-header">

                <div>

                  <span className="checkout-step">
                    1
                  </span>

                </div>

                <div>

                  <h2>
                    Delivery Address
                  </h2>

                  <p>
                    Where should we deliver your order?
                  </p>

                </div>

              </div>


              {/* ADDRESS LIST */}

              {addressLoading ? (

                <div className="address-loading">
                  Loading addresses...
                </div>

              ) : addresses.length > 0 ? (

                <div className="address-list">

                  {addresses.map(
                    (address) => (

                      <div
                        key={
                          address._id
                        }
                        className={
                          selectedAddress ===
                          address._id
                            ? "address-card selected"
                            : "address-card"
                        }
                      >

                        <label>

                          <input
                            type="radio"
                            name="selectedAddress"
                            value={
                              address._id
                            }
                            checked={
                              selectedAddress ===
                              address._id
                            }
                            onChange={() =>
                              setSelectedAddress(
                                address._id
                              )
                            }
                          />


                          <div className="address-content">

                            <div className="address-top">

                              <strong>
                                {
                                  address.fullName
                                }
                              </strong>

                              <span className="address-type">
                                {
                                  address.addressType
                                }
                              </span>

                              {address.isDefault && (

                                <span className="default-badge">
                                  Default
                                </span>

                              )}

                            </div>


                            <p>
                              {
                                address.addressLine1
                              }

                              {address.addressLine2 &&
                                `, ${address.addressLine2}`}

                              {address.landmark &&
                                `, ${address.landmark}`}
                            </p>


                            <p>
                              {
                                address.city
                              },{" "}
                              {
                                address.state
                              }{" "}
                              -{" "}
                              {
                                address.postalCode
                              }
                            </p>


                            <span className="address-phone">
                              Phone:{" "}
                              {
                                address.phone
                              }
                            </span>

                          </div>

                        </label>


                        <div className="address-actions">

                          {!address.isDefault && (

                            <button
                              type="button"
                              onClick={() =>
                                handleSetDefault(
                                  address._id
                                )
                              }
                            >
                              Set Default
                            </button>

                          )}

                          <button
                            type="button"
                            className="delete-address"
                            onClick={() =>
                              handleDeleteAddress(
                                address._id
                              )
                            }
                          >

                            <Trash2
                              size={15}
                            />

                            Delete

                          </button>

                        </div>

                      </div>

                    )
                  )}

                </div>

              ) : (

                <div className="no-address">

                  <MapPin
                    size={40}
                  />

                  <h3>
                    No Address Found
                  </h3>

                  <p>
                    Please add a delivery
                    address to continue.
                  </p>

                </div>

              )}


              {/* ADD ADDRESS BUTTON */}

              {!showAddressForm && (

                <button
                  type="button"
                  className="add-address-btn"
                  onClick={() =>
                    setShowAddressForm(true)
                  }
                >

                  <Plus size={18} />

                  Add New Address

                </button>

              )}


              {/* =================================================
                  ADDRESS FORM
              ================================================= */}

              {showAddressForm && (

                <form
                  className="address-form"
                  onSubmit={
                    handleAddAddress
                  }
                >

                  <div className="address-form-title">

                    <h3>
                      Add New Address
                    </h3>

                    <button
                      type="button"
                      onClick={() =>
                        setShowAddressForm(false)
                      }
                    >
                      Cancel
                    </button>

                  </div>


                  <div className="form-grid">


                    <div className="form-group">

                      <label>
                        Full Name *
                      </label>

                      <input
                        type="text"
                        name="fullName"
                        value={
                          formData.fullName
                        }
                        onChange={
                          handleChange
                        }
                        required
                      />

                    </div>


                    <div className="form-group">

                      <label>
                        Phone *
                      </label>

                      <input
                        type="tel"
                        name="phone"
                        value={
                          formData.phone
                        }
                        onChange={
                          handleChange
                        }
                        maxLength="10"
                        required
                      />

                    </div>


                    <div className="form-group full">

                      <label>
                        Address Line 1 *
                      </label>

                      <input
                        type="text"
                        name="addressLine1"
                        value={
                          formData.addressLine1
                        }
                        onChange={
                          handleChange
                        }
                        required
                      />

                    </div>


                    <div className="form-group full">

                      <label>
                        Address Line 2
                      </label>

                      <input
                        type="text"
                        name="addressLine2"
                        value={
                          formData.addressLine2
                        }
                        onChange={
                          handleChange
                        }
                      />

                    </div>


                    <div className="form-group">

                      <label>
                        Landmark
                      </label>

                      <input
                        type="text"
                        name="landmark"
                        value={
                          formData.landmark
                        }
                        onChange={
                          handleChange
                        }
                      />

                    </div>


                    <div className="form-group">

                      <label>
                        City *
                      </label>

                      <input
                        type="text"
                        name="city"
                        value={
                          formData.city
                        }
                        onChange={
                          handleChange
                        }
                        required
                      />

                    </div>


                    <div className="form-group">

                      <label>
                        State *
                      </label>

                      <input
                        type="text"
                        name="state"
                        value={
                          formData.state
                        }
                        onChange={
                          handleChange
                        }
                        required
                      />

                    </div>


                    <div className="form-group">

                      <label>
                        Postal Code *
                      </label>

                      <input
                        type="text"
                        name="postalCode"
                        value={
                          formData.postalCode
                        }
                        onChange={
                          handleChange
                        }
                        maxLength="6"
                        required
                      />

                    </div>


                    <div className="form-group">

                      <label>
                        Address Type
                      </label>

                      <select
                        name="addressType"
                        value={
                          formData.addressType
                        }
                        onChange={
                          handleChange
                        }
                      >

                        <option value="Home">
                          Home
                        </option>

                        <option value="Office">
                          Office
                        </option>

                        <option value="Other">
                          Other
                        </option>

                      </select>

                    </div>

                  </div>


                  <button
                    type="submit"
                    className="save-address-btn"
                    disabled={
                      savingAddress
                    }
                  >

                    {savingAddress
                      ? "Saving..."
                      : "Save Address"}

                  </button>

                </form>

              )}

            </div>


            {/* =================================================
                PAYMENT
            ================================================= */}

            <div className="checkout-card">

              <div className="checkout-card-header">

                <span className="checkout-step">
                  2
                </span>

                <div>

                  <h2>
                    Payment Method
                  </h2>

                  <p>
                    Select your preferred payment method
                  </p>

                </div>

              </div>


              <div className="payment-option selected">

                <div className="payment-radio">

                  <CheckCircle
                    size={20}
                  />

                </div>

                <div>

                  <strong>
                    Cash on Delivery
                  </strong>

                  <span>
                    Pay when your order arrives
                  </span>

                </div>

              </div>

            </div>

          </div>


          {/* =================================================
              RIGHT SIDE — SUMMARY
          ================================================= */}

          <div className="checkout-right">

            <div className="checkout-summary">

              <h2>
                Order Summary
              </h2>


              {/* PRODUCTS */}

              <div className="checkout-products">

                {items.map(
                  (item) => (

                    <div
                      className="checkout-product"
                      key={
                        item.productId
                      }
                    >

                      <div className="checkout-product-image">

                        <img
                          src={
                            item.image
                          }
                          alt={
                            item.name
                          }
                        />

                        <span>
                          {item.quantity}
                        </span>

                      </div>


                      <div className="checkout-product-info">

                        <strong>
                          {item.name}
                        </strong>

                        <span>
                          ₹
                          {Number(
                            item.SellingPrice ||
                              0
                          ).toLocaleString(
                            "en-IN"
                          )}
                        </span>

                      </div>


                      <strong>
                        ₹
                        {Number(
                          item.itemTotal ||
                            0
                        ).toLocaleString(
                          "en-IN"
                        )}
                      </strong>

                    </div>

                  )
                )}

              </div>


              {/* SUMMARY */}

              <div className="summary-divider"></div>


              <div className="checkout-summary-row">

                <span>
                  Total Items
                </span>

                <span>
                  {totalQuantity}
                </span>

              </div>


              <div className="checkout-summary-row">

                <span>
                  Subtotal
                </span>

                <span>
                  ₹
                  {Number(
                    subtotal || 0
                  ).toLocaleString(
                    "en-IN"
                  )}
                </span>

              </div>


              <div className="checkout-summary-row">

                <span>
                  Shipping
                </span>

                <span className="free-shipping">
                  FREE
                </span>

              </div>


              <div className="summary-divider"></div>


              <div className="checkout-total">

                <span>
                  Total
                </span>

                <strong>
                  ₹
                  {Number(
                    subtotal || 0
                  ).toLocaleString(
                    "en-IN"
                  )}
                </strong>

              </div>


              {/* PLACE ORDER */}

              <button
                type="button"
                className="place-order-btn"
                onClick={
                  handlePlaceOrder
                }
                disabled={
                  placingOrder ||
                  !selectedAddress
                }
              >

                {placingOrder
                  ? "Placing Order..."
                  : "Place Order"}

              </button>


              {!selectedAddress && (

                <p className="checkout-note">
                  Please select a delivery
                  address to place your order.
                </p>

              )}


              <div className="secure-checkout">

                <CheckCircle
                  size={17}
                />

                Secure & Safe Checkout

              </div>

            </div>

          </div>

        </div>

      </Container>

    </section>

  );

};


export default Checkout;