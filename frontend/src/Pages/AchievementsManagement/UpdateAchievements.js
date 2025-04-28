import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Layout from '../../Components/Layout/Layout';
import './AddAchievements.css';

function UpdateAchievements() {
  const { id } = useParams();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    category: '',
    postOwnerID: '',
    postOwnerName: '',
    imageUrl: ''
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewImage, setPreviewImage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  useEffect(() => {
    const fetchAchievement = async () => {
      try {
        //load achievement
        const response = await fetch(`http://localhost:8080/achievements/${id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch achievement');
        }
        const data = await response.json();
        setFormData(data);
        if (data.imageUrl) {
          setPreviewImage(`http://localhost:8080/achievements/images/${data.imageUrl}`);
        }
      } catch (error) {
        console.error('Error fetching Achievements data:', error);
        alert('Error loading achievement data');
      }
    };
    fetchAchievement();
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    processImageFile(file);
  };

  const processImageFile = (file) => {
    const maxFileSize = 50 * 1024 * 1024; // 50MB

    if (file.size > maxFileSize) {
      alert('File exceeds the maximum size of 50MB.');
      return;
    }

    if (!file.type.match(/^image\/(jpeg|png|jpg)$/)) {
      alert('Only JPG and PNG image files are supported.');
      return;
    }

    setSelectedFile(file);
    setPreviewImage(URL.createObjectURL(file));
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
    if (previewImage) {
      URL.revokeObjectURL(previewImage);
    }
    setSelectedFile(null);
    setPreviewImage('');
    // Also update formData to clear the imageUrl
    setFormData(prev => ({ ...prev, imageUrl: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setShowConfirmDialog(true);
  };

  //confirm and update process
  const confirmUpdate = async () => {
    setIsLoading(true);
    setShowConfirmDialog(false);

    try {
      let imageUrl = formData.imageUrl;
      
      // Upload new image if selected
      if (selectedFile) {
        const uploadFormData = new FormData();
        uploadFormData.append('file', selectedFile);
        
        const uploadResponse = await fetch('http://localhost:8080/achievements/upload', {
          method: 'POST',
          body: uploadFormData,
        });
        
        if (!uploadResponse.ok) {
          throw new Error('Image upload failed');
        }
        imageUrl = await uploadResponse.text();
      } else if (formData.imageUrl === '') {
        // If image was removed without a new one uploaded
        imageUrl = '';
      }

      // Update achievement data
      const updatedData = { ...formData, imageUrl };
      const response = await fetch(`http://localhost:8080/achievements/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedData),
      });

      if (response.ok) {
        alert('Achievement updated successfully!');
        window.location.href = '/myAchievements';
      } else {
        throw new Error('Failed to update achievement');
      }
    } catch (error) {
      console.error('Error:', error);
      alert(error.message || 'An error occurred during update');
    } finally {
      setIsLoading(false);
    }
  };

  const cancelUpdate = () => {
    setShowConfirmDialog(false);
  };

  const handleCancel = () => {
    if (window.confirm("Are you sure you want to cancel? Any unsaved changes will be lost.")) {
      window.location.href = '/allAchievements';
    }
  };

  return (
    <Layout>
      <div className="post-content-wrapper" style={{ 
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
          }}>Update Achievement</h1>

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
                  onChange={handleFileChange}
                  style={{ display: 'none' }}
                />
                {!previewImage ? (
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
                        src={previewImage} 
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
              <label className="form-label" style={{ color: '#333', fontWeight: 'bold' }}>Description</label>
              <textarea
                className="form-textarea"
                name="description"
                placeholder="Describe your achievement..."
                value={formData.description}
                onChange={handleInputChange}
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

            <div style={{ margin: '30px 0', display: 'flex', justifyContent: 'space-between', gap: '20px' }}>
              <button 
                type="button" 
                onClick={handleCancel}
                className="cancel-button"
                style={{
                  width: '48%',
                  padding: '15px 25px', 
                  backgroundColor: '#9E9E9E', 
                  color: '#fff', 
                  border: 'none', 
                  borderRadius: '10px', 
                  fontSize: '18px', 
                  cursor: 'pointer', 
                  fontWeight: 'bold', 
                  transition: 'all 0.3s ease', 
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
                  letterSpacing: '0.5px'
                }}
                onMouseOver={(e) => {
                  e.target.style.backgroundColor = '#757575';
                  e.target.style.transform = 'translateY(-2px)';
                  e.target.style.boxShadow = '0 6px 14px rgba(0, 0, 0, 0.25)';
                }}
                onMouseOut={(e) => {
                  e.target.style.backgroundColor = '#9E9E9E';
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.2)';
                }}
              >
                Cancel
              </button>
              <button 
                type="submit" 
                className="submit-button"
                disabled={isLoading}
                style={{
                  width: '48%',
                  padding: '15px 25px', 
                  backgroundColor: '#4285F4', 
                  color: '#fff', 
                  border: 'none', 
                  borderRadius: '10px', 
                  fontSize: '18px', 
                  cursor: isLoading ? 'not-allowed' : 'pointer', 
                  fontWeight: 'bold', 
                  transition: 'all 0.3s ease', 
                  boxShadow: '0 4px 12px rgba(66, 133, 244, 0.3)',
                  letterSpacing: '0.5px',
                  opacity: isLoading ? 0.7 : 1
                }}
                onMouseOver={(e) => {
                  if (!isLoading) {
                    e.target.style.backgroundColor = '#3367D6';
                    e.target.style.transform = 'translateY(-2px)';
                    e.target.style.boxShadow = '0 6px 14px rgba(66, 133, 244, 0.4)';
                  }
                }}
                onMouseOut={(e) => {
                  e.target.style.backgroundColor = '#4285F4';
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = '0 4px 12px rgba(66, 133, 244, 0.3)';
                }}
              >
                {isLoading ? 'Updating Achievement...' : 'Update Achievement'}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Confirmation Dialog */}
      {showConfirmDialog && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000,
        }}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '10px',
            padding: '30px',
            width: '90%',
            maxWidth: '500px',
            boxShadow: '0 5px 15px rgba(0, 0, 0, 0.3)',
            textAlign: 'center'
          }}>
            <h3 style={{ 
              marginTop: 0,
              color: '#333',
              fontSize: '24px',
              marginBottom: '20px'
            }}>Confirm Update</h3>
            <p style={{
              fontSize: '16px',
              lineHeight: 1.6,
              color: '#555',
              marginBottom: '25px'
            }}>Are you sure you want to update this achievement? This action cannot be undone.</p>
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              gap: '15px'
            }}>
              <button 
                onClick={cancelUpdate}
                style={{
                  padding: '10px 20px',
                  backgroundColor: '#9E9E9E',
                  color: 'white',
                  border: 'none',
                  borderRadius: '5px',
                  fontSize: '16px',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
                onMouseOver={(e) => {
                  e.target.style.backgroundColor = '#757575';
                }}
                onMouseOut={(e) => {
                  e.target.style.backgroundColor = '#9E9E9E';
                }}
              >
                Cancel
              </button>
              <button 
                onClick={confirmUpdate}
                style={{
                  padding: '10px 20px',
                  backgroundColor: '#4285F4',
                  color: 'white',
                  border: 'none',
                  borderRadius: '5px',
                  fontSize: '16px',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
                onMouseOver={(e) => {
                  e.target.style.backgroundColor = '#3367D6';
                }}
                onMouseOut={(e) => {
                  e.target.style.backgroundColor = '#4285F4';
                }}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}

export default UpdateAchievements;