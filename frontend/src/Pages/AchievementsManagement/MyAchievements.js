import React, { useEffect, useState } from 'react';
import { FaEdit } from "react-icons/fa";
import { RiDeleteBin6Fill } from "react-icons/ri";
import Modal from 'react-modal';
import { IoIosCreate } from "react-icons/io";
import Layout from '../../Components/Layout/Layout';

Modal.setAppElement('#root');

function MyAchievements() {
  const [progressData, setProgressData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [showMyPosts, setShowMyPosts] = useState(false);
  const userId = localStorage.getItem('userID');
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    //filter user achievements00
    fetch('http://localhost:8080/achievements')
      .then((response) => response.json())
      .then((data) => {
        const userFilteredData = data.filter((achievement) => achievement.postOwnerID === userId);
        setProgressData(userFilteredData);
        setFilteredData(userFilteredData);
      })
      .catch((error) => console.error('Error fetching Achievements data:', error));
  }, [userId]);

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this Achievement?');
    if (!confirmDelete) {
      return;
    }
    
    try {
      const response = await fetch(`http://localhost:8080/achievements/${id}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        alert('Achievement deleted successfully!');
        setFilteredData(filteredData.filter((progress) => progress.id !== id));
        setProgressData(progressData.filter((progress) => progress.id !== id));
      } else {
        alert('Failed to delete Achievement.');
      }
    } catch (error) {
      console.error('Error deleting Achievement:', error);
      alert('Failed to delete Achievement.');
    }
  };

  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);

    const filtered = progressData.filter(
      (achievement) =>
        achievement.title.toLowerCase().includes(query) ||
        achievement.description.toLowerCase().includes(query)
    );
    setFilteredData(filtered);
  };

  const openModal = (imageUrl) => {
    setSelectedImage(imageUrl);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedImage(null);
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
            placeholder="Search achievements by title or description"
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
          onClick={() => (window.location.href = '/addAchievements')}
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
          {filteredData.length === 0 ? (
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
              <p className='not_found_msg' style={{ color: '#555', fontSize: '18px', margin: '20px 0' }}>No achievements found. Please create a new achievement.</p>
              <button 
                className='not_found_btn' 
                onClick={() => (window.location.href = '/addAchievements')}
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
              >Create New Achievement</button>
            </div>
          ) : (
            filteredData.map((progress) => (
              <div key={progress.id} className='post_card' style={{
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                borderRadius: '15px',
                padding: '25px',
                boxShadow: '0 8px 16px rgba(0, 0, 0, 0.1)',
                marginBottom: '30px',
                transition: 'transform 0.3s, box-shadow 0.3s'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = 'translateY(-5px)';
                e.currentTarget.style.boxShadow = '0 12px 20px rgba(0, 0, 0, 0.15)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 8px 16px rgba(0, 0, 0, 0.1)';
              }}
              >
                <div className='user_details_card' style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '15px',
                  borderBottom: '1px solid rgba(0, 0, 0, 0.1)',
                  paddingBottom: '10px'
                }}>
                  <div className='name_section_post_achi'>
                    <p className='name_section_post_owner_name' style={{ 
                      fontWeight: 'bold', 
                      color: '#333',
                      margin: 0
                    }}>{progress.postOwnerName}</p>
                    <div>
                      <p className='date_card_dte' style={{
                        fontSize: '14px',
                        color: '#666',
                        margin: '5px 0 0 0'
                      }}>{progress.date}</p>
                    </div>
                  </div>
                  {progress.postOwnerID === userId && (
                    <div>
                      <div className='action_btn_icon_post' style={{ display: 'flex', gap: '10px' }}>
                        <FaEdit
                          onClick={() => (window.location.href = `/updateAchievements/${progress.id}`)}
                          className='action_btn_icon'
                          style={{
                            color: '#4285F4',
                            cursor: 'pointer',
                            fontSize: '38px',
                            transition: 'transform 0.2s',
                            padding: '10px',
                            borderRadius: '50%',
                            backgroundColor: 'rgba(66, 133, 244, 0.1)'
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
                          onClick={() => handleDelete(progress.id)}
                          className='action_btn_icon'
                          style={{
                            color: '#FF6F61',
                            cursor: 'pointer',
                            fontSize: '38px',
                            transition: 'transform 0.2s',
                            padding: '10px',
                            borderRadius: '50%',
                            backgroundColor: 'rgba(255, 111, 97, 0.1)'
                          }}
                          onMouseOver={(e) => {
                            e.target.style.transform = 'scale(1.1)';
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
                <div className='dis_con'>
                  <p className='topic_cont' style={{ 
                    color: '#333', 
                    fontSize: '22px', 
                    fontWeight: 'bold',
                    marginBottom: '10px'
                  }}>{progress.title}</p>
                  <p className='dis_con_pera' style={{ 
                    whiteSpace: "pre-line",
                    color: '#555',
                    fontSize: '16px',
                    lineHeight: '1.6',
                    marginBottom: '10px'
                  }}>{progress.description}</p>

                  {progress.imageUrl && (
                    <div 
                      className="achievement-image-container"
                      style={{
                        marginTop: '15px',
                        borderRadius: '8px',
                        overflow: 'hidden',
                        maxWidth: '100%',
                        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                        cursor: 'pointer'
                      }}
                      onClick={() => openModal(`http://localhost:8080/achievements/images/${progress.imageUrl}`)}
                    >
                      <img
                        src={`http://localhost:8080/achievements/images/${progress.imageUrl}`}
                        alt="Achievement"
                        className='achievement_image'
                        style={{ 
                          width: '100%',
                          maxHeight: '400px',
                         
                          transition: 'transform 0.3s ease'
                        }}
                        onMouseOver={(e) => {
                          e.target.style.transform = 'scale(1.05)';
                        }}
                        onMouseOut={(e) => {
                          e.target.style.transform = 'scale(1)';
                        }}
                      />
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Modal for displaying full image */}
      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
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
        {selectedImage && (
          <img 
            src={selectedImage} 
            alt="Full Achievement" 
            className="modal-media" 
            style={{ maxWidth: '100%', maxHeight: '80vh', boxShadow: '0 5px 15px rgba(0, 0, 0, 0.3)' }} 
          />
        )}
      </Modal>
    </Layout>
  );
}

export default MyAchievements;
