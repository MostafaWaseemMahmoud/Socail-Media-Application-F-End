import React from 'react';
import './chat.css'
import { useParams } from 'react-router-dom';

const Chat = () => {
    const {FriendId} = useParams(); 
    const userId = window.localStorage.getItem("Id");
  return (
    <div>
        <h1>Chating You {userId} And  Your Friend {FriendId}</h1>
    </div>
  );
};

export default Chat;