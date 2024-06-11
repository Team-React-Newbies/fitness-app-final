// import { NavLink } from "react-router-dom";
// import Button from "../../components/Button.jsx";
// import { useContext, useState } from "react";
// import { AppContext } from "../../context/AppContext";
// import { logoutUser } from "../../services/auth.service";
// import './Header.css';

// export default function Header() {
//     const { user, userData, setAppState } = useContext(AppContext);
//     const [showProfile, setShowProfile] = useState(false);

//     const logout = async () => {
//         await logoutUser();
//         setAppState({ user: null, userData: null });
//     };

//     return (
//         <div>
//             <div className="title-container">
//                 <NavLink to="/" className="main-title-link">Undecided</NavLink>
//             </div>
//             <header className="header">
//                 <div className="auth-links">
//                     {user ? (
//                         <>
//                             <span id="username">{`Welcome, ${userData ? userData.handle : 'Loading...'}`}</span>
//                             <Button onClick={logout} className="button-logout">Log Out</Button>
//                         </>
//                     ) : (
//                         <>
//                             <NavLink to="/login" className="auth-link">Login</NavLink>
//                             <NavLink to="/register" className="auth-link">Register</NavLink>
//                         </>
//                     )}
//                 </div>
//                 <div className="top-nav">
//                     <nav className="nav-container">
//                         <NavLink to="/posts" className="nav-link">All Posts</NavLink>

//                         {user && userData && !userData.isBlocked && (
//                             <>
//                                 <NavLink to="/posts-create" className="nav-link">Create Post</NavLink>
//                                 <NavLink to="/my-posts" className="nav-link">My Posts</NavLink>
//                             </>
//                         )}

//                         {userData && userData.isAdmin && (
//                             <NavLink to="/admin-dashboard" className="nav-link">Admin Dashboard</NavLink>
//                         )}
//                     </nav>
//                 </div>
//             </header>
//         </div>
//     );
// }

import { NavLink } from "react-router-dom";
import Button from "../../components/Button.jsx";
import { useContext, useState } from "react";
import { AppContext } from "../../context/AppContext";
import { logoutUser } from "../../services/auth.service";
import './Header.css';
import { Avatar } from "@mui/material";

export default function Header() {
    const { user, userData, setAppState } = useContext(AppContext);
    const [showProfile, setShowProfile] = useState(false);

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
                    {
                        userData ? (
                            <Avatar className="header-avatar" src={userData.photoUrl} sx={{ width:40, height: 40 }} />
                        ) : (
                             null
                        )
                    }
                </NavLink>
                            <Button onClick={logout} className="button-logout">Log Out</Button>
                        </>
                    ) : (
                        <>
                            <NavLink to="/login" className="auth-link">Login</NavLink>
                            <NavLink to="/register" className="auth-link">Register</NavLink>
                        </>
                    )}
                </div>
                <div className="top-nav">
                    <nav className="nav-container">
                    <NavLink to="/" className="nav-link">Home</NavLink>

                        {user && userData && !userData.isBlocked && (
                            <>
                                <NavLink to="/exercises" className="nav-link">My Exercises</NavLink>
                                <NavLink to="/goals" className="nav-link">My Goals</NavLink>
                            </>
                        )}

                        {userData && userData.isAdmin && (
                            <NavLink to="/admin-dashboard" className="nav-link">Admin Dashboard</NavLink>
                        )}
                    </nav>
                </div>
            </header>
        </div>
    );
}