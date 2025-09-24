import { useAuth0 } from '@auth0/auth0-react';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import './userprofile.css';

const Userprofile = () => {
  const { id } = useParams();
  const [userAccount, setUserAccount] = useState(false);
  const [users,setUsers] = useState(null)
  const { logout } = useAuth0();
  const [user, setUser] = useState(null);
  const [isFriend, setIsFriend] = useState(false);
  const [allUsers, setAllUsers] = useState([]);
  const [userFriends, setUserFriends] = useState([]);
  const [newComment, setNewComment] = useState(''); // State for new comment
  const [refresh, setRefresh] = useState(false); // To refresh posts after like/comment
    const [error, setError] = useState(null); // Errors during fetch

  const navigate = useNavigate();
  const API_URL = "https://social-media-back-end-gamma.vercel.app";

  useEffect(() => {
  getUsers();
}, []);

  useEffect(() => {
    const storedId = window.localStorage.getItem('Id');
    setUserAccount(id === storedId);
  }, [id]);

    const getUsers = async () => {
    try {
      const res = await axios.get(API_URL + '/usersettings/users');
      setUsers(res.data); // Set all users in state
    } catch (e) {
      console.error('Error fetching users:', e);
    }
  };

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
  useEffect(() => {

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
      getUserData(); // Refresh the posts to include the new comment
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  return (
    <>
          {error && <div className="error">{error}</div>} {/* Show error message if there's an error */}
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
          {isFriend ? "Chat Following" : "Follow Him"}
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
                <span>{user.friends?.length || 0} Following</span>
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
                  {post.mediaUrl != "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEABsbGxscGx4hIR4qLSgtKj04MzM4PV1CR0JHQl2NWGdYWGdYjX2Xe3N7l33gsJycsOD/2c7Z//////////////8BGxsbGxwbHiEhHiotKC0qPTgzMzg9XUJHQkdCXY1YZ1hYZ1iNfZd7c3uXfeCwnJyw4P/Zztn////////////////CABEIALsBTQMBIgACEQEDEQH/xAAXAAEBAQEAAAAAAAAAAAAAAAAAAQIG/9oACAEBAAAAAOaAoAAABAACgAAAIAAKAAAAgAAoAAABAACgAAAIAACgAABAAAoAAACAAAoAAAgAABQAACACUAKAAAgAAAKAAgAAAAoAEAAAAAFCAAAAAAUgAACKAAAAAAgKAAAAAECgAAAAAICgAAAAEACgAAAAQAAUAAAIAAFAAAAgAAoAAAEAAAAUAgAAayAAAAAAH//EABQBAQAAAAAAAAAAAAAAAAAAAAD/2gAKAgIQAxAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD/xAAYEAEAAwEAAAAAAAAAAAAAAAACIVBxkP/aAAgBAQABPwDuMoS2q//EABQRAQAAAAAAAAAAAAAAAAAAAHD/2gAIAQIBAT8AfP/EABQRAQAAAAAAAAAAAAAAAAAAAHD/2gAIAQMBAT8AfP/Z" ? <img className="user-profile-pic-1" src={post.mediaUrl} alt="Post" /> : null}

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
                    <button onClick={() => handleCommentSubmit(post.id,id)}>Comment</button>
                  </div>

<div className="comments">
  <div className="in-comments-container">

  {post.comments && post.comments.length > 0 ? (
    post.comments.map((comment, idx) => {
      const commentedUser = users?.find(u => u._id === comment.commentuserId);

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
              )) : <p>No posts available.</p>}
            </div>
          </div>
        ) : <h2>Loading user data...</h2>}
      </div>
    </>
  );
};

export default Userprofile;
