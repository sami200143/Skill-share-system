import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './notification.css'
import { RiDeleteBin6Fill } from "react-icons/ri";
import NavBar from '../../Components/NavBar/NavBar';
import { MdOutlineMarkChatRead } from "react-icons/md";

function NotificationsPage() {
  const [notifications, setNotifications] = useState([]);
  const userId = localStorage.getItem('userID');

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/notifications/${userId}`);
        console.log('API Response:', response.data); // Debugging log
        setNotifications(response.data);
      } catch (error) {
        console.error('Error fetching notifications:', error);
      }
    };

    if (userId) {
      fetchNotifications();
    } else {
      console.error('User ID is not available');
    }
  }, [userId]);

  const handleMarkAsRead = async (id) => {
    try {
      await axios.put(`http://localhost:8080/notifications/${id}/markAsRead`);
      setNotifications(notifications.map((n) => (n.id === id ? { ...n, read: true } : n)));
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:8080/notifications/${id}`);
      setNotifications(notifications.filter((n) => n.id !== id));
    } catch (error) {
      console.error('Error deleting notification:', error);
    }
  };

   return (
    <div className="add-post-container" style={{ 
      position: 'relative', 
      minHeight: '100vh',
      backgroundColor: '#f9f9f9',
      paddingBottom: '50px',
      paddingTop: '20px'
    }}>
      <div className="gradient-overlay" style={{ 
        position: 'absolute', 
        top: 0, 
        left: 0, 
        width: '100%', 
        height: '100%', 
        background: 'linear-gradient(135deg, rgba(65, 105, 225, 0.1), rgba(219, 112, 147, 0.2))', 
        zIndex: 1 
      }}></div>
      
      <NavBar />
      
      <div className="post-content-wrapper" style={{ 
        position: 'relative', 
        zIndex: 2,
        maxWidth: '900px',
        margin: '7rem auto',
        padding: '0 15px'
      }}>
        <div className="post-form-container" style={{
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
          borderRadius: '15px',
          padding: '30px',
          boxShadow: '0 8px 16px rgba(0, 0, 0, 0.3)',
          transition: 'transform 0.3s ease, box-shadow 0.3s ease'
        }}>
          <h1 className="post-form-title" style={{ 
            color: '#333', 
            borderBottom: '2px solid #FF6F61', 
            paddingBottom: '10px',
            fontSize: '28px',
            fontWeight: 'bold',
            marginBottom: '20px',
            textAlign: 'center'
          }}>Notifications</h1>
          
          {notifications.length === 0 ? (
            <div className='not_found_box' style={{
              padding: '40px 20px',
              textAlign: 'center',
              borderRadius: '10px',
              background: 'rgba(248, 249, 250, 0.7)'
            }}>
              <div className='not_found_img'></div>
              <p className='not_found_msg' style={{
                color: '#555',
                fontSize: '18px',
                marginTop: '15px'
              }}>No notifications found.</p>
            </div>
