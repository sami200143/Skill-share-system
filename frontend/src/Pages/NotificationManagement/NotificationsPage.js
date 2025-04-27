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
          ) : (
            <div className="notifications-list">
              {notifications.map((notification) => (
                <div 
                  key={notification.id} 
                  className={`notification-item ${notification.read ? 'read' : 'unread'}`}
                  style={{
                    backgroundColor: notification.read ? 'rgba(255, 255, 255, 0.7)' : 'rgba(242, 247, 255, 0.95)',
                    padding: '15px 20px',
                    borderRadius: '10px',
                    marginBottom: '15px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    transition: 'all 0.3s ease',
                    boxShadow: notification.read 
                      ? '0 2px 5px rgba(0, 0, 0, 0.08)'
                      : '0 4px 8px rgba(66, 133, 244, 0.2)',
                    borderLeft: notification.read 
                      ? '4px solid #ccc' 
                      : '4px solid #4285F4'
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = notification.read
                      ? '0 4px 8px rgba(0, 0, 0, 0.12)'
                      : '0 6px 12px rgba(66, 133, 244, 0.3)';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = notification.read
                      ? '0 2px 5px rgba(0, 0, 0, 0.08)'
                      : '0 4px 8px rgba(66, 133, 244, 0.2)';
                  }}
                >
                  <div className='notification-content' style={{ flex: 1 }}>
                    <p className='notification-message' style={{
                      fontSize: '16px',
                      fontWeight: notification.read ? '400' : '600',
                      color: notification.read ? '#555' : '#333',
                      marginBottom: '8px'
                    }}>{notification.message}</p>
                    <p className='notification-time' style={{
                      fontSize: '13px',
                      color: '#777',
                      margin: 0
                    }}>{new Date(notification.createdAt).toLocaleString()}</p>
                  </div>
                  <div className='notification-actions' style={{
                    display: 'flex',
                    gap: '12px'
                  }}>
                    <MdOutlineMarkChatRead 
                      onClick={() => handleMarkAsRead(notification.id)}
                      style={{ 
                        display: notification.read ? 'none' : 'inline-block',
                        color: '#4285F4',
                        cursor: 'pointer',
                        fontSize: '22px',
                        transition: 'transform 0.2s ease',
                        padding: '8px',
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
                      onClick={() => handleDelete(notification.id)}
                      style={{
                        color: '#FF6F61',
                        cursor: 'pointer',
                        fontSize: '22px',
                        transition: 'transform 0.2s ease',
                        padding: '8px',
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
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default NotificationsPage;
