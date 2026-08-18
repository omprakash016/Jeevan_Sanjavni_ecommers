import "./ProductForm.css";

const ProductPricing = ({
  formData,
  handleChange,
}) => {
  return (
    <div className="product-form-section">

      <h2>Pricing & Stock</h2>

      <div className="pricing-grid">

        <div className="form-group">
          <label>MRP (₹)<span className="required">*</span></label>

          <input
            type="number"
            name="Mrp"
            min="0"
            placeholder="Enter MRP"
            value={formData.Mrp}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Selling Price (₹) <span className="required">*</span></label>

          <input
            type="number"
            name="SellingPrice"
            min="0"
            placeholder="Enter Selling Price"
            value={formData.SellingPrice}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Stock <span className="required">*</span></label>

          <input
            type="number"
            name="stock"
            min="0"
            placeholder="Available Quantity"
            value={formData.stock}
            onChange={handleChange}
            required
          />
        </div>

      </div>

    </div>
  );
};

export default ProductPricing;