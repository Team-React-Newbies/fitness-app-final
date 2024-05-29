import { useContext, useState, useEffect } from "react";
import { AppContext } from "../context/AppContext.jsx";
import { useNavigate } from "react-router-dom";
import { createUserHandle, getUserByHandle } from "../services/users.service";
import { registerUser } from "../services/auth.service";
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';

export default function Register() {
    const [form, setForm] = useState({
        username: '',
        email: '',
        password: '',
    });
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

    const register = async () => {
        // TODO: validate form data
        try {
            const user = await getUserByHandle(form.username);
            if (user.exists()) {
                return console.log('User with this username already exists!');
            }
            const credential = await registerUser(form.email, form.password);
            await createUserHandle(form.username, credential.user.uid, credential.user.email);
            setAppState({ user: credential.user, userData: null });
            navigate('/');
        } catch (error) {
            if (error.message.includes('auth/email-already-in-use')) {
                console.log('User has already been registered!');
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
