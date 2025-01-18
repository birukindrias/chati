import axios from 'axios';
import { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleLogin = async () => {
    try {
      const response = await axios.post('http://localhost:5000/api/login', formData);
      setSuccessMessage(response.data.message);
      
      // Store the token in localStorage after successful login
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
      }

      // Redirect to homepage after successful login
      setTimeout(() => {
        navigate('/home'); // Redirect to home page
      }, 1000);
    } catch (error) {
      setError(error.response?.data?.error || 'Login failed. Please try again.');
    }
  };

  return (
    <div>
      {/* Your login form */}
      <button onClick={handleLogin}>Login</button>
      {successMessage && <p>{successMessage}</p>}
      {error && <p>{error}</p>}
    </div>
  );
};

export default Login;


// const Login = () => {
//     const [formData, setFormData] = useState({ email: '', password: '' });
//     const [error, setError] = useState('');
//     const [successMessage, setSuccessMessage] = useState('');
//     const navigate = useNavigate();

//     const handleChange = (e) => {
//         setFormData({ ...formData, [e.target.name]: e.target.value });
//     };

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         setError(''); // Reset error message before submitting

//         try {
//             const response = await axios.post('http://localhost:5000/api/login', formData);
//             setSuccessMessage(response.data.message);
//             setTimeout(() => {
//                 navigate('/home'); // Redirect to home page after successful login
//             }, 1000); // Delay the redirect to show the success message
//         } catch (error) {
//             setError(error.response?.data?.error || 'Login failed. Please try again.');
//         }
//     };

//     return (
//         <div className="form-container">
//             <form onSubmit={handleSubmit}>
//                 <input
//                     name="email"
//                     type="email"
//                     placeholder="Email"
//                     onChange={handleChange}
//                     value={formData.email}
//                     required
//                 />
//                 <input
//                     name="password"
//                     type="password"
//                     placeholder="Password"
//                     onChange={handleChange}
//                     value={formData.password}
//                     required
//                 />
//                 {error && <div className="error-message">{error}</div>}
//                 {successMessage && <div className="success-message">{successMessage}</div>}
//                 <button type="submit">Login</button>
//             </form>
//         </div>
//     );
// };

// export default Login;

// // src/components/Auth/Login.js
// import React, { useState } from 'react';
// import { login } from '../../services/authService';

// const Login = () => {
//     const [email, setEmail] = useState('');
//     const [password, setPassword] = useState('');

//     const handleLogin = async () => {
//         try {
//             const response = await login({ email, password });
//             console.log('Logged in:', response.data);
//         } catch (error) {
//             console.error('Login failed:', error.response.data);
//         }
//     };

//     return (
//         <div>
//             <h1>Login</h1>
//             <input
//                 type="email"
//                 placeholder="Email"
//                 value={email}
//                 onChange={(e) => setEmail(e.target.value)}
//             />
//             <input
//                 type="password"
//                 placeholder="Password"
//                 value={password}
//                 onChange={(e) => setPassword(e.target.value)}
//             />
//             <button onClick={handleLogin}>Login</button>
//         </div>
//     );
// };

// export default Login;
