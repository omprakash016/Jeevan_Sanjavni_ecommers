import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, MapPin, Edit, Trash2, Star } from "lucide-react";
import { toast } from "react-toastify";

import Container from "../component/ui/Container";
import "./Addresses.css";

import {
  getAllAddresses,
  deleteAddress,
  setDefaultAddress,
} from "../services/addressService";

const Addresses = () => {
  const navigate = useNavigate();

  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);

  // =========================================
  // FETCH ADDRESSES
  // =========================================

  const fetchAddresses = async () => {
    try {
      setLoading(true);

      const response = await getAllAddresses();

      setAddresses(response.data?.addresses || []);
    } catch (error) {
      console.error("Get Addresses Error:", error);

      toast.error(
        error.response?.data?.message ||
          "Failed to load addresses"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAddresses();
  }, []);

  // =========================================
  // DELETE ADDRESS
  // =========================================

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this address?"
    );

    if (!confirmed) return;

    try {
      await deleteAddress(id);

      toast.success("Address deleted successfully");

      fetchAddresses();
    } catch (error) {
      console.error("Delete Address Error:", error);

      toast.error(
        error.response?.data?.message ||
          "Failed to delete address"
      );
    }
  };

  // =========================================
  // SET DEFAULT ADDRESS
  // =========================================

  const handleSetDefault = async (id) => {
    try {
      await setDefaultAddress(id);

      toast.success(
        "Default address updated successfully"
      );

      fetchAddresses();
    } catch (error) {
      console.error(
        "Set Default Address Error:",
        error
      );

      toast.error(
        error.response?.data?.message ||
          "Failed to update default address"
      );
    }
  };

  // =========================================
  // LOADING
  // =========================================

  if (loading) {
    return (
      <section className="addresses-page">
        <Container>
          <div className="addresses-loading">
            Loading addresses...
          </div>
        </Container>
      </section>
    );
  }

  return (
    <section className="addresses-page">

      <Container>

        {/* =====================================
            HEADER
        ====================================== */}

        <div className="addresses-header">

          <div>
            <span className="addresses-label">
              My Account
            </span>

            <h1>My Addresses</h1>

            <p>
              Manage your saved delivery addresses.
            </p>
          </div>

          <button
            type="button"
            className="add-address-btn"
            onClick={() =>
              navigate("/addresses/add")
            }
          >
            <Plus size={19} />
            Add Address
          </button>

        </div>


        {/* =====================================
            NO ADDRESSES
        ====================================== */}

        {addresses.length === 0 ? (

          <div className="no-addresses">

            <div className="no-address-icon">
              <MapPin size={36} />
            </div>

            <h2>No addresses saved</h2>

            <p>
              Add an address to make checkout
              faster and easier.
            </p>

            <button
              type="button"
              onClick={() =>
                navigate("/addresses/add")
              }
              className="empty-add-address-btn"
            >
              <Plus size={18} />
              Add Your First Address
            </button>

          </div>

        ) : (

          /* =====================================
             ADDRESS GRID
          ====================================== */

          <div className="addresses-grid">

            {addresses.map((address) => (

              <div
                className={
                  address.isDefault
                    ? "address-card default"
                    : "address-card"
                }
                key={address._id}
              >

                {/* DEFAULT BADGE */}

                {address.isDefault && (
                  <div className="default-badge">
                    <Star size={14} />
                    Default Address
                  </div>
                )}


                {/* ADDRESS TYPE */}

                <div className="address-card-header">

                  <div className="address-type">

                    <div className="address-icon">
                      <MapPin size={19} />
                    </div>

                    <div>
                      <h3>
                        {address.addressType ||
                          "Home"}
                      </h3>
                    </div>

                  </div>

                </div>


                {/* ADDRESS DETAILS */}

                <div className="address-details">

                  <strong>
                    {address.fullName}
                  </strong>

                  <p>
                    {address.phone}
                  </p>

                  <p>
                    {address.addressLine1}
                  </p>

                  {address.addressLine2 && (
                    <p>
                      {address.addressLine2}
                    </p>
                  )}

                  {address.landmark && (
                    <p>
                      {address.landmark}
                    </p>
                  )}

                  <p>
                    {address.city},{" "}
                    {address.state} -{" "}
                    {address.postalCode}
                  </p>

                  <p>
                    {address.country}
                  </p>

                </div>


                {/* ACTIONS */}

                <div className="address-actions">

                  <button
                    type="button"
                    className="edit-address-btn"
                    onClick={() =>
                      navigate(
                        `/addresses/${address._id}/edit`
                      )
                    }
                  >
                    <Edit size={16} />
                    Edit
                  </button>


                  {!address.isDefault && (
                    <button
                      type="button"
                      className="default-address-btn"
                      onClick={() =>
                        handleSetDefault(
                          address._id
                        )
                      }
                    >
                      <Star size={16} />
                      Make Default
                    </button>
                  )}


                  <button
                    type="button"
                    className="delete-address-btn"
                    onClick={() =>
                      handleDelete(address._id)
                    }
                  >
                    <Trash2 size={16} />
                    Delete
                  </button>

                </div>

              </div>

            ))}

          </div>

        )}

      </Container>

    </section>
  );
};

export default Addresses;