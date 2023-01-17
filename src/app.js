  import React from 'react';
import { Route, Routes, useNavigate } from 'react-router-dom';
import Login from './components/Login';
import Home from './container/Home';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { useEffect } from 'react';


const App = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const User = localStorage.getItem('user') !== 'undefined' ? JSON.parse(localStorage.getItem('user')) : localStorage.clear();

    if (!User) navigate('/login');
  }, []);

  return (
    <GoogleOAuthProvider clientId={`${process.env.REACT_APP_GOOGLE_API_TOKEN}`} >
      
      <Routes>
        <Route path="Login" element={<Login />} />
        <Route path="/*" element={<Home />} />
      </Routes>
      
    </GoogleOAuthProvider>
      
    
  )
}

export default App






