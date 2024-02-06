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
                {index === 0 || index === 1 || index === 2 ? (
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-award-fill" viewBox="0 0 16 16">
                    <path d="M8 0l1.669.864 1.858.282.842 1.68 1.337 1.32L13.4 6l.306 1.854-1.337 1.32-.842 1.68-1.858.282L8 12l-1.669-.864-1.858-.282-.842-1.68-1.337-1.32L2.6 6l-.306-1.854 1.337-1.32.842-1.68L6.331.864 8 0z" />
                    <path d="M4 11.794V16l4-1 4 1v-4.206l-2.018.306L8 13.126 6.018 12.1 4 11.794z" />
                  </svg>
                ) : (
                  ""
                )}
                {user.score > 10000 ? (
                  <svg className={styles.star} xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="white" class="bi bi-star-fill" viewBox="0 0 16 16">
                    <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.283.95l-3.523 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z" />
                  </svg>
                ) : (
                  ""
                )}
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
