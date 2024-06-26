import React, { useEffect, useState } from 'react';
import './App.css';
import Home from './views/Home.jsx';
import Footer from './components/Footer.jsx';
import Header from './components/Header/Header.jsx';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import NotFound from './views/NotFound.jsx';
import Login from './views/Login.jsx';
import AdminView from './views/AdminView.jsx';
import Authenticated from './hoc/Authenticated.jsx';
import { AppContext } from './context/AppContext.jsx';
import Register from './views/Register.jsx';
import { getUserData } from './services/users.service.js';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from './config/firebase-config.js';
import Exercises from './views/Exercises.jsx';
import Goals from './views/Goals.jsx';
import Profile from './views/Profile.jsx';
import EditProfile from './components/Profile/EditProfile.jsx';
import ExerciseVideos from './views/ExerciseVideos.jsx';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Surprise from './views/SurpriseChallengeView/SurpriseChallengeView.jsx';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});


function App() {
  const [appState, setAppState] = useState({
    user: null,
    userData: null,
  });
  const [user, loading, error] = useAuthState(auth);

  useEffect(() => {
    if (appState.user !== user) {
      setAppState({ ...appState, user });
    }
  }, [user, appState]);

  useEffect(() => {
    if (!appState.user) return;

    getUserData(appState.user.uid)
      .then(snapshot => {
        const userData = snapshot.val() && Object.values(snapshot.val())[0];
        setAppState(prevState => ({ ...prevState, userData }));
      })
      .catch(error => console.error("Failed to fetch user data:", error));
  }, [appState.user]);

  return (
        <ThemeProvider theme={darkTheme}>
    <BrowserRouter>
      <AppContext.Provider value={{ ...appState, setAppState }}>
        <div className="app-container">
          <Header />
          <div className="content-container">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/profile" element={<Authenticated><Profile /></Authenticated>} />
              <Route path="/edit-profile" element={<Authenticated><EditProfile /></Authenticated>} />
              <Route path="/admin-dashboard" element={<Authenticated><AdminView /></Authenticated>} />
              <Route path="/surprise-challenge" element={<Authenticated><Surprise /></Authenticated>} />
              <Route path="/exercise-videos" element={<Authenticated><ExerciseVideos/></Authenticated>} />
              <Route path="/exercises" element={<Authenticated><Exercises /></Authenticated>} />
              <Route path="/goals" element={<Authenticated><Goals /></Authenticated>} />
  
             <Route path="*" element={<NotFound />} />
            </Routes>
          </div>
          <Footer />
        </div>
      </AppContext.Provider>
    </BrowserRouter>
        </ThemeProvider>
  );
}

export default App;
