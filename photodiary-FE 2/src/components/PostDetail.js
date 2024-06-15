import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import Head from './Head';
import './PostDetail.css'; // 필요한 스타일 시트 추가

const PostDetail = () => {
	const { id } = useParams();
	const [post, setPost] = useState(null);
	const [error, setError] = useState(null);

	useEffect(() => {
		const fetchPost = async () => {
			try {
				const response = await axios.get(`http://localhost:8081/api/posts/${id}`);
				setPost(response.data);
			} catch (error) {
				setError('Error fetching post');
				console.error('Error fetching post:', error);
			}
		};

		fetchPost();
	}, [id]);

	if (error) {
		return <div>{error}</div>;
	}

	if (!post) {
		return <div>Loading...</div>;
	}

	return (
		<div className="container">
			<div id="wrapper">
				<Head />
				<div id="main">
					<article className="post">
						<header>
							<div className="title">
								<h2>{post.title}</h2>
								<p>{post.caption}</p>
							</div>
							<div className="meta">
								<time className="published" dateTime={post.createdDate}>{new Date(post.createdDate).toLocaleDateString()}</time>
								<a className="author">
									<span className="name">{post.authorId}</span>
									<img src={`data:image/jpeg;base64,${post.image}`} alt="" />
								</a>
							</div>
						</header>
						<div className="image featured"><img src={`data:image/jpeg;base64,${post.image}`} alt="" /></div>
						<p>{post.content}</p>
						<p>{Array.isArray(post.keywords) ? post.keywords.join(', ') : post.keywords}</p>
					</article>
				</div>
			</div>
		</div>
	);
}

export default PostDetail;
