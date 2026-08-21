import { Link, useNavigate } from "react-router-dom";
import {
  User,
  Phone,
  Mail,
  Package,
  MapPin,
  LogOut,
  ChevronRight,
} from "lucide-react";

import "./Profile.css";
const Profile = () => {
  const navigate = useNavigate();

  // Get logged-in user
  const storedUser = localStorage.getItem("user");

  let user = {};

  try {
    user = storedUser ? JSON.parse(storedUser) : {};
  } catch (error) {
    console.error("Failed to parse user data:", error);
  }

  const userName =
    user?.userName ||
    user?.name ||
    user?.fullName ||
    "User";

  const phone =
    user?.phone ||
    user?.mobile ||
    user?.phoneNumber ||
    "Not available";

  const email =
    user?.email ||
    "Not available";

  // ========================================
  // LOGOUT
  // ========================================

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");

    // If your application uses another auth key,
    // remove it here.

    navigate("/login");
  };

  return (
    <section className="profile-page">
      <div className="profile-container">

        {/* ==================================
            PAGE HEADER
        ================================== */}

        <div className="profile-page-header">
          <h1>My Profile</h1>

          <p>
            Manage your account and access
            your orders and addresses.
          </p>
        </div>

        {/* ==================================
            PROFILE INFORMATION
        ================================== */}

        <div className="profile-card profile-user-card">

          <div className="profile-avatar">
            <User size={38} />
          </div>

          <div className="profile-user-info">

            <h2>{userName}</h2>

            <div className="profile-contact">

              <span>
                <Phone size={16} />
                {phone}
              </span>

              <span>
                <Mail size={16} />
                {email}
              </span>

            </div>

          </div>

        </div>

        {/* ==================================
            ACCOUNT OPTIONS
        ================================== */}

        <div className="profile-options">

          {/* MY ORDERS */}

          <Link
            to="/orders"
            className="profile-option"
          >

            <div className="profile-option-left">

              <div className="profile-option-icon orders-icon">
                <Package size={22} />
              </div>

              <div>
                <h3>My Orders</h3>

                <p>
                  View and track your orders
                </p>
              </div>

            </div>

            <ChevronRight size={22} />

          </Link>

        </div>

        {/* ==================================
            LOGOUT
        ================================== */}

        <button
          type="button"
          className="profile-logout-btn"
          onClick={handleLogout}
        >
          <LogOut size={19} />
          Logout
        </button>

      </div>
    </section>
  );
};

export default Profile;