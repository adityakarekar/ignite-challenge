import React from "react";
import { useNavigate } from "react-router-dom";
import "./CategoryPage.css";

const CategoryPage = () => {
  const navigate = useNavigate();
  const categories = ["Fiction", "Science", "History"];

  const handleCategoryClick = (category) => {
    navigate("/books", { state: { category } });

    console.log(category);
  };

  return (
    <div className="category-page">
      <h1>Book Categories</h1>
      <div className="category-buttons">
        {categories.map((category) => (
          <button key={category} onClick={() => handleCategoryClick(category)}>
            {category}
          </button>
        ))}
      </div>
    </div>
  );
};

export default CategoryPage;
