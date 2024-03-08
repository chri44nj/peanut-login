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
  const [showTooltip, setShowTooltip] = useState(false);

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

  /* Other */
  const school24 = (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" class="bi bi-building" viewBox="0 0 16 16">
      <path fill-rule="evenodd" d="M14.763.075A.5.5 0 0 1 15 .5v15a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5V14h-1v1.5a.5.5 0 0 1-.5.5h-9a.5.5 0 0 1-.5-.5V10a.5.5 0 0 1 .342-.474L6 7.64V4.5a.5.5 0 0 1 .276-.447l8-4a.5.5 0 0 1 .487.022zM6 8.694L1 10.36V15h5V8.694zM7 15h2v-1.5a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 .5.5V15h2V1.309l-7 3.5V15z" />
      <path d="M2 11h1v1H2v-1zm2 0h1v1H4v-1zm-2 2h1v1H2v-1zm2 0h1v1H4v-1zm4-4h1v1H8V9zm2 0h1v1h-1V9zm-2 2h1v1H8v-1zm2 0h1v1h-1v-1zm2-2h1v1h-1V9zm0 2h1v1h-1v-1zM8 7h1v1H8V7zm2 0h1v1h-1V7zm2 0h1v1h-1V7zM8 5h1v1H8V5zm2 0h1v1h-1V5zm2 0h1v1h-1V5zm0-2h1v1h-1V3z" />
    </svg>
  );

  return (
    <>
      <div className={styles.scoreboardContainer}>
        <h2>Denne uge</h2>
        {Object.values(userData).every((category) => category.length === 0) && <p className="loading">Indlæser data...</p>}

        <section className={`${styles.hamsterScore}`}>
          <div className={`${styles.scoreboardCategory} ${styles.diamond}`}>
            <h3 className={styles.scoreboardCategoryName}>Diamant</h3>
            <img src="/pics/diamond-medal.svg" alt="Diamond Medal" className={styles.diamondMedal} />
            <div className={styles.information}>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-info-circle-fill" viewBox="0 0 16 16">
                <path d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16zm.93-9.412l-1 4.705c-.07.34.029.533.304.533.194 0 .487-.07.686-.246l-.088.416c-.287.346-.92.598-1.465.598-.703 0-1.002-.422-.808-1.319l.738-3.468c.064-.293.006-.399-.287-.47l-.451-.081.082-.381 2.29-.287zM8 5.5a1 1 0 1 1 0-2 1 1 0 0 1 0 2z" />
              </svg>
              <span className={styles.informationTooltip}>Vær skolen med højeste score for at komme i rank diamant!</span>
            </div>
          </div>
          {userData.diamond.map((user, index) => (
            <div className={`${styles.singleSchool} ${styles.diamondSchool}`} key={index}>
              <div className={styles.singleSchoolLeft}>
                <p>{school24}</p>
                <p className={styles.hamsterName}>{user.name}</p>
              </div>
              <p>{user.score.toLocaleString()}</p>
            </div>
          ))}
        </section>

        <section className={`${styles.hamsterScore}`}>
          <div className={`${styles.scoreboardCategory} ${styles.gold}`}>
            <h3 className={styles.scoreboardCategoryName}>Guld</h3>
            <img src="/pics/gold-medal.svg" alt="Gold Medal" className={styles.goldMedal} />
            <div className={styles.information}>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-info-circle-fill" viewBox="0 0 16 16">
                <path d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16zm.93-9.412l-1 4.705c-.07.34.029.533.304.533.194 0 .487-.07.686-.246l-.088.416c-.287.346-.92.598-1.465.598-.703 0-1.002-.422-.808-1.319l.738-3.468c.064-.293.006-.399-.287-.47l-.451-.081.082-.381 2.29-.287zM8 5.5a1 1 0 1 1 0-2 1 1 0 0 1 0 2z" />
              </svg>
              <span className={styles.informationTooltip}>Optjen en score på min. 20.000 for at komme i rank guld!</span>
            </div>
          </div>
          {userData.gold.map((user, index) => (
            <div className={`${styles.singleSchool} ${styles.goldSchool}`} key={index}>
              <div className={styles.singleSchoolLeft}>
                <p>{school24}</p>
                <p className={styles.hamsterName}>{user.name}</p>
              </div>
              <p>{user.score.toLocaleString()}</p>
            </div>
          ))}
        </section>

        <section className={`${styles.hamsterScore}`}>
          <div className={`${styles.scoreboardCategory} ${styles.silver}`}>
            <h3 className={styles.scoreboardCategoryName}>Sølv</h3>
            <img src="/pics/silver-medal.svg" alt="Silver Medal" className={styles.silverMedal} />
            <div className={styles.information}>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-info-circle-fill" viewBox="0 0 16 16">
                <path d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16zm.93-9.412l-1 4.705c-.07.34.029.533.304.533.194 0 .487-.07.686-.246l-.088.416c-.287.346-.92.598-1.465.598-.703 0-1.002-.422-.808-1.319l.738-3.468c.064-.293.006-.399-.287-.47l-.451-.081.082-.381 2.29-.287zM8 5.5a1 1 0 1 1 0-2 1 1 0 0 1 0 2z" />
              </svg>
              <span className={styles.informationTooltip}>Optjen en score på min. 10.000 for at komme i rank sølv!</span>
            </div>
          </div>
          {userData.silver.map((user, index) => (
            <div className={`${styles.singleSchool} ${styles.silverSchool}`} key={index}>
              <div className={styles.singleSchoolLeft}>
                <p>{school24}</p>
                <p className={styles.hamsterName}>{user.name}</p>
              </div>
              <p>{user.score.toLocaleString()}</p>
            </div>
          ))}
        </section>

        <section className={`${styles.hamsterScore}`}>
          <div className={`${styles.scoreboardCategory} ${styles.bronze}`}>
            <h3 className={styles.scoreboardCategoryName}>Bronze</h3>
            <img src="/pics/bronze-medal.svg" alt="Bronze Medal" className={styles.bronzeMedal} />
            <div className={styles.information}>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-info-circle-fill" viewBox="0 0 16 16">
                <path d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16zm.93-9.412l-1 4.705c-.07.34.029.533.304.533.194 0 .487-.07.686-.246l-.088.416c-.287.346-.92.598-1.465.598-.703 0-1.002-.422-.808-1.319l.738-3.468c.064-.293.006-.399-.287-.47l-.451-.081.082-.381 2.29-.287zM8 5.5a1 1 0 1 1 0-2 1 1 0 0 1 0 2z" />
              </svg>
              <span className={styles.informationTooltip}>Optjen en score på min. 5.000 for at komme i rank bronze!</span>
            </div>
          </div>
          {userData.bronze.map((user, index) => (
            <div className={`${styles.singleSchool} ${styles.bronzeSchool}`} key={index}>
              <div className={styles.singleSchoolLeft}>
                <p>{school24}</p>
                <p className={styles.hamsterName}>{user.name}</p>
              </div>
              <p>{user.score.toLocaleString()}</p>
            </div>
          ))}
        </section>

        <section className={`${styles.hamsterScore}`}>
          <div className={`${styles.scoreboardCategory} ${styles.all}`}>
            <h3 id={styles.novice} className={styles.scoreboardCategoryName}>
              Novice
            </h3>
            <div className={styles.information}>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-info-circle-fill" viewBox="0 0 16 16">
                <path d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16zm.93-9.412l-1 4.705c-.07.34.029.533.304.533.194 0 .487-.07.686-.246l-.088.416c-.287.346-.92.598-1.465.598-.703 0-1.002-.422-.808-1.319l.738-3.468c.064-.293.006-.399-.287-.47l-.451-.081.082-.381 2.29-.287zM8 5.5a1 1 0 1 1 0-2 1 1 0 0 1 0 2z" />
              </svg>
              <span className={styles.informationTooltip}>Optjen en højere score for at stige i rank!</span>
              <div class="tooltipPointer"></div>
            </div>
          </div>
          {userData.all.map((user, index) => (
            <div className={`${styles.singleSchool} ${styles.allSchool}`} key={index}>
              <div className={styles.singleSchoolLeft}>
                <p>{school24}</p>
                <p className={styles.hamsterName}>{user.name}</p>
              </div>
              <p>{user.score.toLocaleString()}</p>
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
