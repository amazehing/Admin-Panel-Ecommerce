import React, { useState, useEffect } from "react";
import axios from "axios";
import "./AddProduct.css";
import upload_area from "../../assets/upload_area.svg";
import cross_icon from "../../assets/cross_icon.png";

const AddProduct = ({ onClose, onProductAdded }) => {
  const axiosInstance = axios.create({
    baseURL: 'https://localhost:8443', auth: {
      username: 'admin', password: 'admin!password'
    }
  });
  const [image, setImage] = useState(null);
  const [categories, setCategories] = useState([]);
  const [productDetails, setProductDetails] = useState({
    name: "",
    image: "",
    category: "",
    new_price: "",
    old_price: "",
  });
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  const imageHandler = (e) => {
    const file = e.target.files[0];
    const maxSize = 50 * 1024 * 1024; // 50 MB

    if (file.size > maxSize) {
      alert("File size exceeds the maximum limit of 50MB");
      return;
    }

    setImage(file);
  };

  const productChangeHandler = (e) => {
    setProductDetails({ ...productDetails, [e.target.name]: e.target.value });
  };

  const categoryChangeHandler = (e) => {
    setProductDetails({ ...productDetails, category: e.target.value });
  };

  const fetchCategories = async () => {
    try {
      const response = await axiosInstance.get("/categories");
      setCategories(response.data);

      if (response.data.length > 0 && !productDetails.category) {
        setProductDetails({ ...productDetails, category: response.data[0].id });
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const fileUpload = async (file) => {
    try {
      const formData = new FormData();
      formData.append("file", file);
      const response = await axiosInstance.post(
        "/images",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return response.data; // Assuming response data is the ID of the uploaded image
    } catch (error) {
      console.error("Error uploading file:", error);
      throw error;
    }
  };

  const addProduct = async () => {
    try {
      let imageId = productDetails.image;
      if (image) {
        imageId = await fileUpload(image);
      }

      const payload = {
        name: productDetails.name,
        new_price: productDetails.new_price,
        old_price: productDetails.old_price,
        category: productDetails.category,
        imageIds: imageId ? [imageId] : []
      };

      await axiosInstance.post(
        `/categories/${productDetails.category}/products`,
        payload
      );

      // reset view
      setProductDetails({
        ...productDetails,
        name: "",
        image: "",
        new_price: "",
        old_price: "",
      });
      setImage(null);
      setShowSuccessMessage(true);
      onProductAdded();
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div className="add-product">
      <div className="add-product-inner">
        <button className="close-button" onClick={onClose}>
          <img src={cross_icon} alt="Close" />
        </button>
        <h2>Add Product</h2>
        {showSuccessMessage && <p>Product Added Successfully</p>}
        <div className="addproduct-itemfield">
          <p>Product title</p>
          <input
            value={productDetails.name}
            onChange={productChangeHandler}
            type="text"
            name="name"
            placeholder="Type here"
          />
        </div>
        <div className="addproduct-price">
          <div className="addproduct-itemfield">
            <p>Old Price</p>
            <input
              value={productDetails.old_price}
              onChange={productChangeHandler}
              type="text"
              name="old_price"
              placeholder="Type here"
            />
          </div>
          <div className="addproduct-itemfield">
            <p>New Price</p>
            <input
              value={productDetails.new_price}
              onChange={productChangeHandler}
              type="text"
              name="new_price"
              placeholder="Type here"
            />
          </div>
        </div>
        <div className="addproduct-itemfield">
          <p>Product Category</p>
          <select
            placeholder=""
            value={productDetails.category}
            onChange={categoryChangeHandler}
            name="category"
            className="add-product-selector"
          >
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
        <div className="addproduct-itemfield">
          <label htmlFor="file-input">
            <img
              src={image ? URL.createObjectURL(image) : upload_area}
              className="addproduct-thumbnail-img"
              alt="Upload Area"
            />
          </label>
          <input
            onChange={imageHandler}
            type="file"
            name="image"
            id="file-input"
            hidden
          />
        </div>
        <button onClick={addProduct} className="addproduct-btn">
          ADD
        </button>
      </div>
    </div>
  );
};

export default AddProduct;
