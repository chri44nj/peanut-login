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
        <h2>Seneste 24 timer</h2>
        {userData.map((user, index) => (
          <div className={styles.hamsterScore} key={index}>
            <div className={styles.hamsterTop}>
              <p>{index + 1}.</p>
              <div className={styles.hamsterTop}>
                <p className={styles.hamsterName}>{user.name}</p>
              </div>
            </div>
            <div className={styles.hamsterTop}>
              <p>{user.score}</p>
              <svg className={styles.points} xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="white" class="bi bi-capslock-fill" viewBox="0 0 16 16">
                <path d="M7.27 1.047a1 1 0 0 1 1.46 0l6.345 6.77c.6.638.146 1.683-.73 1.683H11.5v1a1 1 0 0 1-1 1h-5a1 1 0 0 1-1-1v-1H1.654C.78 9.5.326 8.455.924 7.816L7.27 1.047zM4.5 13.5a1 1 0 0 1 1-1h5a1 1 0 0 1 1 1v1a1 1 0 0 1-1 1h-5a1 1 0 0 1-1-1v-1z" />
              </svg>
            </div>
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
