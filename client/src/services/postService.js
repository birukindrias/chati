// src/services/postService.js
import axios from 'axios';

const API_URL = 'http://localhost:5000';

export const fetchPosts = () => axios.get(`${API_URL}/posts`);
export const createPost = (data) => axios.post(`${API_URL}/posts`, data, {
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
});
export const likePost = (postId) => axios.post(`${API_URL}/posts/${postId}/like`, {}, {
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
});
export const commentOnPost = (postId, data) => axios.post(`${API_URL}/posts/${postId}/comment`, data, {
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
});
