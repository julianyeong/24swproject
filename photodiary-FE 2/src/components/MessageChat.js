import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Head from './Head';
import './MessageChat.css'; // 스타일을 별도의 CSS 파일로 분리

const MessageChat = () => {
  const [messages, setMessages] = useState([]);
  const [messageContent, setMessageContent] = useState('');
  const [user, setUser] = useState('me'); // 사용자 이름 또는 ID

  useEffect(() => {
    loadMessages();
  }, []);

  const loadMessages = async () => {
    try {
      const response = await axios.get('http://localhost:8081/api/message/');
      if (Array.isArray(response.data)) {
        setMessages(response.data);
      } else {
        console.error('Expected an array but got:', response.data);
      }
    } catch (error) {
      console.error('Failed to load messages:', error);
    }
  };

  const sendMessage = async () => {
    if (messageContent.trim() === '') {
      return;
    }
    try {
      const message = {
        content: messageContent,
        user: user,
        sendAt: new Date().toISOString()
      };
      await axios.post('http://localhost:8081/api/message/', message, {
        headers: { 'Content-Type': 'application/json' },
      });
      setMessageContent('');
      loadMessages();
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  return (
      <div className="chat-container">
        <Head />
        <div className="message-list">
          {messages.map((message, index) => (
              <div className="message-item" key={index} style={{ textAlign: message.user === 'me' ? 'right' : 'left' }}>
                <span className="user-name">{message.user}</span>
                <span className="message-content">{message.content}</span>
                <span className="message-time">{new Date(message.sendAt).toLocaleString()}</span>
              </div>
          ))}
        </div>
        <div className="message-input-container">
          <input type="text" value={messageContent} onChange={(e) => setMessageContent(e.target.value)} placeholder="message..." />
          <button type="button" onClick={sendMessage}>Send</button>
        </div>
      </div>
  );
};

export default MessageChat;
