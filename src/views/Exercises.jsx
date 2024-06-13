import React, { useState, useEffect, useContext } from "react";
import {
  createExercise,
  getExercises,
  updateExercise,
  deleteExercise,
} from "../services/exercises.service.js";
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
import strength from "../assets/ExerciseGoalsIcons/strength.svg";
import flexibility from "../assets/ExerciseGoalsIcons/flexibility.svg";
import cardio from "../assets/ExerciseGoalsIcons/cardio.svg";

const icons = {
  strength: strength,
  flexibility: flexibility,
  cardio: cardio,
};

const ExerciseManager = () => {
  const { userData } = useContext(AppContext);
  const [exercises, setExercises] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredExercises, setFilteredExercises] = useState([]);
  const [open, setOpen] = useState(false);
  const [currentExercise, setCurrentExercise] = useState(null);
  const [newExercise, setNewExercise] = useState({
    title: "",
    detailType: "",
    detailValue: "",
    icon: "",
  });
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchExercises = async () => {
      const exercisesData = await getExercises();
      const userExercises = Object.values(exercisesData).filter(
        (exercise) => exercise.owner === userData.handle
      );
      setExercises(userExercises);
      setFilteredExercises(userExercises);
    };

    fetchExercises();
  }, [userData.handle]);

  useEffect(() => {
    setFilteredExercises(
      exercises.filter((exercise) =>
        exercise.title.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [searchTerm, exercises]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewExercise({ ...newExercise, [name]: value });
  };

  const handleDetailTypeChange = (e) => {
    setNewExercise({
      ...newExercise,
      detailType: e.target.value,
      detailValue: "",
    });
  };

  const handleIconChange = (e) => {
    setNewExercise({ ...newExercise, icon: e.target.value });
  };

  const validateExerciseTitle = (title) => {
    if (title.length < 4 || title.length > 30) {
      setError("Exercise title must be between 4 and 30 characters.");
      return false;
    }
    if (
      currentExercise === null &&
      exercises.some((ex) => ex.title === title)
    ) {
      setError("Exercise title must be unique.");
      return false;
    }
    setError("");
    return true;
  };

  const validateExerciseDetails = (detailType, detailValue) => {
    if (!detailType || !detailValue) {
      setError("Please provide valid details for the exercise.");
      return false;
    }
    setError("");
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { title, detailType, detailValue, icon } = newExercise;

    if (
      !validateExerciseTitle(title) ||
      !validateExerciseDetails(detailType, detailValue)
    ) {
      return;
    }

    if (currentExercise) {
      await updateExercise(currentExercise.title, {
        title,
        detailType,
        detailValue,
        icon,
      });
    } else {
      await createExercise(
        title,
        userData.handle,
        detailType,
        detailValue,
        icon
      );
    }

    const updatedExercises = await getExercises();
    const userExercises = Object.values(updatedExercises).filter(
      (exercise) => exercise.owner === userData.handle
    );
    setExercises(userExercises);
    setFilteredExercises(userExercises);
    setOpen(false);
    setNewExercise({ title: "", detailType: "", detailValue: "", icon: "" });
    setCurrentExercise(null);
  };

  const handleEdit = (exercise) => {
    setCurrentExercise(exercise);
    setNewExercise({
      title: exercise.title,
      detailType: exercise.detailType,
      detailValue: exercise.detailValue,
      icon: exercise.icon,
    });
    setOpen(true);
  };

  const handleDelete = async (title) => {
    await deleteExercise(title);
    const updatedExercises = await getExercises();
    const userExercises = Object.values(updatedExercises).filter(
      (exercise) => exercise.owner === userData.handle
    );
    setExercises(userExercises);
    setFilteredExercises(userExercises);
  };

  return (
    <div>
      <Typography variant="h4" gutterBottom>
        Exercise Manager
      </Typography>
      <TextField
        label="Search Exercises"
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
        Create Exercise
      </Button>
      <div style={{ marginTop: "20px" }}>
        <Grid container spacing={2}>
          {filteredExercises.map((exercise) => (
            <Grid item key={exercise.title} xs={12} sm={6} md={4}>
              <Card>
                <CardContent>
                  {exercise.icon && (
                    <img
                      src={icons[exercise.icon]}
                      alt={exercise.icon}
                      style={{
                        width: "100px",
                        height: "100px",
                        display: "block",
                        margin: "0 auto",
                      }}
                    />
                  )}
                  <Typography variant="h5" component="h2" align="center">
                    {exercise.title}
                  </Typography>
                  <Typography color="textSecondary" align="center">
                    {exercise.detailType}: {exercise.detailValue}
                  </Typography>
                  <div style={{ textAlign: "center" }}>
                    <IconButton onClick={() => handleEdit(exercise)}>
                      <Edit />
                    </IconButton>
                    <IconButton onClick={() => handleDelete(exercise.title)}>
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
          setCurrentExercise(null);
        }}
      >
        <DialogTitle>
          {currentExercise ? "Edit Exercise" : "Create a new exercise"}
        </DialogTitle>
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
          <FormControl component="fieldset" margin="dense">
            <Typography component="legend">Detail Type</Typography>
            <RadioGroup
              name="detailType"
              value={newExercise.detailType}
              onChange={handleDetailTypeChange}
              row
            >
              <FormControlLabel
                value="StepsPerDay"
                control={<Radio />}
                label="Steps per Day"
              />
              <FormControlLabel
                value="MinutesPerDay"
                control={<Radio />}
                label="Minutes per Day"
              />
              <FormControlLabel
                value="KmPerDay"
                control={<Radio />}
                label="Km per Day"
              />
              <FormControlLabel
                value="RepsPerDay"
                control={<Radio />}
                label="Reps per Day"
              />
            </RadioGroup>
          </FormControl>
          <TextField
            margin="dense"
            name="detailValue"
            label="Detail Value"
            fullWidth
            value={newExercise.detailValue}
            onChange={handleInputChange}
            required
          />
          <FormControl component="fieldset" margin="dense">
            <Typography component="legend">Select Icon</Typography>
            <RadioGroup
              name="icon"
              value={newExercise.icon}
              onChange={handleIconChange}
              row
            >
              <FormControlLabel
                value="strength"
                control={
                  <Radio
                    icon={
                      <img
                        src={strength}
                        alt="strength"
                        style={{ width: "50px", height: "50px" }}
                      />
                    }
                    checkedIcon={
                      <img
                        src={strength}
                        alt="strength"
                        style={{ width: "50px", height: "50px" }}
                      />
                    }
                  />
                }
                label="Strength"
              />
              <FormControlLabel
                value="cardio"
                control={
                  <Radio
                    icon={
                      <img
                        src={cardio}
                        alt="cardio"
                        style={{ width: "50px", height: "50px" }}
                      />
                    }
                    checkedIcon={
                      <img
                        src={cardio}
                        alt="cardio"
                        style={{ width: "50px", height: "50px" }}
                      />
                    }
                  />
                }
                label="Cardio"
              />
              <FormControlLabel
                value="flexibility"
                control={
                  <Radio
                    icon={
                      <img
                        src={flexibility}
                        alt="flexibility"
                        style={{ width: "50px", height: "50px" }}
                      />
                    }
                    checkedIcon={
                      <img
                        src={flexibility}
                        alt="flexibility"
                        style={{ width: "50px", height: "50px" }}
                      />
                    }
                  />
                }
                label="Flexibility"
              />
            </RadioGroup>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setOpen(false);
              setCurrentExercise(null);
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

export default ExerciseManager;
