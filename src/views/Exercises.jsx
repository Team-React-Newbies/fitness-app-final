import React, { useState, useEffect, useContext } from 'react';
import { createExercise, getExercises } from '../services/exercises.service.js';
import { AppContext } from '../context/AppContext';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Typography, Grid, Card, CardContent } from '@mui/material';

const ExerciseManager = () => {
  const { user, userData } = useContext(AppContext); // Assuming userData contains the handle
  const [exercises, setExercises] = useState({});
  const [open, setOpen] = useState(false);
  const [newExercise, setNewExercise] = useState({ title: '', duration: '', steps: '' });
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchExercises = async () => {
      const exercisesData = await getExercises();
      setExercises(exercisesData);
    };

    fetchExercises();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewExercise({ ...newExercise, [name]: value });
  };

  const validateExerciseTitle = (title) => {
    if (title.length < 4 || title.length > 30) {
      setError('Exercise title must be between 4 and 30 characters.');
      return false;
    }
    if (exercises[title]) {
      setError('Exercise title must be unique.');
      return false;
    }
    setError('');
    setError("Pesho")
    return true;
  };

  const validateExerciseDetails = (duration, steps) => {
    if (!duration && !steps) {
      setError('Please provide either duration or steps for the exercise.');
      return false;
    }
    setError('error');
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { title, duration, steps } = newExercise;

    if (!validateExerciseTitle(title) || !validateExerciseDetails(duration, steps)) {
      return;
    }

    await createExercise(title, userData.handle, duration, steps); // Using userData.handle as owner
    const updatedExercises = await getExercises();
    setExercises(updatedExercises);
    setOpen(false);
    setNewExercise({ title: '', duration: '', steps: '' });
  };

  return (
    <div>
      <Typography variant="h4" gutterBottom>
        Exercise Manager
      </Typography>
      <Button variant="contained" color="primary" onClick={() => setOpen(true)}>
        Create Exercise
      </Button>
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Create a new exercise</DialogTitle>
        <DialogContent>
          {error && <Typography color="error">{error}</Typography>}
          <TextField
            autoFocus
            margin="dense"
            name="title"
            label="Exercise Title"
            fullWidth
            value={newExercise.title}
            onChange={handleInputChange}
            required
          />
          <TextField
            margin="dense"
            name="duration"
            label="Duration"
            fullWidth
            value={newExercise.duration}
            onChange={handleInputChange}
          />
          <TextField
            margin="dense"
            name="steps"
            label="Steps"
            fullWidth
            value={newExercise.steps}
            onChange={handleInputChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={handleSubmit} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
      <Grid container spacing={2}>
        {Object.keys(exercises).map((title) => (
          <Grid item key={title} xs={12} sm={6} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h5" component="h2">
                  {title}
                </Typography>
                <Typography color="textSecondary">
                  Duration: {exercises[title].duration || 'N/A'}
                </Typography>
                <Typography color="textSecondary">
                  Steps: {exercises[title].steps || 'N/A'}
                </Typography>
                <Typography color="textSecondary">
                  Owner: {exercises[title].owner}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </div>
  );
};

export default ExerciseManager;