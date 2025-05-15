import React, { useState } from 'react';
import axios from 'axios';
import NavBar from '../../Components/NavBar/NavBar';
import './AddNewPost.css'; // Make sure to include the CSS filee

//create function for add post
function AddNewPost() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [media, setMedia] = useState([]);
  const [mediaPreviews, setMediaPreviews] = useState([]);
  const [categories, setCategories] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const userID = localStorage.getItem('userID');

  const handleMediaChange = (e) => {
    const files = Array.from(e.target.files);
    processMediaFiles(files);
  };
  const handleMediaChange = (e) => {
    const files = Array.from(e.target.files);
    processMediaFiles(files);
  };
}