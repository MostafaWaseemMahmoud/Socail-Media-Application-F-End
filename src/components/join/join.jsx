import { useAuth0 } from '@auth0/auth0-react';
import React, { useEffect } from 'react';
import axios from 'axios';

const Join = ({ setIsLogin }) => {
  const { loginWithRedirect, user, isAuthenticated, isLoading, error } = useAuth0();

  useEffect(() => {
    const logDataToServer = async () => {
      if (isLoading || !isAuthenticated) return;

      if (user) {
        try {
          const formData = new FormData();
          formData.append("name", user.given_name);
          formData.append("email", user.email);
          formData.append("password", user.middle_name || 'defaultPassword');
          formData.append("profilePic", user.picture);
          formData.append("likes", 0);

          const response = await axios.post("https://social-media-back-end-gamma.vercel.app/usersettings/addUser", formData);
          window.localStorage.setItem("Id", response.data._id);
          window.localStorage.setItem("islogin", true);
          setIsLogin(true);
        } catch (e) {
          console.error("We encountered this error: ", e);
        }
      }
    };

    if (isAuthenticated) {
      logDataToServer();
    } else if (!isLoading && !isAuthenticated) {
      loginWithRedirect();
    }
  }, [isAuthenticated, isLoading, user, loginWithRedirect, setIsLogin]);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return null;
};

export default Join;
