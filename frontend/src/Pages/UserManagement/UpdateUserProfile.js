import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { IoMdAdd } from "react-icons/io";
import Layout from '../../Components/Layout/Layout';
import './UpdateUserProfile.css';

function UpdateUserProfile() {
  const { id } = useParams();
  const [formData, setFormData] = useState({
    fullname: '',
    email: '',
    password: '',
    phone: '',
    skills: [],
    bio: '',
  });
  const [profilePicture, setProfilePicture] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const navigate = useNavigate();
  const [skillInput, setSkillInput] = useState('');
  const handleAddSkill = () => {
    if (skillInput.trim()) {
      setFormData({ ...formData, skills: [...formData.skills, skillInput] });
      setSkillInput('');
    }
  };
  const handleRemoveSkill = (skillToRemove) => {
    setFormData({
      ...formData,
      skills: formData.skills.filter((skill) => skill !== skillToRemove),
    });
  };
  useEffect(() => {
    fetch(`http://localhost:8080/user/${id}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to fetch user data');
        }
        return response.json();
      })
      .then((data) => setFormData(data))
      .catch((error) => console.error('Error:', error));
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleProfilePictureChange = (e) => {
    const file = e.target.files[0];
    setProfilePicture(file);
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setPreviewImage(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://localhost:8080/user/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (response.ok) {
        if (profilePicture) {
          const formData = new FormData();
          formData.append('file', profilePicture);
          await fetch(`http://localhost:8080/user/${id}/uploadProfilePicture`, {
            method: 'PUT',
            body: formData,
          });
        }
        alert('Profile updated successfully!');
        window.location.href = '/userProfile';
      } else {
        alert('Failed to update profile.');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <Layout>
      <div className="post-content-wrapper" style={{ maxWidth: '800px', margin: '20px auto' }}>
        <div className="post-form-container" style={{
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
          borderRadius: '15px',
          padding: '30px',
          boxShadow: '0 8px 16px rgba(0, 0, 0, 0.3)'
        }}>
          <h1 className="post-form-title" style={{ 
            color: '#333', 
            borderBottom: '2px solid #FF6F61', 
            paddingBottom: '10px',
            fontSize: '32px',
            fontWeight: 'bold',
            marginBottom: '20px',
            textAlign: 'center'
          }}>Update Profile</h1>
          
          <form onSubmit={handleSubmit} className="post-form">
            <div className="form-grid">
              <div className="form-group">
                <label className="form-label" style={{ color: '#333', fontWeight: 'bold' }}>Full Name</label>
                <input
                  className="form-input"
                  type="text"
                  name="fullname"
                  placeholder="Enter your full name"
                  value={formData.fullname}
                  onChange={handleInputChange}
                  required
                  style={{ 
                    width: '100%', 
                    padding: '12px', 
                    borderRadius: '8px', 
                    border: '1px solid #ccc', 
                    fontSize: '16px', 
                    boxShadow: 'inset 0 2px 4px rgba(0, 0, 0, 0.1)' 
                  }}
                />
              </div>

              <div className="form-group">
                <label className="form-label" style={{ color: '#333', fontWeight: 'bold' }}>Email Address</label>
                <input
                  className="form-input"
                  type="email"
                  name="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  style={{ 
                    width: '100%', 
                    padding: '12px', 
                    borderRadius: '8px', 
                    border: '1px solid #ccc', 
                    fontSize: '16px', 
                    boxShadow: 'inset 0 2px 4px rgba(0, 0, 0, 0.1)' 
                  }}
                />
              </div>

              <div className="form-group">
                <label className="form-label" style={{ color: '#333', fontWeight: 'bold' }}>Password</label>
                <input
                  className="form-input"
                  type="password"
                  name="password"
                  placeholder="Enter new password"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                  style={{ 
                    width: '100%', 
                    padding: '12px', 
                    borderRadius: '8px', 
                    border: '1px solid #ccc', 
                    fontSize: '16px', 
                    boxShadow: 'inset 0 2px 4px rgba(0, 0, 0, 0.1)' 
                  }}
                />
              </div>

              <div className="form-group">
                <label className="form-label" style={{ color: '#333', fontWeight: 'bold' }}>Phone</label>
                <input
                  className="form-input"
                  type="text"
                  name="phone"
                  placeholder="Enter your phone number"
                  value={formData.phone}
                  onChange={(e) => {
                    const re = /^[0-9\b]{0,10}$/;
                    if (re.test(e.target.value)) {
                      handleInputChange(e);
                    }
                  }}
                  maxLength="10"
                  pattern="[0-9]{10}"
                  title="Please enter exactly 10 digits."
                  required
                  style={{ 
                    width: '100%', 
                    padding: '12px', 
                    borderRadius: '8px', 
                    border: '1px solid #ccc', 
                    fontSize: '16px', 
                    boxShadow: 'inset 0 2px 4px rgba(0, 0, 0, 0.1)' 
                  }}
                />
              </div>

              <div className="form-group">
                <label className="form-label" style={{ color: '#333', fontWeight: 'bold' }}>Skills</label>
                <div className="skills-input-group" style={{ display: 'flex', gap: '10px' }}>
                  <input
                    className="form-input"
                    type="text"
                    placeholder="Add a skill"
                    value={skillInput}
                    onChange={(e) => setSkillInput(e.target.value)}
                    style={{ 
                      flex: '1',
                      padding: '12px', 
                      borderRadius: '8px', 
                      border: '1px solid #ccc', 
                      fontSize: '16px', 
                      boxShadow: 'inset 0 2px 4px rgba(0, 0, 0, 0.1)' 
                    }}
                  />
                  <button 
                    type="button" 
                    className="add-skill-btn" 
                    onClick={handleAddSkill}
                    style={{
                      backgroundColor: '#4285F4',
                      color: '#fff',
                      border: 'none',
                      borderRadius: '8px',
                      padding: '0 15px',
                      fontSize: '24px',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      boxShadow: '0 4px 8px rgba(66, 133, 244, 0.3)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                    onMouseOver={(e) => {
                      e.target.style.backgroundColor = '#3367D6';
                      e.target.style.transform = 'translateY(-2px)';
                      e.target.style.boxShadow = '0 6px 14px rgba(66, 133, 244, 0.4)';
                    }}
                    onMouseOut={(e) => {
                      e.target.style.backgroundColor = '#4285F4';
                      e.target.style.transform = 'translateY(0)';
                      e.target.style.boxShadow = '0 4px 8px rgba(66, 133, 244, 0.3)';
                    }}
                  >
                    <IoMdAdd />
                  </button>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label" style={{ color: '#333', fontWeight: 'bold' }}>Bio</label>
                <textarea
                  className="form-input"
                  name="bio"
                  placeholder="Tell us about yourself..."
                  value={formData.bio}
                  onChange={handleInputChange}
                  rows={4}
                  style={{ 
                    width: '100%', 
                    padding: '12px', 
                    borderRadius: '8px', 
                    border: '1px solid #ccc', 
                    fontSize: '16px', 
                    boxShadow: 'inset 0 2px 4px rgba(0, 0, 0, 0.1)',
                    resize: 'vertical'
                  }}
                />
              </div>
            </div>

            <div className="skills-display">
              <div className="skills-tags" style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '15px' }}>
                {formData.skills.map((skill, index) => (
                  <span key={index} className="skill-tag" style={{ 
                    backgroundColor: 'rgba(66, 133, 244, 0.1)', 
                    color: '#4285F4',
                    padding: '6px 12px',
                    borderRadius: '20px',
                    fontSize: '14px',
                    fontWeight: 'bold',
                    display: 'flex',
                    alignItems: 'center',
                    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
                  }}>
                    {skill}
                    <button 
                      type="button"
                      className="remove-skill-btn"
                      onClick={() => handleRemoveSkill(skill)}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: '#4285F4',
                        cursor: 'pointer',
                        fontSize: '18px',
                        fontWeight: 'bold',
                        marginLeft: '6px',
                        padding: '0 3px'
                      }}
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>

            <div className="form-group" style={{ marginTop: '20px' }}>
              <label className="form-label" style={{ color: '#333', fontWeight: 'bold' }}>Profile Picture</label>
              <div className="profile-upload-container">
                <div className="profile-preview" style={{ 
                  width: '150px', 
                  height: '150px', 
                  borderRadius: '50%', 
                  overflow: 'hidden',
                  margin: '0 auto 15px',
                  border: '3px solid #4285F4',
                  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)'
                }}>
                  {previewImage ? (
                    <img src={previewImage} alt="Selected Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : formData.profilePicturePath ? (
                    <img 
                      src={`http://localhost:8080/uploads/profile/${formData.profilePicturePath}`}
                      alt="Current Profile"
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  ) : (
                    <div className="no-profile" style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      height: '100%',
                      backgroundColor: '#f0f0f0',
                      color: '#555'
                    }}>
                      <span>No profile picture</span>
                    </div>
                  )}
                </div>
                <div style={{ textAlign: 'center' }}>
                  <input
                    type="file"
                    id="profile-upload"
                    className="file-input"
                    accept="image/*"
                    onChange={handleProfilePictureChange}
                    style={{ display: 'none' }}
                  />
                  <label htmlFor="profile-upload" style={{
                    backgroundColor: '#4285F4',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '12px 20px',
                    fontSize: '16px',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    boxShadow: '0 4px 8px rgba(66, 133, 244, 0.3)',
                    display: 'inline-block',
                    fontWeight: 'bold'
                  }}
                  onMouseOver={(e) => {
                    e.style.backgroundColor = '#3367D6';
                    e.style.transform = 'translateY(-2px)';
                    e.style.boxShadow = '0 6px 14px rgba(66, 133, 244, 0.4)';
                  }}
                  onMouseOut={(e) => {
                    e.style.backgroundColor = '#4285F4';
                    e.style.transform = 'translateY(0)';
                    e.style.boxShadow = '0 4px 8px rgba(66, 133, 244, 0.3)';
                  }}>
                    Choose New Picture
                  </label>
                </div>
              </div>
            </div>

            <div style={{ margin: '30px 0', textAlign: 'center' }}>
              <button 
                type="submit" 
                className="submit-button"
                style={{
                  width: '100%', 
                  maxWidth: '400px',
                  padding: '15px 25px', 
                  backgroundColor: '#FF6F61', 
                  color: '#fff', 
                  border: 'none', 
                  borderRadius: '10px', 
                  fontSize: '18px', 
                  cursor: 'pointer', 
                  fontWeight: 'bold', 
                  transition: 'all 0.3s ease', 
                  boxShadow: '0 4px 12px rgba(255, 111, 97, 0.3)',
                  letterSpacing: '0.5px'
                }}
                onMouseOver={(e) => {
                  e.target.style.backgroundColor = '#E64A45';
                  e.target.style.transform = 'translateY(-2px)';
                  e.target.style.boxShadow = '0 6px 14px rgba(255, 111, 97, 0.4)';
                }}
                onMouseOut={(e) => {
                  e.target.style.backgroundColor = '#FF6F61';
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = '0 4px 12px rgba(255, 111, 97, 0.3)';
                }}
              >
                Update Profile
              </button>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
}

export default UpdateUserProfile;
