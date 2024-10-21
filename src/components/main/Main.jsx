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
  const [newComment, setNewComment] = useState(''); // State for new comment
  const navigate = useNavigate(); // Initialize useNavigate
  const API_URL = "https://social-media-back-end-gamma.vercel.app";

  // Function to fetch the logged-in user's data
  const getUser = async () => {
    try {
      const currentUserId = window.localStorage.getItem("Id"); // Get the current user's ID from localStorage
      const res = await axios.get(API_URL + "/usersettings/users");
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
      const res = await axios.get(API_URL + "/usersettings/users");
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

  const GoLive = () => {
    navigate('/meet');
  };

  // Function to handle submitting a comment
  const handleCommentSubmit = async (postId, userPostId) => {
    if (!newComment) return; // Prevent submitting empty comments

    try {
      await axios.post(`${API_URL}/posts/commentpost`, {
        postId: postId, // ID of the post being commented on
        userPostId: userPostId, // ID of the user who owns the post
        commentDescription: newComment, // Comment text
      });
      setNewComment(''); // Clear the input field after submission
      getUsers(); // Refresh posts after commenting
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  // Function to handle liking a post
  const handleLikePost = async (postId,userId) => {
    try {
      await axios.post(`${API_URL}/posts/likepost/${userId}/${postId}`);
      getUsers(); // Refresh posts after liking
    } catch (error) {
      console.error("Error adding like:", error);
    }
  };

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
                      >
                        {user.name}
                      </h2>
                    </div>
                    <div className="post-content">
                      <h3>{post.postDescription}</h3> {/* Displaying post description */}
                      {post.mediaUrl && <img src={post.mediaUrl} alt="Post media" />} {/* Displaying media if available */}
                    </div>
                    <div className="post-actions">
                      <button onClick={() => handleLikePost(post._id,user._id)}>
                        Like
                      </button>
                      <span class="likes">{post.likes ? post.likes : 0} Likes</span> {/* Displaying number of likes */}
                      <input
                        type="text"
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder="Add a comment"
                      />
                      <button onClick={() => handleCommentSubmit(post._id, user._id)}>
                        Comment
                      </button>
                    </div>
                    <div className="comments">
                      {post.comments && post.comments.length > 0 ? (
                        post.comments.map((comment, idx) => (
                          <p key={idx}>{comment}</p>
                        ))
                      ) : (
                        <p>No comments yet</p>
                      )}
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
