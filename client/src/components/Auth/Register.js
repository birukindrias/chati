import { useNavigate } from 'react-router-dom';
import axios from 'axios';

import { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
const Register = () => {
  const navigate = useNavigate(); // Hook for navigation
  const [formData, setFormData] = useState({ username: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
};
  const handleRegister = async (e) => {
        e.preventDefault();

    try {
      const response = await axios.post('http://localhost:5000/api/register', formData);
      setSuccessMessage(response.data.message);
      console.log(response.data.token);
      let token = response.data.token;
      // Store the token in localStorage after successful registration (if JWT is returned)
      if (token) {

        localStorage.setItem('tokeni', token);
        console.log(response.data.toke);
        console.log('adsfdsfdsaf');
        console.log(token);
        
        
      }

      // Redirect to homepage after successful registration
      setTimeout(() => {
        navigate('/home'); // Redirect to home page
      }, 1000);
    } catch (error) {
      setError(error.response?.data?.error || 'Registration failed. Please try again.');
    }
  };

  return (
    <div>
      {/* Your registration form */}
      <form onSubmit={handleRegister}>
             <input name="username" placeholder="Username" onChange={handleChange} required />
             <input name="email" type="email" placeholder="Email" onChange={handleChange} required />
             <input name="password" type="password" placeholder="Password" onChange={handleChange} required />
           
             {error && <p>{error}</p>}
             {successMessage && <p>{successMessage}</p>}
<button type="submit">Register</button>
      {successMessage && <p>{successMessage}</p>}
      {error && <p>{error}</p>}
         </form>
    </div>
      
  );
};

export default Register;

// import { useState } from 'react';
// import axios from 'axios';
// import './reg.css'
// import { setUser } from '../context/userSlice';
// import { useNavigate } from 'react-router-dom';
// import { useDispatch } from 'react-redux';
// const Register = () => {
//     const [formData, setFormData] = useState({ username: '', email: '', password: '' });
//     const [error, setError] = useState('');
//     const [successMessage, setSuccessMessage] = useState('');
//     const dispatch = useDispatch();
//     const navigate = useNavigate();



//     const handleSubmit = async (e) => {
//         e.preventDefault();ype="submit"
//         try {
//             const response = await axios.post('http://localhost:5000/api/register', formData);
//             const { user, token } = response.data;

//             // Save the user and token in Redux
//             dispatch(setUser({ user, token }));

//             // Redirect to home page after successful registration
//             setTimeout(() => {
//                 navigate('/home');
//             }, 1000);

//             setSuccessMessage(response.data.message);
//         } catch (error) {
//             setError(error.response?.data?.error || 'Registration failed. Please try again.');
//         }
//     };

//     return (
//         <form onSubmit={handleSubmit}>
//             <input name="username" placeholder="Username" onChange={handleChange} required />
//             <input name="email" type="email" placeholder="Email" onChange={handleChange} required />
//             <input name="password" type="password" placeholder="Password" onChange={handleChange} required />
//             <button type="submit">Register</button>
//             {error && <p>{error}</p>}
//             {successMessage && <p>{successMessage}</p>}
//         </form>
//     );
// };
// export default Register;

// const Register = () => {
//     const [formData, setFormData] = useState({ username: '', email: '', password: '' });
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
//             const response = await axios.post('http://localhost:5000/api/register', formData);
//             setTimeout(() => {
//                 navigate('/home'); // Redirect to home page after successful registration
//             }, 1000);
//             setSuccessMessage(response.data.message);
//         } catch (error) {
//             setError(error.response?.data?.error || 'Registration failed. Please try again.');
//         }
//     };

//     return (
//         <div className="form-container">
//             <form onSubmit={handleSubmit}>
//                 <input
//                     name="username"
//                     placeholder="Username"
//                     onChange={handleChange}
//                     value={formData.username}
//                     required
//                 />
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
//                 <button type="submit">Register</button>
//             </form>
//         </div>
//     );
// };

// export default Register;
// // src/components/Auth/Register.js
// import React, { useState } from 'react';
// import { register } from '../../services/authService';
// import axios from 'axios';

// const Register = () => {
//     const [formData, setFormData] = useState({ username: '', email: '', password: '' });

//     const handleChange = (e) => {
//         setFormData({ ...formData, [e.target.name]: e.target.value });
//     };

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         try {
//             const response = await axios.post('http://localhost:5000/api/register', formData);
//             alert(response.data.message);
//         } catch (error) {
            
//             alert('Registration failed. Please try again.');
//         }
//     };

//     return (
//         <form onSubmit={handleSubmit}>
//             <input name="username" placeholder="Username" onChange={handleChange} required />
//             <input name="email" type="email" placeholder="Email" onChange={handleChange} required />
//             <input name="password" type="password" placeholder="Password" onChange={handleChange} required />
//             <button type="submit">Register</button>
//         </form>
//     );
// };

// export default Register;

// const Register = () => {
//     const [formData, setFormData] = useState({ username: '', email: '', password: '' });

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         try {
//             await register(formData);
//             alert('Registration successful!');
//         } catch (error) {
//             console.error('Registration failed:', error.response.data);
//         }
//     };

//     return (
//         <form onSubmit={handleSubmit}>
//             <input
//                 type="text"
//                 placeholder="Username"
//                 value={formData.username}
//                 onChange={(e) => setFormData({ ...formData, username: e.target.value })}
//             />
//             <input
//                 type="email"
//                 placeholder="Email"
//                 value={formData.email}
//                 onChange={(e) => setFormData({ ...formData, email: e.target.value })}
//             />
//             <input
//                 type="password"
//                 placeholder="Password"
//                 value={formData.password}
//                 onChange={(e) => setFormData({ ...formData, password: e.target.value })}
//             />
//             <button type="submit">Register</button>
//         </form>
//     );
// };

// export default Register;
