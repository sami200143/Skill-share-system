import React, { useState } from 'react';
import axios from 'axios';
import NavBar from '../../Components/NavBar/NavBar';
import './AddNewPost.css'; // Make sure to include the CSS filee

//create function for add post
function AddNewPost() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [media, setMedia] = useState([]);
  const [mediaPreviews, setMediaPreviews] = useState([]);
  const [categories, setCategories] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const userID = localStorage.getItem('userID');

  const handleMediaChange = (e) => {
    const files = Array.from(e.target.files);
    processMediaFiles(files);
  };
  const handleMediaChange = (e) => {
    const files = Array.from(e.target.files);
    processMediaFiles(files);
  };
  const processMediaFiles = (files) => {
    const maxFileSize = 50 * 1024 * 1024; // 50MB
    let imageCount = 0;
    let videoCount = 0;
    const previews = [];

    for (const file of files) {
      if (file.size > maxFileSize) {
        alert(`File ${file.name} exceeds the maximum size of 50MB.`);
        return;
      }
      if (file.type.startsWith('image/')) {
        imageCount++;
      } else if (file.type === 'video/mp4') {
        videoCount++;

        const video = document.createElement('video');
        video.preload = 'metadata';
        video.src = URL.createObjectURL(file);

        video.onloadedmetadata = () => {
          URL.revokeObjectURL(video.src);
          if (video.duration > 30) {
            alert(`Video ${file.name} exceeds the maximum duration of 30 seconds.`);
            window.location.reload();
          }
        };
         } else {
        alert(`Unsupported file type: ${file.type}`);
        return;
      }
      // Add file preview object with type and URL
      previews.push({ type: file.type, url: URL.createObjectURL(file) });
    }

    if (imageCount > 3) {
      alert('You can upload a maximum of 3 images.');
      return;
    }

    if (videoCount > 1) {
      alert('You can upload only 1 video.');
      return;
    }

    setMedia([...media, ...files]);
    setMediaPreviews([...mediaPreviews, ...previews]);
  };
  const removeMedia = (index) => {
    const updatedMedia = [...media];
    const updatedPreviews = [...mediaPreviews];

    // Revoke the object URL to prevent memory leaks
    URL.revokeObjectURL(mediaPreviews[index].url);
    
    updatedMedia.splice(index, 1);
    updatedPreviews.splice(index, 1);
    
    setMedia(updatedMedia);
    setMediaPreviews(updatedPreviews);
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
    
    const files = Array.from(e.dataTransfer.files);
    processMediaFiles(files);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!title.trim()) {
      alert('Please enter a title for your post');
      return;
    }
    
    if (!description.trim()) {
      alert('Please enter a description for your post');
      return;
    }
    
    if (!categories) {
      alert('Please select a category for your post');
      return;
    }
    
    if (media.length === 0) {
      alert('Please upload at least one media file');
      return;
    }
    
    const formData = new FormData();
    formData.append('userID', userID);
    formData.append('title', title);
    formData.append('description', description);
    formData.append('category', categories);
    media.forEach((file) => formData.append('mediaFiles', file));

    try {
      // Show loading state
      document.getElementById('submit-button').disabled = true;
      document.getElementById('submit-button').innerText = 'Creating Post...';
      
      const response = await axios.post('http://localhost:8080/posts', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      
      alert('Post created successfully!');
      window.location.href = '/myAllPost';
    } catch (error) {
      console.error(error);
      alert('Failed to create post. Please try again.');

      // Reset button state
      document.getElementById('submit-button').disabled = false;
      document.getElementById('submit-button').innerText = 'Create Post';
    }
     return (
      <div className="add-post-container" style={{ 
      position: 'relative', 
      minHeight: '100vh',
      backgroundColor: '#f9f9f9',
      paddingBottom: '50px',
      paddingTop: '20px'
    }}>
      <div className="gradient-overlay" style={{ 
        position: 'absolute', 
        top: 0, 
        left: 0, 
        width: '100%', 
        height: '100%', 
        background: 'linear-gradient(135deg, rgba(65, 105, 225, 0.1), rgba(219, 112, 147, 0.2))', 
        zIndex: 1 
      }}></div>
      
    <div className="add-post-container" style={{ 
      position: 'relative', 
      minHeight: '100vh',
      backgroundColor: '#f9f9f9',
      paddingBottom: '50px',
      paddingTop: '20px'
    }}></div>
    <NavBar />
      
      <div className="post-content-wrapper" style={{ 
        position: 'relative', 
        zIndex: 2,
        maxWidth: '800px',
        margin: '20px auto',
        padding: '0 15px'
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
          }}>Create New Post</h1>
          
          <form onSubmit={handleSubmit} className="post-form">
            <div className="form-group">
              <label className="form-label" style={{ color: '#333', fontWeight: 'bold' }}>Title</label>
              <input
                className="form-input"
                type="text"
                placeholder="Enter an engaging title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
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
              <label className="form-label" style={{ color: '#333', fontWeight: 'bold' }}>Description</label>
              <textarea
                className="form-textarea"
                placeholder="Share your thoughts..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
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
            
            <div className="form-group">
              <label className="form-label" style={{ color: '#333', fontWeight: 'bold' }}>Category</label>
              <select
                className="form-select"
                value={categories}
                onChange={(e) => setCategories(e.target.value)}
                required
                style={{ 
                  width: '100%', 
                  padding: '12px', 
                  borderRadius: '8px', 
                  border: '1px solid #ccc', 
                  fontSize: '16px', 
                  boxShadow: 'inset 0 2px 4px rgba(0, 0, 0, 0.1)',
                  backgroundColor: '#fff'
                }}
              >
                <option value="" disabled>Select a category</option>
                <option value="Painting">Painting</option>
                <option value="Drawing">Drawing</option>
                <option value="Sculpture">Sculpture</option>
                <option value="Photography">Photography</option>
                <option value="Digital Art">Digital Art</option>
                <option value="Illustration">Illustration</option>
                <option value="Calligraphy">Calligraphy</option>
                <option value="Graffiti / Street Art">Graffiti / Street Art</option>
                <option value="Mixed Media">Mixed Media</option>
                <option value="Printmaking">Printmaking</option>
              </select>
            </div>
  };

    


}