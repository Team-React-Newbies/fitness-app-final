import { useState, useEffect } from "react";
import {
  fetchRandomGoal,
  fetchRandomSofiaChallenge,
} from "../../services/surprise.service.js"; // Adjust the import path as needed
import Button from "../../components/Button.jsx";
import "./SurpriseChallengeView.css"; // Import the CSS file

const Surprise = () => {
  const [goal, setGoal] = useState("");
  const [animate, setAnimate] = useState(false);
  const [side, setSide] = useState(""); // New state to track which side's button was clicked

  const handleButtonClick = async () => {
    const randomGoal = await fetchRandomGoal();
    if (randomGoal) {
      setGoal(randomGoal);
      setAnimate(true);
      setSide("left");
    }
  };

  const handleSofiaButtonClick = async () => {
    const randomChallenge = await fetchRandomSofiaChallenge();
    if (randomChallenge) {
      setGoal(randomChallenge);
      setAnimate(true);
      setSide("right");
    }
  };

  useEffect(() => {
    if (animate) {
      const timer = setTimeout(() => setAnimate(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [animate]);

  return (
    <div className="container">
      <div className="half left">
        {goal && side === "left" && (
          <p className={`goal-text black ${animate ? "animate" : ""}`}>
            {goal}
          </p>
        )}
        <Button className="surprise-button" onClick={handleButtonClick}>
          Solo Daily Challenge. Do it!🦸‍♂️
        </Button>
      </div>
      <div className="half right">
        {goal && side === "right" && (
          <p className={`goal-text white ${animate ? "animate" : ""}`}>
            {goal}
          </p>
        )}
        <Button className="surprise-button" onClick={handleSofiaButtonClick}>
          Sofia Group Daily Challenge! 🤝
        </Button>
      </div>
    </div>
  );
};

export default Surprise;
