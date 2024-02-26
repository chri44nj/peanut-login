"use client";
import { useState, useContext } from "react";
import { signOut } from "next-auth/react";
import styles from "../styles/Dashboard.module.css";
import { MyContexts, SetMyContexts } from "./Contexts";
import DashboardAccount from "./DashboardAccount";
import DashboardStatistics from "./DashboardStatistics";
import DashboardClasses from "./DashboardClasses";
import DashboardMilestones from "./DashboardMilestones";
import DashboardScoreboard from "./DashboardScoreboard";

function Dashboard() {
  /* Contexts */
  const myContexts = useContext(MyContexts);
  const myContextsDispatch = useContext(SetMyContexts);

  /* States */
  const [burgerMenu, setburgerMenu] = useState(false);

  /* Functions */
  function burgerMenuClicked() {
    if (!burgerMenu) {
      setburgerMenu(true);
    } else {
      setburgerMenu(false);
    }
  }

  function switchDashboardType(dashboardType) {
    myContextsDispatch((old) => ({
      ...old,
      dashboardType: dashboardType,
      clickedClass: "Alle klasser",
      selectedStudent: "Alle elever",
    }));
    burgerMenuClicked();
  }

  /* Other */

  return (
    <div id="dashboardContainer" className={styles.dashboardContainer}>
      <div className={`${styles.dashboardMenu} ${burgerMenu ? styles.dashboardBurger : ""}`}>
        <button id={myContexts.dashboardType === "Statistik" ? styles.activeDashboard : ""} value="Statistik" onClick={() => switchDashboardType("Statistik")}>
          <a href="#dashboardContainer">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-pie-chart-fill" viewBox="0 0 16 16">
              <path d="M15.985 8.5H8.207l-5.5 5.5a8 8 0 0 0 13.277-5.5zM2 13.292A8 8 0 0 1 7.5.015v7.778l-5.5 5.5zM8.5.015V7.5h7.485A8.001 8.001 0 0 0 8.5.015z" />
            </svg>
            Statistik
          </a>
        </button>
        <button id={myContexts.dashboardType === "Dine klasser" ? styles.activeDashboard : ""} value="Dine klasser" onClick={() => switchDashboardType("Dine klasser")}>
          <a href="#dashboardContainer">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-people-fill" viewBox="0 0 16 16">
              <path d="M7 14s-1 0-1-1 1-4 5-4 5 3 5 4-1 1-1 1H7zm4-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" />
              <path fillRule="evenodd" d="M5.216 14A2.238 2.238 0 0 1 5 13c0-1.355.68-2.75 1.936-3.72A6.325 6.325 0 0 0 5 9c-4 0-5 3-5 4s1 1 1 1h4.216z" />
              <path d="M4.5 8a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z" />
            </svg>
            Klasser
          </a>
        </button>

        <button id={myContexts.dashboardType === "Milepæle" ? styles.activeDashboard : ""} value="Milepæle" onClick={() => switchDashboardType("Milepæle")}>
          <a href="#dashboardContainer">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-check-square-fill" viewBox="0 0 16 16">
              <path d="M2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2zm10.03 4.97a.75.75 0 0 1 .011 1.05l-3.992 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.75.75 0 0 1 1.08-.022z" />
            </svg>
            Milepæle
          </a>
        </button>
        <button id={myContexts.dashboardType === "Scoreboard" ? styles.activeDashboard : ""} value="Scoreboard" onClick={() => switchDashboardType("Scoreboard")}>
          <a href="#dashboardContainer">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-trophy-fill" viewBox="0 0 16 16">
              <path d="M2.5.5A.5.5 0 0 1 3 0h10a.5.5 0 0 1 .5.5c0 .538-.012 1.05-.034 1.536a3 3 0 1 1-1.133 5.89c-.79 1.865-1.878 2.777-2.833 3.011v2.173l1.425.356c.194.048.377.135.537.255L13.3 15.1a.5.5 0 0 1-.3.9H3a.5.5 0 0 1-.3-.9l1.838-1.379c.16-.12.343-.207.537-.255L6.5 13.11v-2.173c-.955-.234-2.043-1.146-2.833-3.012a3 3 0 1 1-1.132-5.89A33.076 33.076 0 0 1 2.5.5zm.099 2.54a2 2 0 0 0 .72 3.935c-.333-1.05-.588-2.346-.72-3.935zm10.083 3.935a2 2 0 0 0 .72-3.935c-.133 1.59-.388 2.885-.72 3.935z" />
            </svg>
            Scoreboard
          </a>
        </button>
        <button id={myContexts.dashboardType === "Din konto" ? styles.activeDashboard : ""} value="Hjem" onClick={() => switchDashboardType("Din konto")}>
          <a href="#dashboardContainer">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-house-door-fill" viewBox="0 0 16 16">
              <path d="M6.5 14.5v-3.505c0-.245.25-.495.5-.495h2c.25 0 .5.25.5.5v3.5a.5.5 0 0 0 .5.5h4a.5.5 0 0 0 .5-.5v-7a.5.5 0 0 0-.146-.354L13 5.793V2.5a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5v1.293L8.354 1.146a.5.5 0 0 0-.708 0l-6 6A.5.5 0 0 0 1.5 7.5v7a.5.5 0 0 0 .5.5h4a.5.5 0 0 0 .5-.5z" />
            </svg>
            Din konto
          </a>
        </button>
        <button
          onClick={() => {
            myContextsDispatch((old) => ({
              ...old,
              loggedIn: false,
              loginType: "login",
              dashboardType: "Hjem",
            }));
            signOut();
            burgerMenuClicked();
          }}
        >
          <a>
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-door-open-fill" viewBox="0 0 16 16">
              <path d="M1.5 15a.5.5 0 0 0 0 1h13a.5.5 0 0 0 0-1H13V2.5A1.5 1.5 0 0 0 11.5 1H11V.5a.5.5 0 0 0-.57-.495l-7 1A.5.5 0 0 0 3 1.5V15H1.5zM11 2h.5a.5.5 0 0 1 .5.5V15h-1V2zm-2.5 8c-.276 0-.5-.448-.5-1s.224-1 .5-1 .5.448.5 1-.224 1-.5 1z" />
            </svg>
            Log ud
          </a>
        </button>
      </div>

      <div className={styles.dashboard}>
        <div id="dashboardHeader" className={styles.dashboardHeader}>
          <h1 id={myContexts.dashboardType}>{myContexts.dashboardType}</h1>
          <button anchor="dashboardHeader" type="button" className={styles.burgerMenu} onClick={() => burgerMenuClicked()}>
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
        {myContexts.dashboardType === "Din konto" ? <DashboardAccount /> : ""}
        {myContexts.dashboardType === "Statistik" ? <DashboardStatistics /> : ""}
        {myContexts.dashboardType === "Dine klasser" ? <DashboardClasses /> : ""}
        {myContexts.dashboardType === "Milepæle" ? <DashboardMilestones /> : ""}
        {myContexts.dashboardType === "Scoreboard" ? <DashboardScoreboard /> : ""}
      </div>
    </div>
  );
}

export default Dashboard;
