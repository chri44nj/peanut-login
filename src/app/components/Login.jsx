"use client";

import { useState, useContext } from "react";
import styles from "../styles/Login.module.css";

import { TestContext, SetTestContext } from "./Contexts";
import OptionCard from "./OptionCard";

function Login() {
  /* Contexts */
  const testState = useContext(TestContext);
  const testDispatch = useContext(SetTestContext);

  /* States */
  const [passwordType, setPasswordType] = useState("password");
  const [tooltipText, setTooltipText] = useState("Vis adgangskode");
  const [loginType, setLoginType] = useState("login");
  const [accountType, setAccountType] = useState("");
  const [signedIn, setSignedIn] = useState(false);

  /* Functions */
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
      testDispatch(true);
    } else {
      setLoginType("login");
      testDispatch(false);
    }
  }

  function chooseAccountType(selectedType) {
    setAccountType(selectedType);
  }

  function signIn(e) {
    e.preventDefault();
    if (!signedIn) {
      setSignedIn(true);
    } else {
      setSignedIn(false);
    }
  }

  return (
    <>
      {!testState && !signedIn ? (
        <div className={styles.loginFormContainer}>
          <form onSubmit={(e) => signIn(e)} className={styles.loginForm} action="">
            <h2>{loginType === "login" ? "Log ind" : "Opret en bruger"}</h2>
            <div className={styles.inputField}>
              <label htmlFor="email">Email-adresse</label>
              <input type="email" id="email" name="email" title="Indtast din email-adresse" required />
            </div>

            <div className={styles.inputField}>
              <label htmlFor="password">Adgangskode</label>
              <div className={styles.passwordContainer}>
                <input type={passwordType} id="password" name="password" title={loginType === "login" ? "Indtast din adgangskode" : "Indtast din ønskede adgangskode"} required />
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
              <button
                type="button"
                className={`${styles.switchButton} hover-link`}
                onClick={() => {
                  switchLogin();
                  setAccountType("");
                }}
              >
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
      ) : (
        ""
      )}

      {testState && !signedIn ? (
        <div className={styles.createFormContainer}>
          {!accountType ? (
            <div className={styles.chooseAccountContainer}>
              <h2>Hvilken type bruger beskriver dig bedst?</h2>
              <div className={styles.optionsContainer}>
                <OptionCard onClick={() => chooseAccountType("lærer")} top="Hey" bottom="Lærer"></OptionCard>
                <OptionCard onClick={() => chooseAccountType("forælder")} top="Hey" bottom="Forælder"></OptionCard>
                <OptionCard onClick={() => chooseAccountType("elev")} top="Hey" bottom="Elev"></OptionCard>
              </div>
              <div className={styles.switchButtonContainer}>
                <p> {loginType === "login" ? "Har du ikke en bruger endnu?" : "Har du allerede en bruger?"}</p>
                <button type="button" className={`${styles.switchButton} hover-link`} onClick={switchLogin}>
                  {loginType === "login" ? "Opret en" : "Log ind"}
                </button>
              </div>
            </div>
          ) : (
            ""
          )}

          {accountType && !signedIn ? (
            <form onSubmit={(e) => signIn(e)} className={styles.createForm} action="">
              <h2>
                {loginType === "login" ? "Log ind" : "Opret en bruger"} som <span className={styles.accountType}>{accountType}</span>
              </h2>
              {accountType ? (
                <div className={styles.switchButtonContainer}>
                  <p>Trykkede du forkert?</p>
                  <button type="button" className={`${styles.switchButton} hover-link`} onClick={() => setAccountType("")}>
                    Vælg anden type
                  </button>
                </div>
              ) : (
                ""
              )}

              <div className={styles.inputField}>
                <label htmlFor="email">Email-adresse</label>
                <input type="email" id="email" name="email" title="Indtast din email-adresse" required />
              </div>

              <div className={styles.inputField}>
                <label htmlFor="password">Adgangskode</label>
                <div className={styles.passwordContainer}>
                  <input type={passwordType} id="password" name="password" title={loginType === "login" ? "Indtast din adgangskode" : "Indtast din ønskede adgangskode"} required />
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
          ) : (
            ""
          )}
        </div>
      ) : (
        ""
      )}
    </>
  );
}

export default Login;
