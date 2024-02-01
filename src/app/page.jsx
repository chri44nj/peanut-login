"use client";

import { useContext } from "react";

import styles from "./styles/page.module.css";
import { MyContexts } from "./components/Contexts";

import Login from "./components/Login";
import Dashboard from "./components/Dashboard";

export default function Home() {
  /* Contexts */
  const myContexts = useContext(MyContexts);

  return (
    <main id="main" className={styles.main}>
      {!myContexts.loggedIn ? <Login /> : <Dashboard />}
    </main>
  );
}
