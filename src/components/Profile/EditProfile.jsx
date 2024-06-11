import React, { useContext, useState, useEffect } from 'react';
import { AppContext } from '../../context/AppContext.jsx';
import { updateUserHandle } from '../../services/users.service.js';
import { uploadPhoto } from '../../services/storage.service.js';
import { Container, TextField, Button, Typography, Box, CircularProgress, Paper, Grid, Avatar } from '@mui/material';

const EditProfile = ({ cancelEditMode, initialData }) => {
  const { user, userData, setAppState } = useContext(AppContext);
  const [form, setForm] = useState({
    username: '',
    age: '',
    weight: '',
    height: '',
    phone: '',
    photoUrl: '',
  });
  const [photoFile, setPhotoFile] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (initialData) {
      setForm({
        username: initialData.handle || '',
        age: initialData.age || '',
        weight: initialData.weight || '',
        height: initialData.height || '',
        phone: initialData.phone || '',
        photoUrl: initialData.photoUrl || '',
      });
    }
  }, [initialData]);

  const updateForm = prop => e => {
    setForm({
      ...form,
      [prop]: e.target.value,
    });
  };

  const handleFileChange = e => {
    setPhotoFile(e.target.files[0]);
  };

  const validateForm = () => {
    const { username, age, weight, height, phone } = form;
    const phoneRegex = /^\d{10}$/;
    const ageRegex = /^\d+$/;
    const weightHeightRegex = /^\d+(\.\d+)?$/;
    if (!username || username.length < 2 || username.length > 20) {
      return 'Username must be between 2 and 20 characters';
    }
    if (!phoneRegex.test(phone)) {
      return 'Phone number must be 10 digits';
    }
    if (!ageRegex.test(age)) {
      return 'Age must be a valid number';
    }
    if (!weightHeightRegex.test(weight)) {
      return 'Weight must be a valid number';
    }
    if (!weightHeightRegex.test(height)) {
      return 'Height must be a valid number';
    }
    return null;
  };

  const saveProfile = async () => {
    const validationError = validateForm();
    if (!form.phone && !photoFile) return;
    if (validationError) {
      setError(validationError);
      return;
    }
    try {
      if (photoFile) {
        const photoUrl = await uploadPhoto(photoFile, user.uid);
        form.photoUrl = photoUrl;
      }
      await updateUserHandle(userData.handle, form);
      setAppState(prevState => ({
        ...prevState,
        userData: { ...prevState.userData, ...form }
      }));
      cancelEditMode();
    } catch (error) {
      setError('Failed to update profile:' + error.message);
    }
  };

  if (!form) {
    return <CircularProgress />;
  }

  return (
    <Container>
      <Box sx={{ mt: 4 }}>
        <Paper elevation={3} sx={{ padding: 4 }}>
          <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
            <Avatar 
              src={form.photoUrl} 
              sx={{ width: 100, height: 100, cursor: 'pointer' }} 
              onClick={cancelEditMode}
            />
          </Box>
          <Typography variant="h4" component="h1" gutterBottom>
            Edit Profile
          </Typography>
          {error && <Typography color="error">{error}</Typography>}
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                label="Username"
                value={form.username}
                onChange={updateForm('username')}
                fullWidth
                margin="normal"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Age"
                value={form.age}
                onChange={updateForm('age')}
                fullWidth
                margin="normal"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Weight"
                value={form.weight}
                onChange={updateForm('weight')}
                fullWidth
                margin="normal"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
               label="Height"
                value={form.height}
                onChange={updateForm('height')}
                fullWidth
                margin="normal"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Phone"
                value={form.phone}
                onChange={updateForm('phone')}
                fullWidth
                margin="normal"
              />
            </Grid>
            <Grid item xs={12}>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                style={{ margin: '20px 0' }}
              />
            </Grid>
            <Grid item xs={12}>
              <Button variant="contained" color="primary" onClick={saveProfile} sx={{ mr: 2 }}>
                Save
              </Button>
              <Button variant="outlined" color="secondary" onClick={cancelEditMode}>
                Cancel
              </Button>
            </Grid>
          </Grid>
        </Paper>
      </Box>
    </Container>
  );
};

export default EditProfile;
