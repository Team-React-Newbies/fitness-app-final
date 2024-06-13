
import { NavLink } from "react-router-dom";
import Button from "../../components/Button.jsx";
import { useContext, useState } from "react";
import { AppContext } from "../../context/AppContext";
import { logoutUser } from "../../services/auth.service";
import './Header.css';
import { Avatar, Tooltip } from "@mui/material";

export default function Header() {
    const { user, userData, setAppState } = useContext(AppContext);

    const logout = async () => {
        await logoutUser();
        setAppState({ user: null, userData: null });
    };

    return (
      <div>
        <header className="header">
          <div className="auth-links">
            {user ? (
              <>
                <NavLink to="/profile" id="username">
                  {userData ? (
                    <Avatar
                      className="header-avatar"
                      src={userData.photoUrl}
                      sx={{ width: 40, height: 40 }}
                      title={userData.name || userData.handle} // Add the title attribute here
                    />
                  ) : null}
                </NavLink>

                <Tooltip title="Must you leave us? 😢" arrow>
                  <div>
                    <Button onClick={logout} className="button-logout">
                      Log Out
                    </Button>
                  </div>
                </Tooltip>
              </>
            ) : (
              <>
                <NavLink to="/login" className="auth-link">
                  Login
                </NavLink>
                <NavLink to="/register" className="auth-link">
                  Register
                </NavLink>
              </>
            )}
          </div>
          <div className="top-nav">
            <nav className="nav-container">
              <Tooltip title="Sends you to Home page" arrow>
                <NavLink to="/" className="nav-link">
                  Home
                </NavLink>
              </Tooltip>
              {user && userData && !userData.isBlocked && (
                <>
                  <Tooltip title="Be Brave" arrow>
                    <NavLink to="surprise-challenge" className="nav-link">
                      Surprise Challenges
                    </NavLink>
                  </Tooltip>
                  <Tooltip title="Coming Soon..." arrow>
                    <NavLink to="exercise-videos" className="nav-link">
                      Exercise Videos
                    </NavLink>
                  </Tooltip>
                  <Tooltip
                    title="Here you can create, edit and delete your exercises!"
                    arrow
                  >
                    <NavLink to="/exercises" className="nav-link">
                      My Exercises
                    </NavLink>
                  </Tooltip>
                  <Tooltip title="Tailor your own way of powering thru!" arrow>
                    <NavLink to="/goals" className="nav-link">
                      My Goals
                    </NavLink>
                  </Tooltip>
                </>
              )}
              {userData && userData.isAdmin && (
                <Tooltip title="The Beheader" arrow>
                  <NavLink to="/admin-dashboard" className="nav-link">
                    Admin Dashboard
                  </NavLink>
                </Tooltip>
              )}
            </nav>
          </div>
        </header>
      </div>
    );
}