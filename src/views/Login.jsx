import { useContext, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import { loginUser } from "../services/auth.service";
import { checkAdminStatus } from "../services/users.service";
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';

export default function Login() {
  const { user, setAppState } = useContext(AppContext);
  const [form, setForm] = useState({
    email: '',
    password: '',
  });
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (user) {
      navigate(location.state?.from.pathname || '/');
    }
  }, [user]);

  const login = async () => {
    try {
      const { user } = await loginUser(form.email, form.password);
      console.log("Logged in user UID:", user.uid);
      //Ani: Checking if the user is an admin
      const isAdmin = await checkAdminStatus(user.uid);

      if (isAdmin === true) {
        navigate('/admin-dashboard');
      } else {
        navigate('/');
      }
      setAppState({ user, isAdmin, userData: null });
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  const updateForm = prop => e => {
    setForm({
      ...form,
      [prop]: e.target.value,
    });
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
            Login
          </Typography>
          <Box component="form" sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
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
              onClick={login}
            >
              Login
            </Button>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
}