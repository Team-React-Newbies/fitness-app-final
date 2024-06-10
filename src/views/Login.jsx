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
import Grid from '@mui/material/Grid';
import CircularProgress from '@mui/material/CircularProgress';

export default function Login() {
  const { user, setAppState } = useContext(AppContext);
  const [form, setForm] = useState({
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (user) {
      navigate(location.state?.from.pathname || '/');
    }
  }, [user, navigate, location]);

  const login = async () => {
    setLoading(true);
    try {
      const { user } = await loginUser(form.email, form.password);
      console.log("Logged in user UID:", user.uid);

      const isAdmin = await checkAdminStatus(user.uid);

      if (isAdmin === true) {
        navigate('/admin-dashboard');
      } else {
        navigate('/');
      }
      setAppState({ user, userData: null });
    } catch (error) {
      console.error('Login failed:', error);
    } finally {
      setLoading(false);
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
          <Typography component="h1" variant="h5" gutterBottom>
            Login
          </Typography>
          <Box component="form" sx={{ mt: 1 }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
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
                <Button
                  type="button"
                  fullWidth
                  variant="contained"
                  sx={{ mt: 3, mb: 2 }}
                  onClick={login}
                  disabled={loading}
                >
                  {loading ? <CircularProgress size={24} color="inherit" /> : 'Login'}
                </Button>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
}
