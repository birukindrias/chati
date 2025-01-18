import React from 'react';
import './Profile.css';

const Profile = () => {
    return (
        <div className="profile">
            <div className="profile-header">
                <img src="/default-avatar.png" alt="Profile" className="profile-pic" />
                <h2>John Doe</h2>
                <p>Bio: Developer, Coffee Lover, Dreamer</p>
            </div>
            <div className="profile-posts">
                <h3>Your Posts</h3>
                <div className="post">
                    <p>Post content goes here...</p>
                </div>
                <div className="post">
                    <p>Another post content...</p>
                </div>
            </div>
        </div>
    );
};

export default Profile;
