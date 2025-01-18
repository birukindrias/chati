// src/components/Posts/Feed.js
import React, { useEffect, useState } from 'react';
import { fetchPosts, createPost } from '../../services/postService';
import Post from './Post';

const Feed = () => {
    const [posts, setPosts] = useState([]);
    const [newPost, setNewPost] = useState('');

    const loadPosts = async () => {
        try {
            const response = await fetchPosts();
            setPosts(response.data);
        } catch (error) {
            console.error('Error fetching posts:', error.response.data);
        }
    };

    const handleNewPost = async () => {
        try {
            if (newPost.trim()) {
                await createPost({ content: newPost });
                setNewPost('');
                loadPosts(); // Refresh posts after creating a new one
            }
        } catch (error) {
            console.error('Error creating post:', error.response.data);
        }
    };

    useEffect(() => {
        loadPosts();
    }, []);

    return (
        <div className="feed">
            <div className="create-post">
                <textarea
                    placeholder="What's on your mind?"
                    value={newPost}
                    onChange={(e) => setNewPost(e.target.value)}
                />
                <button onClick={handleNewPost}>Post</button>
            </div>
            <div className="posts">
                {posts.map((post) => (
                    <Post key={post.id} post={post} refreshPosts={loadPosts} />
                ))}
            </div>
        </div>
    );
};

export default Feed;
