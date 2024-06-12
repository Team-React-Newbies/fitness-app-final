import React, { useEffect, useState, useRef } from "react";
import { fetchAllUsers } from "../services/users.service";
import { getMusicUrl } from "../services/storage.service";
import "./Home.css";
import backgroundVideo from "../assets/Videos/BallerinaTurns.mp4";

export default function Home() {
  const [userCount, setUserCount] = useState(0);
  const [audioUrl, setAudioUrl] = useState("");
  const audioRef = useRef(null);

  useEffect(() => {
    const loadUserCount = async () => {
      try {
        const usersData = await fetchAllUsers();
        const usersArray = Object.values(usersData);
        setUserCount(usersArray.length);
      } catch (error) {
        console.error("Failed to fetch users:", error);
      }
    };

    const fetchAudioUrl = async () => {
      try {
        const url = await getMusicUrl(
          'y2mate.com - ZICO지코  TOUGH COOKIE 터프쿠키 AUDIO.mp3' 
        );
        setAudioUrl(url);
      } catch (error) {
        console.error("Error fetching audio URL:", error);
      }
    };

    loadUserCount();
    fetchAudioUrl();
  }, []);

  return (
    <>
      <video className="background-video" autoPlay loop muted>
        <source src={backgroundVideo} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      <div className="home-container">
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
        {audioUrl && (
          <audio ref={audioRef} controls className="audio-player">
            <source src={audioUrl} type="audio/mp3" />
            Your browser does not support the audio element.
          </audio>
        )}
      </div>
    </>
  );
}
