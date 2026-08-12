import "./AuthButton.css";

const AuthButton = ({ children, loading, loadingText = "Please wait..." }) => {
  return (
    <button
      className="auth-btn"
      disabled={loading}
      type="submit"
    >
      {loading ? loadingText : children}
    </button>
  );
};

export default AuthButton;