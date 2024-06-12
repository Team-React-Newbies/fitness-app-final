import React, { useState, useEffect, useContext } from "react";
import {
  createGoal,
  getGoals,
  updateGoal,
  deleteGoal,
} from "../services/goals.service.js";
import { AppContext } from "../context/AppContext";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Typography,
  Grid,
  Card,
  CardContent,
  IconButton,
  FormControl,
  RadioGroup,
  FormControlLabel,
  Radio,
} from "@mui/material";
import { Search, Delete, Edit } from "@mui/icons-material";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import weightLoss from "../assets/ExerciseGoalsIcons/weightLoss.svg";
import strength from "../assets/ExerciseGoalsIcons/strength.svg";
import flexibility from "../assets/ExerciseGoalsIcons/flexibility.svg";
import cardio from "../assets/ExerciseGoalsIcons/cardio.svg";
import meditation from "../assets/ExerciseGoalsIcons/meditation.svg";
import muscleGain from "../assets/ExerciseGoalsIcons/muscleGain.svg";
import food from "../assets/ExerciseGoalsIcons/food.svg";

const icons = {
  "weight loss": weightLoss,
  strength,
  flexibility,
  cardio,
  meditation,
  "muscle gain": muscleGain,
  "food and drink": food,
};

const GoalManager = () => {
  const { userData } = useContext(AppContext); // Assuming userData contains the handle
  const [goals, setGoals] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredGoals, setFilteredGoals] = useState([]);
  const [open, setOpen] = useState(false);
  const [currentGoal, setCurrentGoal] = useState(null);
  const [newGoal, setNewGoal] = useState({
    goalName: "",
    goalIcon: "",
    from: null,
    to: null,
  });
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchGoals = async () => {
      const goalsData = await getGoals();
      const userGoals = Object.values(goalsData).filter(
        (goal) => goal.owner === userData.handle
      );
      setGoals(userGoals);
      setFilteredGoals(userGoals);
    };

    if (userData) {
      fetchGoals();
    }
  }, [userData]);

  useEffect(() => {
    setFilteredGoals(
      goals.filter(
        (goal) =>
          goal.goalName &&
          goal.goalName.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [searchTerm, goals]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewGoal({ ...newGoal, [name]: value });
  };

  const handleDateChange = (name, date) => {
    setNewGoal({ ...newGoal, [name]: date });
  };

  const handleIconChange = (e) => {
    setNewGoal({ ...newGoal, goalIcon: e.target.value });
  };

  const validateGoal = ({ goalName, from, to }) => {
    if (goalName.length < 4 || goalName.length > 30) {
      setError("Goal name must be between 4 and 30 characters.");
      return false;
    }
    if (!from || !to) {
      setError("Please provide valid dates for the goal.");
      return false;
    }
    setError("");
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { goalName, goalIcon, from, to } = newGoal;

    if (!validateGoal(newGoal)) {
      return;
    }

    if (currentGoal) {
      await updateGoal(currentGoal.goalName, {
        goalName,
        goalIcon,
        from: from.toISOString(),
        to: to.toISOString(),
        owner: userData.handle,
      });
    } else {
      await createGoal(
        goalName,
        userData.handle,
        goalIcon,
        from.toISOString(),
        to.toISOString()
      );
    }

    const updatedGoals = await getGoals();
    const userGoals = Object.values(updatedGoals).filter(
      (goal) => goal.owner === userData.handle
    );
    setGoals(userGoals);
    setFilteredGoals(userGoals);
    setOpen(false);
    setNewGoal({ goalName: "", goalIcon: "", from: null, to: null });
    setCurrentGoal(null);
  };

  const handleEdit = (goal) => {
    setCurrentGoal(goal);
    setNewGoal({
      goalName: goal.goalName,
      goalIcon: goal.goalIcon,
      from: new Date(goal.from),
      to: new Date(goal.to),
    });
    setOpen(true);
  };

  const handleDelete = async (goalName) => {
    await deleteGoal(goalName);
    const updatedGoals = await getGoals();
    const userGoals = Object.values(updatedGoals).filter(
      (goal) => goal.owner === userData.handle
    );
    setGoals(userGoals);
    setFilteredGoals(userGoals);
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
          startAdornment: <Search />,
        }}
      />
      <Button
        variant="contained"
        style={{ backgroundColor: "red", color: "white" }}
        onClick={() => setOpen(true)}
      >
        Create Goal
      </Button>
      <div style={{ marginTop: "20px" }}>
        <Grid container spacing={2}>
          {filteredGoals.map((goal) => (
            <Grid item key={goal.goalName} xs={12} sm={6} md={4}>
              <Card>
                <CardContent>
                  {goal.goalIcon && (
                    <img
                      src={icons[goal.goalIcon]}
                      alt={goal.goalIcon}
                      style={{
                        width: "100px",
                        height: "100px",
                        display: "block",
                        margin: "0 auto",
                      }}
                    />
                  )}
                  <Typography variant="h5" component="h2" align="center">
                    {goal.goalName}
                  </Typography>
                  <Typography color="textSecondary" align="center">
                    From: {new Date(goal.from).toLocaleDateString()} - To:{" "}
                    {new Date(goal.to).toLocaleDateString()}
                  </Typography>
                  <Typography color="textSecondary" align="center">
                    Owner: {goal.owner}
                  </Typography>
                  <div style={{ textAlign: "center" }}>
                    <IconButton onClick={() => handleEdit(goal)}>
                      <Edit />
                    </IconButton>
                    <IconButton onClick={() => handleDelete(goal.goalName)}>
                      <Delete />
                    </IconButton>
                  </div>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </div>
      <Dialog
        open={open}
        onClose={() => {
          setOpen(false);
          setCurrentGoal(null);
        }}
      >
        <DialogTitle>
          {currentGoal ? "Edit Goal" : "Create a new goal"}
        </DialogTitle>
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
            <RadioGroup
              name="goalIcon"
              value={newGoal.goalIcon}
              onChange={handleIconChange}
              row
            >
              {Object.keys(icons).map((iconKey) => (
                <FormControlLabel
                  key={iconKey}
                  value={iconKey}
                  control={
                    <Radio
                      icon={
                        <img
                          src={icons[iconKey]}
                          alt={iconKey}
                          style={{ width: "50px", height: "50px" }}
                        />
                      }
                      checkedIcon={
                        <img
                          src={icons[iconKey]}
                          alt={iconKey}
                          style={{ width: "50px", height: "50px" }}
                        />
                      }
                    />
                  }
                  label={iconKey}
                />
              ))}
            </RadioGroup>
          </FormControl>
          <DatePicker
            selected={newGoal.from}
            onChange={(date) => handleDateChange("from", date)}
            dateFormat="yyyy/MM/dd"
            customInput={<TextField margin="dense" fullWidth />}
            placeholderText="From"
            required
          />
          <DatePicker
            selected={newGoal.to}
            onChange={(date) => handleDateChange("to", date)}
            dateFormat="yyyy/MM/dd"
            customInput={<TextField margin="dense" fullWidth />}
            placeholderText="To"
            required
          />
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setOpen(false);
              setCurrentGoal(null);
            }}
            color="primary"
          >
            Cancel
          </Button>
          <Button onClick={handleSubmit} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default GoalManager;
