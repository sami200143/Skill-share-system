import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { IoMdAdd } from "react-icons/io";
import './post.css';
import './Templates.css';
import { FaVideo } from "react-icons/fa";
import { FaImage } from "react-icons/fa";
import { HiCalendarDateRange } from "react-icons/hi2";
import Layout from '../../Components/Layout/Layout';

function UpdateLearningPost() {
  const { id } = useParams();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [contentURL, setContentURL] = useState('');
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState('');
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [existingImage, setExistingImage] = useState('');
  const [templateID, setTemplateID] = useState(null);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [category, setCategory] = useState('');
  const [showContentURLInput, setShowContentURLInput] = useState(true);
  const [showImageUploadInput, setShowImageUploadInput] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/learningPlan/${id}`);
        const { title, description, contentURL, tags, imageUrl, templateID, startDate, endDate, category } = response.data;
        setTitle(title);
        setDescription(description);
        setContentURL(contentURL);
        setTags(tags);
        setExistingImage(imageUrl);
        setTemplateID(templateID);
        setStartDate(startDate);
        setEndDate(endDate);
        setCategory(category);
      } catch (error) {
        console.error('Error fetching post:', error);
      }
    };

    fetchPost();
    
    return () => {
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [id]);

  const handleAddTag = () => {
    if (tagInput.trim() !== '') {
      setTags([...tags, tagInput.trim()]);
      setTagInput('');
    }
  };

  const handleDeleteTag = (index) => {
    const updatedTags = tags.filter((_, i) => i !== index);
    setTags(updatedTags);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    processImageFile(file);
  };

  const processImageFile = (file) => {
    if (!file) return;

    const maxFileSize = 50 * 1024 * 1024; // 50MB

    if (file.size > maxFileSize) {
      alert('File exceeds the maximum size of 50MB.');
      return;
    }

    if (!file.type.startsWith('image/')) {
      alert('Only image files are supported.');
      return;
    }

    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
    }

    setImage(file);
    setImagePreview(URL.createObjectURL(file));
    // When new image is selected, clear existing image reference
    setExistingImage('');
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
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      processImageFile(file);
    }
  };

  const getEmbedURL = (url) => {
    try {
      if (url.includes('youtube.com/watch')) {
        const videoId = new URL(url).searchParams.get('v');
        return `https://www.youtube.com/embed/${videoId}`;
      }
      if (url.includes('youtu.be/')) {
        const videoId = url.split('youtu.be/')[1];
        return `https://www.youtube.com/embed/${videoId}`;
      }
      return url;
    } catch (error) {
      console.error('Invalid URL:', url);
      return '';
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    let imageUrl = existingImage;

    if (image) {
      const formData = new FormData();
      formData.append('file', image);
      try {
        const uploadResponse = await axios.post('http://localhost:8080/learningPlan/planUpload', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
        imageUrl = uploadResponse.data;
      } catch (error) {
        console.error('Error uploading image:', error);
        alert('Failed to upload image.');
        setIsSubmitting(false);
        return;
      }
    }

    const updatedPost = { title, description, contentURL, tags, imageUrl, postOwnerID: localStorage.getItem('userID'), templateID, startDate, endDate, category };
    try {
      await axios.put(`http://localhost:8080/learningPlan/${id}`, updatedPost);
      alert('Post updated successfully!');
      window.location.href = '/allLearningPlan';
    } catch (error) {
      console.error('Error updating post:', error);
      alert('Failed to update post.');
      setIsSubmitting(false);
    }
  };

  // Helper function to render image preview
  const renderImagePreview = () => {
    if (imagePreview) {
      return (
        <div style={{
          position: 'relative',
          borderRadius: '8px',
          overflow: 'hidden',
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
          marginTop: '10px'
        }}>
          <img
            src={imagePreview}
            alt="Preview"
            style={{
              width: '100%',
              maxHeight: '200px',
              objectFit: 'contain',
              display: 'block'
            }}
          />
          <button
            type="button"
            onClick={() => {
              URL.revokeObjectURL(imagePreview);
              setImage(null);
              setImagePreview(null);
            }}
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
      );
    } else if (existingImage) {
      return (
        <div style={{
          position: 'relative',
          borderRadius: '8px',
          overflow: 'hidden',
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
          marginTop: '10px'
        }}>
          <img
            src={`http://localhost:8080/learningPlan/planImages/${existingImage}`}
            alt="Existing"
            style={{
              width: '100%',
              maxHeight: '200px',
              objectFit: 'contain',
              display: 'block'
            }}
          />
          <button
            type="button"
            onClick={() => {
              setExistingImage('');
            }}
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
      );
    }
    return null;
  };

  return (
    <Layout>
      <div className="post-content-wrapper" style={{
        position: 'relative',
        maxWidth: '800px',
        margin: '20px auto',
        padding: '0 15px'
      }}>
        <div className="template-preview-container">
          <div className={`template template-1 ${templateID === 1 ? 'selected' : ''}`}>
            <p className='template_id_one'>template 1</p>
            <p className='template_title'>{title || "Title Preview"}</p>
            <p className='template_dates'><HiCalendarDateRange /> {startDate} to {endDate} </p>
            <p className='template_description'>{category}</p>
            <hr></hr>
            <p className='template_description'>{description || "Description Preview"}</p>
            <div className="tags_preview">
              {tags.map((tag, index) => (
                <span key={index} className="tagname">#{tag}</span>
              ))}
            </div>
            {imagePreview ? (
              <div className="image-preview-achi">
                <img src={imagePreview} alt="Preview" className="iframe_preview" />
              </div>
            ) : existingImage && (
              <div className="image-preview-achi">
                <img src={`http://localhost:8080/learningPlan/planImages/${existingImage}`} alt="Existing" className="iframe_preview" />
              </div>
            )}
            {contentURL && (
              <iframe
                src={getEmbedURL(contentURL)}
                title="Content Preview"
                className="iframe_preview"
                frameBorder="0"
                allowFullScreen
              ></iframe>
            )}
          </div>
          <div className={`template template-2 ${templateID === 2 ? 'selected' : ''}`}>
            <p className='template_id_one'>template 2</p>
            <p className='template_title'>{title || "Title Preview"}</p>
            <p className='template_dates'><HiCalendarDateRange /> {startDate} to {endDate} </p>
            <p className='template_description'>{category}</p>
            <hr></hr>
            <p className='template_description'>{description || "Description Preview"}</p>
            <div className="tags_preview">
              {tags.map((tag, index) => (
                <span key={index} className="tagname">#{tag}</span>
              ))}
            </div>
            <div className='preview_part'>
              <div className='preview_part_sub'>
                {imagePreview ? (
                  <div className="image-preview-achi">
                    <img src={imagePreview} alt="Preview" className="iframe_preview_new" />
                  </div>
                ) : existingImage && (
                  <div className="image-preview-achi">
                    <img src={`http://localhost:8080/learningPlan/planImages/${existingImage}`} alt="Existing" className="iframe_preview_new" />
                  </div>
                )}
              </div>
              <div className='preview_part_sub'>
                {contentURL && (
                  <iframe
                    src={getEmbedURL(contentURL)}
                    title="Content Preview"
                    className="iframe_preview_new"
                    frameBorder="0"
                    allowFullScreen
                  ></iframe>
                )}
              </div>
            </div>
          </div>
          <div className={`template template-3 ${templateID === 3 ? 'selected' : ''}`}>
            <p className='template_id_one'>template 3</p>
            {imagePreview ? (
              <div className="image-preview-achi">
                <img src={imagePreview} alt="Preview" className="iframe_preview" />
              </div>
            ) : existingImage && (
              <div className="image-preview-achi">
                <img src={`http://localhost:8080/learningPlan/planImages/${existingImage}`} alt="Existing" className="iframe_preview" />
              </div>
            )}
            {contentURL && (
              <iframe
                src={getEmbedURL(contentURL)}
                title="Content Preview"
                className="iframe_preview"
                frameBorder="0"
                allowFullScreen
              ></iframe>
            )}
            <p className='template_title'>{title || "Title Preview"}</p>
            <p className='template_dates'><HiCalendarDateRange /> {startDate} to {endDate} </p>
            <p className='template_description'>{category}</p>
            <hr></hr>
            <p className='template_description'>{description || "Description Preview"}</p>
            <div className="tags_preview">
              {tags.map((tag, index) => (
                <span key={index} className="tagname">#{tag}</span>
              ))}
            </div>
          </div>
        </div>

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
          }}>Update Learning Plan</h1>

          <form onSubmit={handleSubmit} className="post-form">
            <div className="form-group">
              <label className="form-label" style={{ color: '#333', fontWeight: 'bold' }}>Title</label>
              <input
                className="form-input"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter plan title"
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
              <label className="form-label" style={{ color: '#333', fontWeight: 'bold' }}>Tags</label>
              <div className="tag-container" style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '0.5rem',
                marginBottom: '0.5rem'
              }}>
                {tags.map((tag, index) => (
                  <span key={index} className="tag" style={{
                    background: 'rgba(66, 133, 244, 0.1)',
                    color: '#4285F4',
                    padding: '5px 10px',
                    borderRadius: '15px',
                    fontSize: '14px',
                    fontWeight: 'bold'
                  }}>
                    #{tag}
                    <button
                      type="button"
                      onClick={() => handleDeleteTag(index)}
                      className="tag-delete-btn"
                      style={{
                        marginLeft: '5px',
                        background: 'none',
                        border: 'none',
                        color: '#4285F4',
                        cursor: 'pointer',
                        fontSize: '14px',
                        fontWeight: 'bold'
                      }}
                    >×</button>
                  </span>
                ))}
              </div>
              <div className="tag-input-container" style={{ display: 'flex', gap: '10px' }}>
                <input
                  className="form-input"
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  placeholder="Add tags"
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
                  onClick={handleAddTag}
                  className="media-button"
                  style={{
                    backgroundColor: '#4285F4',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '0 15px',
                    fontSize: '16px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '5px',
                    transition: 'all 0.3s ease',
                    boxShadow: '0 2px 5px rgba(66, 133, 244, 0.3)'
                  }}
                  onMouseOver={(e) => {
                    e.target.style.backgroundColor = '#3367D6';
                    e.target.style.transform = 'translateY(-2px)';
                    e.target.style.boxShadow = '0 4px 8px rgba(66, 133, 244, 0.4)';
                  }}
                  onMouseOut={(e) => {
                    e.target.style.backgroundColor = '#4285F4';
                    e.target.style.transform = 'translateY(0)';
                    e.target.style.boxShadow = '0 2px 5px rgba(66, 133, 244, 0.3)';
                  }}
                >
                  <IoMdAdd /> Add Tag
                </button>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" style={{ color: '#333', fontWeight: 'bold' }}>Description</label>
              <textarea
                className="form-textarea"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe your learning plan"
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
              <label className="form-label" style={{ color: '#333', fontWeight: 'bold' }}>Template</label>
              <select
                className="form-select"
                value={templateID || ''}
                onChange={(e) => setTemplateID(Number(e.target.value))}
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
                <option value="">Select Template</option>
                <option value="1">Template 1</option>
                <option value="2">Template 2</option>
                <option value="3">Template 3</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label" style={{ color: '#333', fontWeight: 'bold' }}>Duration</label>
              <div style={{ display: 'flex', gap: '1rem' }}>
                <input
                  className="form-input"
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  required
                  style={{
                    flex: '1',
                    padding: '12px',
                    borderRadius: '8px',
                    border: '1px solid #ccc',
                    fontSize: '16px',
                    boxShadow: 'inset 0 2px 4px rgba(0, 0, 0, 0.1)'
                  }}
                />
                <input
                  className="form-input"
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  required
                  style={{
                    flex: '1',
                    padding: '12px',
                    borderRadius: '8px',
                    border: '1px solid #ccc',
                    fontSize: '16px',
                    boxShadow: 'inset 0 2px 4px rgba(0, 0, 0, 0.1)'
                  }}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" style={{ color: '#333', fontWeight: 'bold' }}>Category</label>
              <select
                className="form-select"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
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
                <option value="">Select Category</option>
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

            <div className="media-controls" style={{
              display: 'flex',
              gap: '10px',
              margin: '20px 0'
            }}>
              <button
                type="button"
                className="media-button"
                onClick={() => setShowContentURLInput(!showContentURLInput)}
                style={{
                  flex: '1',
                  backgroundColor: '#FF6F61',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '12px',
                  fontSize: '16px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '5px',
                  transition: 'all 0.3s ease',
                  boxShadow: '0 2px 5px rgba(255, 111, 97, 0.3)'
                }}
                onMouseOver={(e) => {
                  e.target.style.backgroundColor = '#E64A45';
                  e.target.style.transform = 'translateY(-2px)';
                  e.target.style.boxShadow = '0 4px 8px rgba(255, 111, 97, 0.4)';
                }}
                onMouseOut={(e) => {
                  e.target.style.backgroundColor = '#FF6F61';
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = '0 2px 5px rgba(255, 111, 97, 0.3)';
                }}
              >
                <FaVideo /> {showContentURLInput ? 'Hide Video URL' : 'Add Video'}
              </button>
              <button
                type="button"
                className="media-button"
                onClick={() => setShowImageUploadInput(!showImageUploadInput)}
                style={{
                  flex: '1',
                  backgroundColor: '#4285F4',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '12px',
                  fontSize: '16px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '5px',
                  transition: 'all 0.3s ease',
                  boxShadow: '0 2px 5px rgba(66, 133, 244, 0.3)'
                }}
                onMouseOver={(e) => {
                  e.target.style.backgroundColor = '#3367D6';
                  e.target.style.transform = 'translateY(-2px)';
                  e.target.style.boxShadow = '0 4px 8px rgba(66, 133, 244, 0.4)';
                }}
                onMouseOut={(e) => {
                  e.target.style.backgroundColor = '#4285F4';
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = '0 2px 5px rgba(66, 133, 244, 0.3)';
                }}
              >
                <FaImage /> {showImageUploadInput ? 'Hide Image Upload' : 'Add Image'}
              </button>
            </div>

            {showContentURLInput && (
              <div className="form-group">
                <label className="form-label" style={{ color: '#333', fontWeight: 'bold' }}>Content URL</label>
                <input
                  className="form-input"
                  type="url"
                  value={contentURL}
                  onChange={(e) => setContentURL(e.target.value)}
                  placeholder="Enter YouTube or other video URL"
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
            )}

            {showImageUploadInput && (
              <div className="form-group">
                <label className="form-label" style={{ color: '#333', fontWeight: 'bold' }}>Upload Image</label>
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
                    transition: 'all 0.3s ease',
                    marginBottom: '10px'
                  }}
                >
                  <input
                    id="image-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    style={{ display: 'none' }}
                  />
                  <label htmlFor="image-upload" style={{ cursor: 'pointer', display: 'block' }}>
                    <div style={{ color: '#4285F4', marginBottom: '10px' }}>
                      <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                        <polyline points="17 8 12 3 7 8"></polyline>
                        <line x1="12" y1="3" x2="12" y2="15"></line>
                      </svg>
                    </div>
                    <p style={{ color: '#4285F4', fontSize: '16px', fontWeight: 'bold', margin: '0 0 8px' }}>
                      {imagePreview || existingImage ? 'Change image' : 'Drag & drop image here or click to browse'}
                    </p>
                  </label>
                </div>

                {renderImagePreview()}
              </div>
            )}

            <div style={{ margin: '30px 0', textAlign: 'center' }}>
              <button
                type="submit"
                className="submit-button"
                disabled={isSubmitting}
                style={{
                  width: '100%',
                  maxWidth: '400px',
                  padding: '15px 25px',
                  backgroundColor: '#FF6F61',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '10px',
                  fontSize: '18px',
                  cursor: isSubmitting ? 'not-allowed' : 'pointer',
                  fontWeight: 'bold',
                  transition: 'all 0.3s ease',
                  boxShadow: '0 4px 12px rgba(255, 111, 97, 0.3)',
                  letterSpacing: '0.5px',
                  opacity: isSubmitting ? 0.7 : 1
                }}
                onMouseOver={(e) => {
                  if (!isSubmitting) {
                    e.target.style.backgroundColor = '#E64A45';
                    e.target.style.transform = 'translateY(-2px)';
                    e.target.style.boxShadow = '0 6px 14px rgba(255, 111, 97, 0.4)';
                  }
                }}
                onMouseOut={(e) => {
                  if (!isSubmitting) {
                    e.target.style.backgroundColor = '#FF6F61';
                    e.target.style.transform = 'translateY(0)';
                    e.target.style.boxShadow = '0 4px 12px rgba(255, 111, 97, 0.3)';
                  }
                }}
              >
                {isSubmitting ? 'Updating Plan...' : 'Update Learning Plan'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
}

export default UpdateLearningPost;
