import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

const Navbar = ({ isLoggedIn }) => {
    return (
        <nav className="navbar">
            <div className="navbar-logo">
                <Link to="/">MySocial</Link>
            </div>
            <ul className="navbar-links">
                <li><Link to="/">Home</Link></li>
                {isLoggedIn ? (
                    <>
                        <li><Link to="/profile">Profile</Link></li>
                        <li><Link to="/posts">Posts</Link></li>
                        <li><Link to="/notifications">Notifications</Link></li>
                         <li><Link to="/logout">Logout</Link></li>
                            </>
                ) : (
                    <>
                        <li><Link to="/login">Login</Link></li>
                        <li><Link to="/register">Register</Link></li>
                    </>
                )}
            </ul>
        </nav>
    );
};

export default Navbar;
