import axios from 'axios';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../header/Header';
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
      console.log(users)
      for(let i =0; i < users.length; i++){
        console.log(users[i].posts)
      }
    } catch (e) {
      console.error('Error fetching users:', e);
      setError(`${e.message}`);
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
    console.log({
        postId,
        userPostId,
        commentDescription: newComment, // Add the new comment text
        userid:window.localStorage.getItem("Id")
      })
    try {
      const res = await axios.post(`${API_URL}/posts/commentpost`, {
        postId,
        userPostId,
        commentDescription: newComment, // Add the new comment text
        userid:window.localStorage.getItem("Id")
      });
      console.log('res',res)
      setNewComment(''); // Clear the input field after submitting the comment
      getUsers(); // Refresh the posts to include the new comment
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  // Like a post
  const handleLikePost = async (postId, userId) => {
    try {
      const res = await axios.post(`${API_URL}/posts/likepost/${window.localStorage.getItem("Id")}/${userId}/${postId}`);
      getUsers(); // Refresh posts after liking a post
      console.log(res);
    } catch (error) {
      setError(error.response.data);
      setTimeout(() => {
        setError(null)
      }, 4000);
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
                                       {post.mediaUrl != "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEABsbGxscGx4hIR4qLSgtKj04MzM4PV1CR0JHQl2NWGdYWGdYjX2Xe3N7l33gsJycsOD/2c7Z//////////////8BGxsbGxwbHiEhHiotKC0qPTgzMzg9XUJHQkdCXY1YZ1hYZ1iNfZd7c3uXfeCwnJyw4P/Zztn////////////////CABEIALsBTQMBIgACEQEDEQH/xAAXAAEBAQEAAAAAAAAAAAAAAAAAAQIG/9oACAEBAAAAAOaAoAAABAACgAAAIAAKAAAAgAAoAAABAACgAAAIAACgAABAAAoAAACAAAoAAAgAABQAACACUAKAAAgAAAKAAgAAAAoAEAAAAAFCAAAAAAUgAACKAAAAAAgKAAAAAECgAAAAAICgAAAAEACgAAAAQAAUAAAIAAFAAAAgAAoAAAEAAAAUAgAAayAAAAAAH//EABQBAQAAAAAAAAAAAAAAAAAAAAD/2gAKAgIQAxAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD/xAAYEAEAAwEAAAAAAAAAAAAAAAACIVBxkP/aAAgBAQABPwDuMoS2q//EABQRAQAAAAAAAAAAAAAAAAAAAHD/2gAIAQIBAT8AfP/EABQRAQAAAAAAAAAAAAAAAAAAAHD/2gAIAQMBAT8AfP/Z" ? <img className="user-profile-pic-1" src={post.mediaUrl} alt="Post" /> : null}
                    </div>
                    <div className="post-actions">
                      <button onClick={() => handleLikePost(post.id, user._id)}>
                        Like
                      </button>
                      <span>{post.likes.length}Like</span>
                      <input
                        type="text"
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder="Add a comment"
                      />
                      <button onClick={() => handleCommentSubmit(post.id, user._id)}>
                        Comment
                      </button>
                    </div>
<div className="comments">
  <div className="in-comments-container">

  {post.comments && post.comments.length > 0 ? (
    post.comments.map((comment, idx) => {
      const commentedUser = users.find(u => u._id === comment.commentuserId);

      return (
        <div className="comment" key={idx}>
          <div className="comment-user">
            {commentedUser ? (
              <>
                              <div className='post-header' onClick={()=>navigate(`/userprofile/${commentedUser._id}`)}>
                                <img className='user-profile-pic' src={commentedUser.profilePic}/>
                                <h2>{commentedUser.name}</h2></div>
              </>
            ) : (
              <strong>Unknown User</strong>
            )}
          </div>
          <p>{comment.commentDescription}</p>
        </div>
      );
    })
  ) : (
    <p>No comments yet</p>
  )}
  </div>
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
