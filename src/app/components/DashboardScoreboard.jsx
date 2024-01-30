import { useState, useEffect } from "react";
import axios from "axios";

import styles from "../styles/DashboardScoreboard.module.css";

function DashboardScoreboard() {
  /* States */
  const [userData, setUserData] = useState([]);

  /* Other */
  useEffect(() => {
    async function loadData() {
      const info = { range: "today", n: 10 };
      try {
        const res = await axios.get(`https://skillzy-node.fly.dev/api/get-leaderboard-players`, {
          params: info,
        });
        const formattedData = res.data.map((user) => ({
          name: user.name,
          score: user.score,
        }));
        setUserData(formattedData);
        console.log(formattedData);
      } catch (error) {
        console.error("Error fetching leaderboard data:", error);
      }
    }

    loadData();
  }, []);

  return (
    <div>
      {userData.map((user, index) => (
        <p key={index}>
          {index + 1} {user.name} {user.score}
        </p>
      ))}
    </div>
  );
}

export default DashboardScoreboard;
