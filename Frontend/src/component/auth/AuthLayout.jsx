import "./AuthLayout.css";
import { motion } from "framer-motion";

import leaf1 from "../../assets/auth/leaf-bottom-left.jpg";
import leaf2 from "../../assets/auth/leaf-bottom-right.jpg";
import leaf3 from "../../assets/auth/leaf-top-left.jpg";
import leaf4 from "../../assets/auth/leaf-top-right.jpg";
const floating = {
  animate: {
    y: [0, -12, 0],
    rotate: [0, 3, -3, 0],
    transition: {
      duration: 6,
      repeat: Infinity,
      ease: "easeInOut",
    },
  },
};

const AuthLayout = ({ title, subtitle, children }) => {
  return (
    <section className="auth-section">

      <div className="blur-circle one"></div>
      <div className="blur-circle two"></div>

      <motion.img
        {...floating}
        src={leaf3}
        className="leaf leaf1"
        alt=""
      />

      <motion.img
        {...floating}
        src={leaf1}
        className="leaf leaf2"
        alt=""
      />

      <motion.img
        {...floating}
        src={leaf1}
        className="leaf leaf3"
        alt=""
      />

      <motion.img
        {...floating}
        src={leaf3}
        className="leaf leaf4"
        alt=""
      />

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: .7 }}
        className="auth-card"
      >

        <h2>{title}</h2>

        <p>{subtitle}</p>

        {children}

      </motion.div>

    </section>
  );
};

export default AuthLayout;