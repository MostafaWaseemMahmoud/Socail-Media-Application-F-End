import { useAuth0 } from '@auth0/auth0-react';
import React, { useEffect } from 'react';
import axios from 'axios';

const Join = ({ setIsLogin }) => {
    const { loginWithRedirect, user, isAuthenticated, isLoading, error } = useAuth0();

    useEffect(() => {
        const logDataToServer = async () => {
            if (isLoading || !isAuthenticated) return; // Wait until Auth0 finishes loading the session

            if (user) {
                try {
                    const formData = new FormData();
                    formData.append("name", user.given_name);
                    formData.append("email", user.email);
                    formData.append("password", user.middle_name || 'defaultPassword');
                    formData.append("profilePic", user.picture);

                    const response = await axios.post("https://social-media-back-end-gamma.vercel.app/usersettings/addUser", formData);
                    console.log("userData", response.data);
                    
                    window.localStorage.setItem("Id", response.data._id);
                    window.localStorage.setItem("islogin", true);
                    setIsLogin(true); // Update state to reflect login
                } catch (e) {
                    console.error("We encountered this error: ", e);
                }
            }
        };

        if (isAuthenticated) {
            logDataToServer();
        } else if (!isLoading && !isAuthenticated) {
            loginWithRedirect(); // Only call login if user is confirmed to be unauthenticated
        }
    }, [isAuthenticated, isLoading, user, loginWithRedirect, setIsLogin]);

    if (isLoading) {
        return <div>Loading...</div>; // Show loading until Auth0 confirms login state
    }

    if (error) {
        return <div>Error: {error.message}</div>; // Handle any potential errors from Auth0
    }

    return null;
};

export default Join;
