import React, { useEffect, useState } from "react";
import "./ListProduct.css";
import cross_icon from "..//../assets/cross_icon.png";
import AddProduct from "../AddProduct/AddProduct";

const ListProduct = () => {
  const [allproducts, setAllProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("");

  const fetchInfo = async () => {
    try {
      const response = await fetch("http://localhost:8080/products");
      const data = await response.json();

      const products = data.map((item) => ({
        id: item.id,
        name: item.name,
        new_price: item.new_price,
        old_price: item.old_price,
        category_name: item.category.name,
        category_id: item.category.id,
        images: item.images,
      }));

      setAllProducts(products);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch("http://localhost:8080/categories");
      const data = await response.json();
      setCategories(data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  useEffect(() => {
    fetchInfo();
    fetchCategories();
  }, []);

  const removeProduct = async (id) => {
    try {
      await fetch(`http://localhost:8080/products/${id}`, {
        method: "DELETE",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      });

      await fetchInfo();
    } catch (error) {
      console.error("Error removing product:", error);
    }
  };

  const handleProductAdded = () => {
    fetchInfo();
  };

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
  };

  const filteredProducts = selectedCategory
    ? allproducts.filter(
        (product) => product.category_id === parseInt(selectedCategory)
      )
    : allproducts;

  return (
    <div className="list-product">
      <h1>All Products List</h1>
      {showModal ? (
        <span className="close" onClick={() => setShowModal(false)}>
          <img src={cross_icon} alt="Close" />
        </span>
      ) : (
        <button className="plus-button" onClick={() => setShowAddModal(true)}>
          <p className="p-plus">Add Product</p>+
        </button>
      )}
      {showAddModal && (
        <div className="modal">
          <div className="modal-content">
            <span
              className="close"
              onClick={() => setShowAddModal(false)}
            ></span>
            <AddProduct
              onClose={() => setShowAddModal(false)}
              onProductAdded={handleProductAdded}
            />
          </div>
        </div>
      )}
      <div>
        <label htmlFor="category">Filter by Category: </label>
        <select
          className="category-select"
          id="category"
          value={selectedCategory}
          onChange={handleCategoryChange}
        >
          <option value="">All</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
      </div>
      <div className="listproduct-format-main">
        <p>Products</p>
        <p>Title</p>
        <p>Old Price</p>
        <p>New Price</p>
        <p>Category</p>
        <p>Remove</p>
      </div>
      <div className="listproduct-allproducts">
        <hr />
        {filteredProducts.map((product, index) => (
          <React.Fragment key={index}>
            <div className="listproduct-format-main listproduct-format">
              <p>
                {product.images?.[0] && (
                  <img
                    className="listproduct-product-icon"
                    src={`http://localhost:8080/images/${product.images[0].id}`}
                    alt="Product"
                  />
                )}
              </p>
              <p>{product.name}</p>
              <p>€{product.old_price}</p>
              <p>€{product.new_price}</p>
              <p>{product.category_name}</p>
              <img
                onClick={() => {
                  removeProduct(product.id);
                }}
                className="listproduct-remove-icon"
                src={cross_icon}
                alt="Remove"
              />
            </div>
            <hr />
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default ListProduct;
