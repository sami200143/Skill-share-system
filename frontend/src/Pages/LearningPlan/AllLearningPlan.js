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
