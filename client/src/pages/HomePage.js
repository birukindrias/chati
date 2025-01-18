import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux'; // To access the Redux store
import './Home.css'
const Home = () => {
    const [posts, setPosts] = useState([]);
    const [newPost, setNewPost] = useState('');
    const [comment, setComment] = useState('');
    const [error, setError] = useState('');
    const userId = 1; // Replace with actual logged-in user's ID
    const navigate = useNavigate();

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/posts');
                setPosts(response.data);
                console.log(response.data);
                alert(response.data)
                
            } catch (error) {
                setError('Failed to fetch posts');
            }
        };

        fetchPosts();
    }, []);

    const handlePostChange = (e) => {
        setNewPost(e.target.value);
    };
    // const { token } = useSelector((state) => state.user); // Get the token from Redux store
    const token = localStorage.getItem('tokeni'); // Check for token in localStorage
alert(token)
    // const handlePostSubmit = async (content) => {
    //     content.preventDefault();
    //     alert(token)
    //     if (!token) {
    //         console.error('No token found');
    //         return;
    //     }

    //     try {
    //         const postData = { content }; // Ensure this is just the content string
    //         const response = await axios.post(
    //             'http://localhost:5000/api/posts',
    //             postData,
    //             {
    //                 headers: {
    //                     Authorization: `Bearer ${token}`, // Send the token in the Authorization header
    //                 },
    //             }
    //         );
    //         console.log('Post created successfully:', response.data);
    //     } catch (error) {
    //         console.error('Error creating post:', error.response?.data?.error || error.message);
    //     }
    // };
    // const { token } = useSelector((state) => state.user); // Get the token from Redux store

    const handlePostSubmit = async (content) => {
        console.log(content);
        console.log(`Authorization: Bearer ${token}`);
        
        content.preventDefault()
        if (!token) {
            console.error('No token found');
            return;
        }
    
        try {
            const response = await axios.post(
                'http://localhost:5000/api/posts',
                { 'title':'newPost','body':'newPost',user_id:44 },
                {
                    headers: {
                        Authorization: `Bearer ${token}`, // Send the token in the Authorization header
                    },
                }
            );
            console.log('Post created successfully:', response.data);
        } catch (error) {
            console.error('Error creating post:', error.response?.data?.error || error.message);
        }
    };
    
    const handlePostSubmits = async (e) => {


        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:5000/api/posts', {
                user_id: userId,
                content: newPost,
            });
            setPosts([response.data, ...posts]);
            setNewPost('');
        } catch (error) {
            setError('Failed to create post');
        }
    };

    const handleLike = async (postId) => {
        try {
            await axios.post(`http://localhost:5000/api/posts/${postId}/like`, {
                user_id: userId,
            });
            // Update the post like count after liking
            alert(posts)
            setPosts(posts.map(post => post.id === postId ? { ...post, like_count: post.like_count + 1 } : post));
        } catch (error) {
            setError('Failed to like post');
        }
    };

    const handleCommentSubmit = async (postId) => {
        try {
            const response = await axios.post(`http://localhost:5000/api/posts/${postId}/comment`, {
                user_id: userId,
                content: comment,
            });
            setPosts(posts.map(post => post.id === postId ? { ...post, comment_count: post.comment_count + 1 } : post));
            setComment('');
        } catch (error) {
            setError('Failed to comment on post');
        }
    };

    return (
        <div className="home-container">
            <h1>Welcome to the Home Page</h1>

            <form onSubmit={handlePostSubmit}>
                <textarea
                    value={newPost}
                    onChange={handlePostChange}
                    placeholder="What's on your mind?"
                    required
                />
                <button type="submit">Post</button>
            </form>

            {error && <div className="error-message">{error}</div>}

            <div className="posts">
                {posts.map(post => (
                    <div key={post.id} className="post">
                        <div className="post-header">
                            <h3>{post.title}</h3>
                            <p>{post.body}</p>
                            <p>{new Date(post.created_at).toLocaleString()}</p>
                        </div>
                        <p>{post.content}</p>

                        <div className="post-actions">
                            <button onClick={() => handleLike(post.id)}>Like ({post.like_count})</button>
                            <button onClick={() => setComment(post.id)}>Comment</button>
                        </div>

                        <div className="comments">
                            {post.comment_count > 0 && (
                                <div>
                                    <strong>{post.comment_count} Comments</strong>
                                    {/* Display comments here */}
                                </div>
                            )}
                            <form onSubmit={() => handleCommentSubmit(post.id)}>
                                <textarea
                                    value={comment}
                                    onChange={(e) => setComment(e.target.value)}
                                    placeholder="Write a comment..."
                                    required
                                />
                                <button type="submit">Comment</button>
                            </form>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Home;
// import React from 'react';
// import { Link } from 'react-router-dom';
// import './Home.css';

// const Home = () => {
//     return (
//         <div className="home">
//             <h1>Welcome to MySocial</h1>
//             <p>Connect with friends, share your moments, and explore content!</p>
//             <div className="home-buttons">
//                 <Link to="/login" className="btn">Login</Link>
//                 <Link to="/register" className="btn">Register</Link>
//             </div>
//         </div>
//     );
// };

// export default Home;
