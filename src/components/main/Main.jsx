import { useEffect, useState } from 'react';
import axios from 'axios';
import Header from '../header/Header';
import { useNavigate } from 'react-router-dom';
import './main.css'; // Import your CSS file for styling if needed

const Main = () => {
  const [user, setUser] = useState(null); // State to store the current user's data
  const [users, setUsers] = useState([]); // State to store all users data
  const [error, setError] = useState(null); // State to store errors
  const [loading, setLoading] = useState(true); // State for loading
  const navigate = useNavigate(); // Initialize useNavigate

  // Function to fetch the logged-in user's data
  const getUser = async () => {
    try {
      const currentUserId = window.localStorage.getItem("Id"); // Get the current user's ID from localStorage
      const res = await axios.get("https://social-media-back-end-gamma.vercel.app/usersettings/users");
      const currentUser = res.data.find(user => user._id === currentUserId); // Find the current user
      
      if (currentUser) {
        setUser(currentUser); // Store the current user in state
      } else {
        setError("User not found"); // If the user isn't found
      }
    } catch (e) {
      console.error("Error fetching user:", e);
      setError(`Error fetching user: ${e.message}`);
    } finally {
      setLoading(false); // Stop loading
    }
  };

  // Function to fetch all users and their posts
  const getUsers = async () => {
    try {
      const res = await axios.get("https://social-media-back-end-gamma.vercel.app/usersettings/users");
      setUsers(res.data); // Set all users in state
    } catch (e) {
      console.error("Error fetching users:", e);
      setError(`Error fetching users: ${e.message}`);
    }
  };

  // useEffect to fetch user and users when the component mounts
  useEffect(() => {
    getUser(); // Fetch the logged-in user
    getUsers(); // Fetch all users
  }, []); // Empty dependency array ensures this runs once after the initial render

  // Function to handle navigation to the user profile
  const navigateToUserProfile = (userId) => {
    navigate(`/userprofile/${userId}`);
  };

  const GoLive = ()=> {
    navigate('/meet')
  }

  return (
    <main>
      <button onClick={GoLive} className='meet'>Go Meet</button>
      <Header user={user} /> {/* Pass the current user to Header */}
      {error && <div className="error">{error}</div>} {/* Display error message if any */}
      {loading ? ( // Show spinner while loading
        <div className="loading-container">
          <div className="loading-spinner"></div>
        </div>
      ) : (
        <div className="posts-container">
          {users.length > 0 ? (
            users.map((user) => (
              user.posts && user.posts.length > 0 ? ( // Check if user has posts
                user.posts.map((post, index) => (
                  <div className="post" key={index}>
                    <div className="post-header">
                      <img
                        className="user-profile-pic"
                        src={user.profilePic}
                        alt="Profile"
                        onClick={() => navigateToUserProfile(user._id)} // Navigate on click
                      />
                      <h2
                        onClick={() => navigateToUserProfile(user._id)} // Navigate on click
                        style={{ cursor: 'pointer', color: '#007bff' }} // Add styles for pointer and color
                      >
                        {user.name}
                      </h2>
                    </div>
                    <div className="post-content">
                      <h3>{post.postDescription}</h3> {/* Displaying post description */}
                      {post.mediaUrl && <img src={post.mediaUrl} alt="Post media" />} {/* Displaying media if available */}
                    </div>
                  </div>
                ))
              ) : null
            ))
          ) : (
            <p>No posts available.</p> // Message if no posts
          )}
        </div>
      )}
    </main>
  );
};

export default Main;
