// src/pages/ProfilePage.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const ProfilePage = () => {
  const { userId } = useParams();
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    axios.get(`http://localhost:5000/api/users/${userId}`)  // Replace with your backend API
      .then(response => setUser(response.data))
      .catch(error => console.error(error));

    axios.get(`http://localhost:5000/api/posts/user/${userId}`)
      .then(response => setPosts(response.data))
      .catch(error => console.error(error));
  }, [userId]);

  return (
    <div>
      {user && (
        <>
          <h1>{user.name}'s Profile</h1>
          <p>{user.bio}</p>
        </>
      )}
      <h2>Posts</h2>
      {posts.map(post => (
        
        <div key={post._id}>
          <p>{post.content}</p>
        </div>
      ))}
    </div>
  );
};

export default ProfilePage;
