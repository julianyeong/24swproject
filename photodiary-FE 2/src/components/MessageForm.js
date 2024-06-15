import React, { useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const MessageForm = () => {
	const { userId } = useParams();
	const [content, setContent] = useState('');
	const navigate = useNavigate();

	const handleSendMessage = async (e) => {
		e.preventDefault();
		try {
			await axios.post('http://localhost:8081/api/messages/', { recipientId: userId, content }, { withCredentials: true });
			alert('메시지가 전송되었습니다.');
			navigate('/home'); // 메시지 전송 후 홈으로 이동
		} catch (error) {
			console.error('메시지 전송 중 오류 발생:', error);
			alert('메시지 전송 중 오류가 발생했습니다.');
		}
	};

	return (
		<div className="message-form-container">
			<h2>쪽지 보내기</h2>
			<form onSubmit={handleSendMessage}>
        <textarea
	        value={content}
	        onChange={(e) => setContent(e.target.value)}
	        placeholder="메시지를 입력하세요..."
	        required
        />
				<button type="submit">전송</button>
			</form>
		</div>
	);
};

export default MessageForm;
