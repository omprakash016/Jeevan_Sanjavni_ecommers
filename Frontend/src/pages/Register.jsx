import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { User, Mail, Phone, Lock } from "lucide-react";
import { toast } from "react-toastify";

import AuthLayout from "../component/auth/AuthLayout";
import AuthInput from "../component/auth/AuthInput";
import AuthButton from "../component/auth/AuthButton";

import { registerUser } from "../services/authService";

import {
  loginStart,
  loginSuccess,
  loginFailure,
} from "../redux/auth/authSlice";

const Register = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { loading } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = "Full name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = "Enter a valid email";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (!/^\d{10}$/.test(formData.phone)) {
      newErrors.phone = "Enter a valid 10-digit phone number";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must contain at least 6 characters";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    try {
      dispatch(loginStart());

      const response = await registerUser(formData);

      dispatch(loginSuccess(response.user));

      toast.success(
        response.message || "Registration successful!"
      );

      setTimeout(() => {
        navigate("/");
      }, 800);

    } catch (error) {
      dispatch(loginFailure());

      const message =
        error.response?.data?.message ||
        "Registration failed. Please try again.";

      toast.error(message);
    }
  };

  return (
    <AuthLayout
      title="Create Account 🌿"
      subtitle="Join Jeevan Sanjivani today"
    >
      <form onSubmit={handleSubmit}>

        <AuthInput
          label="Full Name"
          name="fullName"
          type="text"
          icon={User}
          value={formData.fullName}
          onChange={handleChange}
          placeholder="Enter your full name"
          error={errors.fullName}
        />

        <AuthInput
          label="Email Address"
          name="email"
          type="email"
          icon={Mail}
          value={formData.email}
          onChange={handleChange}
          placeholder="Enter your email"
          error={errors.email}
        />

        <AuthInput
          label="Phone Number"
          name="phone"
          type="tel"
          icon={Phone}
          value={formData.phone}
          onChange={handleChange}
          placeholder="Enter your 10-digit phone number"
          error={errors.phone}
        />

        <AuthInput
          label="Password"
          name="password"
          type="password"
          icon={Lock}
          value={formData.password}
          onChange={handleChange}
          placeholder="Create a password"
          error={errors.password}
        />

        <AuthButton loading={loading}>
          Create Account
        </AuthButton>

      </form>

      <p className="auth-switch">
        Already have an account?{" "}
        <Link to="/login">
          Login
        </Link>
      </p>

    </AuthLayout>
  );
};

export default Register;