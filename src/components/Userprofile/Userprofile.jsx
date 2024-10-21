import { useAuth0 } from '@auth0/auth0-react';
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import './userprofile.css';
import axios from 'axios';

const Userprofile = () => {
  const { id } = useParams();
  const [userAccount, setUserAccount] = useState(false);
  const { logout } = useAuth0();
  const [user, setUser] = useState(null);
  const [isFriend, setIsFriend] = useState(false);
  const [allUsers, setAllUsers] = useState([]);
  const [userFriends, setUserFriends] = useState([]);
  const [newComment, setNewComment] = useState(''); // State for new comment
  const [refresh, setRefresh] = useState(false); // To refresh posts after like/comment
  const navigate = useNavigate();
  const API_URL = "https://social-media-back-end-gamma.vercel.app";

  useEffect(() => {
    const storedId = window.localStorage.getItem('Id');
    setUserAccount(id === storedId);
  }, [id]);

  useEffect(() => {
    const getUserData = async () => {
      try {
        const res = await axios.get(`${API_URL}/usersettings/users`);
        const foundUser = res.data.find((user) => user._id === id);
        setUser(foundUser);
        const loggedInUserId = window.localStorage.getItem("Id");
        setIsFriend(foundUser?.friends.includes(loggedInUserId) || false);
        setAllUsers(res.data);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    getUserData();
  }, [id, refresh]); // Refresh when new like/comment is added

  const addFriend = async () => {
    const userId = window.localStorage.getItem("Id");
    try {
      await axios.post(`${API_URL}/friendsettings/addfriend`, {
        userId: userId,
        FriendId: id
      });
      setUser((prevUser) => ({
        ...prevUser,
        friends: [...prevUser.friends, userId],
      }));
      setIsFriend(true);
    } catch (error) {
      console.error("Error adding friend:", error);
    }
  };

  useEffect(() => {
    if (user && allUsers.length) {
      const friendsList = allUsers.filter(user_From_All => user.friends.includes(user_From_All._id));
      setUserFriends(friendsList);
    }
  }, [user, allUsers]);

  const navigateHome = () => {
    navigate('/');
  };

  const addPost = () => {
    navigate(`/addpost/${id}`);
  };

  const showUser = (friendId) => {
    navigate(`/userprofile/${friendId}`);
  };

  const GoChat = () => {
    navigate(`/chat/${id}`);
  };

  const handleLikePost = async (postId) => {
    try {
      await axios.post(`${API_URL}/posts/likepost/${id}/${postId}`);
      setRefresh(!refresh); // Trigger a refresh to update likes
    } catch (error) {
      console.error("Error liking post:", error);
    }
  };

  const handleCommentSubmit = async (postId, userPostId) => {
    if (!newComment) return; // Prevent submitting empty comments
  
    try {
      await axios.post(`${API_URL}/posts/commentpost`, {
        postId: postId, // ID of the post being commented on
        userPostId: userPostId, // ID of the user who owns the post
        commentDescription: newComment, // Comment text
      });
  
      // Clear the input field after submission
      setNewComment('');
  
      // Update the state to add the new comment to the post without refreshing
      setUser((prevUser) => ({
        ...prevUser,
        posts: prevUser.posts.map((post) => {
          if (post._id === postId) {
            return {
              ...post,
              comments: [...post.comments, newComment], // Add new comment to comments array
            };
          }
          return post;
        }),
      }));
  
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  return (
    <>
      {userAccount ? (
        <>
          <button className="logoutButton" onClick={() => {
            logout({ returnTo: window.location.origin });
            window.localStorage.clear();
          }}>Log Out</button>
          <button className="addPost" onClick={addPost}>Add Post</button>
        </>
      ) : (
        <button className="addFriendBtn" onClick={isFriend ? GoChat : addFriend}>
          {isFriend ? "Chat Friend" : "Add Friend"}
        </button>
      )}
      <button className="homeButton" onClick={navigateHome}>Go to Home</button>
      <div className="userProfile">
        {user ? (
          <div className="userInfo">
            <img className="ProfileCover" src="https://scontent.fcai20-6.fna.fbcdn.net/v/t39.30808-6/458456965_524738193421132_2643238019393904708_n.jpg?_nc_cat=109&ccb=1-7&_nc_sid=cc71e4&_nc_ohc=3vTLTZvct2AQ7kNvgFBMip4&_nc_zt=23&_nc_ht=scontent.fcai20-6.fna&_nc_gid=AWKmwGrsq44yiiWAuqGwyYX&oh=00_AYDqx-h6UQFLcIfpFicnnNPlquR_Q-Kla1vJgVraxHytCg&oe=671C0D44" alt="Profile Cover" />
            <div className="profile-details">
              <img className="profilePic" src={user.profilePic} alt="Profile Pic" />
              <div className="user-details">
                <h1>{user.name}</h1>
                <span>{user.friends?.length || 0} Friends</span>
                <div className="Friends">
                  {userFriends.map((friend, index) => (
                    <img key={index} className="FriendprofilePic" src={friend.profilePic} alt={friend.name} onClick={() => showUser(friend._id)} />
                  ))}
                </div>
              </div>
            </div>
            <div className="user-posts">
              {user.posts.length ? user.posts.map((post, index) => (
                <div className="post" key={index}>
                  <div className="user-details">
                    <img src={user.profilePic} alt="User" />
                    <h1>{user.name}</h1>
                  </div>
                  <div className="post-detail">
                    <h3>{post.postDescription || "No description available."}</h3>
                  </div>
                  {post.mediaUrl && <img className="user-profile-pic-1" src={post.mediaUrl} alt="Post" />}
                  
                  <div className="post-actions">
                    <button onClick={() => handleLikePost(post._id)}>Like</button>
                    <span>{post.likes ? post.likes : 0} Likes</span> {/* Display number of likes */}
                    <input
                      type="text"
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      placeholder="Add a comment"
                    />
                    <button onClick={() => handleCommentSubmit(post._id,id)}>Comment</button>
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
              )) : <p>No posts available.</p>}
            </div>
          </div>
        ) : <h2>Loading user data...</h2>}
      </div>
    </>
  );
};

export default Userprofile;
