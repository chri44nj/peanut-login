import { useState, useEffect } from "react";
import axios from "axios";

import styles from "../styles/DashboardScoreboard.module.css";

function DashboardScoreboard() {
  /* States */
  const [userNames, setUserNames] = useState([]);

  /* Other */
  useEffect(() => {
    async function loadData() {
      const info = { range: "today", n: 10 };
      try {
        const res = await axios.get(`https://skillzy-node.fly.dev/api/get-leaderboard-players`, {
          params: info,
        });
        setUserNames(res.data.map((user) => user.name));
      } catch (error) {
        console.error("Error fetching leaderboard data:", error);
      }
    }

    loadData();
  }, []);

  return (
    <div>
      {userNames.map((name, index) => (
        <p key={index}>
          {index + 1} {name}
        </p>
      ))}
    </div>
  );
}

export default DashboardScoreboard;
