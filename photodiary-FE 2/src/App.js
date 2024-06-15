import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Main from './components/Main';
import Login from './components/Login';
import UserList from './components/UserList';
import Messages from './components/Messages';
import MessageChat from './components/MessageChat';
import CreatePost from './components/CreatePost';
import Edit from './components/Edit';
import SignUp from './components/SignUp';
import Search from './components/Search';
import Home from './components/Home';
import PostDetail from './components/PostDetail';
import MyPage from './components/MyPage';
import MessageForm from './components/MessageForm'; // MessageForm 컴포넌트 임포트
import SendMessage from './components/SendMessage'; // 쪽지 보내기 컴포넌트 추가
import './App.css';

function App() {
  return (
      <Router>
        <div className="App">
          <Routes>
            <Route path="/" element={<Main />} />
            <Route path="/login" element={<Login />} />
            <Route path="/userlist" element={<UserList />} />
            <Route path="/messages" element={<Messages />} />
            <Route path="/messageChat" element={<MessageChat />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/edit" element={<Edit />} />
            <Route path="/search" element={<Search />} />
            <Route path="/home" element={<Home />} />
            <Route path="/createpost" element={<CreatePost />} />
            <Route path="/mypage" element={<MyPage />} />
            <Route path="/posts/:id" element={<PostDetail />} />
            <Route path="/message/:userId" element={<MessageForm />} />
            <Route path="/send-message/:userId" element={<SendMessage />} /> {/* 쪽지 보내기 라우트 추가 */}
          </Routes>
        </div>
      </Router>
  );
}

export default App;
