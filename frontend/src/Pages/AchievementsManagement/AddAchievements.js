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
          
         <form onSubmit={handleSubmit} className="post-form">
            <div className="form-group">
              <label className="form-label" style={{ color: '#333', fontWeight: 'bold' }}>Upload Image</label>
              <div 
                className={`file-input ${isDragging ? 'dragging' : ''}`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                style={{ 
                  border: '2px dashed #4285F4',
                  borderRadius: '8px',
                  padding: '30px',
                  textAlign: 'center',
                  cursor: 'pointer',
                  backgroundColor: isDragging ? 'rgba(66, 133, 244, 0.1)' : 'transparent',
                  transition: 'all 0.3s ease'
                }}
              >
                <input
                  id="image-upload"
                  type="file"
                  accept="image/jpeg,image/png,image/jpg"
                  onChange={handleImageChange}
                  style={{ display: 'none' }}
                />
                {!imagePreview ? (
                  <label htmlFor="image-upload" className="file-upload-label" style={{ cursor: 'pointer', display: 'block' }}>
                    <div className="upload-icon" style={{ color: '#4285F4', marginBottom: '15px' }}>
                      <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                        <polyline points="17 8 12 3 7 8"></polyline>
                        <line x1="12" y1="3" x2="12" y2="15"></line>
                      </svg>
                    </div>
                    <div className="upload-text">
                      <p style={{ fontSize: '16px', fontWeight: 'bold', color: '#4285F4', margin: '0 0 5px' }}>
                        Drag & drop image here or click to browse
                      </p>
                      <p className="upload-hint" style={{ fontSize: '14px', color: '#555', margin: '0 0 5px' }}>
                        Supports: JPG, PNG (max 50MB)
                      </p>
                    </div>
                  </label>
                ) : (
                  <div className="media-preview-grid" style={{ 
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
                    gap: '10px',
                    marginTop: '15px'
                  }}>
                    <div className="media-preview-item" style={{ 
                      position: 'relative',
                      borderRadius: '8px',
                      overflow: 'hidden',
                      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)'
                    }}>
                      <img 
                        className="media-preview" 
                        src={imagePreview} 
                        alt="Achievement preview" 
                        style={{ width: '100%', height: '150px', objectFit: 'cover' }}
                      />

                                           <button 
                        type="button" 
                        className="remove-media-btn"
                        onClick={removeImage}
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
                          padding: '0',
                          transition: 'background-color 0.3s'
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
                  </div>
                )}
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" style={{ color: '#333', fontWeight: 'bold' }}>Title</label>
              <input
                className="form-input"
                name="title"
                placeholder="Enter achievement title"
                value={formData.title}
                onChange={handleChange}
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
                name="description"
                placeholder="Describe your achievement..."
                value={formData.description}
                onChange={handleChange}
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
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
                style={{ 
                  width: '100%', 
                  padding: '12px', 
                  borderRadius: '8px', 
                  border: '1px solid #ccc', 
                  fontSize: '16px', 
                  boxShadow: 'inset 0 2px 4px rgba(0, 0, 0, 0.1)',
                  backgroundColor: 'white' 
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
              <label className="form-label" style={{ color: '#333', fontWeight: 'bold' }}>Date</label>
              <input
                className="form-input"
                name="date"
                type="date"
                value={formData.date}
                onChange={handleChange}
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
                Add Achievement
              </button>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
}

export default AddAchievements;

    } 

