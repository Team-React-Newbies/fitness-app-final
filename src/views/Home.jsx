import React, { useEffect, useState } from "react";
import { fetchAllUsers } from '../services/users.service'; // Adjust the path as necessary
import "./Home.css";
import backgroundVideo from '../assets/Videos/BallerinaTurns.mp4';

export default function Home() {
    const [userCount, setUserCount] = useState(0);

    useEffect(() => {
        const loadUserCount = async () => {
            try {
                const usersData = await fetchAllUsers();
                const usersArray = Object.values(usersData); // Convert to array
                setUserCount(usersArray.length); // Set the user count
            } catch (error) {
                console.error('Failed to fetch users:', error);
            }
        };

        loadUserCount();
    }, []);

    return (
        <div className="home-container">
            <video className="background-video" autoPlay loop muted>
                <source src={backgroundVideo} type="video/mp4" />
                Your browser does not support the video tag.
            </video>
            <div className="overlay">
                <h1 className="title">Team QuickFingers</h1>
                <div className="content">
                    <h2>Awesome Fitness App</h2>
                    <p>In Construction...</p>
                </div>
                <div className="user-count">
                    <p>Number of users of the app: {userCount}</p>
                </div>
            </div>
        </div>
    );
}

