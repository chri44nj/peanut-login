"use client";
import styles from "../styles/Header.module.css";
import { useContext } from "react";
import { MyContexts, SetMyContexts } from "./Contexts";

function Header() {
  /* Contexts */
  const myContexts = useContext(MyContexts);
  const myContextsDispatch = useContext(SetMyContexts);

  /* Functions */
  function switchDashboardType(dashboardType) {
    myContextsDispatch((old) => ({
      ...old,
      dashboardType: dashboardType,
      clickedClass: "Alle klasser",
      selectedStudent: "Alle elever",
    }));
    burgerMenuClicked();
  }

  function burgerMenuClicked() {
    if (!myContexts.burgerMenuOpen) {
      myContextsDispatch((old) => ({
        ...old,
        burgerMenuOpen: true,
      }));
    } else {
      myContextsDispatch((old) => ({
        ...old,
        burgerMenuOpen: false,
      }));
    }
  }

  return (
    <header className={styles.header}>
      <nav className={styles.headerNav}>
        <a className={`${styles.navLink} hover-link`} href="https://planetpeanut.io/da/" target="_blank">
          Planet Peanut
        </a>
        <div>
          <button
            className={styles.accountIcon}
            type="button"
            onClick={() => {
              switchDashboardType("Din konto");
              burgerMenuClicked();
            }}
          >
            <svg className={styles.navLink} xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" class="bi bi-person-circle" viewBox="0 0 16 16">
              <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0z" />
              <path fillRule="evenodd" d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8zm8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1z" />
            </svg>
          </button>
        </div>
      </nav>
    </header>
  );
}

export default Header;
