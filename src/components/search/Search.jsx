import React, { createRef, useState, useEffect } from 'react';
import "./search.css";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Search = () => {
  const searchField = createRef();
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);
  const [searchResults, setSearchResults] = useState([]);
  const navigate = useNavigate();

  const storeUsers = async () => {
    try {
      const res = await axios.get("https://social-media-back-end-gamma.vercel.app/usersettings/users");
      const currentUsers = res.data;

      if (currentUsers) {
        setUsers(currentUsers);
      } else {
        setError("No users found");
      }
    } catch (e) {
      console.error("Error fetching users:", e);
      setError(`Error fetching users: ${e.message}`);
    }
  };

  const search = () => {
    const searchFieldValue = searchField.current.value.toLowerCase();
    
    // Check if the search field is empty
    if (!searchFieldValue) {
      setSearchResults([]);
      return;
    }

    // Find users matching the search criteria (partial match)
    const foundUsers = users.filter((user) =>
      user.name.toLowerCase().includes(searchFieldValue)
    );

    if (foundUsers.length > 0) {
      setSearchResults(foundUsers);
    } else {
      setSearchResults([]);
    }
  };

  // Fetch users once on component mount
  useEffect(() => {
    storeUsers();
  }, []);

  useEffect(() => {
    if (error) {
      console.log(error);
    }
  }, [error]);

  const showUser = (id) => {
    navigate(`/userprofile/${id}`);
  };

  return (
    <div className="search-component">
      <div className="search">
        <i className="fa-solid fa-magnifying-glass" onClick={search}></i>
        <input
          type="search"
          ref={searchField}
          onKeyDown={(e) => e.key === 'Enter' && search()}
          onKeyUp={search}
        />
      </div>
      {searchResults.length === 0 && searchField.current?.value && (
        <span className='search-error'>No Users Found</span>
      )}
      {searchResults.length > 0 && (
        <div className="search-results">
          {searchResults.map((user) => (
            <div key={user._id} className="search-result" onClick={() => showUser(user._id)}>
              <img src={user.profilePic} alt={user.name} />
              <span>{user.name}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Search;
