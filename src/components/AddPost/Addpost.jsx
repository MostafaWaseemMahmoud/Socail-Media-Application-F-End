import axios from 'axios';
import React, { useState, createRef, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import './addpost.css'
const Addpost = () => {
  const { id } = useParams();
  const userProfileId = window.localStorage.getItem("Id");
  const navigate = useNavigate();

  const fileRef = createRef();
  const postTitleRef = createRef();
  const postDescRef = createRef();

  const [loading, setLoading] = useState(false); // Loading state
  const [error, setError] = useState(''); // Error state

  useEffect(() => {
    if (id === userProfileId) {
      console.log("This Is The Correct Way");
    } else {
      navigate("/");
    }
  }, [id, userProfileId, navigate]);

  const getPostData = async () => {
    const file = fileRef.current.files[0]; // Use .files[0] to get the actual file
    const postTitle = postTitleRef.current.value;
    const postDescription = postDescRef.current.value;

    // Input validation
    if (!file || !postTitle || !postDescription || postTitle.length < 3 || postDescription.length < 3) {
      setError("Please fill out all fields with valid inputs (minimum 3 characters for title and description).");
      return; // Exit if validation fails
    } else {
      setError(''); // Clear any previous error messages
    }

    const formData = new FormData(); // Use FormData to send file
    formData.append('file', file);
    formData.append('postTitle', postTitle);
    formData.append('postDescription', postDescription);

    try {
      setLoading(true); // Start loading
      const response = await axios.post(
        `https://social-media-back-end-gamma.vercel.app/posts/addpost/${id}`,
        formData,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );
      console.log("Response", response);
      setLoading(false); // End loading
      navigate(`/Userprofile/${id}`); // Navigate to profile after post added
    } catch (error) {
      console.error("Error adding post", error);
      setError("Error adding post. Please try again."); // Set error message on request failure
      setLoading(false); // End loading if there's an error
    }
  };

  return (
    <div className='Addpost'>
      {loading ? (
        <div className="loading-spinner">Loading...</div> // Show loading spinner when loading
      ) : (
        <form>
          {error && <div className="error-message">{error}</div>} {/* Display error message */}
          <input type="text" ref={postTitleRef} placeholder="Post Title" />
          <input type="text" ref={postDescRef} placeholder="Post Description" />
          <input type="file" ref={fileRef} />
          <button type="button" onClick={getPostData}>Add Post</button>
        </form>
      )}
    </div>
  );
};

export default Addpost;
