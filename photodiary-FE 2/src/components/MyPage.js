import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Head from './Head';
import './Mypage.css';
import EditPostForm from './EditPostForm';
import { Link } from "react-router-dom";

const MyPage = () => {
	const [posts, setPosts] = useState([]);
	const [error, setError] = useState(null);
	const [editingPostId, setEditingPostId] = useState(null);

	useEffect(() => {
		const fetchPosts = async () => {
			try {
				const userResponse = await axios.get('http://localhost:8081/api/users/me', { withCredentials: true });
				const userId = userResponse.data.id;

				const postsResponse = await axios.get(`http://localhost:8081/api/posts/user/${userId}`, { withCredentials: true });
				setPosts(postsResponse.data);
			} catch (error) {
				setError('Error fetching posts');
				console.error('Error fetching posts:', error);
			}
		};

		fetchPosts();
	}, []);

	const handleEditClick = (postId) => {
		setEditingPostId(postId);
	};

	const handleCloseEditForm = () => {
		setEditingPostId(null);
	};

	const handleDelete = async (postId) => {
		try {
			await axios.delete(`http://localhost:8081/api/posts/${postId}`, { withCredentials: true });
			setPosts(posts.filter(post => post.id !== postId));
		} catch (error) {
			setError('Error deleting post');
			console.error('Error deleting post:', error);
		}
	};

	return (
		<div className="container">
			<div id="wrapper">
				<Head />
				<div id="main" className="scrollable-content">
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
										<Link to={`/posts/${post.id}`}>
											{post.title}
										</Link>
									</td>
									<td>{post.caption}</td>
									<td>{new Date(post.createdDate).toLocaleDateString()}</td>
									<td>{post.keywords}</td>
									<td>
										<button onClick={() => handleEditClick(post.id)} className="button small">
											Edit
										</button>
										<button onClick={() => handleDelete(post.id)} className="button small">
											Delete
										</button>
									</td>
								</tr>
							))}
							</tbody>
						</table>
					) : (
						<p>No posts available</p>
					)}
				</div>
			</div>
			{editingPostId && (
				<EditPostForm
					postId={editingPostId}
					onClose={handleCloseEditForm}
					onUpdate={() => {
						const fetchPosts = async () => {
							try {
								const userResponse = await axios.get('http://localhost:8081/api/users/me', { withCredentials: true });
								const userId = userResponse.data.id;

								const postsResponse = await axios.get(`http://localhost:8081/api/posts/user/${userId}`, { withCredentials: true });
								setPosts(postsResponse.data);
							} catch (error) {
								setError('Error fetching posts');
								console.error('Error fetching posts:', error);
							}
						};

						fetchPosts();
					}}
				/>
			)}
		</div>
	);
}

export default MyPage;
