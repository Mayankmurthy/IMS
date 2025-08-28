

import React, { useState, useEffect, useRef } from 'react';
import { BellFill } from 'react-bootstrap-icons';
import { useAuth } from '../AuthContext';
 
const backgroundColor = '#1a2b35';
const textColor = '#e8e3d9';
const notificationBackgroundColor = '#283d49';
const iconColor = textColor;
 
const styles = {
    iconContainer: {
        position: 'relative',
        cursor: 'pointer',
        display: 'inline-block',
    },
    icon: {
        fontSize: '24px',
        color: iconColor,
    },
    notificationBadge: {
        position: 'absolute',
        top: '-5px',
        right: '-5px',
        backgroundColor: '#dc3545',
        color: 'white',
        borderRadius: '50%',
        padding: '2px 6px',
        fontSize: '0.75em',
        fontWeight: 'bold',
        zIndex: 1, 
    },
    fixedContainer: {
        position: 'absolute',
        top: '100%',
        right: '0',
        marginTop: '10px',
        backgroundColor: '#fff',
        color: '#000',
        fontFamily: 'Arial, sans-serif',
        width: '450px',
        borderRadius: '5px',
        boxShadow: '0 2px 5px rgba(0, 0, 0, 0.3)',
        zIndex: 1050,
        overflow: 'hidden',
    },
    title: {
        textAlign: 'center',
        padding: '15px',
        marginBottom: 0,
        color: '#000',
        borderBottom: `1px solid ${notificationBackgroundColor}`,
        fontWeight: 'bold',
    },
    listContainer: {
        maxHeight: '300px',
        overflowY: 'auto',
        padding: '10px',
        backgroundColor: '#fff',
    },
    list: {
        listStyle: 'none',
        padding: 0,
        margin: 0,
        backgroundColor: '#fff',
    },
    listItem: {
        padding: '15px',
        marginBottom: '10px',
        borderRadius: '3px',
       
    },
    message: {
        margin: 0,
        backgroundColor: 'transparent',
        borderRadius: '3px',
    },
    timestamp: {
        fontSize: '0.8em',
        color: '#333',
        marginTop: '5px',
    },
    noNotifications: {
        textAlign: 'center',
        padding: '20px',
        color: '#aaa',
    },
    loading: {
        textAlign: 'center',
        padding: '20px',
        color: '#aaa',
    },
    error: {
        textAlign: 'center',
        padding: '20px',
        color: 'red',
    },
};
 
function Notifications() {
    const { user } = useAuth();
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isOpen, setIsOpen] = useState(false);
 
    const loggedInUsername = user?.username;
    const loggedInUserRole = user?.role;
 
   
    const notificationsRef = useRef(null);
 
    useEffect(() => {
        const fetchUserNotifications = async () => {
            if (!loggedInUsername || loggedInUserRole !== 'user') {
                setLoading(false);
                setNotifications([]);
                return;
            }
 
            try {
                const response = await fetch(
                    `http://localhost:5000/api/users/${loggedInUsername}/notifications`
                );
 
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
              
                setNotifications(data);
                setLoading(false);
            } catch (e) {
                setError("Failed to fetch notifications: " + e.message);
                console.error("Error fetching notifications:", e);
                setLoading(false);
            }
        };
 
        fetchUserNotifications();
 
        const intervalId = loggedInUserRole === 'user' ? setInterval(fetchUserNotifications, 3600000) : null;
 
        const handleClickOutside = (event) => {
            if (notificationsRef.current && !notificationsRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
 
        document.addEventListener('mousedown', handleClickOutside);
 
        return () => {
            if (intervalId) {
                clearInterval(intervalId);
            }
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [loggedInUsername, loggedInUserRole]);
 
    const toggleNotifications = () => {
        setIsOpen(!isOpen);
    };
 
    const getNotificationStyle = (type) => {
        if (type === 'expiration') {
            return {
                backgroundColor: '#ffe0b2', 
                border: '1px solid #ff9800', 
            };
        } else if (type === 'purchase') {
            return {
                backgroundColor: '#d4edda', 
                border: '1px solid #28a745', 
            };
        }
        return {};
    };
 
    return (
        loggedInUserRole === 'user' ? (
            <div style={styles.iconContainer} onClick={toggleNotifications} ref={notificationsRef}> 
                <BellFill style={styles.icon} />
                {notifications.length > 0 && !loading && (
                    <span style={styles.notificationBadge}>
                        {notifications.length}
                    </span>
                )}
                {isOpen && (
                    <div style={styles.fixedContainer}>
                    <h2 style={styles.title}>Notifications</h2>
                    <div style={styles.listContainer}>
                        {loading && <p style={styles.loading}>Loading notifications...</p>}
                        {error && <p style={styles.error}>{error}</p>}
                        {!loading && !error && notifications.length === 0 ? (
                            <p style={styles.noNotifications}>No notifications to display.</p>
                        ) : (
                            <ul style={styles.list}>
                                {!loading && !error && notifications.map((notification) => (
                                    <li key={notification.id || notification._id} style={{ ...styles.listItem, ...getNotificationStyle(notification.type) }}>
                                        <p style={styles.message}>{notification.message}</p>
                                        <span style={styles.timestamp}>
                                            {new Date(notification.timestamp).toLocaleString()}
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                    </div>
                )}
        </div>
        ) : null
    );
}
 
export default Notifications;
