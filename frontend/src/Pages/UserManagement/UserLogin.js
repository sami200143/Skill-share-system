import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './user.css'
import GoogalLogo from './img/glogo.png'

function UserLogin() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Login attempt:', formData);
    try {
      const response = await fetch('http://localhost:8080/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('userID', data.id); // Save user ID in local storage
        alert('Login successful!');
        navigate('/allPost');
      } else if (response.status === 401) {
        alert('Invalid credentials!');
      } else {
        alert('Failed to login!');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className="login-container" style={{ backgroundImage: 'url(./img/photography-beautiful.jpg)', backgroundSize: 'cover', backgroundPosition: 'center', height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', position: 'relative' }}>
      <div className="gradient-overlay" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: 'linear-gradient(135deg, rgba(65, 105, 225, 0.7), rgba(219, 112, 147, 0.8))', zIndex: 1 }}></div>
        <div className="login-box" style={{ position: 'relative', zIndex: 2, backgroundColor: 'rgba(255, 255, 255, 0.9)', padding: '40px', borderRadius: '15px', maxWidth: '400px', width: '100%', textAlign: 'center', boxShadow: '0 8px 16px rgba(0, 0, 0, 0.3)' }}>
          <h1 style={{ fontSize: '32px', fontWeight: 'bold', marginBottom: '20px', color: '#333' }}>Welcome  to <br/> Lens Learn</h1>
          <p style={{ fontSize: '16px', marginBottom: '30px', color: '#555' }}>Log in to explore and share your photography journey</p>
                
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '20px' }}>
            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={handleInputChange}
              required
              style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ccc', fontSize: '16px', boxShadow: 'inset 0 2px 4px rgba(0, 0, 0, 0.1)' }}
            />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleInputChange}
              required
              style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ccc', fontSize: '16px', boxShadow: 'inset 0 2px 4px rgba(0, 0, 0, 0.1)' }}
            />
          </div>

          <button type="submit" style={{ width: '100%', padding: '12px', backgroundColor: '#FF6F61', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '16px', cursor: 'pointer', fontWeight: 'bold', transition: 'background-color 0.3s', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)' }}
            onMouseOver={(e) => e.target.style.backgroundColor = '#E64A45'}
            onMouseOut={(e) => e.target.style.backgroundColor = '#FF6F61'}>
            Login
          </button>

          <div style={{ margin: '20px 0', color: '#aaa' }}>OR</div>

          <button
            type="button"
            onClick={() => window.location.href = 'http://localhost:8080/oauth2/authorization/google'}
            style={{ width: '100%', padding: '12px', backgroundColor: '#4285F4', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '16px', cursor: 'pointer', fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'background-color 0.3s', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)' }}
            onMouseOver={(e) => e.target.style.backgroundColor = '#3367D6'}
            onMouseOut={(e) => e.target.style.backgroundColor = '#4285F4'}
          >
            <img src={GoogalLogo} alt='Google' style={{ width: '20px', marginRight: '10px' }} />
            Sign in with Google
          </button>

          <p style={{ marginTop: '20px', fontSize: '14px', color: '#555' }}>
            Don't have an account? 
            <span onClick={() => (window.location.href = '/register')} style={{ color: '#FF6F61', cursor: 'pointer', textDecoration: 'underline' }}>
              Sign up
            </span>
          </p>
        </form>
      </div>
    </div>
  );
}

export default UserLogin;
