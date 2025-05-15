import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { IoSend } from "react-icons/io5";
import { FaEdit } from "react-icons/fa";
import { RiDeleteBin6Fill } from "react-icons/ri";
import { BiSolidLike } from "react-icons/bi";
import Modal from 'react-modal';
import { IoIosCreate } from "react-icons/io";
import { MdDelete } from "react-icons/md";
import { GrUpdate } from "react-icons/gr";
import { FiSave } from "react-icons/fi";
import { TbPencilCancel } from "react-icons/tb";
import { FaCommentAlt } from "react-icons/fa";
import Layout from '../../Components/Layout/Layout';
Modal.setAppElement('#root');

function MyAllPost() {
  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [postOwners, setPostOwners] = useState({});
  const [showMyPosts, setShowMyPosts] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMedia, setSelectedMedia] = useState(null);
  const [followedUsers, setFollowedUsers] = useState([]);
  const [newComment, setNewComment] = useState({});
  const [editingComment, setEditingComment] = useState({});
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const loggedInUserID = localStorage.getItem('userID');

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get('http://localhost:8080/posts');
        const userID = localStorage.getItem('userID');

        const userPosts = response.data.filter((post) => post.userID === userID);

        setPosts(userPosts);
        setFilteredPosts(userPosts);

        const userIDs = [...new Set(userPosts.map((post) => post.userID))];
        const ownerPromises = userIDs.map((userID) =>
          axios.get(`http://localhost:8080/user/${userID}`)
            .then((res) => ({
              userID,
              fullName: res.data.fullname,
            }))
            .catch((error) => {
              console.error(`Error fetching user details for userID ${userID}:`, error);
              return { userID, fullName: 'Anonymous' };
            })
        );
        const owners = await Promise.all(ownerPromises);
        const ownerMap = owners.reduce((acc, owner) => {
          acc[owner.userID] = owner.fullName;
          return acc;
        }, {});
        console.log('Post Owners Map:', ownerMap);
        setPostOwners(ownerMap);
      } catch (error) {
        console.error('Error fetching posts:', error);
      }
    };

    fetchPosts();
  }, []);

  useEffect(() => {
    const fetchFollowedUsers = async () => {
      const userID = localStorage.getItem('userID');
      if (userID) {
        try {
          const response = await axios.get(`http://localhost:8080/user/${userID}/followedUsers`);
          setFollowedUsers(response.data);
        } catch (error) {
          console.error('Error fetching followed users:', error);
        }
      }
    };

    fetchFollowedUsers();
  }, []);

  const handleDelete = async (postId) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this post?');
    if (!confirmDelete) {
      return;
    }

    try {
      await axios.delete(`http://localhost:8080/posts/${postId}`);
      alert('Post deleted successfully!');
      setPosts(posts.filter((post) => post.id !== postId));
      setFilteredPosts(filteredPosts.filter((post) => post.id !== postId));
    } catch (error) {
      console.error('Error deleting post:', error);
      alert('Failed to delete post.');
    }
  };

  const handleUpdate = (postId) => {
    navigate(`/updatePost/${postId}`);
  };

  const handleMyPostsToggle = () => {
    if (showMyPosts) {
      setFilteredPosts(posts);
    } else {
      setFilteredPosts(posts.filter((post) => post.userID === loggedInUserID));
    }
    setShowMyPosts(!showMyPosts);
  };

  const handleLike = async (postId) => {
    const userID = localStorage.getItem('userID');
    if (!userID) {
      alert('Please log in to like a post.');
      return;
    }
    try {
      const response = await axios.put(`http://localhost:8080/posts/${postId}/like`, null, {
        params: { userID },
      });

      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post.id === postId ? { ...post, likes: response.data.likes } : post
        )
      );

      setFilteredPosts((prevFilteredPosts) =>
        prevFilteredPosts.map((post) =>
          post.id === postId ? { ...post, likes: response.data.likes } : post
        )
      );
    } catch (error) {
      console.error('Error liking post:', error);
    }
  };


  const handleFollowToggle = async (postOwnerID) => {
    const userID = localStorage.getItem('userID');
    if (!userID) {
      alert('Please log in to follow/unfollow users.');
      return;
    }
    try {
      if (followedUsers.includes(postOwnerID)) {
        await axios.put(`http://localhost:8080/user/${userID}/unfollow`, { unfollowUserID: postOwnerID });
        setFollowedUsers(followedUsers.filter((id) => id !== postOwnerID));
      } else {
        await axios.put(`http://localhost:8080/user/${userID}/follow`, { followUserID: postOwnerID });
        setFollowedUsers([...followedUsers, postOwnerID]);
      }
    } catch (error) {
      console.error('Error toggling follow state:', error);
    }
  };

const handleAddComment = async (postId) => {
    const userID = localStorage.getItem('userID');
    if (!userID) {
      alert('Please log in to comment.');
      return;
    }
    const content = newComment[postId] || '';
    if (!content.trim()) {
      alert('Comment cannot be empty.');
      return;
    }
    try {
      const response = await axios.post(`http://localhost:8080/posts/${postId}/comment`, {
        userID,
        content,
      });

      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post.id === postId ? { ...post, comments: response.data.comments } : post
        )
      );

      setFilteredPosts((prevFilteredPosts) =>
        prevFilteredPosts.map((post) =>
          post.id === postId ? { ...post, comments: response.data.comments } : post
        )
      );

      setNewComment({ ...newComment, [postId]: '' });
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };
  const handleDeleteComment = async (postId, commentId) => {
    const userID = localStorage.getItem('userID');
    try {
      await axios.delete(`http://localhost:8080/posts/${postId}/comment/${commentId}`, {
        params: { userID },
      });

      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post.id === postId
            ? { ...post, comments: post.comments.filter((comment) => comment.id !== commentId) }
            : post
        )
      );

      setFilteredPosts((prevFilteredPosts) =>
        prevFilteredPosts.map((post) =>
          post.id === postId
            ? { ...post, comments: post.comments.filter((comment) => comment.id !== commentId) }
            : post
        )
      );
    } catch (error) {
      console.error('Error deleting comment:', error);
    }
  };
  const handleSaveComment = async (postId, commentId, content) => {
    try {
      const userID = localStorage.getItem('userID');
      await axios.put(`http://localhost:8080/posts/${postId}/comment/${commentId}`, {
        userID,
        content,
      });

      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post.id === postId
            ? {
              ...post,
              comments: post.comments.map((comment) =>
                comment.id === commentId ? { ...comment, content } : comment
              ),
            }
            : post
        )
      );

      setFilteredPosts((prevFilteredPosts) =>
        prevFilteredPosts.map((post) =>
          post.id === postId
            ? {
              ...post,
              comments: post.comments.map((comment) =>
                comment.id === commentId ? { ...comment, content } : comment
              ),
            }
            : post
        )
      );

      setEditingComment({});
    } catch (error) {
      console.error('Error saving comment:', error);
    }
  };

  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);

    const filtered = posts.filter(
      (post) =>
        post.title.toLowerCase().includes(query) ||
        post.description.toLowerCase().includes(query) ||
        (post.category && post.category.toLowerCase().includes(query))
    );
    setFilteredPosts(filtered);
  };

  const openModal = (mediaUrl) => {
    setSelectedMedia(mediaUrl);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedMedia(null);
    setIsModalOpen(false);
  };

  return (
    <Layout>
      <div className='continSection' style={{ 
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
            placeholder="Search posts by title, description, or category"
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
        
        <div className='add_new_btn' 
          onClick={() => (window.location.href = '/addNewPost')}
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
              <p className='not_found_msg' style={{ color: '#555', fontSize: '18px', margin: '20px 0' }}>No posts found. Please create a new post.</p>
              <button 
                className='not_found_btn' 
                onClick={() => (window.location.href = '/addNewPost')}
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
              >Create New Post</button>
            </div>
          ) : (
            filteredPosts.map((post) => (
              <div key={post.id} className='post_card' style={{
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                borderRadius: '15px',
                padding: '25px',
                boxShadow: '0 8px 16px rgba(0, 0, 0, 0.1)',
                marginBottom: '30px',
                transition: 'transform 0.3s, box-shadow 0.3s'
              }}>
                <div className='user_details_card' style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '15px',
                  borderBottom: '1px solid rgba(0, 0, 0, 0.1)',
                  paddingBottom: '10px'
                }}>
                  <div className='name_section_post'>
                    <p className='name_section_post_owner_name' style={{ 
                      fontWeight: 'bold', 
                      color: '#333',
                      margin: 0
                    }}>{postOwners[post.userID] || 'Anonymous'}</p>
                    {post.userID !== loggedInUserID && (
                      <button
                        className={followedUsers.includes(post.userID) ? 'flow_btn_unfalow' : 'flow_btn'}
                        onClick={() => handleFollowToggle(post.userID)}
                        style={{
                          backgroundColor: followedUsers.includes(post.userID) ? '#FF6F61' : '#4285F4',
                          color: '#fff',
                          border: 'none',
                          borderRadius: '20px',
                          padding: '5px 12px',
                          fontSize: '14px',
                          cursor: 'pointer',
                          marginLeft: '10px',
                          transition: 'background-color 0.3s',
                          boxShadow: followedUsers.includes(post.userID) 
                            ? '0 2px 5px rgba(255, 111, 97, 0.3)' 
                            : '0 2px 5px rgba(66, 133, 244, 0.3)'
                        }}
                      >
                        {followedUsers.includes(post.userID) ? 'Unfollow' : 'Follow'}
                      </button>
                    )}
                  </div>
                  {post.userID === loggedInUserID && (
                    <div>
                      <div className='action_btn_icon_post' style={{ display: 'flex', gap: '10px' }}>
                        <FaEdit
                          onClick={() => handleUpdate(post.id)} 
                          className='action_btn_icon'
                          style={{
                            color: '#4285F4',
                            cursor: 'pointer',
                            fontSize: '24px',
                            transition: 'transform 0.2s, color 0.2s',
                            padding: '12px',
                            borderRadius: '50%',
                            backgroundColor: 'rgba(66, 133, 244, 0.1)',
                            width: '50px',
                            height: '50px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}
                          onMouseOver={(e) => {
                            e.target.style.transform = 'scale(1.2)';
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
                            transition: 'transform 0.2s, color 0.2s',
                            padding: '12px',
                            borderRadius: '50%',
                            backgroundColor: 'rgba(255, 111, 97, 0.1)',
                            width: '50px',
                            height: '50px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}
                          onMouseOver={(e) => {
                            e.target.style.transform = 'scale(1.2)';
                            e.target.style.backgroundColor = 'rgba(255, 111, 97, 0.2)';
                          }}
                          onMouseOut={(e) => {
                            e.target.style.transform = 'scale(1)';
                            e.target.style.backgroundColor = 'rgba(255, 111, 97, 0.1)';
                          }}
                        />
                      </div>
                    </div>
                  )}
                </div>
                <div className='user_details_card_di' style={{ marginBottom: '15px' }}>
                  <p className='card_post_title' style={{ 
                    color: '#333', 
                    fontSize: '22px', 
                    fontWeight: 'bold',
                    marginBottom: '10px'
                  }}>{post.title}</p>
                  <p className='card_post_description' style={{ 
                    whiteSpace: "pre-line",
                    color: '#555',
                    fontSize: '16px',
                    lineHeight: '1.6',
                    marginBottom: '10px'
                  }}>{post.description}</p>
                  <p className='card_post_category' style={{ 
                    color: '#4285F4',
                    fontSize: '14px',
                    fontWeight: 'bold',
                    backgroundColor: 'rgba(66, 133, 244, 0.1)',
                    padding: '5px 10px',
                    borderRadius: '15px',
                    display: 'inline-block'
                  }}>Category: {post.category || 'Uncategorized'}</p>
                </div>
                <div className="media-collage" style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
                  gap: '10px',
                  marginBottom: '15px'
                }}>
                  {post.media.slice(0, 4).map((mediaUrl, index) => (
                    <div
                      key={index}
                      className={`media-item ${post.media.length > 4 && index === 3 ? 'media-overlay' : ''}`}
                      onClick={() => openModal(mediaUrl)}
                      style={{
                        position: 'relative',
                        overflow: 'hidden',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        height: '180px'
                      }}
                    >
                      {mediaUrl.endsWith('.mp4') ? (
                        <video controls style={{ width: '100%', height: '100%', objectFit: 'cover' }}>
                          <source src={`http://localhost:8080${mediaUrl}`} type="video/mp4" />
                          Your browser does not support the video tag.
                        </video>
                      ) : (
                        <img 
                          src={`http://localhost:8080${mediaUrl}`} 
                          alt="Post Media" 
                          style={{ 
                            width: '100%', 
                            height: '100%', 
                            objectFit: 'cover',
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
                      {post.media.length > 4 && index === 3 && (
                        <div className="overlay-text" style={{
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          width: '100%',
                          height: '100%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          backgroundColor: 'rgba(0, 0, 0, 0.5)',
                          color: '#fff',
                          fontSize: '24px',
                          fontWeight: 'bold'
                        }}>+{post.media.length - 4}</div>
                      )}
                    </div>
                  ))}
                </div>
                <div className='like_coment_lne' style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  padding: '10px 0',
                  borderTop: '1px solid rgba(0, 0, 0, 0.1)',
                  borderBottom: '1px solid rgba(0, 0, 0, 0.1)',
                  marginBottom: '15px'
                }}>
      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        contentLabel="Media Modal"
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
          onClick={closeModal}
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
        {selectedMedia && selectedMedia.endsWith('.mp4') ? (
          <video controls className="modal-media" style={{ maxWidth: '100%', maxHeight: '80vh', boxShadow: '0 5px 15px rgba(0, 0, 0, 0.3)' }}>
            <source src={`http://localhost:8080${selectedMedia}`} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        ) : (
          <img 
            src={`http://localhost:8080${selectedMedia}`} 
            alt="Full Media" 
            className="modal-media" 
            style={{ maxWidth: '100%', maxHeight: '80vh', boxShadow: '0 5px 15px rgba(0, 0, 0, 0.3)' }} 
          />
        )}
      </Modal>
    </Layout>
  );
}

export default MyAllPost;
