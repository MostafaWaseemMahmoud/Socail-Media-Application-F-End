import axios from 'axios';
import { createRef, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import './addpost.css'; // Ensure you have animations in CSS

const Addpost = () => {
  const { id } = useParams();
  const userProfileId = window.localStorage.getItem("Id");
  const navigate = useNavigate();

  const fileRef = createRef();
  const postTitleRef = createRef();
  const postDescRef = createRef();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (id !== userProfileId) {
      navigate("/");
    }
  }, [id, userProfileId, navigate]);

  const getPostData = async () => {
    const file = fileRef.current.files[0];
    const postTitle = postTitleRef.current.value;
    const postDescription = postDescRef.current.value;

    if (!postTitle || !postDescription || postTitle.length < 3 || postDescription.length < 3) {
      setError("(minimum 3 characters for title and description).");
      return;
    } else {
      setError('');
    }

    const formData = new FormData();
    if(file){
      formData.append('file', file);
    }
    formData.append('postTitle', postTitle);
    formData.append('postDescription', postDescription);

    try {
      setLoading(true);
      const response = await axios.post(`https://social-media-back-end-gamma.vercel.app/posts/addpost/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      console.log(response)
      setLoading(false);
      navigate(`/userprofile/${id}`);
    } catch (error) {
      setError("Error adding post. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className='Addpost'>
      {loading ? (
        <div className="loading-spinner">Loading...</div>
      ) : (
        <form>
          {error && <div className="error-message">{error}</div>}
          <input type="text" ref={postTitleRef} placeholder="Post Title" />
          <input type="text" ref={postDescRef} placeholder="Post Description" />
          <label htmlFor="file-upload" className="file-upload-label">
  📁 Add Media If Want
</label>
<input type="file" id="file-upload" ref={fileRef} className="file-input" />
          <button type="button" onClick={getPostData}>Add Post</button>
        </form>
      )}
    </div>
  );
};

export default Addpost;
