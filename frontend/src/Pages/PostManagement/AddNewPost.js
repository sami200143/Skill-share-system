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
            
            <div className="form-group">
              <label className="form-label" style={{ color: '#333', fontWeight: 'bold' }}>Media</label>
              <div 
                className={`file-input ${isDragging ? 'dragging' : ''}`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                style={{
                  border: '2px dashed #ccc',
                  borderRadius: '8px',
                  padding: '25px',
                  textAlign: 'center',
                  cursor: 'pointer',
                  backgroundColor: isDragging ? 'rgba(66, 133, 244, 0.1)' : '#f9f9f9',
                  transition: 'all 0.3s ease'
                }}
              >
                <input
                  id="media-upload"
                  type="file"
                  accept="image/jpeg,image/png,image/jpg,video/mp4"
                  multiple
                  onChange={handleMediaChange}
                  style={{ display: 'none' }}
                />
                <label htmlFor="media-upload" className="file-upload-label" style={{ cursor: 'pointer', display: 'block' }}>
                  <div className="upload-icon" style={{ color: '#4285F4', marginBottom: '10px' }}>
                    <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                      <polyline points="17 8 12 3 7 8"></polyline>
                      <line x1="12" y1="3" x2="12" y2="15"></line>
                    </svg>
                  </div>
                  <div className="upload-text">
                    <p style={{ color: '#4285F4', fontSize: '18px', fontWeight: 'bold', margin: '0 0 8px' }}>Drag & drop files here or click to browse</p>
                    <p className="upload-hint" style={{ color: '#555', margin: '0 0 5px' }}>Supports: JPG, PNG, MP4 (max 50MB)</p>
                    <p className="upload-limits" style={{ color: '#FF6F61', margin: '0' }}>Limits: 3 images, 1 video (max 30s)</p>
                  </div>
                </label>
              </div>
              
              {mediaPreviews.length > 0 && (
                <div className="media-preview-grid" style={{ 
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
                  gap: '15px',
                  marginTop: '20px'
                }}>
                  {mediaPreviews.map((preview, index) => (
                    <div key={index} className="media-preview-item" style={{ 
                      position: 'relative',
                      borderRadius: '8px',
                      overflow: 'hidden',
                      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)'
                    }}>
                      {preview.type.startsWith('video/') ? (
                        <video controls className="media-preview" style={{ width: '100%', height: '150px', objectFit: 'cover' }}>
                          <source src={preview.url} type={preview.type} />
                          Your browser does not support the video tag.
                        </video>
                      ) : (
                        <img className="media-preview" src={preview.url} alt={`Preview ${index + 1}`} style={{ width: '100%', height: '150px', objectFit: 'cover' }} />
                      )}
                      <button 
                        type="button" 
                        className="remove-media-btn"
                        onClick={() => removeMedia(index)}
                        style={{
                          position: 'absolute',
                          top: '5px',
                          right: '5px',
                          backgroundColor: 'rgba(255, 111, 97, 0.8)',
                          color: 'white',
                          border: 'none',
                          borderRadius: '50%',
                          width: '25px',
                          height: '25px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          cursor: 'pointer',
                          transition: 'all 0.3s ease'
                        }}
                        onMouseOver={(e) => e.target.style.backgroundColor = 'rgba(230, 74, 69, 0.9)'}
                        onMouseOut={(e) => e.target.style.backgroundColor = 'rgba(255, 111, 97, 0.8)'}
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <circle cx="12" cy="12" r="10"></circle>
                          <line x1="15" y1="9" x2="9" y2="15"></line>
                          <line x1="9" y1="9" x2="15" y2="15"></line>
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            <div style={{ margin: '30px 0', textAlign: 'center' }}>
              <button 
                id="submit-button"
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
                Create Post
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AddNewPost;
};





