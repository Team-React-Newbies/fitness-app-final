import { useContext, useState, useEffect } from "react";
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
import { uploadPhoto } from '../services/storage.service.js';

export default function Register() {
    const [form, setForm] = useState({
        username: '',
        email: '',
        password: '',
        phone: '',
        photoUrl: '',
    });
    const [photoFile, setPhotoFile] = useState(null); // State to hold the selected file
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
        const { username, email, password, phone, } = form;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const phoneRegex = /^\d{10}$/;

        if (!username || username.length < 2 || username.length > 20) {
            return 'Username must be between 2 and 20 characters';
        }
        if (!emailRegex.test(email)) {
            return 'Invalid email address';
        }
        if (!phoneRegex.test(phone)) {
            return 'Phone number must be 10 digits';
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
        // TODO: validate form data
        try {
            const user = await getUserByHandle(form.username);
            if (user.exists()) {
                return console.log('User with this username already exists!');
            }
            const credential = await registerUser(form.email, form.password, form.username, form.phone);
            const photoUrl = await uploadPhoto(photoFile, credential.user.uid);
            await createUserHandle(form.username, credential.user.uid, credential.user.email, form.phone, photoUrl);
            const userData = await getUserData(credential.user.uid);
            setAppState({ user: credential.user, userData: userData });
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

                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleFileChange}
                            style={{ margin: '20px' }}
                        />

                        <Button
                            type="button"
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3, mb: 2 }}
                            onClick={register}
                        >
                            Register
                        </Button>
                    </Box>
                </Box>
            </Paper>
        </Container>
    );
}