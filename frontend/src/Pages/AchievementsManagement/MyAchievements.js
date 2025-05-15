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
        