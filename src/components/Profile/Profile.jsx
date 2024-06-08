import React, { useContext, useEffect, useState } from 'react';
import { AppContext } from '../../context/AppContext';
import { getUserData } from '../../services/users.service';
import { useNavigate } from 'react-router-dom';
import { Container, Typography, Button, CircularProgress, Box, Avatar } from '@mui/material';
import EditProfile from './EditProfile';

const Profile = () => {
  const { user, userData } = useContext(AppContext);
  const navigate = useNavigate();
  const [profileData, setProfileData] = useState(null);
  const [editProfileMode, setEditProfileMode] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    const fetchProfileData = async () => {
      try {
        const snapshot = await getUserData(user.uid);
        const data = snapshot.val() && Object.values(snapshot.val())[0];
        setProfileData(data);
      } catch (error) {
        console.error("Failed to fetch profile data:", error);
      }
    };

    fetchProfileData();
  }, [user, navigate]);

  const cancelEditMode = () => {
    setEditProfileMode(false);
  };

  if (!profileData) {
    return <CircularProgress />;
  }

  return (
    <Container>
      <Box sx={{ mt: 4 }}>
        {editProfileMode ? (
          <EditProfile cancelEditMode={cancelEditMode} initialData={profileData} />
        ) : (
          <>
            <Typography variant="h4" component="h1" gutterBottom>
              Profile
            </Typography>
            <Avatar src={profileData.photoUrl} sx={{ width: 100, height: 100 }} />
            <Typography variant="h6" gutterBottom>
              Username: {profileData.handle}
            </Typography>
            <Typography variant="h6" gutterBottom>
              Email: {profileData.email}
            </Typography>
            <Typography variant="h6" gutterBottom>
              Phone: {profileData.phone}
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
