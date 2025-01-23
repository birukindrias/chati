import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import HomePage from './pages/HomePage';

import HomeGust from './pages/HomeGust';
import ProfilePage from './pages/ProfilePage';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import Feed from './components/Posts/Feed';
import Navbar from './components/Notifications/Notifications';

import Posts from './components/Posts/Posts';

import { Provider } from 'react-redux'; // Import Provider from react-redux
import store from './components/context/store'; // Import the store (make sure this path is correct)

import Profile from './components/Profile/Profile';
import Notifications from './components/Notifications/Notifications';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import Db from './pages/db/db';
// const { token } = useSelector((state) => state.user);
let logval = true;
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('tokeni'); // Check for token in localStorage
  alert(token)
  if (!token) {
    return <Navigate to="/login" />;
  }
  logval = true;
  alert(logval)
  return children;
};

const App = () => {
  useEffect(() => {


    alert('asdf');
  }, []);

  return (

    <Provider store={store}> {/* Wrap your app with Provider */}
      <Router>
        {/* <Header /> */}
        <Navbar isLoggedIn={logval} />
        <Routes>
          <Route path="/home" element={<ProtectedRoute><HomePage /></ProtectedRoute>} />

          <Route path="/profile" element={<Profile />} />
          <Route path="/posts" element={<Posts />} />
          <Route path="/db" element={<Db />} />

          <Route path="/" element={<HomeGust />} />
          <Route path="/profile/:userId" element={<ProfilePage />} />
          <Route path="/" element={<Feed />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/profile/:id" element={<Profile />} />
          <Route path="/notifications" element={<Notifications />} />
        </Routes>
      </Router>
    </Provider>

  );
};

export default App;
