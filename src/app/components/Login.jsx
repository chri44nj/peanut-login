"use client";

import { useContext, useState, useEffect } from "react";
import styles from "../styles/Login.module.css";

import { LoggedInContext, SetLoggedInContext } from "./Contexts";
import OptionCard from "./OptionCard";

function Login() {
  /* Contexts */
  const loggedInState = useContext(LoggedInContext);
  const loggedInDispatch = useContext(SetLoggedInContext);

  /* States */
  const [passwordType, setPasswordType] = useState("password");
  const [tooltipText, setTooltipText] = useState("Vis adgangskode");
  const [loginType, setLoginType] = useState("login");
  const [accountType, setAccountType] = useState("");
  const [signedIn, setSignedIn] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailValid, setEmailValid] = useState(false);
  const [passwordValid, setPasswordValid] = useState(false);

  /* Effects */
  useEffect(() => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
    setEmailValid(emailRegex.test(email));
    setPasswordValid(passwordRegex.test(password));
  }, [email, password]);

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
    setEmail("");
    setPassword("");
    setEmailValid(false);
    setPasswordValid(false);
    if (loginType === "login") {
      setLoginType("create");
    } else {
      setLoginType("login");
    }
  }

  function chooseAccountType(selectedType) {
    setEmail("");
    setPassword("");
    setEmailValid(false);
    setPasswordValid(false);
    setAccountType(selectedType);
  }

  function signIn(e) {
    e.preventDefault();
    if (!signedIn) {
      setSignedIn(true);
      loggedInDispatch(true);
    } else {
      setSignedIn(false);
      loggedInDispatch(false);
    }
  }

  /* Other Stuff */

  const userIcon = (
    <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" fill="currentColor" className="bi bi-person-fill" viewBox="0 0 16 16">
      <path d="M3 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1H3zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" />
    </svg>
  );

  const buttonTooltip = !emailValid ? "Indtast en korrekt emailadresse (eks: planetpeanut@hotmail.com" : !passwordValid ? "Indtast en korrekt adgangskode (min. 8 karakterer, min. 1 stort bogstav, min. 1 tal)" : "";

  return (
    <>
      {loginType === "login" ? (
        <div id="loginForm" className={styles.loginFormContainer}>
          <form onSubmit={(e) => signIn(e)} className={styles.loginForm} action="">
            <h2>{loginType === "login" ? "Log ind" : "Opret en bruger"}</h2>
            <div className={styles.inputField}>
              <label htmlFor="email">Email-adresse</label>
              <input type="email" id="email" name="email" title="Indtast din email-adresse" onChange={(e) => setEmail(e.target.value)} required />
            </div>

            <div className={styles.inputField}>
              <label htmlFor="password">Adgangskode</label>
              <div className={styles.passwordContainer}>
                <input type={passwordType} id="password" name="password" title={loginType === "login" ? "Indtast din adgangskode" : "Indtast din ønskede adgangskode"} onChange={(e) => setPassword(e.target.value)} required />
                <button type="button" className={styles.showPassword} onClick={showPassword}>
                  {passwordType === "password" ? "Ø" : "O"} <span className={styles.passwordTooltip}>{tooltipText}</span>
                </button>
              </div>
            </div>

            <button className={`${styles.loginButton} ${emailValid && passwordValid ? styles.validButton : ""}`} type="submit" title={buttonTooltip} disabled={!emailValid || !passwordValid}>
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
                {loginType === "login" ? "Opret nu" : "Log ind"}
              </button>
            </div>

            <div className={styles.ellerContainer}>
              <hr className={styles.ellerLine} />
              <span className={styles.eller}>eller</span>
            </div>
            <p className="hover-link">Fortsæt med Google</p>
            <p className="hover-link">Fortsæt med Facebook</p>
            <p className="hover-link">Fortsæt med Apple</p>
          </form>
        </div>
      ) : (
        ""
      )}

      {loginType === "create" ? (
        <div id="createForm" className={styles.createFormContainer}>
          {!accountType ? (
            <div className={styles.chooseAccountContainer}>
              <h2>Hvilken type bruger beskriver dig bedst?</h2>
              <div className={styles.optionsContainer}>
                <OptionCard onClick={() => chooseAccountType("lærer")} top={userIcon} bottom="Lærer"></OptionCard>
                <OptionCard onClick={() => chooseAccountType("forælder")} top={userIcon} bottom="Forælder"></OptionCard>
                <OptionCard onClick={() => chooseAccountType("elev")} top={userIcon} bottom="Elev"></OptionCard>
              </div>
              <div className={styles.switchButtonContainer}>
                <p> {loginType === "login" ? "Har du ikke en bruger endnu?" : "Har du allerede en bruger?"}</p>
                <button type="button" className={`${styles.switchButton} hover-link`} onClick={switchLogin}>
                  {loginType === "login" ? "Opret nu" : "Log ind"}
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
                  <button type="button" className={`${styles.switchButton} hover-link`} onClick={() => chooseAccountType("")}>
                    Vælg anden type
                  </button>
                </div>
              ) : (
                ""
              )}

              <div className={styles.inputField}>
                <label htmlFor="email">Email-adresse</label>
                <input type="email" id="email" name="email" title="Indtast din email-adresse" onChange={(e) => setEmail(e.target.value)} required />
              </div>

              <div className={styles.inputField}>
                <label htmlFor="password">Adgangskode</label>
                <div className={styles.passwordContainer}>
                  <input type={passwordType} id="password" name="password" title={loginType === "login" ? "Indtast din adgangskode" : "Indtast din ønskede adgangskode"} onChange={(e) => setPassword(e.target.value)} required />
                  <button type="button" className={styles.showPassword} onClick={showPassword}>
                    {passwordType === "password" ? "Ø" : "O"} <span className={styles.passwordTooltip}>{tooltipText}</span>
                  </button>
                </div>
              </div>

              <button className={`${styles.loginButton} ${emailValid && passwordValid ? styles.validButton : ""}`} type="submit" title={buttonTooltip} disabled={!emailValid || !passwordValid}>
                {loginType === "login" ? "Log ind" : "Opret"}
              </button>

              <div className={styles.switchButtonContainer}>
                <p> {loginType === "login" ? "Har du ikke en bruger endnu?" : "Har du allerede en bruger?"}</p>
                <button type="button" className={`${styles.switchButton} hover-link`} onClick={switchLogin}>
                  {loginType === "login" ? "Opret nu" : "Log ind"}
                </button>
              </div>

              <div className={styles.ellerContainer}>
                <hr className={styles.ellerLine} />
                <span className={styles.eller}>eller</span>
              </div>

              <p className="hover-link">Fortsæt med Google</p>
              <p className="hover-link">Fortsæt med Facebook</p>
              <p className="hover-link">Fortsæt med Apple</p>
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
