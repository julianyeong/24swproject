import React, { useState } from 'react';
import axios from 'axios';
import './Search.css';

const Search = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState([]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSearchSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.get('http://localhost:8081/api/posts/search', {
        params: { keywords: searchTerm }
      });
      setResults(response.data.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)));
    } catch (error) {
      console.error('Error fetching search results:', error);
    }
  };

  return (
      <div className="search-container">
        <form onSubmit={handleSearchSubmit} className="search-form">
          <input
              type="text"
              placeholder="Search by keyword"
              value={searchTerm}
              onChange={handleSearchChange}
          />
          <button type="submit">Search</button>
        </form>
        <div className="search-results">
          {results.length > 0 ? (
              results.map(post => (
                  <div key={post.id} className="post">
                    <img src={"/img/" + post.original} alt="Post"/>
                    <h2>제목 : {post.title}</h2>
                    <p>내용 : {post.caption}</p>
                    <p>태그 : {post.keywords}</p>
                  </div>
              ))
          ) : (
              <p>No results found</p>
          )}
        </div>

      </div>

  );
};

export default Search;
