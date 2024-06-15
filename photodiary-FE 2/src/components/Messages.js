import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Messages.css';

const Messages = () => {
  const [messages, setMessages] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await axios.get('http://localhost:8081/api/messages/received', {
          withCredentials: true,
        });
        setMessages(response.data);
      } catch (error) {
        setError(error);
        console.error('Error fetching messages:', error);
      }
    };

    fetchMessages();
  }, []);

  const handleDelete = async (messageId) => {
    try {
      await axios.delete(`http://localhost:8081/api/messages/${messageId}`, {
        withCredentials: true,
      });
      setMessages(messages.filter(message => message.id !== messageId));
    } catch (err) {
      if (err.response && err.response.status === 403) {
        alert('You do not have permission to delete this message.');
      } else {
        alert('Error deleting message');
      }
    }
  };

  const handleReply = (senderId) => {
    navigate(`/message/${senderId}`);
  };

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
      <div className="messages-container">
        <h1>Messages</h1>
        <table className="message-table">
          <thead>
          <tr>
            <th>From</th>
            <th>Content</th>
            <th>Actions</th>
          </tr>
          </thead>
          <tbody>
          {messages.map(message => (
              <tr key={message.id} className="message-item">
                <td className="message-user">{message.sender.username}</td>
                <td className="message-content">{message.content}</td>
                <td className="message-actions">
                <span className="message-status">
                  {message.isRead ? <span className="read-dot"></span> : <span className="unread-dot"></span>}
                </span>
                  <button className="delete-button" onClick={() => handleDelete(message.id)}>🗑️</button>
                  <button className="reply-button" onClick={() => handleReply(message.sender.id)}>Reply</button>
                </td>
              </tr>
          ))}
          </tbody>
        </table>
      </div>
  );
};

export default Messages;
