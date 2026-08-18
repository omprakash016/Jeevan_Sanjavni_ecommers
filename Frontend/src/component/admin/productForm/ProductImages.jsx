import { ImagePlus, Trash2 } from "lucide-react";
import "./ProductForm.css";

const ProductImages = ({
  formData,
  handleImageChange,
  removeImage,
}) => {
  return (
    <div className="product-form-section">

      <h2>
        Product Images
        <span className="required">*</span>
      </h2>

      <label className="image-upload-box">

        <ImagePlus size={40} />

        <p>Click to upload images</p>

        <span>Maximum 6 images</span>

        <input
          type="file"
          multiple
          accept="image/*"
          onChange={handleImageChange}
          hidden
        />

      </label>

      {formData.images.length > 0 && (

        <div className="image-preview-grid">

          {formData.images.map((image, index) => (

            <div
              className="image-card"
              key={index}
            >

              {index === 0 && (
                <span className="cover-badge">
                  Cover
                </span>
              )}

              <img
                src={URL.createObjectURL(image)}
                alt=""
              />

              <button
                type="button"
                className="remove-image-btn"
                onClick={() =>
                  removeImage(index)
                }
              >
                <Trash2 size={18} />
              </button>

            </div>

          ))}

        </div>

      )}

    </div>
  );
};

export default ProductImages;