import "./ProductForm.css";

const ProductBasicInfo = ({
  formData,
  handleChange,
}) => {
  return (
    <div className="product-form-section">

      <h2>Basic Information</h2>

      <div className="form-group">
        <label>Product Name <span className="required">*</span></label>

        <input
          type="text"
          name="name"
          placeholder="Enter product name"
          value={formData.name}
          onChange={handleChange}
          required
        />
      </div>

      <div className="form-group">
        <label>Category <span className="required">*</span></label>

        <input
          type="text"
          name="category"
          placeholder="Example: Hair Oil"
          value={formData.category}
          onChange={handleChange}
          required
        />
      </div>

      <div className="form-group">
        <label>Short Description <span className="required">*</span></label>

        <textarea
          rows="3"
          name="shortDescription"
          placeholder="Small description..."
          value={formData.shortDescription}
          onChange={handleChange}
          required
        />
      </div>

      <div className="form-group">
        <label>Description <span className="required">*</span></label>

        <textarea
          rows="6"
          name="description"
          placeholder="Complete product description..."
          value={formData.description}
          onChange={handleChange}
          required
        />
      </div>

    </div>
  );
};

export default ProductBasicInfo;