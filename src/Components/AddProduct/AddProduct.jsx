import React, { useState, useEffect } from "react";
import axios from "axios";
import "./AddProduct.css";
import upload_area from "../../assets/upload_area.svg";
import cross_icon from "../../assets/cross_icon.png"

const AddProduct = ({ onClose, onProductAdded }) => {
  const [image, setImage] = useState(null);
  const [categories, setCategories] = useState([]);
  const [productDetails, setProductDetails] = useState({
    name: "",
    image:"",
    category: "",
    new_price: "",
    old_price: "",
  });
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  const imageHandler = (e) => {
    setImage(e.target.files[0]);
  };

  const productChangeHandler = (e) => {
    setProductDetails({ ...productDetails, [e.target.name]: e.target.value });
  };

  const categoryChangeHandler = (e) => {
    setProductDetails({ ...productDetails, category: e.target.value });
  };

  const fetchCategories = async () => {
    try {
      const response = await axios.get("http://localhost:8080/categories");
      setCategories(response.data);

      if (response.data.length > 0 && !productDetails.category) {
        setProductDetails({ ...productDetails, category: response.data[0].id });
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const AddProduct = async () => {
    try {
      const payload = {
        name: productDetails.name,
        new_price: productDetails.new_price,
        old_price: productDetails.old_price,
      };

      await axios.post(
        `http://localhost:8080/categories/${productDetails.category}/products`,
        payload
      );

      setProductDetails({
        ...productDetails,
        name: "",
        image:"",
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
          <img src={cross_icon} alt="" />
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
              alt=""
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
        <button onClick={AddProduct} className="addproduct-btn">
          ADD
        </button>
      </div>
    </div>
  );
};

export default AddProduct;
