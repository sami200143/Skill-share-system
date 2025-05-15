import React, { useEffect, useState } from 'react';
import { FaEdit } from "react-icons/fa";
import { RiDeleteBin6Fill } from "react-icons/ri";
import { IoIosCreate } from "react-icons/io";
import Modal from 'react-modal';
import Layout from '../../Components/Layout/Layout';
import './AllAchievements.css';

Modal.setAppElement('#root');

function AllAchievements() {
  const [progressData, setProgressData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchQuery, setSearchQuery] = useState(''); // State for search query
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const userId = localStorage.getItem('userID');

  useEffect(() => {
    fetch('http://localhost:8080/achievements')
      .then((response) => response.json())
      .then((data) => {
        setProgressData(data);
        setFilteredData(data); // Initially show all data
      })
      .catch((error) => console.error('Error fetching Achievements data:', error));
  }, []);

    const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);

    // Filter achievements based on title or description
    const filtered = progressData.filter(
      (achievement) =>
        achievement.title.toLowerCase().includes(query) ||
        achievement.description.toLowerCase().includes(query)
    );
    setFilteredData(filtered);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this Achievement?')) {
      try {
        const response = await fetch(`http://localhost:8080/achievements/${id}`, {
          method: 'DELETE',
        });
        if (response.ok) {
          alert('Achievement deleted successfully!');
          setFilteredData(filteredData.filter((progress) => progress.id !== id));
        } else {
          alert('Failed to delete Achievement.');
        }
      } catch (error) {
        console.error('Error deleting Achievement:', error);
      }
    }
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
        
        