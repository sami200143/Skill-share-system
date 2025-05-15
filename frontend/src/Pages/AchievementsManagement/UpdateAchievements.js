import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Layout from '../../Components/Layout/Layout';
import './AddAchievements.css';

function UpdateAchievements() {
  const { id } = useParams();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    category: '',
    postOwnerID: '',
    postOwnerName: '',
    imageUrl: ''
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewImage, setPreviewImage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
