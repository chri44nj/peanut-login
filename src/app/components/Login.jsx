"use client";

import { useState } from "react";
import styles from "../styles/Login.module.css";

function Login() {
  const [passwordType, setPasswordType] = useState("password");
  const [tooltipText, setTooltipText] = useState("Vis adgangskode");
  const [loginType, setLoginType] = useState("login");

  function showPassword() {
    if (passwordType === "password") {
      setPasswordType("text");
      setTooltipText("Skjul adgangskode");
    } else {
      setPasswordType("password");
      setTooltipText("Vis adgangskode");
    }
  }

  function switchLogin() {
    if (loginType === "login") {
      setLoginType("create");
    } else {
      setLoginType("login");
    }
  }

  return (
    <div className={styles.loginFormContainer}>
      <form className={styles.loginForm} action="">
        <h2>{loginType === "login" ? "Log ind" : "Opret en bruger"}</h2>
        <div className={styles.inputField}>
          <label htmlFor="email">Email-adresse</label>
          <input type="email" id="email" name="email" required />
        </div>

        <div className={styles.inputField}>
          <label htmlFor="password">Adgangskode</label>
          <div className={styles.passwordContainer}>
            <input type={passwordType} id="password" name="password" required />
            <button type="button" className={styles.showPassword} onClick={showPassword}>
              {passwordType === "password" ? "Ø" : "O"} <span className={styles.passwordTooltip}>{tooltipText}</span>
            </button>
          </div>
        </div>

        <button className={styles.loginButton} type="submit">
          {loginType === "login" ? "Log ind" : "Opret"}
        </button>

        <div className={styles.switchButtonContainer}>
          <p> {loginType === "login" ? "Har du ikke en bruger endnu?" : "Har du allerede en bruger?"}</p>
          <button type="button" className={`${styles.switchButton} hover-link`} onClick={switchLogin}>
            {loginType === "login" ? "Opret en" : "Log ind"}
          </button>
        </div>

        <div className={styles.ellerContainer}>
          <hr className={styles.ellerLine} />
          <span className={styles.eller}>eller</span>
        </div>

        <p className="hover-link">Fortsæt med Google</p>
      </form>
    </div>
  );
}

export default Login;
