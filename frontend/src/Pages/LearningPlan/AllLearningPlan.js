import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './post.css';
import { FaEdit } from "react-icons/fa";
import { RiDeleteBin6Fill } from "react-icons/ri";
import { IoIosCreate } from "react-icons/io";
import { HiCalendarDateRange } from "react-icons/hi2";
import Modal from 'react-modal';
import Layout from '../../Components/Layout/Layout';

Modal.setAppElement('#root');

function AllLearningPlan() {
  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showMyPosts, setShowMyPosts] = useState(false);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const userId = localStorage.getItem('userID');

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get('http://localhost:8080/learningPlan');
        setPosts(response.data);
        setFilteredPosts(response.data);
        
        // Extract unique categories
        const uniqueCategories = [...new Set(response.data.map(post => post.category))];
        setCategories(uniqueCategories.filter(Boolean)); // Filter out undefined/null categories
      } catch (error) {
        console.error('Error fetching posts:', error);
      }
    };

    fetchPosts();
  }, []);

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

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this post?');
    if (confirmDelete) {
      try {
        await axios.delete(`http://localhost:8080/learningPlan/${id}`);
        alert('Post deleted successfully!');
        setPosts(posts.filter((post) => post.id !== id));
        setFilteredPosts(filteredPosts.filter((post) => post.id !== id));
      } catch (error) {
        console.error('Error deleting post:', error);
        alert('Failed to delete post.');
      }
    }
  };

  const handleUpdate = (id) => {
    window.location.href = `/updateLearningPlan/${id}`;
  };

  const handleMyPostsToggle = () => {
    if (showMyPosts) {
      // Show all posts
      applyFilters(searchQuery, selectedCategory, false);
    } else {
      // Filter posts by logged-in user ID
      applyFilters(searchQuery, selectedCategory, true);
    }
    setShowMyPosts(!showMyPosts);
  };

  const handleCategoryChange = (category) => {
    if (selectedCategory === category) {
      setSelectedCategory('');
      applyFilters(searchQuery, '', showMyPosts);
    } else {
      setSelectedCategory(category);
      applyFilters(searchQuery, category, showMyPosts);
    }
  };

  const handleSearch = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    applyFilters(query, selectedCategory, showMyPosts);
  };

  const applyFilters = (query, category, onlyMyPosts) => {
    let filtered = [...posts];
    
    // Filter by search query
    if (query) {
      const lowerQuery = query.toLowerCase();
      filtered = filtered.filter(
        (post) =>
          post.title?.toLowerCase().includes(lowerQuery) ||
          post.description?.toLowerCase().includes(lowerQuery) ||
          post.postOwnerName?.toLowerCase().includes(lowerQuery) ||
          (post.category && post.category.toLowerCase().includes(lowerQuery)) ||
          (post.tags && post.tags.some(tag => tag.toLowerCase().includes(lowerQuery)))
      );
    }
    
    // Filter by category
    if (category) {
      filtered = filtered.filter(post => post.category === category);
    }
    
    // Filter by user's posts
    if (onlyMyPosts) {
      filtered = filtered.filter(post => post.postOwnerID === userId);
    }
    
    setFilteredPosts(filtered);
  };
  
  const openImageModal = (imageUrl) => {
    setSelectedImage(imageUrl);
    setIsModalOpen(true);
  };

  const closeImageModal = () => {
    setSelectedImage(null);
    setIsModalOpen(false);
  };

  const renderPostByTemplate = (post) => {
    if (!post.templateID) {
      return <div className="template template-default">Invalid template ID</div>;
    }

    switch (post.templateID) {
      case 1:
        return (
          <div className="template_dis template-1">
            <div className='user_details_card' style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '15px',
              borderBottom: '1px solid rgba(0, 0, 0, 0.1)',
              paddingBottom: '10px'
            }}>
              <div>
                <div className='name_section_post'>
                  <p className='name_section_post_owner_name' style={{ 
                    fontWeight: 'bold', 
                    color: '#333',
                    margin: 0
                  }}>{post.postOwnerName}</p>
                </div>
              </div>
              {post.postOwnerID === localStorage.getItem('userID') && (
                <div className='action_btn_icon_post' style={{ display: 'flex', gap: '15px' }}>
                  <FaEdit
                    onClick={() => handleUpdate(post.id)} 
                    className='action_btn_icon'
                    style={{
                      color: '#4285F4',
                      cursor: 'pointer',
                      fontSize: '24px',
                      transition: 'transform 0.2s',
                      padding: '10px',
                      borderRadius: '50%',
                      backgroundColor: 'rgba(66, 133, 244, 0.1)',
                      width: '45px',
                      height: '45px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                    onMouseOver={(e) => {
                      e.target.style.transform = 'scale(1.1)';
                      e.target.style.backgroundColor = 'rgba(66, 133, 244, 0.2)';
                    }}
                    onMouseOut={(e) => {
                      e.target.style.transform = 'scale(1)';
                      e.target.style.backgroundColor = 'rgba(66, 133, 244, 0.1)';
                    }}
                  />
                  <RiDeleteBin6Fill
                    onClick={() => handleDelete(post.id)}
                    className='action_btn_icon'
                    style={{
                      color: '#FF6F61',
                      cursor: 'pointer',
                      fontSize: '24px',
                      transition: 'transform 0.2s',
                      padding: '10px',
                      borderRadius: '50%',
                      backgroundColor: 'rgba(255, 111, 97, 0.15)', // Updated to a slightly darker background
                      width: '45px',
                      height: '45px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                    onMouseOver={(e) => {
                      e.target.style.backgroundColor = 'rgba(255, 111, 97, 0.2)';
                      e.target.style.transform = 'scale(1.1)';
                    }}
                    onMouseOut={(e) => {
                      e.target.style.backgroundColor = 'rgba(255, 111, 97, 0.15)';
                      e.target.style.transform = 'scale(1)';
                    }}
                  />
                </div>
              )}
            </div>
            <p className='template_title' style={{ 
              color: '#333', 
              fontSize: '22px', 
              fontWeight: 'bold',
              marginBottom: '10px'
            }}>{post.title}</p>
            <p className='template_dates' style={{ 
              color: '#555',
              fontSize: '16px',
              marginBottom: '10px',
              display: 'flex',
              alignItems: 'center',
              gap: '5px'
            }}><HiCalendarDateRange /> {post.startDate} to {post.endDate} </p>
            <p className='template_description' style={{ 
              color: '#4285F4',
              fontSize: '14px',
              fontWeight: 'bold',
              backgroundColor: 'rgba(66, 133, 244, 0.1)',
              padding: '5px 10px',
              borderRadius: '15px',
              display: 'inline-block'
            }}>{post.category}</p>
            <hr></hr>
            <p className='template_description' style={{ 
              whiteSpace: "pre-line",
              color: '#555',
              fontSize: '16px',
              lineHeight: '1.6',
              marginBottom: '10px'
            }}>{post.description}</p>
            <div className="tags_preview" style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '5px',
              marginBottom: '15px'
            }}>
              {post.tags?.map((tag, index) => (
                <span key={index} className="tagname" style={{
                  backgroundColor: 'rgba(66, 133, 244, 0.1)',
                  color: '#4285F4',
                  padding: '4px 8px',
                  borderRadius: '12px',
                  fontSize: '13px'
                }}>#{tag}</span>
              ))}
            </div>
            {post.imageUrl && (
              <img
                src={`http://localhost:8080/learningPlan/planImages/${post.imageUrl}`}
                alt={post.title}
                className="iframe_preview_dis"
                onClick={() => openImageModal(`http://localhost:8080/learningPlan/planImages/${post.imageUrl}`)}
                style={{
                  width: '100%',
                  borderRadius: '8px',
                  marginTop: '10px',
                  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                  maxHeight: '400px',
                  objectFit: 'contain',
                  cursor: 'pointer',
                  transition: 'transform 0.3s ease'
                }}
                onMouseOver={(e) => {
                  e.target.style.transform = 'scale(1.02)';
                }}
                onMouseOut={(e) => {
                  e.target.style.transform = 'scale(1)';
                }}
              />
            )}
            {post.contentURL && (
              <iframe
                src={getEmbedURL(post.contentURL)}
                title={post.title}
                className="iframe_preview_dis"
                frameBorder="0"
                allowFullScreen
                style={{
                  width: '100%',
                  height: '300px',
                  borderRadius: '8px',
                  marginTop: '10px',
                  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)'
                }}
              ></iframe>
            )}
          </div>
        );
      case 2:
        return (
          <div className="template_dis template-2">
            <div className='user_details_card' style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '15px',
              borderBottom: '1px solid rgba(0, 0, 0, 0.1)',
              paddingBottom: '10px'
            }}>
              <div>
                <div className='name_section_post'>
                  <p className='name_section_post_owner_name' style={{ 
                    fontWeight: 'bold', 
                    color: '#333',
                    margin: 0
                  }}>{post.postOwnerName}</p>
                </div>
                
              </div>
              {post.postOwnerID === localStorage.getItem('userID') && (
                <div className='action_btn_icon_post' style={{ display: 'flex', gap: '15px' }}>
                  <FaEdit
                    onClick={() => handleUpdate(post.id)} 
                    className='action_btn_icon'
                    style={{
                      color: '#4285F4',
                      cursor: 'pointer',
                      fontSize: '24px',
                      transition: 'transform 0.2s',
                      padding: '10px',
                      borderRadius: '50%',
                      backgroundColor: 'rgba(66, 133, 244, 0.1)',
                      width: '45px',
                      height: '45px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                    onMouseOver={(e) => {
                      e.target.style.transform = 'scale(1.1)';
                      e.target.style.backgroundColor = 'rgba(66, 133, 244, 0.2)';
                    }}
                    onMouseOut={(e) => {
                      e.target.style.transform = 'scale(1)';
                      e.target.style.backgroundColor = 'rgba(66, 133, 244, 0.1)';
                    }}
                  />
                  <RiDeleteBin6Fill
                    onClick={() => handleDelete(post.id)}
                    className='action_btn_icon'
                    style={{
                      color: '#FF6F61',
                      cursor: 'pointer',
                      fontSize: '24px',
                      transition: 'transform 0.2s',
                      padding: '10px',
                      borderRadius: '50%',
                      backgroundColor: 'rgba(255, 111, 97, 0.15)', // Updated to a slightly darker background
                      width: '45px',
                      height: '45px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                    onMouseOver={(e) => {
                      e.target.style.backgroundColor = 'rgba(255, 111, 97, 0.2)';
                      e.target.style.transform = 'scale(1.1)';
                    }}
                    onMouseOut={(e) => {
                      e.target.style.backgroundColor = 'rgba(255, 111, 97, 0.15)';
                      e.target.style.transform = 'scale(1)';
                    }}
                  />
                </div>
              )}
            </div>
            <p className='template_title' style={{ 
              color: '#333', 
              fontSize: '22px', 
              fontWeight: 'bold',
              marginBottom: '10px'
            }}>{post.title}</p>
            <p className='template_dates' style={{ 
              color: '#555',
              fontSize: '16px',
              marginBottom: '10px',
              display: 'flex',
              alignItems: 'center',
              gap: '5px'
            }}><HiCalendarDateRange /> {post.startDate} to {post.endDate} </p>
            <p className='template_description' style={{ 
              color: '#4285F4',
              fontSize: '14px',
              fontWeight: 'bold',
              backgroundColor: 'rgba(66, 133, 244, 0.1)',
              padding: '5px 10px',
              borderRadius: '15px',
              display: 'inline-block'
            }}>{post.category}</p>
            <hr></hr>
            <p className='template_description' style={{ 
              whiteSpace: "pre-line",
              color: '#555',
              fontSize: '16px',
              lineHeight: '1.6',
              marginBottom: '10px'
            }}>{post.description}</p>
            <div className="tags_preview" style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '5px',
              marginBottom: '15px'
            }}>
              {post.tags?.map((tag, index) => (
                <span key={index} className="tagname" style={{
                  backgroundColor: 'rgba(66, 133, 244, 0.1)',
                  color: '#4285F4',
                  padding: '4px 8px',
                  borderRadius: '12px',
                  fontSize: '13px'
                }}>#{tag}</span>
              ))}
            </div>
            <div className='preview_part' style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '15px',
              marginTop: '15px'
            }}>
              <div className='preview_part_sub'>
                {post.imageUrl && (
                  <img
                    src={`http://localhost:8080/learningPlan/planImages/${post.imageUrl}`}
                    alt={post.title}
                    className="iframe_preview"
                    onClick={() => openImageModal(`http://localhost:8080/learningPlan/planImages/${post.imageUrl}`)}
                    style={{
                      width: '100%',
                      borderRadius: '8px',
                      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                      height: '100%',
                      objectFit: 'cover',
                      cursor: 'pointer',
                      transition: 'transform 0.3s ease'
                    }}
                    onMouseOver={(e) => {
                      e.target.style.transform = 'scale(1.05)';
                    }}
                    onMouseOut={(e) => {
                      e.target.style.transform = 'scale(1)';
                    }}
                  />
                )}
              </div>
              <div className='preview_part_sub'>
                {post.contentURL && (
                  <iframe
                    src={getEmbedURL(post.contentURL)}
                    title={post.title}
                    className="iframe_preview"
                    frameBorder="0"
                    allowFullScreen
                    style={{
                      width: '100%',
                      height: '100%',
                      minHeight: '250px',
                      borderRadius: '8px',
                      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)'
                    }}
                  ></iframe>
                )}
              </div>
            </div>
          </div>
        );
      case 3:
        return (
          <div className="template_dis template-3">
            <div className='user_details_card' style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '15px',
              borderBottom: '1px solid rgba(0, 0, 0, 0.1)',
              paddingBottom: '10px'
            }}>
              <div>
                <div className='name_section_post'>
                  <p className='name_section_post_owner_name' style={{ 
                    fontWeight: 'bold', 
                    color: '#333',
                    margin: 0
                  }}>{post.postOwnerName}</p>
                </div>
                
              </div>
              {post.postOwnerID === localStorage.getItem('userID') && (
                <div className='action_btn_icon_post' style={{ display: 'flex', gap: '15px' }}>
                  <FaEdit
                    onClick={() => handleUpdate(post.id)} 
                    className='action_btn_icon'
                    style={{
                      color: '#4285F4',
                      cursor: 'pointer',
                      fontSize: '24px',
                      transition: 'transform 0.2s',
                      padding: '10px',
                      borderRadius: '50%',
                      backgroundColor: 'rgba(66, 133, 244, 0.1)',
                      width: '45px',
                      height: '45px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                    onMouseOver={(e) => {
                      e.target.style.transform = 'scale(1.1)';
                      e.target.style.backgroundColor = 'rgba(66, 133, 244, 0.2)';
                    }}
                    onMouseOut={(e) => {
                      e.target.style.transform = 'scale(1)';
                      e.target.style.backgroundColor = 'rgba(66, 133, 244, 0.1)';
                    }}
                  />
                  <RiDeleteBin6Fill
                    onClick={() => handleDelete(post.id)}
                    className='action_btn_icon'
                    style={{
                      color: '#FF6F61',
                      cursor: 'pointer',
                      fontSize: '24px',
                      transition: 'transform 0.2s',
                      padding: '10px',
                      borderRadius: '50%',
                      backgroundColor: 'rgba(255, 111, 97, 0.15)', // Updated to a slightly darker background
                      width: '45px',
                      height: '45px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                    onMouseOver={(e) => {
                      e.target.style.backgroundColor = 'rgba(255, 111, 97, 0.2)';
                      e.target.style.transform = 'scale(1.1)';
                    }}
                    onMouseOut={(e) => {
                      e.target.style.backgroundColor = 'rgba(255, 111, 97, 0.15)';
                      e.target.style.transform = 'scale(1)';
                    }}
                  />
                </div>
              )}
            </div>
            {post.imageUrl && (
              <img
                src={`http://localhost:8080/learningPlan/planImages/${post.imageUrl}`}
                alt={post.title}
                className="iframe_preview_dis"
                onClick={() => openImageModal(`http://localhost:8080/learningPlan/planImages/${post.imageUrl}`)}
                style={{
                  width: '100%',
                  borderRadius: '8px',
                  marginBottom: '15px',
                  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                  maxHeight: '350px',
                  cursor: 'pointer',
                  transition: 'transform 0.3s ease'
                }}
                onMouseOver={(e) => {
                  e.target.style.transform = 'scale(1.02)';
                }}
                onMouseOut={(e) => {
                  e.target.style.transform = 'scale(1)';
                }}
              />
            )}
            {post.contentURL && (
              <iframe
                src={getEmbedURL(post.contentURL)}
                title={post.title}
                className="iframe_preview_dis"
                frameBorder="0"
                allowFullScreen
                style={{
                  width: '100%',
                  height: '300px',
                  borderRadius: '8px',
                  marginBottom: '15px',
                  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)'
                }}
              ></iframe>
            )}
            <p className='template_title' style={{ 
              color: '#333', 
              fontSize: '22px', 
              fontWeight: 'bold',
              marginBottom: '10px'
            }}>{post.title}</p>
            <p className='template_dates' style={{ 
              color: '#555',
              fontSize: '16px',
              marginBottom: '10px',
              display: 'flex',
              alignItems: 'center',
              gap: '5px'
            }}><HiCalendarDateRange /> {post.startDate} to {post.endDate} </p>
            <p className='template_description' style={{ 
              color: '#4285F4',
              fontSize: '14px',
              fontWeight: 'bold',
              backgroundColor: 'rgba(66, 133, 244, 0.1)',
              padding: '5px 10px',
              borderRadius: '15px',
              display: 'inline-block'
            }}>{post.category}</p>
            <hr></hr>
            <p className='template_description' style={{ 
              whiteSpace: "pre-line",
              color: '#555',
              fontSize: '16px',
              lineHeight: '1.6',
              marginBottom: '10px'
            }}>{post.description}</p>
            <div className="tags_preview" style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '5px',
              marginBottom: '15px'
            }}>
              {post.tags?.map((tag, index) => (
                <span key={index} className="tagname" style={{
                  backgroundColor: 'rgba(66, 133, 244, 0.1)',
                  color: '#4285F4',
                  padding: '4px 8px',
                  borderRadius: '12px',
                  fontSize: '13px'
                }}>#{tag}</span>
              ))}
            </div>
          </div>
        );
      default:
        return (
          <div className="template template-default">
            <p>Unknown template ID: {post.templateID}</p>
          </div>
        );
    }
  };

  return (
    <Layout>
      <div className='continSection' style={{ 
        position: 'relative',
        zIndex: 2,
        maxWidth: '1200px',
        margin: '20px auto',
        padding: '0 15px',
        marginTop: '80px',
      }}>
        <div className='searchinput' style={{ 
          marginBottom: '20px',
          display: 'flex',
          justifyContent: 'center',
          width: '100%'
        }}>
          <input
            type="text"
            className="Auth_input"
            placeholder="Search learning plans by title, description, or category"
            value={searchQuery}
            onChange={handleSearch}
            style={{ 
              width: '70%', 
              padding: '12px', 
              borderRadius: '30px', 
              border: '1px solid #ccc', 
              fontSize: '16px', 
              boxShadow: 'inset 0 2px 4px rgba(0, 0, 0, 0.1)',
              textAlign: 'center'
            }}
          />
        </div>
        
        {/* Filter Buttons */}
        <div className='filter-buttons' style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '15px',
          marginBottom: '25px',
          flexWrap: 'wrap'
        }}>
          {userId && (
            <button 
              onClick={handleMyPostsToggle}
              className={`filter-btn ${showMyPosts ? 'active' : ''}`}
              style={{
                padding: '10px 20px',
                borderRadius: '20px',
                border: 'none',
                background: showMyPosts ? '#4285F4' : 'rgba(66, 133, 244, 0.1)',
                color: showMyPosts ? '#fff' : '#4285F4',
                fontWeight: 'bold',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                boxShadow: showMyPosts ? '0 4px 8px rgba(66, 133, 244, 0.3)' : 'none'
              }}
            >
              My Learning Plans
            </button>
          )}
          
          {categories.map(category => (
            <button
              key={category}
              onClick={() => handleCategoryChange(category)}
              className={`filter-btn ${selectedCategory === category ? 'active' : ''}`}
              style={{
                padding: '10px 20px',
                borderRadius: '20px',
                border: 'none',
                background: selectedCategory === category ? '#4285F4' : 'rgba(66, 133, 244, 0.1)',
                color: selectedCategory === category ? '#fff' : '#4285F4',
                fontWeight: 'bold',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                boxShadow: selectedCategory === category ? '0 4px 8px rgba(66, 133, 244, 0.3)' : 'none'
              }}
            >
              {category}
            </button>
          ))}
        </div>
        
        <div className='add_new_btn' 
          onClick={() => (window.location.href = '/addLearningPlan')}
          style={{
            backgroundColor: '#FF6F61',
            color: '#fff',
            borderRadius: '50%',
            width: '60px',
            height: '60px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 0 20px auto',
            boxShadow: '0 4px 12px rgba(255, 111, 97, 0.3)',
            cursor: 'pointer',
            transition: 'all 0.3s ease'
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.backgroundColor = '#E64A45';
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 6px 14px rgba(255, 111, 97, 0.4)';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.backgroundColor = '#FF6F61';
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 4px 12px rgba(255, 111, 97, 0.3)';
          }}
        >
          <IoIosCreate className='add_new_btn_icon' style={{ fontSize: '24px' }}/>
        </div>
        
        <div className='post_card_continer'>
          {filteredPosts.length === 0 ? (
            <div className='not_found_box' style={{
              backgroundColor: 'rgba(255, 255, 255, 0.9)',
              borderRadius: '15px',
              padding: '30px',
              boxShadow: '0 8px 16px rgba(0, 0, 0, 0.1)',
              textAlign: 'center',
              margin: '40px auto',
              maxWidth: '500px'
            }}>
              <div className='not_found_img'></div>
              <p className='not_found_msg' style={{ color: '#555', fontSize: '18px', margin: '20px 0' }}>
                {showMyPosts 
                  ? "You haven't created any learning plans yet." 
                  : selectedCategory 
                    ? `No learning plans found in the "${selectedCategory}" category.` 
                    : "No learning plans found. Please create a new learning plan."
                }
              </p>
              <button 
                className='not_found_btn' 
                onClick={() => (window.location.href = '/addLearningPlan')}
                style={{
                  backgroundColor: '#4285F4',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '12px 25px',
                  fontSize: '16px',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  boxShadow: '0 4px 8px rgba(66, 133, 244, 0.3)'
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
              >Create New Learning Plan</button>
            </div>
          ) : (
            <div className="posts-grid" style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
              gap: '25px'
            }}>
              {filteredPosts.map((post) => (
                <div key={post.id} className='post_card_new' style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.9)',
                  borderRadius: '15px',
                  padding: '25px',
                  boxShadow: '0 8px 16px rgba(0, 0, 0, 0.1)',
                  transition: 'transform 0.3s, box-shadow 0.3s',
                  height: '100%'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.transform = 'translateY(-5px)';
                  e.currentTarget.style.boxShadow = '0 12px 20px rgba(0, 0, 0, 0.15)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 8px 16px rgba(0, 0, 0, 0.1)';
                }}>
                  {renderPostByTemplate(post)}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      
      {/* Modal for displaying full-size images */}
      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeImageModal}
        contentLabel="Image Modal"
        className="media-modal"
        overlayClassName="media-modal-overlay"
        style={{
          overlay: {
            backgroundColor: 'rgba(0, 0, 0, 0.75)',
            zIndex: 1000,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
          },
          content: {
            position: 'relative',
            top: 'auto',
            left: 'auto',
            right: 'auto',
            bottom: 'auto',
            border: 'none',
            background: 'transparent',
            maxWidth: '90%',
            maxHeight: '90%',
            padding: 0
          }
        }}
      >
        <button 
          className="close-modal-btn" 
          onClick={closeImageModal}
          style={{
            position: 'absolute',
            top: '-40px',
            right: '-40px',
            backgroundColor: '#FF6F61',
            color: '#fff',
            border: 'none',
            borderRadius: '50%',
            width: '40px',
            height: '40px',
            fontSize: '20px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 2px 10px rgba(0, 0, 0, 0.3)',
            transition: 'all 0.2s ease'
          }}
          onMouseOver={(e) => {
            e.target.style.backgroundColor = '#E64A45';
            e.target.style.transform = 'scale(1.1)';
          }}
          onMouseOut={(e) => {
            e.target.style.backgroundColor = '#FF6F61';
            e.target.style.transform = 'scale(1)';
          }}
        >x</button>
        {selectedImage && (
          <img 
            src={selectedImage} 
            alt="Full Size" 
            className="modal-media" 
            style={{ maxWidth: '100%', maxHeight: '80vh', boxShadow: '0 5px 15px rgba(0, 0, 0, 0.3)' }} 
          />
        )}
      </Modal>
    </Layout>
  );
}

export default AllLearningPlan;