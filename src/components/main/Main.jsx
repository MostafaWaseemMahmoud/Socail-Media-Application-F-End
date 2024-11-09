import { useEffect, useState } from 'react';
import axios from 'axios';
import Header from '../header/Header';
import { useNavigate } from 'react-router-dom';
import './main.css'; // Import your CSS file for styling if needed

const Main = () => {
  const [user, setUser] = useState(null); // Current logged-in user data
  const [users, setUsers] = useState([]); // All users data
  const [error, setError] = useState(null); // Errors during fetch
  const [loading, setLoading] = useState(true); // Loading state for data
  const [newComment, setNewComment] = useState(''); // New comment state
  const navigate = useNavigate(); // Initialize useNavigate
  const API_URL = 'https://social-media-back-end-gamma.vercel.app';

  // Fetch the logged-in user data
  const getUser = async () => {
    try {
      const currentUserId = window.localStorage.getItem('Id'); // Retrieve the user's ID from localStorage
      const res = await axios.get(API_URL + '/usersettings/users');
      const currentUser = res.data.find((user) => user._id === currentUserId);

      if (currentUser) {
        setUser(currentUser); // Set current user in state
      } else {
        setError('User not found');
      }
    } catch (e) {
      console.error('Error fetching user:', e);
      setError(`Error fetching user: ${e.message}`);
    } finally {
      setLoading(false); // Stop loading after fetching user data
    }
  };

  // Fetch all users' data
  const getUsers = async () => {
    try {
      const res = await axios.get(API_URL + '/usersettings/users');
      setUsers(res.data); // Set all users in state
    } catch (e) {
      console.error('Error fetching users:', e);
      setError(`Error fetching users: ${e.message}`);
    }
  };

  // Run the fetch functions when the component mounts
  useEffect(() => {
    getUser(); // Fetch logged-in user data
    getUsers(); // Fetch all users
  }, []); // Empty array ensures this runs only once after the initial render

  // Navigate to user profile page
  const navigateToUserProfile = (userId) => {
    navigate(`/userprofile/${userId}`);
  };

  // Navigate to the 'Go Meet' page
  const GoLive = () => {
    navigate('/meet');
  };

  // Submit a comment on a post
  const handleCommentSubmit = async (postId, userPostId) => {
    if (!newComment) return; // Prevent empty comments from being submitted

    try {
      await axios.post(`${API_URL}/posts/commentpost`, {
        postId,
        userPostId,
        commentDescription: newComment, // Add the new comment text
      });
      setNewComment(''); // Clear the input field after submitting the comment
      getUsers(); // Refresh the posts to include the new comment
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  // Like a post
  const handleLikePost = async (postId, userId) => {
    try {
      await axios.post(`${API_URL}/posts/likepost/${userId}/${postId}`);
      getUsers(); // Refresh posts after liking a post
    } catch (error) {
      console.error('Error adding like:', error);
    }
  };

  return (
    <main>
      <button onClick={GoLive} className="meet">Go Meet</button>
      <Header user={user} /> {/* Pass the logged-in user to Header */}

      {error && <div className="error">{error}</div>} {/* Show error message if there's an error */}
      
      {loading ? (
        <div className="loading-container">
          <div className="loading-spinner"></div> {/* Add a spinner during loading */}
        </div>
      ) : (
        <div className="posts-container">
          {users.length > 0 ? (
            users.map((user) =>
              user.posts && user.posts.length > 0 ? ( // Check if the user has posts
                user.posts.map((post, index) => (
                  <div className="post" key={index}>
                    <div className="post-header">
                      <img
                        className="user-profile-pic"
                        src={user.profilePic}
                        alt="Profile"
                        onClick={() => navigateToUserProfile(user._id)} // Navigate to profile on click
                      />
                      <h2 onClick={() => navigateToUserProfile(user._id)}>
                        {user.name}
                      </h2>
                    </div>
                    <div className="post-content">
                      <h3>{post.postDescription}</h3> {/* Post description */}
                      {post.mediaUrl && <img src={post.mediaUrl} alt="Post media" />} {/* Display post media if available */}
                    </div>
                    <div className="post-actions">
                      <button onClick={() => handleLikePost(post._id, user._id)}>
                        Like
                      </button>
                      <span className="likes">{post.likes ? post.likes : 0} Likes</span>
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
                        post.comments.map((comment, idx) => <p key={idx}>{comment}</p>)
                      ) : (
                        <p>No comments yet</p>
                      )}
                    </div>
                  </div>
                ))
              ) : null
            )
          ) : (
            <p>No posts available.</p> // Message if no posts exist
          )}
        </div>
      )}
    </main>
  );
};

export default Main;
