import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";

const BookListPage = () => {
  const [books, setBooks] = useState([]);
  const [search, setSearch] = useState("");
  const [next, setNext] = useState(null);
  const [loading, setLoading] = useState(false);
  const location = useLocation();
  const category = location.state?.category || "";

  const fetchBooks = useCallback(
    async (url) => {
      setLoading(true);
      try {
        // Use provided URL or default URL
        const baseUrl = url || "http://skunkworks.ignitesol.com:8000/books";
        const fullUrl = new URL(baseUrl);

        // Append query parameters
        if (category) {
          fullUrl.searchParams.append("topic", category);
        }
        if (search) {
          fullUrl.searchParams.append("search", search);
        }

        console.log("Fetching from URL:", fullUrl.toString()); // Debugging line

        // Fetch data from the API
        const response = await axios.get(fullUrl.toString());

        console.log("API Response:", response.data); // Debugging line

        // Update the state with new books
        setBooks((prevBooks) => [...prevBooks, ...response.data.results]);

        // Set the `next` URL if available
        if (response.data.next) {
          setNext(response.data.next);
        } else {
          setNext(null); // No more pages
        }
      } catch (error) {
        console.error("Error fetching books:", error);
      } finally {
        setLoading(false);
      }
    },
    [category, search]
  );

  useEffect(() => {
    fetchBooks(); // Fetch books on component mount or when search term changes
  }, [fetchBooks]);

  // Fetch books initially
  useEffect(() => {
    fetchBooks(); // Fetch books on component mount or when search term changes
  }, [fetchBooks]);

  // Fetch more books when scrolling
  useEffect(() => {
    const handleScroll = (event) => {
      const { scrollTop, clientHeight, scrollHeight } =
        event.target.scrollingElement;
      if (scrollHeight - scrollTop <= clientHeight * 1.5 && next && !loading) {
        fetchBooks(next); // Fetch more books when scrolled near bottom
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [next, loading]);

  const handleSearchChange = (event) => {
    setSearch(event.target.value); // Update search term
  };

  const handleSearchSubmit = (event) => {
    event.preventDefault(); // Prevent form submission
    setBooks([]); // Clear existing books
    fetchBooks(); // Fetch new results
  };

  const handleBookClick = (formats) => {
    const preferredFormats = ["text/html", "text/pdf", "text/plain"];
    const availableFormat = preferredFormats.find((format) => formats[format]);

    if (availableFormat) {
      window.open(formats[availableFormat]);
    } else {
      alert("No viewable version available");
    }
  };

  return (
    <div>
      <form onSubmit={handleSearchSubmit}>
        <input
          type="text"
          value={search}
          onChange={handleSearchChange}
          placeholder="Search books..."
        />
        <button type="submit">Search</button>
      </form>
      <div className="container">
        {books.map((book, index) => (
          <div
            key={book.id || index}
            className="item"
            onClick={() => handleBookClick(book.formats)}
          >
            {book.formats["image/jpeg"] ? (
              <img src={book.formats["image/jpeg"]} alt={book.title} />
            ) : (
              <div>No Image</div>
            )}
            <div className="item-content">
              <h3>{book.title}</h3>
              <p>{book.author}</p>
            </div>
          </div>
        ))}
      </div>
      {loading && <p>Loading...</p>}
    </div>
  );
};

export default BookListPage;
