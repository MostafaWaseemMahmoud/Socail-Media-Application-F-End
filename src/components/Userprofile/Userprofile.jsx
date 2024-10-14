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
  const [Allusers, setAllusers] = useState(null);
  const [userFreinds, setUserFreinds] = useState([]);
  const navigate = useNavigate();

  // Check if the current profile belongs to the logged-in user
  useEffect(() => {
    const storedId = window.localStorage.getItem('Id');
    setUserAccount(id === storedId);
  }, [id]);

  // Fetch user data based on the 'id' from the URL params
  useEffect(() => {
    const getUserData = async (id) => {
      try {
        const res = await axios.get("https://social-media-back-end-gamma.vercel.app/users");
        const allUsers = res.data;
        setAllusers(allUsers);
        const foundUser = allUsers.find((user) => user._id === id);
        setUser(foundUser);

        // Check if the logged-in user is already a friend
        const loggedInUserId = window.localStorage.getItem("Id");
        if (foundUser && foundUser.friends && foundUser.friends.includes(loggedInUserId)) {
          setIsFriend(true); // Set to true if already friends
        } else {
          setIsFriend(false); // Set to false if not friends
        }
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    getUserData(id);
  }, [id]);

  // Add friend functionality
  const addFriend = async () => {
    const userId = window.localStorage.getItem("Id");

    try {
      const response = await axios.post("https://social-media-back-end-gamma.vercel.app/friendsettings/addfriend", {
        userId: userId,
        FriendId: id
      });

      // Automatically update the user's Friends array
      setUser((prevUser) => ({
        ...prevUser,
        Friends: [...prevUser.friends, userId], // Add logged-in user's ID to the Friends array
      }));

      // Update the isFriend state to true after adding a friend
      setIsFriend(true);
      console.log(response.data);
    } catch (error) {
      console.error("Error adding friend:", error);
    }
  };

  // Fetch user's friends
  const setUserFreindsFunc = () => {
    try {
      const friendsList = Allusers.filter(user_From_All => user.friends.includes(user_From_All._id));
      setUserFreinds(friendsList);
    } catch (error) {
      console.log("Error While Showing User Data:", error);
    }
  };

  useEffect(() => {
    if (user && Allusers) {
      setUserFreindsFunc();
    }
  }, [user, Allusers]);

  // Navigate to Home Page
  const navigateHome = () => {
    navigate('/'); // This path should match your home route
  };

  const addPost = ()=> {
    navigate(`/addpost/${id}`);
  }

  // Navigate to Friend's Profile
  const showUser = (id) => {
    navigate(`/userprofile/${id}`);
  };

  const GoChat = ()=> {
    navigate(`/chat/${id}`)
  }

  return (
    <>
      {userAccount ? (
        <>
        <button
          className="logoutButton"
          onClick={() => {
            logout({ logoutParams: { returnTo: window.location.origin } });
            window.localStorage.clear();
          }}
          >
          Log Out
        </button>
        <button
          className="addPost"
          onClick={() => {
            addPost()
          }}
        >
          Add Post
        </button>
          </>
      ) : isFriend ? (
        <>
        <button className="addFriendBtn" onClick={GoChat}>
          Chat Friend
        </button>
        </>
      ) : (
        <button className="addFriendBtn" onClick={addFriend}>
          Add Friend
        </button>
      )}

      {/* New Home Button */}
      <button className="homeButton" onClick={navigateHome}>
        Go to Home
      </button>

      <div className="userProfile">
        {user ? (
          <>
          <div className="userInfo">
            <img
              className="ProfileCover"
              src="http://scontent.fcai20-6.fna.fbcdn.net/v/t39.30808-6/458456965_524738193421132_2643238019393904708_n.jpg?_nc_cat=109&ccb=1-7&_nc_sid=cc71e4&_nc_eui2=AeE9tECO2Taw2r0aLJfYh76CEZjaz010jt0RmNrPTXSO3XR_n-qyhfvEFOF7wPwFlgo52X6uFx6bg2UseRinMMBU&_nc_ohc=o55MHGhjUIkQ7kNvgGjIXn-&_nc_ht=scontent.fcai20-6.fna&_nc_gid=ATtaBvEyOhpH-K8gprQ6_mt&oh=00_AYDY7tgA2tIrcVLrU55Q0Q9qhdSL05WJRllabdy8VoNX0g&oe=67099844"
              alt="Profile Cover"
              />
            <br />
            <div className="profile-details">
              <img className="profilePic" src={user.profilePic} alt="Profile Pic" />
              <div className="user-details">
                <h1>{user.name}</h1>
                <span>{user.friends?.length || 0} Friends</span>
                <div className="Friends">
                  {userFreinds.map((friend, index) => (
                    <img
                      key={index}
                      className="FriendprofilePic"
                      src={friend.profilePic}
                      alt={friend.name}
                      onClick={() => showUser(friend._id)}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>

          {user?.posts?.length > 0 ? (
  <div className="user-posts">
    {user.posts.map((post, index) => (
      <div className="post" key={index}>
        <div className="user-details">
          <img src={user.profilePic} alt="User" />
          <h1>{user.name}</h1>
        </div>
        <div className="post-detail">
          {/* Error handling for empty post description */}
          <h3>{post.postDescription.length > 0 ? post.postDescription : "No description available."}</h3>
        </div>
        {/* Conditional rendering for media */}
        {post.mediaUrl ? (
          <div className="post-pic">
            <img src={post.mediaUrl} alt="Post" />
          </div>
        ) : (
          <p>No media attached to this post.</p>
        )}
      </div>
    ))}
  </div>
) : (
  <p>No posts available.</p>
)}

        </>
        ) : (
          <p>Loading user profile...</p>
        )}


      </div>
    </>
  );
};

export default Userprofile;
