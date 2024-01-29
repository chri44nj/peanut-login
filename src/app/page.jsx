"use client";

import { useContext } from "react";

import styles from "./styles/page.module.css";
import { LoggedInContext, SetLoggedInContext } from "./components/Contexts";

import Login from "./components/Login";
import Dashboard from "./components/Dashboard";

export default function Home() {
  /* Contexts */
  const loggedInState = useContext(LoggedInContext);
  const loggedInDispatch = useContext(SetLoggedInContext);

  return (
    <main id="main" className={styles.main}>
      {!loggedInState ? <Login /> : <Dashboard />}
    </main>
  );
}
