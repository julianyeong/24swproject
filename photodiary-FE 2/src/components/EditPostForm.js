import React, { useState, useEffect } from 'react';
import axios from 'axios';

const EditPostForm = ({ postId, onClose, onUpdate }) => {
	const [post, setPost] = useState({
		title: '',
		caption: '',
		keywords: '',
		image: null
	});

	useEffect(() => {
		const loadPost = async () => {
			try {
				const response = await axios.get(`http://localhost:8081/api/posts/${postId}`);
				setPost(response.data);
			} catch (error) {
				console.error('Failed to load post:', error);
			}
		};

		loadPost();
	}, [postId]);

	const handleChange = (e) => {
		const { name, value } = e.target;
		setPost((prevPost) => ({
			...prevPost,
			[name]: value,
		}));
	};

	const handleImageChange = (e) => {
		setPost((prevPost) => ({
			...prevPost,
			image: e.target.files[0],
		}));
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		const formData = new FormData();
		formData.append('title', post.title);
		formData.append('caption', post.caption);
		formData.append('keywords', post.keywords);
		if (post.image) {
			formData.append('image', post.image);
		}

		try {
			await axios.put(`http://localhost:8081/api/posts/${postId}`, formData, {
				headers: { 'Content-Type': 'multipart/form-data' },
				withCredentials: true,
			});
			onUpdate();
			onClose();
		} catch (error) {
			console.error('Failed to update post:', error);
		}
	};

	return (
		<div className="edit-post-form">
			<form onSubmit={handleSubmit}>
				<div>
					<label>Title</label>
					<input type="text" name="title" value={post.title} onChange={handleChange} />
				</div>
				<div>
					<label>Caption</label>
					<input type="text" name="caption" value={post.caption} onChange={handleChange} />
				</div>
				<div>
					<label>Keywords</label>
					<input type="text" name="keywords" value={post.keywords} onChange={handleChange} />
				</div>
				<div>
					<label>Image</label>
					<input type="file" onChange={handleImageChange} />
				</div>
				<button type="submit">Update</button>
				<button type="button" onClick={onClose}>Cancel</button>
			</form>
		</div>
	);
};

export default EditPostForm;
