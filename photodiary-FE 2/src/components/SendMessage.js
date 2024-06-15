import React, { useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import './SendMessage.css';

const SendMessage = () => {
	const [content, setContent] = useState('');
	const [error, setError] = useState('');
	const [success, setSuccess] = useState('');
	const { userId } = useParams();
	const navigate = useNavigate();

	const handleSendMessage = async (event) => {
		event.preventDefault();
		try {
			const response = await axios.post(
				'http://localhost:8081/api/messages/',
				{
					recipientId: userId,
					content: content,
				},
				{ withCredentials: true }
			);

			if (response.status === 201) {
				setSuccess('메시지가 성공적으로 전송되었습니다.');
				setTimeout(() => {
					navigate('/messages'); // 메시지 전송 후 메시지 목록으로 리디렉션
				}, 2000);
			} else {
				setError('메시지 전송에 실패했습니다.');
			}
		} catch (error) {
			console.error('메시지 전송 중 오류 발생:', error);
			setError('서버와 통신 중 오류가 발생했습니다.');
		}
	};

	return (
		<div className="send-message">
			<h1>Send Message</h1>
			<form onSubmit={handleSendMessage}>
        <textarea
	        placeholder="Write your message here..."
	        value={content}
	        onChange={(e) => setContent(e.target.value)}
	        required
        />
				<button type="submit">Send</button>
			</form>
			{error && <div className="error">{error}</div>}
			{success && <div className="success">{success}</div>}
		</div>
	);
};

export default SendMessage;
