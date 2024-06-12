import { useState, useEffect } from "react";
import { fetchRandomGoal } from "../../services/surprise.service.js"; // Adjust the import path as needed
import Button from "../../components/Button.jsx";
import "./SurpriseChallengeView.css"; // Import the CSS file

const Surprise = () => {
  const [goal, setGoal] = useState("");
  const [animate, setAnimate] = useState(false);

  const handleButtonClick = async () => {
    const randomGoal = await fetchRandomGoal();
    if (randomGoal) {
      setGoal(randomGoal);
      setAnimate(true);
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
      {goal && (
        <p className={`goal-text ${animate ? "animate" : ""}`}>{goal}</p>
      )}
      <Button className="surprise-button" onClick={handleButtonClick}>
        Random Daily challenge. Do it!🦸‍♂️
      </Button>
    </div>
  );
};

export default Surprise;
