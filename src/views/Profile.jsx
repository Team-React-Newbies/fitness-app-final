import React, { useContext, useEffect, useState } from 'react';
import { AppContext } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';
import { Container, Typography, Button, CircularProgress, Box, Avatar, Paper, Grid } from '@mui/material';
import EditProfile from '../components/Profile/EditProfile';
import swimBackground from '../assets/Backgrounds/swim.jpg';


const Profile = () => {
  const { user, userData } = useContext(AppContext);
  const navigate = useNavigate();
  const [editProfileMode, setEditProfileMode] = useState(false);
  
  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
  }, [user, navigate]);
  
  const cancelEditMode = () => {
    setEditProfileMode(false);
  };

  if (!userData) {
    return <CircularProgress />;
  }

  return (
    <Container>
      <Box sx={{ mt: 4 }}>
        {editProfileMode ? (
          <EditProfile cancelEditMode={cancelEditMode} initialData={userData} />
        ) : (
          <Paper elevation={3} sx={{ padding: 4 }}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={4}>
                <Avatar src={userData.photoUrl} sx={{ width: 100, height: 100, mx: 'auto' }} />
              </Grid>
              <Grid item xs={12} md={8}>
                <Typography variant="h4" component="h1" gutterBottom>
                  Profile
                </Typography>
                <Typography variant="h6" gutterBottom>
                  Username: {userData.handle}
                </Typography>
                <Typography variant="h6" gutterBottom>
                  Email: {userData.email}
                </Typography>
                <Typography variant="h6" gutterBottom>
                  Phone: {userData.phone}
                </Typography>
                <Typography variant="h6" gutterBottom>
                  Name: {userData.name}
                </Typography>
                <Typography variant="h6" gutterBottom>
                  Age: {userData.age}
                </Typography>
                <Typography variant="h6" gutterBottom>
                  Weight: {userData.weight}
                </Typography>
                <Typography variant="h6" gutterBottom>
                  Height: {userData.height}
                </Typography>
                <Button variant="contained" color="primary" onClick={() => setEditProfileMode(true)} sx={{ mt: 2 }}>
                  Edit Profile
                </Button>
              </Grid>
            </Grid>
          </Paper>
        )}
      </Box>
    </Container>
  );
};

export default Profile;
