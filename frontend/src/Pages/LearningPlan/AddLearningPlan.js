import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { IoMdAdd } from "react-icons/io";
import './post.css';
import './Templates.css';
import { FaVideo } from "react-icons/fa";
import { FaImage } from "react-icons/fa";
import { HiCalendarDateRange } from "react-icons/hi2";
import Layout from '../../Components/Layout/Layout'; 

function AddLearningPlan() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [contentURL, setContentURL] = useState('');
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState('');
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showContentURLInput, setShowContentURLInput] = useState(false);
  const [showImageUploadInput, setShowImageUploadInput] = useState(false);
  const [templateID, setTemplateID] = useState(null);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [category, setCategory] = useState('');
  const [isDragging, setIsDragging] = useState(false);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    setImagePreview(file ? URL.createObjectURL(file) : null);
  };

  const navigate = useNavigate();

  const handleAddTag = () => {
    if (tagInput.trim() !== '') {
      setTags([...tags, tagInput.trim()]);
      setTagInput('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (startDate === endDate) {
      alert("Start date and end date cannot be the same.");
      setIsSubmitting(false);
      return;
    }

    if (startDate > endDate) {
      alert("Start date cannot be greater than end date.");
      setIsSubmitting(false);
      return;
    }

    const postOwnerID = localStorage.getItem('userID');
    const postOwnerName = localStorage.getItem('userFullName');

    if (!postOwnerID) {
      alert('Please log in to add a post.');
      navigate('/');
      return;
    }

    if (tags.length < 2) {
      alert("Please add at least two tags.");
      setIsSubmitting(false);
      return;
    }

    if (!templateID) {
      alert("Please select a template.");
      setIsSubmitting(false);
      return;
    }

    try {
      let imageUrl = '';
      if (image) {
        const formData = new FormData();
        formData.append('file', image);
        const uploadResponse = await axios.post('http://localhost:8080/learningPlan/planUpload', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
        imageUrl = uploadResponse.data;
      }

      const newPost = {
        title,
        description,
        contentURL,
        tags,
        postOwnerID,
        postOwnerName,
        imageUrl,
        templateID,
        startDate, // New field
        endDate,   // New field
        category   // New field
      };

      // Submit the post data
      await axios.post('http://localhost:8080/learningPlan', newPost);
      alert('Post added successfully!');
      navigate('/allLearningPlan');
    } catch (error) {
      console.error('Error adding post:', error);
      alert('Failed to add post.');
    } finally {
      setIsSubmitting(false);
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
      return url; // Return the original URL if it's not a YouTube link
    } catch (error) {
      console.error('Invalid URL:', url);
      return ''; // Return an empty string for invalid URLs
    }
  };
  // Create templete

  return (
    <Layout>
      <div className="post-content-wrapper" style={{
        maxWidth: '800px',
        margin: '20px auto',
        padding: '0 15px'
      }}>
        {/* Keep template preview container as is */}
        <div className="template-preview-container">
          {/* Template 1 */}
          <div className="template template-1">
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
            {imagePreview && <img src={imagePreview} alt="Preview" className="iframe_preview" />}
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

          {/* Template 2 */}
          <div className="template template-2">
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
                {imagePreview && <img src={imagePreview} alt="Preview" className="iframe_preview_new" />}
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

          {/* Template 3 */}
          <div className="template template-3">
            <p className='template_id_one'>template 3</p>
            {imagePreview && <img src={imagePreview} alt="Preview" className="iframe_preview" />}
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
          }}>Add Learning Plan</h1>
          


          

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
                  }}>#{tag}</span>
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
                onChange={(e) => setTemplateID(e.target.value)}
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
                <FaVideo /> Add Video
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
                <FaImage /> Add Image
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
                  onDragOver={(e) => {
                    e.preventDefault();
                    setIsDragging(true);
                  }}
                  onDragLeave={(e) => {
                    e.preventDefault();
                    setIsDragging(false);
                  }}
                  onDrop={(e) => {
                    e.preventDefault();
                    setIsDragging(false);
                    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                      const file = e.dataTransfer.files[0];
                      setImage(file);
                      setImagePreview(URL.createObjectURL(file));
                    }
                  }}
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
                      Drag & drop image here or click to browse
                    </p>
                  </label>
                </div>

                {imagePreview && (
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
                        maxHeight: '200px',
                        display: 'block'
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => {
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
                )}
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
                {isSubmitting ? 'Creating Plan...' : 'Create Learning Plan'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
}

export default AddLearningPlan;