import React, { useContext, useEffect, useState } from 'react';
import { AppContext } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';
import { Container, Typography, Button, CircularProgress, Box, Avatar } from '@mui/material';
import EditProfile from '../components/Profile/EditProfile';

const Profile = () => {
  const { user, userData } = useContext(AppContext);
  const navigate = useNavigate();
  const [editProfileMode, setEditProfileMode] = useState(false);
  
  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

  }, [user]);
  
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
          <>
            <Typography variant="h4" component="h1" gutterBottom>
              Profile
            </Typography>
            <Avatar src={userData.photoUrl} sx={{ width: 100, height: 100 }} />
            <Typography variant="h6" gutterBottom>
              Username: {userData.handle}
            </Typography>
            <Typography variant="h6" gutterBottom>
              Email: {userData.email}
            </Typography>
            <Typography variant="h6" gutterBottom>
              Phone: {userData.phone}
            </Typography>
            <Button variant="contained" color="primary" onClick={() => setEditProfileMode(true)}>
              Edit Profile
            </Button>
          </>
        )}
      </Box>
    </Container>
  );
};

export default Profile;