import React, { useState, useEffect, useContext } from 'react';
import { createGoal, getGoals, updateGoal, deleteGoal } from '../services/goals.service.js';
import { AppContext } from '../context/AppContext';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Typography, Grid, Card, CardContent, FormControl, RadioGroup, FormControlLabel, Radio, IconButton } from '@mui/material';
import { Search, Edit, Delete } from '@mui/icons-material';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import weightLoss from '../assets/ExerciseGoalsIcons/weightLoss.svg';
import strength from '../assets/ExerciseGoalsIcons/strength.svg';
import flexibility from '../assets/ExerciseGoalsIcons/flexibility.svg';
import cardio from '../assets/ExerciseGoalsIcons/cardio.svg';
import meditation from '../assets/ExerciseGoalsIcons/meditation.svg';
import muscleGain from '../assets/ExerciseGoalsIcons/muscleGain.svg';
import food from '../assets/ExerciseGoalsIcons/food.svg';

const icons = {
  "weight loss": weightLoss,
  strength,
  flexibility,
  cardio,
  meditation,
  "muscle gain": muscleGain,
  "food and drink": food
};

const GoalManager = () => {
  const { userData } = useContext(AppContext);
  const [goals, setGoals] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredGoals, setFilteredGoals] = useState({});
  const [open, setOpen] = useState(false);
  const [newGoal, setNewGoal] = useState({ goalName: '', goalIcon: '', from: null, to: null });
  const [error, setError] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [currentGoalId, setCurrentGoalId] = useState(null);

  useEffect(() => {
    const fetchGoals = async () => {
      const goalsData = await getGoals();
      setGoals(goalsData);
      setFilteredGoals(goalsData);
    };

    fetchGoals();
  }, []);

  useEffect(() => {
    setFilteredGoals(
      Object.keys(goals).filter(goalId =>
        goals[goalId].title && goals[goalId].title.toLowerCase().includes(searchTerm.toLowerCase())
      ).reduce((res, key) => (res[key] = goals[key], res), {})
    );
  }, [searchTerm, goals]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewGoal({ ...newGoal, [name]: value });
  };

  const handleGoalIconChange = (e) => {
    setNewGoal({ ...newGoal, goalIcon: e.target.value });
  };

  const handleDateChange = (name, date) => {
    setNewGoal({ ...newGoal, [name]: date });
  };

  const validateGoalName = (goalName) => {
    if (goalName.length < 4 || goalName.length > 30) {
      setError('Goal name must be between 4 and 30 characters.');
      return false;
    }
    const existingGoal = Object.values(goals).find(goal => goal.title === goalName);
    if (!isEditing && existingGoal) {
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
    const { goalName, goalIcon, from, to } = newGoal;

    if (!validateGoalName(goalName) || !validateDates(from, to)) {
      return;
    }

    if (isEditing) {
      await updateGoal(currentGoalId, { title: goalName, goalIcon, from: from.toISOString(), to: to.toISOString(), owner: userData.handle });
    } else {
      await createGoal(goalName, userData.handle, goalIcon, from.toISOString(), to.toISOString());
    }

    const updatedGoals = await getGoals();
    setGoals(updatedGoals);
    setOpen(false);
    setNewGoal({ goalName: '', goalIcon: '', from: null, to: null });
    setIsEditing(false);
    setCurrentGoalId(null);
  };

  const handleEdit = (goalId) => {
    const goal = goals[goalId];
    setNewGoal({
      goalName: goal.title,
      goalIcon: goal.goalIcon,
      from: goal.from ? new Date(goal.from) : null,
      to: goal.to ? new Date(goal.to) : null,
    });
    setIsEditing(true);
    setOpen(true);
    setCurrentGoalId(goalId);
  };

  const handleDelete = async (goalId) => {
    await deleteGoal(goalId);
    const updatedGoals = await getGoals();
    setGoals(updatedGoals);
  };

  const calculateProgress = (from, to) => {
    const now = new Date();
    const startDate = new Date(from);
    const endDate = new Date(to);

    if (now < startDate) return 0;
    if (now > endDate) return 100;

    const totalDuration = endDate - startDate;
    const elapsed = now - startDate;
    return Math.min(100, (elapsed / totalDuration) * 100);
  };

  return (
    <div>
      <Typography variant="h4" gutterBottom>
        Goal Manager
      </Typography>
      <TextField
        label="Search Goals"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        fullWidth
        margin="normal"
        InputProps={{
          startAdornment: (
            <Search />
          ),
        }}
      />
      <Button variant="contained" style={{ backgroundColor: 'red', color: 'white' }} onClick={() => setOpen(true)}>
       Create Goal
      </Button> 
      <Dialog open={open} onClose={() => { setOpen(false); setIsEditing(false); }}>
        <DialogTitle>{isEditing ? 'Update Goal' : 'Create a new goal'}</DialogTitle>
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
          <FormControl component="fieldset" margin="dense">
            <Typography component="legend">Select Icon</Typography>
            <RadioGroup name="goalIcon" value={newGoal.goalIcon} onChange={handleGoalIconChange} row>
              {Object.keys(icons).map((iconKey) => (
                <FormControlLabel
                  key={iconKey}
                  value={iconKey}
                  control={<Radio icon={<img src={icons[iconKey]} alt={iconKey} style={{ width: '50px', height: '50px' }} />} checkedIcon={<img src={icons[iconKey]} alt={iconKey} style={{ width: '50px', height: '50px' }} />} />}
                  label={iconKey}
                />
              ))}
            </RadioGroup>
          </FormControl>
          <DatePicker
            selected={newGoal.from}
            onChange={(date) => handleDateChange('from', date)}
            dateFormat="yyyy/MM/dd"
            customInput={<TextField margin="dense" fullWidth />}
            placeholderText="From"
            required
          />
          <DatePicker
            selected={newGoal.to}
            onChange={(date) => handleDateChange('to', date)}
            dateFormat="yyyy/MM/dd"
            customInput={<TextField margin="dense" fullWidth />}
            placeholderText="To"
            required
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => { setOpen(false); setIsEditing(false); }} color="primary">
            Cancel
          </Button>
          <Button onClick={handleSubmit} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
      <Grid container spacing={2} style={{ marginTop: '20px' }}>
        {Object.keys(filteredGoals).map((goalId) => (
          <Grid item key={goalId} xs={12} sm={6} md={4}>
            <Card>
              <CardContent>
                {filteredGoals[goalId].goalIcon && (
                  <img 
                    src={icons[filteredGoals[goalId].goalIcon]}
                    alt={filteredGoals[goalId].goalIcon}
                    style={{ width: '100px', height: '100px', display: 'block', margin: '0 auto' }}
                  />
                )}
                <Typography variant="h5" component="h2">
                  {filteredGoals[goalId].title}
                </Typography>
                <Typography color="textSecondary">
                  From: {new Date(filteredGoals[goalId].from).toLocaleDateString()} - To: {new Date(filteredGoals[goalId].to).toLocaleDateString()}
                </Typography>
                <Typography color="textSecondary">
                  Owner: {filteredGoals[goalId].owner}
                </Typography>
                <div style={{ width: '50%', margin: '10px auto' }}>
                  <CircularProgressbar 
                    value={calculateProgress(filteredGoals[goalId].from, filteredGoals[goalId].to)} 
                    text={`${Math.round(calculateProgress(filteredGoals[goalId].from, filteredGoals[goalId].to))}%`}
                    styles={buildStyles({
                      textSize: '16px',
                      pathColor: `rgba(62, 152, 199, ${calculateProgress(filteredGoals[goalId].from, filteredGoals[goalId].to) / 100})`,
                    })}
                  />
                </div>
                <IconButton onClick={() => handleEdit(goalId)}>
                  <Edit />
                </IconButton>
                <IconButton onClick={() => handleDelete(goalId)}>
                  <Delete />
                </IconButton>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </div>
  );
};

export default GoalManager;