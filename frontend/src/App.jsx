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
function App() {
  const {isSignedIn,isLoaded} = useAuth()
      if (!isLoaded) {
        return <PageLoader/>
      }
  return (      
    <ThemeProvider>
      <WallpaperProvider>
        <Routes>
      <Route path="/" element={isSignedIn ? <ChatPage /> : <Navigate to={"/auth"} />} />
      <Route path="/auth" element={!isSignedIn ? <AuthPage /> : <Navigate to={"/"} />} />
    </Routes>
    </WallpaperProvider>
    </ThemeProvider>
  )
}

export default App