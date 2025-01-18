import React from 'react';
import './Posts.css';

// const Posts = () => {
//     return (
//         <div className="posts">
//             <h2>Posts Feed</h2>
//             <div className="post">
//                 <p>Post content goes here...</p>
//                 <div className="post-actions">
//                     <button>Like</button>
//                     <button>Comment</button>
//                 </div>
//             </div>
//             <div className="post">
//                 <p>Another post content...</p>
//                 <div className="post-actions">
//                     <button>Like</button>
//                     <button>Comment</button>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default Posts;


import { useState, useEffect } from 'react';
import axios from 'axios';

const Posts = ({ token }) => {
    const [posts, setPosts] = useState([]);
    const [content, setContent] = useState('');

    useEffect(() => {
        const fetchPosts = async () => {
            const response = await axios.get('http://localhost:5000/api/posts');
            setPosts(response.data);
        };
        fetchPosts();
    }, []);

    const handlePost = async () => {
        try {
            const response = await axios.post('http://localhost:5000/api/posts', { token, content });
            setPosts([response.data.post, ...posts]);
            setContent('');
        } catch (error) {
            alert('Failed to create post.');
        }
    };

    return (
        <div>
            <textarea value={content} onChange={(e) => setContent(e.target.value)} placeholder="Write a post..." />
            <button onClick={handlePost}>Post</button>
            <div>
                {posts.map((post) => (
                    <div key={post.id}>

                        the posts
                        <p><strong>{post.title}</strong>: {post.body}</p>
                        <p><strong>{post.title}</strong>: {post.body}</p>
                        <small>{new Date(post.created_at).toLocaleString()}{post.title}</small>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Posts;
