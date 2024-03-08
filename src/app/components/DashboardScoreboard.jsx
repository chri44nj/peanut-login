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

  /* Effects */
  useEffect(() => {
    loadData();
  }, [amount]);

  /* Functions */
  async function loadData() {
    const info = { range: "today", n: amount };
    try {
      const res = await axios.get(`https://skillzy-node.fly.dev/api/get-classes-scoreboard-week`, {
        params: info,
      });
      console.log(res);
      const formattedData = res.data.data.map((user) => ({
        name: user.name,
        score: user.score,
      }));

      // Separate users into categories
      const sortedUsers = formattedData.slice().sort((a, b) => b.score - a.score);
      const diamondUsers = sortedUsers.length > 0 ? [sortedUsers[0]] : [];
      const goldUsers = sortedUsers.filter((user) => user.score >= 20000 && user !== diamondUsers[0]);
      const silverUsers = sortedUsers.filter((user) => user.score >= 10000 && user.score < 20000);
      const bronzeUsers = sortedUsers.filter((user) => user.score >= 5000 && user.score < 10000);
      const allUsers = sortedUsers.filter((user) => user.score < 5000);

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

  return (
    <>
      <div className={styles.scoreboardContainer}>
        <h2>Denne uge</h2>
        {Object.values(userData).every((category) => category.length === 0) && <p className="loading">Indlæser data...</p>}

        <section className={`${styles.hamsterScore}`}>
          <div className={`${styles.scoreboardCategory} ${styles.diamond}`}>
            <p className={styles.scoreboardCategoryName}>Diamond</p>
            <img src="/pics/diamond-medal.svg" alt="Diamond Medal" className={styles.diamondMedal} />
          </div>
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
          <div className={`${styles.scoreboardCategory} ${styles.gold}`}>
            <p className={styles.scoreboardCategoryName}>Gold</p>
            <img src="/pics/gold-medal.svg" alt="Gold Medal" className={styles.goldMedal} />
          </div>
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
          <div className={`${styles.scoreboardCategory} ${styles.silver}`}>
            <p className={styles.scoreboardCategoryName}>Silver</p>
            <img src="/pics/silver-medal.svg" alt="Silver Medal" className={styles.silverMedal} />
          </div>
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
          <div className={`${styles.scoreboardCategory} ${styles.bronze}`}>
            <p className={styles.scoreboardCategoryName}>Bronze</p>
            <img src="/pics/bronze-medal.svg" alt="Bronze Medal" className={styles.bronzeMedal} />
          </div>
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
          <div className={`${styles.scoreboardCategory} ${styles.all}`}>
            <p className={styles.scoreboardCategoryName}>Novice</p>
          </div>
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
