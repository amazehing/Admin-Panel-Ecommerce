import React, { useState, useEffect } from "react";
import axios from "axios";
import "./AddCategory.css";
import cross_icon from "..//../assets/cross_icon.png";

const AddCategory = () => {
  const [category, setCategory] = useState({
    name: "",
  });
  const [categories, setCategories] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [addedCategoryId, setAddedCategoryId] = useState(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await axios.get("http://localhost:8080/categories");
      const capitalizedCategories = response.data.map((cat) => ({
        ...cat,
        name: capitalize(cat.name),
      }));
      setCategories(capitalizedCategories);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const capitalize = (str) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  const changeHandler = (e) => {
    setCategory({ ...category, [e.target.name]: e.target.value });
  };

  const addCategory = async () => {
    if (category.name.trim() === "") {
      setErrorMessage("Please fill in a category name.");
      return;
    }

    try {
      const payload = { name: category.name };
      const response = await axios.post(
        "http://localhost:8080/categories",
        payload
      );
      setCategory({ name: "" });
      fetchCategories();
      setErrorMessage("");
      setAddedCategoryId(response.data.id);
      setSuccessMessage("Category Successfully Added!");
      setTimeout(() => {
        setSuccessMessage("");
        setAddedCategoryId(null);
      }, 2000);
    } catch (error) {
      console.error("Error adding category:", error);
    }
  };

  const deleteCategory = async (categoryId) => {
    try {
      const response = await axios.get(
        `http://localhost:8080/products?category=${categoryId}`
      );
      const productsToDelete = response.data;

      await Promise.all(
        productsToDelete.map(async (product) => {
          await axios.delete(`http://localhost:8080/products/${product.id}`);
        })
      );

      await axios.delete(`http://localhost:8080/categories/${categoryId}`);

      fetchCategories();
    } catch (error) {
      console.error("Error deleting category and associated products:", error);
    }
  };

  return (
    <div className="add-product">
      <div className="addproduct-itemfield">
        <p>Category name</p>
        <input
          value={category.name}
          onChange={changeHandler}
          type="text"
          name="name"
          placeholder="Type here"
        />
        <button onClick={addCategory} className="addproduct-btn">
          ADD
        </button>
        {errorMessage && <p className="error-message">{errorMessage}</p>}
        {successMessage && <p className="success-message">{successMessage}</p>}
      </div>
      <div className="categories-list">
        <h2 className="categories">Categories</h2>
        {categories.length === 0 ? (
          <p>No Categories Added</p>
        ) : (
          <ul>
            <hr />
            {categories.map((cat) => (
              <li
                key={cat.id}
                className={cat.id === addedCategoryId ? "added-category" : ""}
              >
                {cat.name}{" "}
                <button
                  className="delete-categories"
                  onClick={() => deleteCategory(cat.id)}
                >
                  <img className="cross-icon" src={cross_icon} alt="" />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default AddCategory;
