import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const CreateAccount = () => {
  const [formData, setFormData] = useState({
    Username: '',
    Password: '',
  });

  const [message, setMessage] = useState('');
  const navigate = useNavigate(); // Hook for navigation

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:3000/register', formData);
      alert('User registered successfully!');
      setFormData({ Username: '', Password: '' }); // Reset form
      navigate('/login'); // Redirect to login page
    } catch (error) {
      console.error('Error registering user:', error);
      setMessage('Error registering user. Please try again.');
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>Create Account</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Username:</label>
          <input
            type="text"
            name="Username"
            value={formData.Username}
            onChange={handleInputChange}
            required
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            type="password"
            name="Password"
            value={formData.Password}
            onChange={handleInputChange}
            required
          />
        </div>
        <button type="submit">Register</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default CreateAccount;