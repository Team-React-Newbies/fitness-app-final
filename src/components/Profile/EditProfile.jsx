import React, { useContext, useState, useEffect } from 'react';
import { AppContext } from '../../context/AppContext.jsx';
import { updateUserHandle } from '../../services/users.service.js';
import { uploadPhoto } from '../../services/storage.service.js'; // Import the new upload function
import { Container, TextField, Button, Typography, Box, CircularProgress } from '@mui/material';

const EditProfile = ({ cancelEditMode, initialData }) => {
  const { user, setAppState } = useContext(AppContext);
  const [form, setForm] = useState({
    phone: '',
    photoUrl: '',
  });
  const [photoFile, setPhotoFile] = useState(null); // State to hold the selected file

  useEffect(() => {
    if (initialData) {
      setForm({
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

  const saveProfile = async () => {
    if (!form.phone && !photoFile) return; // Ensure we have some data to update
    try {
      if (photoFile) {
        const photoUrl = await uploadPhoto(photoFile, user.uid); // Upload photo and get URL
        form.photoUrl = photoUrl; // Update form with the new photo URL
      }
      await updateUserHandle(user.uid, form); // Use uid instead of handle for consistency
      setAppState(prevState => ({
        ...prevState,
        userData: { ...prevState.userData, ...form }
      }));
      cancelEditMode();
    } catch (error) {
      console.error('Failed to update profile:', error);
    }
  };

  if (!form) {
    return <CircularProgress />;
  }

  return (
    <Container>
      <Box sx={{ mt: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Edit Profile
        </Typography>
        <TextField
          label="Phone"
          value={form.phone}
          onChange={updateForm('phone')}
          fullWidth
          margin="normal"
          sx={{ backgroundColor: '#f9f9f9'}}
        />
        <TextField
          label="Photo URL"
          value={form.photoUrl}
          fullWidth
          margin="normal"
          sx={{ backgroundColor: '#f9f9f9'}}
          disabled
        />
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
        />
        <Button variant="contained" color="primary" onClick={saveProfile} sx={{ mr: 2 }}>
          Save
        </Button>
        <Button variant="outlined" color="secondary" onClick={cancelEditMode}>
          Cancel
        </Button>
      </Box>
    </Container>
  );
};

export default EditProfile;
