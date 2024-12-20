import React, { createRef, useEffect, useState } from 'react';
import './chat.css';
import { useNavigate, useParams } from 'react-router-dom'; // Import useNavigate
import axios from 'axios';

const Chat = () => {
  const { FriendId } = useParams();
  const userId = window.localStorage.getItem("Id");
  const [room, setRoom] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [friendData, setFriendData] = useState(null);
  const [userData, setUserData] = useState(null);
  const inputRef = createRef();
  const navigate = useNavigate();
  const API_URL = "https://social-media-back-end-gamma.vercel.app"
  useEffect(() => {
    const fetchUserRooms = async () => {
      setLoading(true);
      try {
        const userRoomsResponse = await axios.get(API_URL + `/rooms/getuserrooms/${userId}`);
        const userRooms = userRoomsResponse.data;

        const existingRoom = userRooms.find(room => 
          room.roomUsers.includes(userId) && room.roomUsers.includes(FriendId)
        );

        if (existingRoom) {
          setRoom(existingRoom);
          setMessages(existingRoom.messages || []);
        } else {
          const newRoomResponse = await axios.post(API_URL + "/rooms/addroom", {
            user1ID: userId,
            user2ID: FriendId
          });
          setRoom(newRoomResponse.data);
          setMessage
          s([]);
        }

        // Fetch friend's data
        const friendResponse = await axios.get(API_URL + `/usersettings/users/${FriendId}`);
        setFriendData(friendResponse.data);

        // Fetch user data
        const userResponse = await axios.get(API_URL + `/usersettings/users/${userId}`);
        setUserData(userResponse.data);

      } catch (error) {
        const newRoomResponse = await axios.post(API_URL + "/rooms/addroom", {
          user1ID: userId,
          user2ID: FriendId
        });
        setRoom(newRoomResponse.data);
        setMessages([]);
              // Fetch friend's data
      const friendResponse = await axios.get(API_URL + `/usersettings/users/${FriendId}`);
      setFriendData(friendResponse.data);

      // Fetch user data
      const userResponse = await axios.get(API_URL + `/usersettings/users/${userId}`);
      setUserData(userResponse.data);
      }finally {
        setLoading(false)
      }
    };

    fetchUserRooms();
  }, [FriendId, userId]);

  const sendMessage = async () => {
    const messageContent = inputRef.current.value;
    if (!messageContent.trim()) return;

    try {
      const response = await axios.post(API_URL + `/rooms/addmessage/${room._id}`, {
        userId: userId,
        messageContent: messageContent
      });

      setMessages(response.data); // Add new message to the messages state
      inputRef.current.value = '';
    } catch (error) {
      console.error("Error sending message:", error.message);
    }
  };

  return (
    <div className='Room'>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          <button onClick={() => { navigate("/") }} className="home-button">Go Home</button> {/* Home button */}
          {!room ? (
            <p>No Rooms Yet</p>
          ) : (
            <div className="room-container">
              <h1>{room.roomTitle}</h1>
              {messages.length === 0 ? (
                <h1>No Messages Yet</h1>
              ) : (
                <div className="messages-container">
                  {messages.map((message, index) => (
                    <div key={index} className="message">
                      <div className="message-user">
                        {friendData && userData && (
                          <>
                            {message.userId === userId ? (
                              <>
                                <img src={userData.profilePic} alt={`${userData.name}'s profile`} className="profile_pic" />
                                <strong>{userData.name}:</strong>
                              </>
                            ) : (
                              <>
                                <img src={friendData.profilePic} alt={`${friendData.name}'s profile`} className="profile_pic" />
                                <strong>{friendData.name}:</strong>
                              </>
                            )}
                          </>
                        )}
                      </div>
                      <p>{message.message}</p>
                    </div>
                  ))}
                </div>
              )}
              <div className="input-area">
                <input type="text" ref={inputRef} placeholder="Type a message..." />
                <button onClick={sendMessage}>Send Message</button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Chat;
