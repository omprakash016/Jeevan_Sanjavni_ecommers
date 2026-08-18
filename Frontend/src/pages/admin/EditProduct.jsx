import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { ImagePlus, Trash2 } from "lucide-react";

import ProductBasicInfo from "../../component/admin/productForm/ProductBasicInfo";
import ProductPricing from "../../component/admin/productForm/ProductPricing";
import ProductFeatures from "../../component/admin/productForm/ProductFeature";
import ProductOptions from "../../component/admin/productForm/ProductOptions";

import {
  getProductBySlug,
  updateProduct,
} from "../../services/productService";

import "./AddProduct.css";
import "../../component/admin/productForm/ProductForm.css";

const EditProduct = () => {
  const { slug } = useParams();
  const navigate = useNavigate();

  // ==========================================
  // STATES
  // ==========================================

  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);

  const [productId, setProductId] = useState("");

  const [existingImages, setExistingImages] = useState([]);

  const [newImages, setNewImages] = useState([]);

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

  // ==========================================
  // LOAD PRODUCT
  // ==========================================
  useEffect(() => {
    loadProduct();

    return () => {
      // Cleanup object URLs
      newImages.forEach((image) => {
        URL.revokeObjectURL(image.preview);
      });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug]);

const loadProduct = async () => {
  try {
    setPageLoading(true);

    const response = await getProductBySlug(slug);

    console.log("EDIT PRODUCT API RESPONSE:", response);

    /*
      Your service returns:

      response.data

      And your backend normally returns:

      {
        success: true,
        data: {
          product: {...}
        }
      }

      So product should normally be:

      response.data.product
    */

    const product =
      response?.data?.product ||
      response?.product ||
      response?.data;

    console.log("PRODUCT TO EDIT:", product);

    if (!product || !product._id) {
      toast.error("Product data not found");
      navigate("/admin/products");
      return;
    }

    // ==========================================
    // PRODUCT ID
    // ==========================================

    setProductId(product._id);

    // ==========================================
    // EXISTING IMAGES
    // ==========================================

    setExistingImages(
      Array.isArray(product.images)
        ? product.images
        : []
    );

    // ==========================================
    // FORM DATA
    // ==========================================

    setFormData({
      name: product.name || "",

      category: product.category || "",

      shortDescription:
        product.shortDescription || "",

      description:
        product.description || "",

      Mrp:
        product.Mrp ?? "",

      SellingPrice:
        product.SellingPrice ?? "",

      stock:
        product.stock ?? "",

      benefits:
        Array.isArray(product.benefits) &&
        product.benefits.length > 0
          ? product.benefits
          : [""],

      ingredients:
        Array.isArray(product.ingredients) &&
        product.ingredients.length > 0
          ? product.ingredients
          : [""],

      directions:
        product.directions || "",

      warnings:
        product.warnings || "",

      featured:
        product.featured === true,

      bestSeller:
        product.bestSeller === true,

      images: [],
    });

  } catch (error) {
    console.error(
      "LOAD PRODUCT ERROR:",
      error
    );

    toast.error(
      error.response?.data?.message ||
      "Failed to load product"
    );

  } finally {
    setPageLoading(false);
  }
};

  // ==========================================
  // HANDLE INPUT CHANGE
  // ==========================================

  const handleChange = (e) => {
    const {
      name,
      value,
      type,
      checked,
    } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? checked
          : value,
    }));
  };

   useEffect(() => {
    loadProduct();

    return () => {
      // Cleanup object URLs
      newImages.forEach((image) => {
        URL.revokeObjectURL(image.preview);
      });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug]);


  // ==========================================
  // ARRAY CHANGE
  // ==========================================

  const handleArrayChange = (
    field,
    index,
    value
  ) => {
    setFormData((prev) => {
      const updated = [...prev[field]];

      updated[index] = value;

      return {
        ...prev,
        [field]: updated,
      };
    });
  };

  // ==========================================
  // ADD ARRAY FIELD
  // ==========================================

  const addArrayField = (field) => {
    setFormData((prev) => ({
      ...prev,
      [field]: [
        ...prev[field],
        "",
      ],
    }));
  };

  // ==========================================
  // REMOVE ARRAY FIELD
  // ==========================================

  const removeArrayField = (
    field,
    index
  ) => {
    setFormData((prev) => {
      const updated = [...prev[field]];

      updated.splice(index, 1);

      return {
        ...prev,
        [field]:
          updated.length > 0
            ? updated
            : [""],
      };
    });
  };

  // ==========================================
  // ADD NEW IMAGES
  // ==========================================

  const handleImageChange = (e) => {
    const files = Array.from(
      e.target.files || []
    );

    if (files.length === 0) {
      return;
    }

    const totalImages =
      existingImages.length +
      newImages.length +
      files.length;

    if (totalImages > 6) {
      toast.error(
        "Maximum 6 images are allowed"
      );

      e.target.value = "";
      return;
    }

    const imageObjects = files.map(
      (file) => ({
        file,
        preview:
          URL.createObjectURL(file),
      })
    );

    setNewImages((prev) => [
      ...prev,
      ...imageObjects,
    ]);

    e.target.value = "";
  };

  // ==========================================
  // REMOVE EXISTING IMAGE
  // ==========================================

  const removeExistingImage = (
    fileId
  ) => {
    setExistingImages((prev) =>
      prev.filter(
        (image) =>
          image.fileId !== fileId
      )
    );
  };

  // ==========================================
  // REMOVE NEW IMAGE
  // ==========================================

  const removeNewImage = (index) => {
    setNewImages((prev) => {
      const imageToRemove =
        prev[index];

      if (imageToRemove?.preview) {
        URL.revokeObjectURL(
          imageToRemove.preview
        );
      }

      return prev.filter(
        (_, imageIndex) =>
          imageIndex !== index
      );
    });
  };

  // ==========================================
  // RESET FORM
  // ==========================================

  const handleReset = async () => {
    // Instead of manually recreating
    // the original product data,
    // reload it from backend.

    // Remove new image previews
    newImages.forEach((image) => {
      if (image.preview) {
        URL.revokeObjectURL(
          image.preview
        );
      }
    });

    setNewImages([]);

    await loadProduct();

    toast.info(
      "Form reset successfully"
    );
  };

  // ==========================================
  // SUBMIT UPDATE
  // ==========================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    // ------------------------------------------
    // BASIC FRONTEND VALIDATION
    // ------------------------------------------

    if (!formData.name.trim()) {
      toast.error(
        "Product name is required"
      );
      return;
    }

    if (!formData.category.trim()) {
      toast.error(
        "Category is required"
      );
      return;
    }

    if (
      !formData.shortDescription.trim()
    ) {
      toast.error(
        "Short description is required"
      );
      return;
    }

    if (
      !formData.description.trim()
    ) {
      toast.error(
        "Description is required"
      );
      return;
    }

    if (
      formData.Mrp === "" ||
      Number(formData.Mrp) < 0
    ) {
      toast.error(
        "Please enter a valid MRP"
      );
      return;
    }

    if (
      formData.SellingPrice === "" ||
      Number(formData.SellingPrice) < 0
    ) {
      toast.error(
        "Please enter a valid selling price"
      );
      return;
    }

    if (
      formData.stock === "" ||
      Number(formData.stock) < 0
    ) {
      toast.error(
        "Please enter a valid stock"
      );
      return;
    }

    // ------------------------------------------
    // IMAGE VALIDATION
    // ------------------------------------------

    const totalImages =
      existingImages.length +
      newImages.length;

    if (totalImages < 1) {
      toast.error(
        "Product must have at least one image"
      );
      return;
    }

    if (totalImages > 6) {
      toast.error(
        "Maximum 6 images are allowed"
      );
      return;
    }

    try {
      setLoading(true);

      const data = new FormData();

      // ------------------------------------------
      // BASIC INFORMATION
      // ------------------------------------------

      data.append(
        "name",
        formData.name.trim()
      );

      data.append(
        "category",
        formData.category.trim()
      );

      data.append(
        "shortDescription",
        formData.shortDescription.trim()
      );

      data.append(
        "description",
        formData.description.trim()
      );

      // ------------------------------------------
      // PRICING
      // ------------------------------------------

      data.append(
        "Mrp",
        String(formData.Mrp)
      );

      data.append(
        "SellingPrice",
        String(formData.SellingPrice)
      );

      data.append(
        "stock",
        String(formData.stock)
      );

      // ------------------------------------------
      // BENEFITS
      // Backend expects comma-separated string
      // ------------------------------------------

      const benefits = formData.benefits
        .filter(
          (item) =>
            item.trim() !== ""
        )
        .join(",");

      data.append(
        "benefits",
        benefits
      );

      // ------------------------------------------
      // INGREDIENTS
      // Backend expects comma-separated string
      // ------------------------------------------

      const ingredients =
        formData.ingredients
          .filter(
            (item) =>
              item.trim() !== ""
          )
          .join(",");

      data.append(
        "ingredients",
        ingredients
      );

      // ------------------------------------------
      // OTHER DETAILS
      // ------------------------------------------

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

      // ------------------------------------------
      // KEEP EXISTING IMAGES
      // ------------------------------------------

      const keepImageIds =
        existingImages.map(
          (image) => image.fileId
        );

      /*
        IMPORTANT:

        Your backend does:

        JSON.parse(keepImages)

        Therefore we MUST stringify
        the array.
      */

      data.append(
        "keepImages",
        JSON.stringify(keepImageIds)
      );

      // ------------------------------------------
      // ADD NEW IMAGES
      // ------------------------------------------

      newImages.forEach(
        (imageObject) => {
          data.append(
            "images",
            imageObject.file
          );
        }
      );

      // ------------------------------------------
      // API CALL
      // ------------------------------------------

      await updateProduct(
        productId,
        data
      );

      toast.success(
        "Product updated successfully"
      );

      // Cleanup new image previews
      newImages.forEach((image) => {
        if (image.preview) {
          URL.revokeObjectURL(
            image.preview
          );
        }
      });

      setNewImages([]);

      // Redirect
      navigate("/admin/products");

    } catch (error) {
      console.error(
        "Update product error:",
        error
      );

      const backendErrors =
        error.response?.data?.errors;

      if (
        backendErrors &&
        Array.isArray(backendErrors)
      ) {
        toast.error(
          backendErrors[0]?.msg ||
            "Please check the form"
        );
      } else {
        toast.error(
          error.response?.data?.message ||
            "Failed to update product"
        );
      }

    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // LOADING SCREEN
  // ==========================================

  if (pageLoading) {
    return (
      <section className="add-product-page">
        <div className="admin-page-loading">
          <div className="loading-spinner"></div>

          <p>
            Loading product...
          </p>
        </div>
      </section>
    );
  }

  // ==========================================
  // PAGE
  // ==========================================

  return (
    <section className="add-product-page">

      <div className="add-product-container">

        {/* ================================
            HEADER
        ================================= */}

        <div className="add-product-header">

          <div>
            <h1>
              Edit Product
            </h1>

            <p>
              Update your product
              information below.
            </p>
          </div>

        </div>

        <p className="required-note">
          <span className="required">
            *
          </span>{" "}
          Required fields
        </p>

        {/* ================================
            FORM
        ================================= */}

        <form
          onSubmit={handleSubmit}
        >

          {/* ==============================
              BASIC INFORMATION
          =============================== */}

          <ProductBasicInfo
            formData={formData}
            handleChange={
              handleChange
            }
          />

          {/* ==============================
              PRICING
          =============================== */}

          <ProductPricing
            formData={formData}
            handleChange={
              handleChange
            }
          />

          {/* ==============================
              FEATURES
          =============================== */}

          <ProductFeatures
            formData={formData}
            handleChange={
              handleChange
            }
            handleArrayChange={
              handleArrayChange
            }
            addArrayField={
              addArrayField
            }
            removeArrayField={
              removeArrayField
            }
          />

          {/* ==============================
              EXISTING + NEW IMAGES
          =============================== */}

          <div className="product-form-section">

            <h2>
              Product Images{" "}
              <span className="required">
                *
              </span>
            </h2>

            <p className="image-help-text">
              Keep your existing images,
              remove them, or upload
              new images. Maximum 6
              images.
            </p>

            {/* Upload */}

            {existingImages.length +
              newImages.length <
              6 && (
              <label className="image-upload-box">

                <ImagePlus
                  size={40}
                />

                <p>
                  Click to upload
                  images
                </p>

                <span>
                  JPG, PNG, WEBP
                  &nbsp; • &nbsp;
                  Maximum 6 images
                </span>

                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={
                    handleImageChange
                  }
                  hidden
                />

              </label>
            )}

            {/* ==========================
                EXISTING IMAGES
            =========================== */}

            {existingImages.length >
              0 && (
              <>

                <h3 className="image-subtitle">
                  Existing Images
                </h3>

                <div className="image-preview-grid">

                  {existingImages.map(
                    (
                      image,
                      index
                    ) => (
                      <div
                        className="image-card"
                        key={
                          image.fileId
                        }
                      >

                        {index ===
                          0 && (
                          <span className="cover-badge">
                            Cover
                          </span>
                        )}

                        <img
                          src={
                            image.url
                          }
                          alt={
                            image.fileName ||
                            `Product image ${
                              index + 1
                            }`
                          }
                        />

                        <button
                          type="button"
                          className="remove-image-btn"
                          onClick={() =>
                            removeExistingImage(
                              image.fileId
                            )
                          }
                          title="Remove image"
                        >
                          <Trash2
                            size={18}
                          />
                        </button>

                      </div>
                    )
                  )}

                </div>

              </>
            )}

            {/* ==========================
                NEW IMAGES
            =========================== */}

            {newImages.length >
              0 && (
              <>

                <h3 className="image-subtitle">
                  New Images
                </h3>

                <div className="image-preview-grid">

                  {newImages.map(
                    (
                      image,
                      index
                    ) => (
                      <div
                        className="image-card"
                        key={`${image.file.name}-${index}`}
                      >

                        <span className="cover-badge">
                          New
                        </span>

                        <img
                          src={
                            image.preview
                          }
                          alt={
                            image.file.name
                          }
                        />

                        <button
                          type="button"
                          className="remove-image-btn"
                          onClick={() =>
                            removeNewImage(
                              index
                            )
                          }
                          title="Remove image"
                        >
                          <Trash2
                            size={18}
                          />
                        </button>

                      </div>
                    )
                  )}

                </div>

              </>
            )}

            {/* Image Counter */}

            <div className="image-count">

              {existingImages.length +
                newImages.length}{" "}
              / 6 images

            </div>

          </div>

          {/* ==============================
              OPTIONS + SAVE
          =============================== */}

          <ProductOptions
            formData={formData}
            handleChange={
              handleChange
            }
            handleReset={
              handleReset
            }
            loading={loading}
          />

        </form>

      </div>

    </section>
  );
};

export default EditProduct;