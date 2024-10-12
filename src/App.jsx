import { useState, useEffect } from 'react';
import Main from './components/main/Main';
import Join from './components/join/join'; // Ensure the correct import casing
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Userprofile from './components/Userprofile/Userprofile';
import Addpost from './components/AddPost/Addpost';
import Chat from './components/chat/Chat';

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
        </Routes>
      </div>
    </Router>
  );
}

export default App;
