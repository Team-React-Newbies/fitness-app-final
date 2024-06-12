import React, { useContext, useState, useEffect } from 'react';
import { AppContext } from '../../context/AppContext.jsx';
import { updateUserHandle } from '../../services/users.service.js';
import { uploadPhoto } from '../../services/storage.service.js';
import { Container, TextField, Button, Typography, Box, CircularProgress, Paper, Grid, Avatar, Snackbar, Alert } from '@mui/material';

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
  const [successMessage, setSuccessMessage] = useState('');

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

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      try {
        const photoUrl = await uploadPhoto(file, `temp/${file.name}`);
        setPhotoFile(file);
        setForm(form => ({
          ...form,
          photoUrl: photoUrl,
        }));
      } catch (error) {
        setError('Failed to upload photo: ' + error.message);
      }
    }
  };

  const validateForm = () => {
    const { username, age, weight, height, phone } = form;
    const phoneRegex = /^\d{10}$/;
    const ageRegex = /^\d{1,3}$/;
    const weightHeightRegex = /^\d{1,3}$/;
    const heightRegex = /^[1-2]\d{2}$/;

    if (!username || username.length < 2 || username.length > 20) {
      return 'Username must be between 2 and 20 characters';
    }
    if (!phoneRegex.test(phone)) {
      return 'Phone number must be 10 digits';
    }
    if (!ageRegex.test(age)) {
      return 'Age must be a valid number of up to 3 digits';
    }
    if (!weightHeightRegex.test(weight)) {
      return 'Weight must be a valid number of up to 3 digits';
    }
    if (!heightRegex.test(height)) {
      return 'Height must be a valid number between 100 and 299 cm';
    }
    return null;
  };

  const saveProfile = async () => {
    const validationError = validateForm();
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
      setSuccessMessage('Profile updated successfully!');
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
              onClick={() => document.getElementById('photoInput').click()}
            />
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              style={{ display: 'none' }}
              id="photoInput"
            />
          </Box>
          <Typography variant="h4" component="h1" gutterBottom>
            Edit Profile
          </Typography>
          {error && <Typography color="error">{error}</Typography>}
          <Grid container spacing={1}>
            <Grid item xs={6}>
              <TextField
                label="Username"
                value={form.username}
                onChange={updateForm('username')}
                fullWidth
                margin="normal"
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Age"
                value={form.age}
                onChange={updateForm('age')}
                fullWidth
                margin="normal"
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Weight"
                value={form.weight}
                onChange={updateForm('weight')}
                fullWidth
                margin="normal"
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Height"
                value={form.height}
                onChange={updateForm('height')}
                fullWidth
                margin="normal"
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Phone"
                value={form.phone}
                onChange={updateForm('phone')}
                fullWidth
                margin="normal"
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
      <Snackbar
        open={Boolean(successMessage)}
        autoHideDuration={6000}
        onClose={() => setSuccessMessage('')}
      >
        <Alert onClose={() => setSuccessMessage('')} severity="success">
          {successMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default EditProfile;
