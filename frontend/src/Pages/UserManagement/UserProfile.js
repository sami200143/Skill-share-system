import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaEnvelope, FaPhone, FaTools, FaEdit } from 'react-icons/fa';
import './UserProfile.css';
import Pro from './img/img.png';
import Layout from '../../Components/Layout/Layout';

export const fetchUserDetails = async (userId) => {
    try {
        const response = await fetch(`http://localhost:8080/user/${userId}`);
        if (response.ok) {
            return await response.json();
        } else {
            console.error('Failed to fetch user details');
            return null;
        }
    } catch (error) {
        console.error('Error fetching user details:', error);
        return null;
    }
};

function UserProfile() {
    const [userData, setUserData] = useState(null);
    const navigate = useNavigate();
    const userId = localStorage.getItem('userID');
    const [googleProfileImage, setGoogleProfileImage] = useState(null);
    const [userType, setUserType] = useState(null);
    const [userProfileImage, setUserProfileImage] = useState(null);

    useEffect(() => {
        const userId = localStorage.getItem('userID');
        if (userId) {
            fetchUserDetails(userId).then((data) => setUserData(data));
        }
    }, []);

    useEffect(() => {
        const storedUserType = localStorage.getItem('userType');
        setUserType(storedUserType);
        if (storedUserType === 'google') {
            const googleImage = localStorage.getItem('googleProfileImage');
            setGoogleProfileImage(googleImage);
        } else if (userId) {
            fetchUserDetails(userId).then((data) => {
                if (data && data.profilePicturePath) {
                    setUserProfileImage(`http://localhost:8080/uploads/profile/${data.profilePicturePath}`);
                }
            });
        }
    }, [userId]);

    const handleDelete = () => {
        if (window.confirm("Are you sure you want to delete your profile?")) {
            fetch(`http://localhost:8080/user/${userId}`, {
                method: 'DELETE',
            })
                .then((response) => {
                    if (response.ok) {
                        alert("Profile deleted successfully!");
                        localStorage.removeItem('userID');
                        navigate('/'); // Redirect to home or login page
                    } else {
                        alert("Failed to delete profile.");
                    }
                })
                .catch((error) => console.error('Error:', error));
        }
    };

    const navigateToUpdate = () => {
        navigate(`/updateUserProfile/${userId}`);
    };

    return (
        <Layout>
            <div className="profile-layout" style={{ 
                position: 'relative', 
                zIndex: 2,
                maxWidth: '1200px',
                margin: '20px auto',
                padding: '0 15px',
                display: 'flex',
                flexDirection: 'column',
                gap: '30px'
            }}>
                <div className="profile-sidebar" style={{ 
                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                    borderRadius: '15px',
                    padding: '30px',
                    boxShadow: '0 8px 16px rgba(0, 0, 0, 0.1)',
                    marginBottom: '20px',
                    marginTop: '5rem',
                }}>
                    {userData && userData.id === localStorage.getItem('userID') && (
                        <>
                            <div className="profile-header-section">
                                <img
                                    src={
                                        googleProfileImage
                                            ? googleProfileImage
                                            : userProfileImage
                                                ? userProfileImage
                                                : Pro
                                    }
                                    alt="Profile"
                                    className="profile-avatar"
                                    style={{ 
                                        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
                                        border: '3px solid #FF6F61'
                                    }}
                                    onError={(e) => {
                                        e.target.onerror = null;
                                        e.target.src = Pro;
                                    }}
                                />
                                <h2 className="profile-name" style={{ color: '#333', marginTop: '15px' }}>{userData.fullname}</h2>
                                <span className="profile-role" style={{ color: '#FF6F61' }}>User</span>
                            </div>
                            
                            <div className="profile-quick-stats">
                                <div className="stat-box" style={{ 
                                    backgroundColor: 'rgba(255, 111, 97, 0.1)',
                                    borderRadius: '8px',
                                    transition: 'transform 0.3s'
                                }}>
                                    <span className="stat-number" style={{ color: '#FF6F61', fontWeight: 'bold' }}>12</span>
                                    <span className="stat-label" style={{ color: '#555' }}>Posts</span>
                                </div>
                                <div className="stat-box" style={{ 
                                    backgroundColor: 'rgba(66, 133, 244, 0.1)',
                                    borderRadius: '8px',
                                    transition: 'transform 0.3s'
                                }}>
                                    <span className="stat-number" style={{ color: '#4285F4', fontWeight: 'bold' }}>5</span>
                                    <span className="stat-label" style={{ color: '#555' }}>Skills</span>
                                </div>
                                <div className="stat-box" style={{ 
                                    backgroundColor: 'rgba(219, 112, 147, 0.1)',
                                    borderRadius: '8px',
                                    transition: 'transform 0.3s'
                                }}>
                                    <span className="stat-number" style={{ color: '#DB7093', fontWeight: 'bold' }}>3</span>
                                    <span className="stat-label" style={{ color: '#555' }}>Awards</span>
                                </div>
                            </div>
                        </>
                    )}
                </div>
                
                <div className="profile-main-content" style={{ 
                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                    borderRadius: '15px',
                    padding: '25px',
                    boxShadow: '0 8px 16px rgba(0, 0, 0, 0.1)'
                }}>
                    {userData && userData.id === localStorage.getItem('userID') && (
                        <div className="profile-details-section">
                            <div className="bio-section">
                                <h3 style={{ color: '#333', borderBottom: '2px solid #FF6F61', paddingBottom: '8px' }}>About Me</h3>
                                <p style={{ color: '#555', lineHeight: '1.6' }}>{userData.bio || "No bio added yet"}</p>
                            </div>
                            <div className="contact-info">
                                <h3 style={{ color: '#333', borderBottom: '2px solid #4285F4', paddingBottom: '8px' }}>Contact Information</h3>
                                <div className="info-item" style={{ margin: '10px 0' }}>
                                    <FaEnvelope className="info-icon" style={{ color: '#4285F4' }} />
                                    <span style={{ color: '#555' }}>{userData.email}</span>
                                </div>
                                <div className="info-item" style={{ margin: '10px 0' }}>
                                    <FaPhone className="info-icon" style={{ color: '#4285F4' }} />
                                    <span style={{ color: '#555' }}>{userData.phone || "Not provided"}</span>
                                </div>
                            </div>
                            <div className="skills-section">
                                <h3 style={{ color: '#333', borderBottom: '2px solid #DB7093', paddingBottom: '8px' }}>Skills</h3>
                                <div className="skills-list" style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                                    {userData.skills && userData.skills.map((skill, index) => (
                                        <span key={index} className="skill-badge" style={{ 
                                            backgroundColor: 'rgba(66, 133, 244, 0.1)', 
                                            color: '#4285F4',
                                            padding: '6px 12px',
                                            borderRadius: '20px',
                                            fontSize: '14px',
                                            fontWeight: 'bold',
                                            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
                                        }}>{skill}</span>
                                    ))}
                                </div>
                            </div>
                            <div className="button-section" style={{ 
                                marginTop: '30px', 
                                display: 'flex', 
                                gap: '20px',
                                justifyContent: 'center',
                                flexWrap: 'wrap'
                            }}>
                                <button 
                                    onClick={navigateToUpdate}
                                    className="action-button edit"
                                    style={{
                                        backgroundColor: '#4285F4',
                                        color: '#fff',
                                        border: 'none',
                                        borderRadius: '10px',
                                        padding: '15px 25px',
                                        fontSize: '18px',
                                        fontWeight: 'bold',
                                        cursor: 'pointer',
                                        transition: 'all 0.3s ease',
                                        boxShadow: '0 4px 12px rgba(66, 133, 244, 0.3)',
                                        minWidth: '160px',
                                        letterSpacing: '0.5px'
                                    }}
                                    onMouseOver={(e) => {
                                        e.target.style.backgroundColor = '#3367D6';
                                        e.target.style.transform = 'translateY(-2px)';
                                        e.target.style.boxShadow = '0 6px 14px rgba(66, 133, 244, 0.4)';
                                    }}
                                    onMouseOut={(e) => {
                                        e.target.style.backgroundColor = '#4285F4';
                                        e.target.style.transform = 'translateY(0)';
                                        e.target.style.boxShadow = '0 4px 12px rgba(66, 133, 244, 0.3)';
                                    }}
                                >
                                    <FaEdit style={{ marginRight: '10px', fontSize: '20px' }} /> Edit Profile
                                </button>
                                <button 
                                    onClick={handleDelete}
                                    className="action-button delete"
                                    style={{
                                        backgroundColor: '#FF6F61',
                                        color: '#fff',
                                        border: 'none',
                                        borderRadius: '10px',
                                        padding: '15px 25px',
                                        fontSize: '18px',
                                        fontWeight: 'bold',
                                        cursor: 'pointer',
                                        transition: 'all 0.3s ease',
                                        boxShadow: '0 4px 12px rgba(255, 111, 97, 0.3)',
                                        minWidth: '160px',
                                        letterSpacing: '0.5px'
                                    }}
                                    onMouseOver={(e) => {
                                        e.target.style.backgroundColor = '#E64A45';
                                        e.target.style.transform = 'translateY(-2px)';
                                        e.target.style.boxShadow = '0 6px 14px rgba(255, 111, 97, 0.4)';
                                    }}
                                    onMouseOut={(e) => {
                                        e.target.style.backgroundColor = '#FF6F61';
                                        e.target.style.transform = 'translateY(0)';
                                        e.target.style.boxShadow = '0 4px 12px rgba(255, 111, 97, 0.3)';
                                    }}
                                >
                                    Delete Account
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
            
            <div className="dashboard-cards" style={{ 
                display: 'flex',
                flexWrap: 'wrap',
                justifyContent: 'center', 
                gap: '20px',
                marginTop: '30px',
                position: 'relative',
                zIndex: 2
            }}>
                <div className="dashboard-card" 
                    onClick={() => (window.location.href = '/myLearningPlan')}
                    style={{
                        backgroundColor: 'rgba(255, 255, 255, 0.9)',
                        borderRadius: '15px',
                        padding: '25px',
                        boxShadow: '0 8px 16px rgba(0, 0, 0, 0.1)',
                        cursor: 'pointer',
                        transition: 'transform 0.3s, box-shadow 0.3s',
                        flex: '1 1 300px',
                        maxWidth: '350px'
                    }}
                    onMouseOver={(e) => {
                        e.currentTarget.style.transform = 'translateY(-5px)';
                        e.currentTarget.style.boxShadow = '0 12px 20px rgba(0, 0, 0, 0.2)';
                    }}
                    onMouseOut={(e) => {
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = '0 8px 16px rgba(0, 0, 0, 0.1)';
                    }}
                >
                    <div className="card-icon learning" style={{ 
                        backgroundColor: 'rgba(66, 133, 244, 0.1)',
                        color: '#4285F4',
                        width: '60px',
                        height: '60px',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0 auto 15px',
                        fontSize: '24px'
                    }}></div>
                    <div className="card-content" style={{ textAlign: 'center' }}>
                        <h3 style={{ color: '#4285F4', margin: '0 0 10px' }}>Learning Plan</h3>
                        <p style={{ color: '#555', margin: '0' }}>Track your progress</p>
                    </div>
                </div>
                <div className="dashboard-card" 
                    onClick={() => (window.location.href = '/myAllPost')}
                    style={{
                        backgroundColor: 'rgba(255, 255, 255, 0.9)',
                        borderRadius: '15px',
                        padding: '25px',
                        boxShadow: '0 8px 16px rgba(0, 0, 0, 0.1)',
                        cursor: 'pointer',
                        transition: 'transform 0.3s, box-shadow 0.3s',
                        flex: '1 1 300px',
                        maxWidth: '350px'
                    }}
                    onMouseOver={(e) => {
                        e.currentTarget.style.transform = 'translateY(-5px)';
                        e.currentTarget.style.boxShadow = '0 12px 20px rgba(0, 0, 0, 0.2)';
                    }}
                    onMouseOut={(e) => {
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = '0 8px 16px rgba(0, 0, 0, 0.1)';
                    }}
                >
                    <div className="card-icon posts" style={{ 
                        backgroundColor: 'rgba(255, 111, 97, 0.1)',
                        color: '#FF6F61',
                        width: '60px',
                        height: '60px',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0 auto 15px',
                        fontSize: '24px'
                    }}></div>
                    <div className="card-content" style={{ textAlign: 'center' }}>
                        <h3 style={{ color: '#FF6F61', margin: '0 0 10px' }}>My Posts</h3>
                        <p style={{ color: '#555', margin: '0' }}>View your content</p>
                    </div>
                </div>
                <div className="dashboard-card" 
                    onClick={() => (window.location.href = '/myAchievements')}
                    style={{
                        backgroundColor: 'rgba(255, 255, 255, 0.9)',
                        borderRadius: '15px',
                        padding: '25px',
                        boxShadow: '0 8px 16px rgba(0, 0, 0, 0.1)',
                        cursor: 'pointer',
                        transition: 'transform 0.3s, box-shadow 0.3s',
                        flex: '1 1 300px',
                        maxWidth: '350px'
                    }}
                    onMouseOver={(e) => {
                        e.currentTarget.style.transform = 'translateY(-5px)';
                        e.currentTarget.style.boxShadow = '0 12px 20px rgba(0, 0, 0, 0.2)';
                    }}
                    onMouseOut={(e) => {
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = '0 8px 16px rgba(0, 0, 0, 0.1)';
                    }}
                >
                    <div className="card-icon achievements" style={{ 
                        backgroundColor: 'rgba(219, 112, 147, 0.1)',
                        color: '#DB7093',
                        width: '60px',
                        height: '60px',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0 auto 15px',
                        fontSize: '24px'
                    }}></div>
                    <div className="card-content" style={{ textAlign: 'center' }}>
                        <h3 style={{ color: '#DB7093', margin: '0 0 10px' }}>Achievements</h3>
                        <p style={{ color: '#555', margin: '0' }}>Your milestones</p>
                    </div>
                </div>
            </div>
        </Layout>
    );
}

export default UserProfile;
