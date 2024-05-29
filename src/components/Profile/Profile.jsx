import React, { useContext, useEffect, useState } from 'react';
import { AppContext } from '../../context/AppContext';
import { getUserData } from '../../services/users.service';
import { useNavigate } from 'react-router-dom';
import { Container, Typography, Button, CircularProgress, Box } from '@mui/material';

const Profile = () => {
  const { user, userData } = useContext(AppContext);
  const navigate = useNavigate();
  const [profileData, setProfileData] = useState(null);

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

  if (!profileData) {
    return <CircularProgress />;
  }

  return (
    <Container>
      <Box sx={{ mt: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Profile
        </Typography>
        <Typography variant="h6" gutterBottom>
          Username: {profileData.handle}
        </Typography>
        <Typography variant="h6" gutterBottom>
          Email: {profileData.email}
        </Typography>
        <Button variant="contained" color="primary" onClick={() => navigate('/edit-profile')}>
          Edit Profile
        </Button>
      </Box>
    </Container>
  );
};

export default Profile;
