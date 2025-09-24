import { useAuth0 } from '@auth0/auth0-react';
import axios from 'axios';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Join = ({ setIsLogin }) => {
  const { loginWithRedirect, user, isAuthenticated, isLoading, error } = useAuth0();
  const navigate = useNavigate();

  useEffect(() => {
    const logDataToServer = async () => {
      if (isLoading || !isAuthenticated) return;

      if (user) {
        try {
          // Prepare FormData to send to the backend
          const formData = new FormData();
          formData.append('name', user.given_name);
          formData.append('email', user.email);
          formData.append('password', user.middle_name || 'defaultPassword');
          formData.append('profilePic', user.picture);
          formData.append('likes', 0);

          // Send a POST request to register the user in the backend
          const response = await axios.post('http://localhost:3000/usersettings/addUser', formData);

          // Save user details in localStorage
          window.localStorage.setItem('Id', response.data._id);
          window.localStorage.setItem('islogin', 'true');
          setIsLogin(true); // Update the state in parent component (App.js)

          // After successful login and registration, navigate to the main page
          navigate('/main');
        } catch (e) {
          console.error('We encountered this error: ', e);
        }
      }
    };

    // If the user is authenticated, proceed to log the data
    if (isAuthenticated) {
      logDataToServer();
    } else if (!isLoading && !isAuthenticated) {
      loginWithRedirect(); // Redirect to the login page if not authenticated
    }
  }, [isAuthenticated, isLoading, user, loginWithRedirect, setIsLogin, navigate]); // Add navigate to dependencies

  // Show loading message or error if applicable
  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return null; // Return null while processing the authentication
};

export default Join;
