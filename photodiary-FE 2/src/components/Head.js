import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import './Head.css';
import axios from "axios";

const Head = ({ onSearch }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const navigate = useNavigate();

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(searchTerm);
    } else {
      console.error("onSearch prop is not provided");
    }
  };

  const handleLogout = async () => {
    // 로그아웃 로직을 여기에 추가합니다.
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("email");
    sessionStorage.removeItem("storeid");

    try {
      await axios.post('http://localhost:8081/api/users/logout');
    } catch (error) {
      console.error('Error logging out:', error);
    }

    // 페이지 이동
    navigate("/");
  };

  return (
    <header className="head">
      <div className={`hamburger ${menuOpen ? 'open' : ''}`} onClick={toggleMenu}>
        <div className="bar"></div>
        <div className="bar"></div>
        <div className="bar"></div>
      </div>
      <nav className={`nav ${menuOpen ? 'open' : ''}`}>
        <ul>
          <li><a href="/messages">Message</a></li>
          <li><a href="/createpost">Upload</a></li>
          <li><a href="/search">Search</a></li>
          <li><a href="/userlist">User List</a></li>
          <li><a href="/MyPage">My Page</a></li>
        </ul>
        <button onClick={handleLogout} className="logout-button">Log out</button>
      </nav>
    </header>
  );
};

export default Head;
