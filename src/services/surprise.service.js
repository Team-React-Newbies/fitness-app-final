import { get, ref } from "firebase/database";
import { db } from "../config/firebase-config.js";

export const fetchRandomGoal = async () => {
  try {
    const goalsRef = ref(db, "random-goals");
    const snapshot = await get(goalsRef);
    if (snapshot.exists()) {
      const goals = snapshot.val();
      const goalTitles = Object.values(goals).map((goal) => goal.title);
      const randomTitle =
        goalTitles[Math.floor(Math.random() * goalTitles.length)];
      return randomTitle;
    } else {
      console.log("No data available");
      return null;
    }
  } catch (error) {
    console.error("Error fetching data: ", error);
    return null;
  }
};
