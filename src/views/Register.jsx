import { useContext, useState, useEffect, useRef } from "react";
import { AppContext } from "../context/AppContext.jsx";
import { useNavigate } from "react-router-dom";
import { createUserHandle, getUserByHandle, getUserData } from "../services/users.service";
import { registerUser } from "../services/auth.service";
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import { uploadPhoto } from '../services/storage.service.js';
import Avatar from '@mui/material/Avatar';


export default function Register() {
    const fileInput = useRef();
    const [form, setForm] = useState({
        username: '',
        email: '',
        password: '',
        phone: '',
        name: '',
        age: '',
        weight: '',
        height: '',
        photoUrl: '',
    });
    const [photoFile, setPhotoFile] = useState(null);
    const { user, setAppState } = useContext(AppContext);
    const navigate = useNavigate();

    useEffect(() => {
        if (user) {
            navigate('/');
        }
    }, [user, navigate]);

    const updateForm = prop => e => {
        setForm(form => ({
            ...form,
            [prop]: e.target.value,
        }));
    };

    const handleFileChange = e => {
        setPhotoFile(e.target.files[0]);
    };

    const validateForm = () => {
        const { username, email, password, phone, name, age, weight, height } = form;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const phoneRegex = /^\d{10}$/;
        const ageRegex = /^\d+$/;
        const weightHeightRegex = /^\d+(\.\d+)?$/;

        if (!username || username.length < 2 || username.length > 20) {
            return 'Username must be between 2 and 20 characters';
        }
        if (!emailRegex.test(email)) {
            return 'Invalid email address';
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
        if (!photoFile) {
            return 'Photo is required';
        }
        return null;
    }

    const register = async () => {
        const validationError = validateForm();
        if (validationError) {
            console.log(validationError);
            return;
        }
        try {
            const user = await getUserByHandle(form.username);
            if (user && user.exists()) {
                return console.log('User with this username already exists!');
            }
            const credential = await registerUser(form.email, form.password, form.username, form.phone);
            const photoUrl = await uploadPhoto(photoFile, credential.user.uid);
            await createUserHandle(form.username, credential.user.uid, credential.user.email, form.phone, photoUrl, form.name, form.age, form.weight, form.height);
            
            getUserData(credential.user.uid)
        .then((snapshot) => {
          const userData = snapshot.val() && Object.values(snapshot.val())[0];
          setAppState({ user: credential.user, userData: userData });
        })
        .catch((error) => console.error("Failed to fetch user data:", error));
            navigate('/');
        } catch (error) {
            if (error.message.includes('auth/email-already-in-use')) {
                console.log('User has already been registered!');
            } else {
                console.error('Failed to register:', error);
            }
        }
    };

    return (
        <Container maxWidth="sm">
            <Paper elevation={3} sx={{ padding: 4, marginTop: 8 }}>
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center', 
                    }}
                >
                    <Typography component="h1" variant="h5">
                        Register
                    </Typography>
                    <Box component="form" sx={{ mt: 1 }}>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                          
            <Avatar
              sx={{ width: 100, height: 100, cursor: 'pointer' }} 
                onClick={() => fileInput.current.click()}
                slotProps={{ img:photoFile  }}

            ></Avatar>
             <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleFileChange}
                                    style={{ display: 'none'}}
                                    ref={fileInput}
                                />
          
          
                                <TextField
                                    margin="normal"
                                    required
                                    fullWidth
                                    id="username"
                                    label="Username"
                                    name="username"
                                    autoComplete="username"
                                    autoFocus
                                    value={form.username}
                                    onChange={updateForm('username')}
                                    InputProps={{
                                        style: { color: 'black' },
                                    }}
                                    InputLabelProps={{
                                        style: { color: 'grey' },
                                    }}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    margin="normal"
                                    required
                                    fullWidth
                                    id="email"
                                    label="Email Address"
                                    name="email"
                                    autoComplete="email"
                                    value={form.email}
                                    onChange={updateForm('email')}
                                    InputProps={{
                                        style: { color: 'black' },
                                    }}
                                    InputLabelProps={{
                                        style: { color: 'grey' },
                                    }}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    margin="normal"
                                    required
                                    fullWidth
                                    name="password"
                                    label="Password"
                                    type="password"
                                    id="password"
                                    autoComplete="current-password"
                                    value={form.password}
                                    onChange={updateForm('password')}
                                    InputProps={{
                                        style: { color: 'black' },
                                    }}
                                    InputLabelProps={{
                                        style: { color: 'grey' },
                                    }}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    margin="normal"
                                    required
                                    fullWidth
                                    name="phone"
                                    label="Phone"
                                    id="phone"
                                    value={form.phone}
                                    onChange={updateForm('phone')}
                                    InputProps={{
                                        style: { color: 'black' },
                                    }}
                                    InputLabelProps={{
                                        style: { color: 'grey' },
                                    }}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    margin="normal"
                                    required
                                    fullWidth
                                    name="name"
                                    label="Name"
                                    id="name"
                                    value={form.name}
                                    onChange={updateForm('name')}
                                    InputProps={{
                                        style: { color: 'black' },
                                    }}
                                    InputLabelProps={{
                                        style: { color: 'grey' },
                                    }}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    margin="normal"
                                    required
                                    fullWidth
                                    name="age"
                                    label="Age"
                                    id="age"
                                    value={form.age}
                                    onChange={updateForm('age')}
                                    InputProps={{
                                        style: { color: 'black' },
                                    }}
                                    InputLabelProps={{
                                        style: { color: 'grey' },
                                    }}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    margin="normal"
                                    required
                                    fullWidth
                                    name="weight"
                                    label="Weight"
                                    id="weight"
                                    value={form.weight}
                                    onChange={updateForm('weight')}
                                    InputProps={{
                                        style: { color: 'black' },
                                    }}
                                    InputLabelProps={{
                                        style: { color: 'grey' },
                                    }}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    margin="normal"
                                    required
                                    fullWidth
                                    name="height"
                                    label="Height"
                                    id="height"
                                    value={form.height}
                                    onChange={updateForm('height')}
                                    InputProps={{
                                        style: { color: 'black' },
                                    }}
                                    InputLabelProps={{
                                        style: { color: 'grey' },
                                    }}
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
                                <Button
                                    type="button"
                                    fullWidth
                                    variant="contained"
                                    sx={{ mt: 3, mb: 2 }}
                                    onClick={register}
                                >
                                    Register
                                </Button>
                            </Grid>
                        </Grid>
                    </Box>
                </Box>
            </Paper>
        </Container>
    );
}
