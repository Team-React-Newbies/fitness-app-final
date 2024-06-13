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
          "y2mate.com - ZICO지코  TOUGH COOKIE 터프쿠키 AUDIO.mp3"
        );
        setAudioUrl(url);
      } catch (error) {
        console.error("Error fetching audio URL:", error);
      }
    };

    loadUserCount();
    fetchAudioUrl();
  }, []);

  useEffect(() => {
    if (audioUrl && audioRef.current) {
      audioRef.current.play().catch((error) => {
        console.error("Error attempting to play audio:", error);
        const playOnInteraction = () => {
          audioRef.current.play().catch((playError) => {
            console.error("Error playing audio after interaction:", playError);
          });
          document.removeEventListener("click", playOnInteraction);
        };
        document.addEventListener("click", playOnInteraction);
      });
    }
  }, [audioUrl]);

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
            <h2>PowersnApp</h2>
            <p>In Construction...</p>
          </div>
          <div className="user-count">
            <p>Number of users of the app: {userCount}</p>
          </div>
        </div>
          <div className="idol-quotes">
            <p>They all started from scratch:</p>

            <img className="quote" src={"/src/assets/QuotePhotos/kobeBryantQuote.jpg"} alt="Kobe Bryant qoute" />
            <img className="quote" src={"/src/assets/QuotePhotos/muhammedAliQuote.jpg"} alt="Muhammed Ali quote" />
            <img className="quote" src={"/src/assets/QuotePhotos/usainBoltQuote.jpg"} alt="Usain bolt quote" />
            <img className="quote" src={"/src/assets/QuotePhotos/michaelJordanQuote.jpg"} alt="Michael Jordan quote" />
            <img className="quote" src={"/src/assets/QuotePhotos/vinceLombardiQuote.jpg"} alt="Vince Lombardi quote" />
            <img className="quote" src={"/src/assets/QuotePhotos/cristianoRonaldoQuote.png"} alt="Cristiano Ronaldo quote" />
          </div>
        {audioUrl && (
          <audio ref={audioRef} controls autoPlay className="audio-player">
            <source src={audioUrl} type="audio/mp3" />
            Your browser does not support the audio element.
          </audio>
        )}
      </div>
    </>
  );
}
