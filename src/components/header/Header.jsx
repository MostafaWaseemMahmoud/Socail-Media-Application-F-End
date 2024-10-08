import React from 'react';
import './header.css';
import Search from '../search/Search';
import { useNavigate } from 'react-router-dom';

const Header = ({ user }) => {
  // Return early if no user is provided

  const navigate = useNavigate()

  if (!user) {
    return <p className='loading'>Loading...Header....Wait</p>;
  }
  

  const showUser = (user)=> {
    navigate(`/userprofile/${user._id}`)
  }

  return (
    <header>
        <div className="side">
          <img src="https://socialmedia-application1.netlify.app/vite.svg" alt="" />
          <Search />
        </div>
        <div className="side" onClick={() => showUser(user)}>
        <h1>{user.name}</h1>
        <img src={user.profilePic} alt="Profile" />
        </div>
    </header>
  );
};

export default Header;
