import { Plus, Trash2 } from "lucide-react";
import "./ProductForm.css";

const ProductFeatures = ({
  formData,
  handleChange,
  handleArrayChange,
  addArrayField,
  removeArrayField,
}) => {
  return (
    <div className="product-form-section">

      <h2>Product Details</h2>

      {/* Benefits */}

      <div className="dynamic-section">

        <div className="section-header">
          <h3>Benefits</h3>

          <button
            type="button"
            className="add-btn"
            onClick={() => addArrayField("benefits")}
          >
            <Plus size={16} />
            Add
          </button>
        </div>

        {formData.benefits.map((benefit, index) => (
          <div className="dynamic-input" key={index}>

            <input
              type="text"
              placeholder={`Benefit ${index + 1}`}
              value={benefit}
              onChange={(e) =>
                handleArrayChange(
                  "benefits",
                  index,
                  e.target.value
                )
              }
            />

            {formData.benefits.length > 1 && (
              <button
                type="button"
                className="delete-btn"
                onClick={() =>
                  removeArrayField("benefits", index)
                }
              >
                <Trash2 size={18} />
              </button>
            )}

          </div>
        ))}

      </div>

      {/* Ingredients */}

      <div className="dynamic-section">

        <div className="section-header">
          <h3>Ingredients</h3>

          <button
            type="button"
            className="add-btn"
            onClick={() => addArrayField("ingredients")}
          >
            <Plus size={16} />
            Add
          </button>
        </div>

        {formData.ingredients.map((ingredient, index) => (
          <div className="dynamic-input" key={index}>

            <input
              type="text"
              placeholder={`Ingredient ${index + 1}`}
              value={ingredient}
              onChange={(e) =>
                handleArrayChange(
                  "ingredients",
                  index,
                  e.target.value
                )
              }
            />

            {formData.ingredients.length > 1 && (
              <button
                type="button"
                className="delete-btn"
                onClick={() =>
                  removeArrayField(
                    "ingredients",
                    index
                  )
                }
              >
                <Trash2 size={18} />
              </button>
            )}

          </div>
        ))}

      </div>

      {/* Directions */}

      <div className="form-group">
        <label>Directions</label>

        <textarea
          rows="4"
          name="directions"
          value={formData.directions}
          onChange={handleChange}
          placeholder="How to use the product..."
        />
      </div>

      {/* Warnings */}

      <div className="form-group">
        <label>Warnings</label>

        <textarea
          rows="4"
          name="warnings"
          value={formData.warnings}
          onChange={handleChange}
          placeholder="Product warnings..."
        />
      </div>

    </div>
  );
};

export default ProductFeatures;