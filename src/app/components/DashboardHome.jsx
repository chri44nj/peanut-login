"use client";
import { useContext } from "react";
import { useSession } from "next-auth/react";

import styles from "../styles/DashboardHome.module.css";

import { MyContexts, SetMyContexts } from "./Contexts";

function DashboardHome() {
  /* Contexts */
  const myContexts = useContext(MyContexts);
  const myContextsDispatch = useContext(SetMyContexts);

  /* Functions */
  function switchDashboardType(dashboardType) {
    myContextsDispatch((old) => ({
      ...old,
      dashboardType: dashboardType,
      clickedClass: "Alle klasser",
    }));
    burgerMenuClicked();
  }

  /* Other */
  const { data: session } = useSession();
  console.log("Session:", session);
  return (
    <div className={styles.homeContainer}>
      <h2 className={styles.name}>{session?.user?.name}</h2>
      <p>{session?.user?.email}</p>
      <p className={styles.phone}>+45 {myContexts.user.phone}</p>
      <p className={styles.school}>
        {myContexts.user.accountType} <span className={styles.lowercase}>på</span> {myContexts.user.school}
      </p>
      {myContexts.user.subjects ? (
        <p className={styles.subjects}>
          {myContexts.user.subjects.map((subject, index) => (
            <span key={index}>{subject.name} </span>
          ))}
        </p>
      ) : (
        ""
      )}
      <a className="hover-link" href="#dashboardContainer" onClick={() => switchDashboardType("Dine klasser")}>
        {myContexts.classes.length} klasser
      </a>
    </div>
  );
}

export default DashboardHome;
