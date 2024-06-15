import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Login.css';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (event) => {
        event.preventDefault();

        try {
            const response = await axios.post(
                `http://localhost:8081/api/users/login?username=${username}&password=${password}`,
                {},
                { withCredentials: true }
            );

            if (response.status === 200) {
                console.log('로그인 성공:', response.data);
                navigate('/Home'); // 로그인 성공 후 리디렉션
            } else {
                setError('로그인에 실패했습니다. 아이디와 비밀번호를 확인해주세요.');
            }
        } catch (error) {
            console.error('로그인 요청 중 오류 발생:', error);
            setError('서버와 통신 중 오류가 발생했습니다.');
        }
    };

    return (
        <div className="login">
            <div className="left">
                <p>Login</p>
            </div>
            <div className="right">
                <div className="form-container">
                    <form onSubmit={handleLogin}>
                        <input
                            type="text"
                            placeholder="ID"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                        <input
                            type="password"
                            placeholder="PW"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                        <button type="submit">Login</button>
                    </form>
                    {error && <div className="error">{error}</div>}
                </div>
            </div>
        </div>
    );
};

export default Login;
