import { useState, useEffect } from "react";
import axios from "axios";

import styles from "../styles/DashboardScoreboard.module.css";

function DashboardScoreboard() {
  /* States */
  const [userData, setUserData] = useState({
    diamond: [],
    gold: [],
    silver: [],
    bronze: [],
    all: [],
  });
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

        // Separate users into categories
        const sortedUsers = formattedData.slice().sort((a, b) => b.score - a.score);
        const diamondUsers = sortedUsers.length > 0 ? [sortedUsers[0]] : [];
        const goldUsers = sortedUsers.filter((user) => user.score >= 2000 && user !== diamondUsers[0]);
        const silverUsers = sortedUsers.filter((user) => user.score >= 1000 && user.score < 2000);
        const bronzeUsers = sortedUsers.filter((user) => user.score >= 500 && user.score < 1000);
        const allUsers = sortedUsers.filter((user) => user.score < 500);

        // Update userData state with categorized users
        setUserData({
          diamond: diamondUsers,
          gold: goldUsers,
          silver: silverUsers,
          bronze: bronzeUsers,
          all: allUsers,
        });
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

        <section className={`${styles.hamsterScore}`}>
          <div className={styles.diamond}></div>
          {userData.diamond.map((user, index) => (
            <div className={styles.singleHamster} key={index}>
              <div className={styles.singleHamsterLeft}>
                <p>O</p>
                <p className={styles.hamsterName}>{user.name}</p>
              </div>

              <p>{user.score}</p>
            </div>
          ))}
        </section>

        <section className={`${styles.hamsterScore}`}>
          <div className={styles.gold}></div>
          {userData.gold.map((user, index) => (
            <div className={styles.singleHamster} key={index}>
              <div className={styles.singleHamsterLeft}>
                <p>O</p>
                <p className={styles.hamsterName}>{user.name}</p>
              </div>

              <p>{user.score}</p>
            </div>
          ))}
        </section>

        <section className={`${styles.hamsterScore}`}>
          <div className={styles.silver}></div>
          {userData.silver.map((user, index) => (
            <div className={styles.singleHamster} key={index}>
              <div className={styles.singleHamsterLeft}>
                <p>O</p>
                <p className={styles.hamsterName}>{user.name}</p>
              </div>

              <p>{user.score}</p>
            </div>
          ))}
        </section>

        <section className={`${styles.hamsterScore}`}>
          <div className={styles.bronze}></div>
          {userData.bronze.map((user, index) => (
            <div className={styles.singleHamster} key={index}>
              <div className={styles.singleHamsterLeft}>
                <p>O</p>
                <p className={styles.hamsterName}>{user.name}</p>
              </div>

              <p>{user.score}</p>
            </div>
          ))}
        </section>

        <section className={`${styles.hamsterScore}`}>
          <div className={styles.all}></div>
          {userData.all.map((user, index) => (
            <div className={styles.singleHamster} key={index}>
              <div className={styles.singleHamsterLeft}>
                <p>O</p>
                <p className={styles.hamsterName}>{user.name}</p>
              </div>

              <p>{user.score}</p>
            </div>
          ))}
        </section>
      </div>
      <button className={styles.loadButton} type="button" onClick={() => setAmount((old) => old + 10)}>
        Indlæs næste 10
      </button>
    </>
  );
}

export default DashboardScoreboard;
