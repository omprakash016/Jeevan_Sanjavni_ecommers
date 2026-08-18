import "./ProductForm.css";

const ProductOptions = ({
  formData,
  handleChange,
  handleReset,
  loading,
}) => {
  return (
    <div className="product-form-section">

      <h2>Product Options</h2>

      <div className="checkbox-grid">

        <label className="checkbox-item">

          <input
            type="checkbox"
            name="featured"
            checked={formData.featured}
            onChange={handleChange}
          />

          <span>Featured Product</span>

        </label>

        <label className="checkbox-item">

          <input
            type="checkbox"
            name="bestSeller"
            checked={formData.bestSeller}
            onChange={handleChange}
          />

          <span>Best Seller</span>

        </label>

      </div>

      <div className="form-actions">

        <button
          type="reset"
          className="reset-btn"
          onClick={handleReset}
        >
          Reset
        </button>

        <button
          type="submit"
          className="save-btn"
          disabled={loading}
        >
          {loading ? "Saving..." : "Save Product"}
        </button>

      </div>

    </div>
  );
};

export default ProductOptions;