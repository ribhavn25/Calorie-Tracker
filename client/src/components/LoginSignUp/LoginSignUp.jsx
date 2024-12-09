import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './LoginSignUp.css';
import user_icon from '../assets/person.png';
import email_icon from '../assets/email.png';
import password_icon from '../assets/password.png';

const LoginSignUp = ({ setIsLoggedIn }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [action, setAction] = useState('Register');
  const navigate = useNavigate();

  const handleSubmit = async () => {
    try {
      if (action === 'Register') {
        alert('Registration successful');
      } else {
        const response = await axios.post('http://localhost:3001/api/auth/login', { email, password });
        const token = response.data.token;
        
        if (token) {
          localStorage.setItem('token', token);
          setIsLoggedIn(true);
          navigate('/dashboard');
        } else {
          alert('Login failed: No token returned.');
        }
      }
    } catch (error) {
      // Show the server's message if available, otherwise show a generic error
      alert(error.response?.data?.msg || 'An error occurred. Please try again.');
    }
  };

  return (
    <div className="container">
      <div className="header">
        <div className="text">{action}</div>
        <div className="underline"></div>
      </div>
      <div className="inputs">
        {action === "Register" && (
          <div className="input">
            <img src={user_icon} alt="User Icon" />
            <input
              type="text"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
        )}
        <div className="input">
          <img src={email_icon} alt="Email Icon" />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="input">
          <img src={password_icon} alt="Password Icon" />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
      </div>
      <div className="submit-container">
        <div className={action === "Login" ? "submit gray" : "submit"} onClick={() => setAction("Register")}>
          Register
        </div>
        <div className={action === "Register" ? "submit gray" : "submit"} onClick={() => setAction("Login")}>
          Login
        </div>
        <button className="submit" onClick={handleSubmit}>
          {action}
        </button>
      </div>
    </div>
  );
};

export default LoginSignUp;