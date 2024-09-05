import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import CategoryPage from "./components/CategoryPage";
import BookListPage from "./components/BookListPage";
import "./App.css";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<CategoryPage />} />
        <Route path="/books" element={<BookListPage />} />
      </Routes>
    </Router>
  );
};

export default App;
