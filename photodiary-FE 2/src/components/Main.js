import React from 'react';
import './Main.css';
import { Link } from 'react-router-dom';

const Main = () => {
  return (

    <div className="main">
      <h1>Photo Diary</h1>
      <p>If you want to see friend's photos, sign up our website</p>
      <Link to="/signup">
        <button>Sign Up</button>
      </Link>
      <Link to="/login">
        <button>Login</button>
      </Link>
      <p>Don't want to sign up? Then you can see userlist!</p>
      <Link to="/userlist">
        <button>User List</button>
      </Link>
    </div>

  );
};

export default Main;
