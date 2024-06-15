import React, { useState, useEffect } from 'react';
import Head from './Head';
import axios from 'axios';

const Edit = ({ searchTerm }) => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:8081/api/posts')
      .then(response => {
        setPosts(response.data);
      })
      .catch(error => {
        console.error('Error fetching posts data:', error);
      });
  }, []);

  const filteredPosts = posts.filter(post =>
    post.tags.includes(searchTerm)
  );

  return (
    <div className="edit-posts">
      <div className="container">
      <Head />
      {filteredPosts.map(post => (
        <div className="edit-post" key={post._id}>
          <div className="edit-post-header">
            <div className="edit-post-image">
              <img src={post.image} alt="Post" />
            </div>
            <textarea 
              name="content"
              value={post.content}
              className="edit-post-content"
              readOnly
            />
          </div>
          <div className="edit-post-tags">
            <input 
              type="text"
              name="tags"
              value={post.tags}
              readOnly
            />
          </div>
        </div>
      ))}
      {/* <section id="sidebar">
        <section id="intro">
          <header>
            <h2>Photo Diary</h2>
          </header>
        </section>
      </section> */}
    </div>
    </div>
  );
}

export default Edit;
