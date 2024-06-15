import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Head from './Head';
import './Home.css';
import { Link, useNavigate } from 'react-router-dom';

const Home = () => {
    const [posts, setPosts] = useState([]);
    const [error, setError] = useState(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const response = await axios.get('http://localhost:8081/api/posts/');
                setPosts(response.data);
            } catch (error) {
                setError('게시물을 가져오는 중 오류가 발생했습니다.');
                console.error('게시물을 가져오는 중 오류 발생:', error);
            }
        };

        fetchPosts();
        checkLoginStatus();
    }, []);

    const checkLoginStatus = async () => {
        try {
            const response = await axios.get('http://localhost:8081/api/users/check', { withCredentials: true });
            setIsLoggedIn(response.data);
        } catch (error) {
            console.error('로그인 상태 확인 중 오류 발생:', error);
            setIsLoggedIn(false);
        }
    };

    const handleSendMessage = (userId) => {
        navigate(`/send-message/${userId}`);
    };

    return (
        <div className="container">
            <div id="wrapper">
                <Head />
                <div id="main">
                    {error && <p>{error}</p>}
                    {posts.length > 0 ? (
                        <table className="posts-table">
                            <thead>
                            <tr>
                                <th>이미지</th>
                                <th>제목</th>
                                <th>내용</th>
                                <th>작성시간</th>
                                <th>키워드</th>
                                <th>Actions</th>
                            </tr>
                            </thead>
                            <tbody>
                            {posts.map(post => (
                                <tr key={post.id}>
                                    <td>
                                        <img src={"/img/" + post.original} alt="Post" style={{width: '100px', borderRadius: '10px'}} />
                                    </td>
                                    <td>
                                            {post.title}
                                    </td>
                                    <td>{post.caption}</td>
                                    <td>{new Date(post.createdDate).toLocaleDateString()}</td>
                                    <td>{post.keywords}</td>
                                    <td>
                                        <button onClick={() => handleSendMessage(post.authorId)} className="button small">
                                            쪽지 보내기
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    ) : (
                        <p>사용할 수 있는 게시물이 없습니다.</p>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Home;
