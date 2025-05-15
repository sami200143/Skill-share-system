import React, { useState, useEffect } from 'react';
import Layout from '../../Components/Layout/Layout';
import './AddAchievements.css';
function AddAchievements() {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    postOwnerID: '',
    category: '',
    postOwnerName: '',
  });
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isDragging, setIsDragging] = useState(false);

   useEffect(() => {
    const userId = localStorage.getItem('userID');
    if (userId) {
      setFormData((prevData) => ({ ...prevData, postOwnerID: userId }));
      fetch(`http://localhost:8080/user/${userId}`)
        .then((response) => response.json())
        .then((data) => {
          if (data && data.fullname) {
            setFormData((prevData) => ({ ...prevData, postOwnerName: data.fullname }));
          }
        })
        .catch((error) => console.error('Error fetching user data:', error));
    }
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    processImageFile(file);
  };

  const processImageFile = (file) => {
    const maxFileSize = 50 * 1024 * 1024; // 50MB

    if (file.size > maxFileSize) {
      alert('File exceeds the maximum size of 50MB.');
      return;
    }

    if (!file.type.startsWith('image/')) {
      alert('Only image files are supported.');
      return;
    }

    setImage(file);
    setImagePreview(URL.createObjectURL(file));
  };
  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    processImageFile(file);
  };

  const removeImage = () => {
    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
    }
    setImage(null);
    setImagePreview(null);
  };

   const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!image) {
      alert('Please upload an image');
      return;
    }

    const submitButton = document.getElementById('submit-button');
    submitButton.disabled = true;
    submitButton.innerText = 'Adding Achievement...';

    try {
      const imageFormData = new FormData();
      imageFormData.append('file', image);
      
      const uploadResponse = await fetch('http://localhost:8080/achievements/upload', {
        method: 'POST',
        body: imageFormData,
      });
      const imageUrl = await uploadResponse.text();

      const response = await fetch('http://localhost:8080/achievements', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, imageUrl }),
      });

      if (response.ok) {
        alert('Achievement added successfully!');
        window.location.href = '/myAchievements';
      } else {
        throw new Error('Failed to add Achievement');
      }
    } catch (error) {
      alert('Failed to add Achievement. Please try again.');
      submitButton.disabled = false;
      submitButton.innerText = 'Add Achievement';
    }
  };

    return (
    <Layout>
      <div className="post-content-wrapper" style={{ 
        position: 'relative', 
        maxWidth: '800px', 
        margin: '20px auto' 
      }}>
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
          }}>Add Achievement</h1>
