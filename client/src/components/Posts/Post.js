// src/components/Posts/Post.js
import React, { useState } from 'react';
import { likePost, commentOnPost } from '../../services/postService';

const Post = ({ post, refreshPosts }) => {
    const [comment, setComment] = useState('');

    const handleLike = async () => {
        try {
            await likePost(post.id);
            refreshPosts(); // Refresh posts after liking
        } catch (error) {
            console.error('Error liking post:', error.response.data);
        }
    };

    const handleComment = async () => {
        try {
            if (comment.trim()) {
                await commentOnPost(post.id, { comment });
                setComment('');
                refreshPosts(); // Refresh posts after commenting
            }
        } catch (error) {
            console.error('Error commenting:', error.response.data);
        }
    };

    return (
        <div className="post">
            <h3>{post.author}</h3>
            <p>{post.content}</p>
            <button onClick={handleLike}>Like ({post.likesCount})</button>
            <div>
                <input
                    type="text"
                    placeholder="Add a comment..."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                />
                <button onClick={handleComment}>Comment</button>
            </div>
            <div className="comments">
                {post.comments.map((c) => (
                    <p key={c.id}>
                        <strong>{c.author}:</strong> {c.content}
                    </p>
                ))}
            </div>
        </div>
    );
};

export default Post;
