import { useState, useEffect } from "react";
import axios from "axios";

import styles from "../styles/DashboardScoreboard.module.css";

function DashboardScoreboard() {
  /* States */
  const [userData, setUserData] = useState([]);
  const [amount, setAmount] = useState(10);

  /* Other */
  useEffect(() => {
    async function loadData() {
      const info = { range: "today", n: amount };
      try {
        const res = await axios.get(`https://skillzy-node.fly.dev/api/get-leaderboard-players`, {
          params: info,
        });
        const formattedData = res.data.map((user) => ({
          name: user.name,
          score: user.score,
        }));
        await setUserData((prevData) => [...prevData, ...formattedData]);
        console.log(userData);
      } catch (error) {
        console.error("Error fetching leaderboard data:", error);
      }
    }

    loadData();
  }, [amount]);

  return (
    <>
      <div className={styles.scoreboardContainer}>
        {userData.map((user, index) => (
          <div className={styles.hamsterScore} key={index}>
            <div className={styles.hamsterTop}>
              <p>{index + 1}</p>
              <p className={styles.hamsterName}>{user.name}</p>
            </div>
            <p>{user.score}</p>
          </div>
        ))}
      </div>
      <button className={styles.loadButton} type="button" onClick={() => setAmount((old) => old + 10)}>
        Indlæs næste 10
      </button>
    </>
  );
}

export default DashboardScoreboard;
