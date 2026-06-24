import { useState } from 'react'
import { Show, SignInButton, SignUpButton, UserButton } from "@clerk/react";
import { Button } from '@heroui/react';
import { ThemeProvider } from "./context/ThemeContext.jsx";
import { WallpaperProvider } from "./context/WallpaperContext.jsx";
import { Route, Routes, Navigate } from 'react-router';
import ChatPage from './pages/ChatPage';
import AuthPage from './pages/AuthPage';
import { useAuth } from '@clerk/react';
import PageLoader from './components/PageLoader.jsx';
import { useAuthStore } from './store/useAuthStore.js';
import { useEffect } from 'react';
import { Toaster } from 'react-hot-toast';

function App() {
  const {isSignedIn,isLoaded} = useAuth()
      
      const clearAuth = useAuthStore((s)=>s.clearAuth);
      const checkAuth = useAuthStore((s)=>s.checkAuth);
      const isCheckingAuth = useAuthStore((s)=>s.isCheckingAuth);
      
      useEffect(() => {
        if(!isLoaded) return;
        if(isSignedIn) checkAuth();
        else clearAuth();
      },[checkAuth,clearAuth,isLoaded,isSignedIn])

      if (!isLoaded || isSignedIn && isCheckingAuth) {
        return <PageLoader/>
      }
  return (      
    <ThemeProvider>
      <WallpaperProvider>
        <Routes>
      <Route path="/" element={isSignedIn ? <ChatPage /> : <Navigate to={"/auth"} />} />
      <Route path="/auth" element={!isSignedIn ? <AuthPage /> : <Navigate to={"/"} />} />
    </Routes>
    <Toaster position="top-center"/>
    </WallpaperProvider>
    </ThemeProvider>
  )
}

export default App