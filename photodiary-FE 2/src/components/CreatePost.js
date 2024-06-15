import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './CreatePost.css';

const CreatePost = () => {
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [title, setTitle] = useState('');
  const [caption, setCaption] = useState('');
  const [keywords, setKeywords] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate(); // useNavigate 훅 초기화

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
      };
      reader.readAsDataURL(file);
      setImage(file);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!title || !caption) {
      setError('제목과 캡션을 입력해주세요.');
      return;
    }

    const formData = new FormData();
    if (image) {
      formData.append('image', image);
      console.log("image : "+ image)
    }
    formData.append('title', title);
    formData.append('caption', caption);

    // 키워드를 #을 기준으로 분리하여 배열로 저장
    const keywordArray = keywords.split(' ').filter(keyword => keyword.startsWith('#'));
    formData.append('keywords', JSON.stringify(keywordArray));

    try {
      const response = await axios.post('http://localhost:8081/api/posts/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        withCredentials: true // 세션 유지를 위한 옵션
      });

      console.log('Post submitted successfully:', response.data);
      navigate('/Home');
    } catch (error) {
      console.error('Error submitting post:', error);
      setError('포스트 제출 중 오류가 발생했습니다.');
    }
  };

  return (
      <div className="post-container">
        <div className="upload-section">
          <label htmlFor="upload-image">Upload Image</label>
          <input type="file" id="upload-image" name="upload-image" accept="image/*" onChange={handleImageChange} />
          {imagePreview && <img id="image-preview" className="image-preview" src={imagePreview} alt="Image Preview" />}
        </div>
        <div className="caption-section">
          <input
              type="text"
              id="title"
              name="title"
              placeholder="Enter title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
          />
          <textarea
              id="caption"
              name="caption"
              placeholder="Enter caption"
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              required
          ></textarea>
          <input
              type="text"
              id="keywords"
              name="keywords"
              placeholder="Enter keywords, please start with #"
              value={keywords}
              onChange={(e) => setKeywords(e.target.value)}
          />
          <br />
          <br />
          <button type="submit" onClick={handleSubmit}>Submit</button>
          {error && <div className="error">{error}</div>}
        </div>
      </div>
  );
};

export default CreatePost;
