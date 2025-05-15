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
  //create handling delete

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