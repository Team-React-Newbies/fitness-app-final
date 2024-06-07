
import React, { useState, useEffect, useContext } from 'react';
import { createGoal, getGoals } from '../services/goals.service.js';
import { AppContext } from '../context/AppContext';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Typography, Grid, Card, CardContent } from '@mui/material';

const GoalManager = () => {
  const { user, userData } = useContext(AppContext); // Assuming userData contains the handle
  const [goals, setGoals] = useState({});
  const [open, setOpen] = useState(false);
  const [newGoal, setNewGoal] = useState({ goalName: '', from: '', to: '' });
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchGoals = async () => {
      const goalsData = await getGoals();
      setGoals(goalsData);
    };

    fetchGoals();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewGoal({ ...newGoal, [name]: value });
  };

  const validateGoalName = (goalName) => {
    if (goalName.length < 4 || goalName.length > 30) {
      setError('Goal name must be between 4 and 30 characters.');
      return false;
    }
    if (goals[goalName]) {
      setError('One of your goals in progress already has this name. Go for another challenge!');
      return false;
    }
    setError('');
    return true;
  };

  const validateDates = (from, to) => {
    if (!from || !to) {
      setError('Oops! Set a start and end date to keep your progress on track!');
      return false;
    }
    setError('');
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { goalName, from, to } = newGoal;

    if (!validateGoalName(goalName) || !validateDates(from, to)) {
      return;
    }

    await createGoal(goalName, userData.handle, from, to); // Using userData.handle as owner
    const updatedGoals = await getGoals();
    setGoals(updatedGoals);
    setOpen(false);
    setNewGoal({ goalName: '', from: '', to: '' });
  };

  return (
    <div>
      <Typography variant="h4" gutterBottom>
        Goal Manager
      </Typography>
      <Button variant="contained" color="primary" onClick={() => setOpen(true)}>
        Create Goal
      </Button>
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Create a new goal</DialogTitle>
        <DialogContent>
          {error && <Typography color="error">{error}</Typography>}
          <TextField
            autoFocus
            margin="dense"
            name="goalName"
            label="Goal Name"
            fullWidth
            value={newGoal.goalName}
            onChange={handleInputChange}
            required
          />
          <TextField
            margin="dense"
            name="from"
            label="From"
            type="date"
            fullWidth
            InputLabelProps={{
              shrink: true,
            }}
            value={newGoal.from}
            onChange={handleInputChange}
            required
          />
          <TextField
            margin="dense"
            name="to"
            label="To"
            type="date"
            fullWidth
            InputLabelProps={{
              shrink: true,
            }}
            value={newGoal.to}
            onChange={handleInputChange}
            required
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
        {Object.keys(goals).map((goalName) => (
          <Grid item key={goalName} xs={12} sm={6} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h5" component="h2">
                  {goalName}
                </Typography>
                <Typography color="textSecondary">
                  {goals[goalName].from} - {goals[goalName].to}
                </Typography>
                <Typography color="textSecondary">
                  Owner: {goals[goalName].owner}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </div>
  );
};

export default GoalManager;