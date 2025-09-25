import axios from 'axios';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../header/Header';
import './main.css';

const Main = () => {
  const [user, setUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [newComment, setNewComment] = useState('');
  const navigate = useNavigate();
  const API_URL = 'https://social-media-back-end-gamma.vercel.app';

  const getUser = async () => {
    try {
      const currentUserId = window.localStorage.getItem('Id');
      const res = await axios.get(API_URL + '/usersettings/users');
      const currentUser = res.data.find((user) => user._id === currentUserId);

      if (currentUser) {
        setUser(currentUser);
      } else {
        setError('User not found');
      }
    } catch (e) {
      console.error('Error fetching user:', e);
      setError(`Error fetching user: ${e.message}`);
    } finally {
      setLoading(false);
    }
  };

  const getUsers = async () => {
    try {
      const res = await axios.get(API_URL + '/usersettings/users');
      setUsers(res.data);
    } catch (e) {
      console.error('Error fetching users:', e);
      setError(`${e.message}`);
    }
  };

  useEffect(() => {
    getUser();
    getUsers();
  }, []);

  const navigateToUserProfile = (userId) => {
    navigate(`/userprofile/${userId}`);
  };

  const GoLive = () => {
    navigate('/meet');
  };

  const handleCommentSubmit = async (postId, userPostId) => {
    if (!newComment) return;
    try {
      await axios.post(`${API_URL}/posts/commentpost`, {
        postId,
        userPostId,
        commentDescription: newComment,
        userid: window.localStorage.getItem('Id')
      });
      setNewComment('');
      getUsers();
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  const handleLikePost = async (postId, userId) => {
    try {
      await axios.post(`${API_URL}/posts/likepost/${window.localStorage.getItem("Id")}/${userId}/${postId}`);
      getUsers();
    } catch (error) {
      setError(error.response.data);
      setTimeout(() => {
        setError(null);
      }, 4000);
    }
  };

  return (
    <main>
      <button onClick={GoLive} className="meet">Go Meet</button>
      <Header user={user} />

      {error && <div className="error">{error}</div>}

      {loading ? (
        <div className="loading-container">
          <div className="loading-spinner"></div>
        </div>
      ) : (
        <div className="posts-container">
          {users.length > 0 ? (
            users.map((user) =>
              user.posts && user.posts.length > 0 ? (
                [...user.posts].reverse().map((post, index) => (
                  <div className="post" key={index}>
                    <div className="post-header">
                      <img
                        className="user-profile-pic"
                        src={user.profilePic}
                        alt="Profile"
                        onClick={() => navigateToUserProfile(user._id)}
                      />
                      <h2 onClick={() => navigateToUserProfile(user._id)}>
                        {user.name}
                      </h2>
                    </div>
                    <div className="post-content">
                      <h3>{post.postDescription}</h3>
                      {post.mediaUrl !== "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEABsbGxscGx4hIR4qLSgtKj04MzM4PV1CR0JHQl2NWGdYWGdYjX2Xe3N7l33gsJycsOD/2c7Z//////////////8BGxsbGxwbHiEhHiotKC0qPTgzMzg9XUJHQkdCXY1YZ1hYZ1iNfZd7c3uXfeCwnJyw4P/Zztn////////////////CABEIALsBTQMBIgACEQEDEQH/xAAXAAEBAQEAAAAAAAAAAAAAAAAAAQIG/9oACAEBAAAAAOaAoAAABAACgAAAIAAKAAAAgAAoAAABAACgAAAIAACgAABAAAoAAACAAAoAAAgAABQAACACUAKAAAgAAAKAAgAAAAoAEAAAAAFCAAAAAAUgAACKAAAAAAgKAAAAAECgAAAAAICgAAAAEACgAAAAQAAUAAAIAAFAAAAgAAoAAAEAAAAUAgAAayAAAAAAH//EABQBAQAAAAAAAAAAAAAAAAAAAAD/2gAKAgIQAxAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD/xAAYEAEAAwEAAAAAAAAAAAAAAAACIVBxkP/aAAgBAQABPwDuMoS2q//EABQRAQAAAAAAAAAAAAAAAAAAAHD/2gAIAQIBAT8AfP/EABQRAQAAAAAAAAAAAAAAAAAAAHD/2gAIAQMBAT8AfP/Z" && (
                        <img className="user-profile-pic-1" loading='lazy' src={post.mediaUrl} alt="Post" />
                      )}
                    </div>
                    <div className="post-actions">
                      <button onClick={() => handleLikePost(post.id, user._id)}>
                        Like
                      </button>
                      <span>{post.likes.length} Like</span>
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
                                    <div className="post-header" onClick={() => navigate(`/userprofile/${commentedUser._id}`)}>
                                      <img className="user-profile-pic" src={commentedUser.profilePic} alt="Comment User" />
                                      <h2>{commentedUser.name}</h2>
                                    </div>
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
            <p>No posts available.</p>
          )}
        </div>
      )}
    </main>
  );
};

export default Main;
