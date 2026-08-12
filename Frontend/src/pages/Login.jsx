import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { Mail, Lock } from "lucide-react";
import { toast } from "react-toastify";
import AuthLayout from "../component/auth/AuthLayout";
import AuthInput from "../component/auth/AuthInput";
import AuthButton from "../component/auth/AuthButton";

import { loginUser } from "../services/authService";

import {
  loginStart,
  loginSuccess,
  loginFailure,
} from "../redux/auth/authSlice";

const Login = () => {

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { loading } = useSelector((state) => state.auth);

  const [errors, setErrors] = useState({});

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {

    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

    setErrors({
      ...errors,
      [e.target.name]: "",
    });

  };

  const validate = () => {

    let temp = {};

    if (!formData.email.trim()) {
      temp.email = "Email is required";
    }

    if (!formData.password.trim()) {
      temp.password = "Password is required";
    }

    setErrors(temp);

    return Object.keys(temp).length === 0;
  };

  const handleSubmit = async (e) => {

    e.preventDefault();

    if (!validate()) return;

    try {

      dispatch(loginStart());

      const res = await loginUser(formData);

     dispatch(loginSuccess(res.user));

        toast.success(res.message || "Login successful!");

        setTimeout(() => {
        if (res.user.role === "admin") {
            navigate("/admin");
        } else {
            navigate("/");
        }
        }, 1000);

    } catch (error) {

      dispatch(loginFailure());

     toast.error(
        error.response?.data?.message ||
        "Login failed"
        );

    }

  };

  return (

    <AuthLayout
      title="Welcome Back 👋"
      subtitle="Login to your Jeevan Sanjivani account"
    >

      <form onSubmit={handleSubmit}>

        <AuthInput
          label="Email Address"
          name="email"
          type="email"
          icon={Mail}
          value={formData.email}
          onChange={handleChange}
          placeholder="Enter email"
          error={errors.email}
        />

        <AuthInput
          label="Password"
          name="password"
          type="password"
          icon={Lock}
          value={formData.password}
          onChange={handleChange}
          placeholder="Enter password"
          error={errors.password}
        />

        <AuthButton loading={loading} loadingText="Logging in...">
          Login
        </AuthButton>

      </form>

      <p
        style={{
          textAlign: "center",
          marginTop: 25,
        }}
      >
        Don't have an account?{" "}
        <Link to="/register">
          Register
        </Link>
      </p>

    </AuthLayout>

  );
};

export default Login;