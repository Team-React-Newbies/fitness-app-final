import React, { useContext, useState } from 'react';
import { AppContext } from '../../context/AppContext.jsx';
import { updateUserHandle } from '../../services/users.service.js';
import { useNavigate } from 'react-router-dom';
import { Container, TextField, Button, Typography, Box } from '@mui/material';

const EditProfile = () => {
  const { user, userData, setAppState } = useContext(AppContext);
  const [form, setForm] = useState({
    handle: userData.handle,
    email: userData.email
  });
  const navigate = useNavigate();

  const updateForm = prop => e => {
    setForm({
      ...form,
      [prop]: e.target.value,
    });
  };

  const saveProfile = async () => {
    try {
      await updateUserHandle(userData.handle, form);
      setAppState(prevState => ({
        ...prevState,
        userData: { ...prevState.userData, ...form }
      }));
      navigate('/profile');
    } catch (error) {
      console.error('Failed to update profile:', error);
    }
  };

  return (
    <Container>
      <Box sx={{ mt: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Edit Profile
        </Typography>
        <TextField
          label="Username"
          value={form.handle}
          onChange={updateForm('handle')}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Email"
          value={form.email}
          onChange={updateForm('email')}
          fullWidth
          margin="normal"
        />
        <Button variant="contained" color="primary" onClick={saveProfile}>
          Save
        </Button>
      </Box>
    </Container>
  );
};

export default EditProfile;
