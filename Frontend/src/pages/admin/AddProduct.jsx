import { useState } from "react";
import "./AddProduct.css";
import { createProduct } from "../../services/productService";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import ProductBasicInfo from "../../component/admin/productForm/ProductBasicInfo";
import ProductPricing from "../../component/admin/productForm/ProductPricing";
import ProductFeatures from "../../component/admin/productForm/ProductFeature";
import ProductImages from "../../component/admin/productForm/ProductImages";
import ProductOptions from "../../component/admin/productForm/ProductOptions";
const AddProduct = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    shortDescription: "",
    description: "",
    Mrp: "",
    SellingPrice: "",
    stock: "",
    benefits: [""],
    ingredients: [""],
    directions: "",
    warnings: "",
    featured: false,
    bestSeller: false,
    images: [],
  });

  const handleChange = (e) => {
  const { name, value, type, checked } = e.target;

  setFormData((prev) => ({
    ...prev,
    [name]: type === "checkbox" ? checked : value,
  }));
};

const handleArrayChange = (
  field,
  index,
  value
) => {
  const updated = [...formData[field]];
  updated[index] = value;

  setFormData({
    ...formData,
    [field]: updated,
  });
};

const addArrayField = (field) => {
  setFormData({
    ...formData,
    [field]: [...formData[field], ""],
  });
};

const removeArrayField = (
  field,
  index
) => {
  const updated = [...formData[field]];

  updated.splice(index, 1);

  setFormData({
    ...formData,
    [field]: updated,
  });
};
const handleImageChange = (e) => {

  const files = Array.from(e.target.files);

  const totalImages =
    formData.images.length + files.length;

  if (totalImages > 6) {
    alert("Maximum 6 images allowed");
    return;
  }

  setFormData((prev) => ({
    ...prev,
    images: [...prev.images, ...files],
  }));
};

const removeImage = (index) => {

  const updated = [...formData.images];

  updated.splice(index, 1);

  setFormData({
    ...formData,
    images: updated,
  });

};

const handleReset = () => {

  setFormData({
    name: "",
    category: "",
    shortDescription: "",
    description: "",
    Mrp: "",
    SellingPrice: "",
    stock: "",
    benefits: [""],
    ingredients: [""],
    directions: "",
    warnings: "",
    featured: false,
    bestSeller: false,
    images: [],
  });

};

const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    setLoading(true);

    const data = new FormData();

    // Basic Information
    data.append("name", formData.name);
    data.append("category", formData.category);
    data.append(
      "shortDescription",
      formData.shortDescription
    );
    data.append(
      "description",
      formData.description
    );

    // Pricing
    data.append("Mrp", formData.Mrp);
    data.append(
      "SellingPrice",
      formData.SellingPrice
    );
    data.append("stock", formData.stock);

    // Arrays
   data.append(
  "benefits",
  formData.benefits
    .filter((item) => item.trim() !== "")
    .join(",")
);

data.append(
  "ingredients",
  formData.ingredients
    .filter((item) => item.trim() !== "")
    .join(",")
);

    // Other fields
    data.append(
      "directions",
      formData.directions
    );

    data.append(
      "warnings",
      formData.warnings
    );

        data.append(
        "featured",
        String(formData.featured)
      );

      data.append(
        "bestSeller",
        String(formData.bestSeller)
      );

    // Images
    formData.images.forEach((image) => {
      data.append("images", image);
    });

    await createProduct(data);

    toast.success("Product added successfully");

    handleReset();

    navigate("/admin/products");

  } catch (error) {

    toast.error(
      error.response?.data?.message ||
      "Failed to add product"
    );

  } finally {

    setLoading(false);

  }
};
  return (
     <div className="add-product-page">

    <h1>Add Product</h1>

    <form onSubmit={handleSubmit}>

      <ProductBasicInfo
        formData={formData}
        handleChange={handleChange}
      />

    <ProductPricing
        formData={formData}
        handleChange={handleChange}
    />
    <ProductFeatures
    formData={formData}
    handleChange={handleChange}
    handleArrayChange={handleArrayChange}
    addArrayField={addArrayField}
    removeArrayField={removeArrayField}
  />
  <ProductImages
    formData={formData}
    handleImageChange={handleImageChange}
    removeImage={removeImage}
    loading={loading}
  />
   <ProductOptions
    formData={formData}
    handleChange={handleChange}
    handleReset={handleReset}
    loading={loading}
  />

    </form>

    </div>
  );
};

export default AddProduct;