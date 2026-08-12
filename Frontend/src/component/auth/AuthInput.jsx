import "./AuthInput.css";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";

const AuthInput = ({
  label,
  type = "text",
  name,
  value,
  onChange,
  placeholder,
  error,
  icon: Icon,
}) => {
  const [showPassword, setShowPassword] = useState(false);

  const inputType =
    type === "password"
      ? showPassword
        ? "text"
        : "password"
      : type;

  return (
    <div className="auth-input-group">

      <label>{label}</label>

      <div className={`auth-input-wrapper ${error ? "error" : ""}`}>

        {Icon && (
          <div className="auth-input-icon">
            <Icon size={20} />
          </div>
        )}

        <input
          type={inputType}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
        />

        {type === "password" && (
          <button
            type="button"
            className="password-toggle"
            onClick={() =>
              setShowPassword(!showPassword)
            }
          >
            {showPassword ? (
              <EyeOff size={20} />
            ) : (
              <Eye size={20} />
            )}
          </button>
        )}

      </div>

      {error && (
        <small className="auth-error">
          {error}
        </small>
      )}

    </div>
  );
};

export default AuthInput;