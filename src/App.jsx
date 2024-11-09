import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

// Import your components
import Main from './components/main/Main';
import Join from './components/join/join'; // Ensure the correct import casing
import Userprofile from './components/Userprofile/Userprofile';
import Addpost from './components/AddPost/Addpost';
import Chat from './components/chat/Chat';
import Meet from './components/meet/Meet';
import Home from './components/home/Home';

function App() {
  const [isLogin, setIsLogin] = useState(false);

  // This useEffect hook will be triggered when the app starts
  useEffect(() => {
    const loginStatus = window.localStorage.getItem("islogin");
    if (loginStatus === 'true') {
      setIsLogin(true); // Set the login state to true if the user is logged in
    }
  }, []);

  return (
    <Router>
      <div>
        <Routes>
          {/* Main route */}
          <Route path='/' element={isLogin ? <Main /> : <Home />} />
          {/* User profile route */}
          <Route path='/userprofile/:id' element={<Userprofile />} />
          <Route path='/addpost/:id' element={<Addpost />} />
          <Route path='/chat/:FriendId' element={<Chat />} />
          <Route path='/meet' element={<Meet />} />
          <Route path='/join' element={<Join setIsLogin={setIsLogin} />} />
          <Route path='/main' element={<Main />} />
          {/* Fallback route for unmatched paths */}
          <Route path='*' element={<h2>404 Not Found</h2>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
