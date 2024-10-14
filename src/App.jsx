import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

// Import your components
import Main from './components/main/Main';
import Join from './components/join/Join'; // Ensure the correct import casing
import Userprofile from './components/Userprofile/Userprofile';
import Addpost from './components/AddPost/Addpost';
import Chat from './components/chat/Chat';
import Meet from './components/meet/Meet';

function App() {
  const [isLogin, setIsLogin] = useState(false);

  useEffect(() => {
    const loginStatus = window.localStorage.getItem("islogin");
    setIsLogin(loginStatus === 'true');
  }, []);

  return (
    <Router>
      <div>
        {/* Define your routes here */}
        <Routes>
          {/* Main route */}
          <Route path='/' element={isLogin ? <Main /> : <Join setIsLogin={setIsLogin} />} />
          {/* User profile route */}
          <Route path='/userprofile/:id' element={<Userprofile />} />
          <Route path='/addpost/:id' element={<Addpost />} />
          <Route path='/chat/:FriendId' element={<Chat />} />
          <Route path='/meet' element={<Meet />} />
          {/* Fallback route for unmatched paths */}
          <Route path='*' element={<h2>404 Not Found</h2>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
