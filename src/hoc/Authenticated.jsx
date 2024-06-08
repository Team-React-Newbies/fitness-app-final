import PropTypes from 'prop-types';
import { useContext } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../config/firebase-config';
import { CircularProgress } from '@mui/material';
/**
 * 
 * @param {{children: any }} props 
 * @returns 
 */
export default function Authenticated({ children }) {
    const { user } = useContext(AppContext);
    const location = useLocation();
    const [,loading, ] = useAuthState(auth);

    if(!user) {
        if(loading) {
            return <CircularProgress />
        }
        else {
            return <Navigate replace to="/login" state={{ from: location }} />
        }
    }

    return (
        <>
            {children}
        </>
    )
}

Authenticated.propTypes = {
    children: PropTypes.any.isRequired,
}