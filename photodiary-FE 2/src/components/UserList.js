import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './UserList.module.css'; // 스타일을 별도의 CSS 파일로 분리

const UserList = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('http://localhost:8081/api/users/');
        setUsers(response.data);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchUsers();
  }, []);

  return (
    <div className="container">
      <h1>User List</h1>
      <div className="user-container">
        {users.map((user, index) => (
          <div className="user-card" key={index}>
            <div>
              <h3>유저이름: {user.username}</h3>
              <p>유저 이메일: {user.email}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserList;
