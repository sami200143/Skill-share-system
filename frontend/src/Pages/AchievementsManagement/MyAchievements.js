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
