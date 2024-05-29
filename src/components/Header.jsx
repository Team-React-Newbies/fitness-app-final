import React, { useContext } from 'react';
import { NavLink } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import { logoutUser } from "../services/auth.service.js";
import { AppBar, Toolbar, Typography, Button, Box, Link } from '@mui/material';
import { styled } from '@mui/system';

const StyledAppBar = styled(AppBar)(({ theme }) => ({
  backgroundColor: '#5e4b8b',
  marginBottom: '20px',
}));

const Title = styled(Link)(({ theme }) => ({
  flexGrow: 1,
  textDecoration: 'none',
  color: '#004d00',
  textShadow: '0 0 10px #00ff00, 0 0 20px #00ff00',
  fontFamily: 'Times New Roman, serif',
}));

const NavLinkStyled = styled(Link)(({ theme }) => ({
  color: 'white',
  backgroundColor: 'transparent',
  textDecoration: 'none',
  padding: '8px 12px',
  borderRadius: '5px',
  fontSize: '16px',
  textShadow: '0 0 8px #00ff00, 0 0 16px #00ff00',
  '&:hover': {
    backgroundColor: '#7467a0',
  },
}));

const AuthLinks = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: '10px',
  alignItems: 'center',
}));

const ButtonLogout = styled(Button)(({ theme }) => ({
  backgroundColor: '#5e4b8b',
  '&:hover': {
    backgroundColor: '#7467a0',
  },
}));

const ToolbarStyled = styled(Toolbar)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
}));

export default function Header() {
  const { user, userData, setAppState } = useContext(AppContext);

  const logout = async () => {
    await logoutUser();
    setAppState({ user: null, userData: null });
  };

  return (
    <StyledAppBar position="static">
      <ToolbarStyled>
        <Title component={NavLink} to="/">
          <Typography variant="h4">Undecided</Typography>
        </Title>
        <AuthLinks>
          {user ? (
            <>
              <Typography variant="body1">{`Welcome, ${userData ? userData.handle : 'Loading...'}`}</Typography>
              <NavLinkStyled component={NavLink} to="/profile">Profile</NavLinkStyled>
              <ButtonLogout onClick={logout} variant="contained" color="secondary">Log Out</ButtonLogout>
            </>
          ) : (
            <>
              <NavLinkStyled component={NavLink} to="/login">Login</NavLinkStyled>
              <NavLinkStyled component={NavLink} to="/register">Register</NavLinkStyled>
            </>
          )}
        </AuthLinks>
      </ToolbarStyled>
      <Box display="flex" justifyContent="center">
        <nav>
          <NavLinkStyled component={NavLink} to="/posts">All Posts</NavLinkStyled>
          {user && userData && !userData.isBlocked && (
            <>
              <NavLinkStyled component={NavLink} to="/posts-create">Create Post</NavLinkStyled>
              <NavLinkStyled component={NavLink} to="/my-posts">My Posts</NavLinkStyled>
            </>
          )}
          {userData && userData.isAdmin && (
            <NavLinkStyled component={NavLink} to="/admin-dashboard">Admin Dashboard</NavLinkStyled>
          )}
        </nav>
      </Box>
    </StyledAppBar>
  );
}
