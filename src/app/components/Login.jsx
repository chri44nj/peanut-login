"use client";

import { useContext, useState, useEffect } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import styles from "../styles/Login.module.css";
import { MyContexts, SetMyContexts } from "./Contexts";
import OptionCard from "./OptionCard";

function Login() {
  /* Contexts */
  const myContexts = useContext(MyContexts);
  const myContextsDispatch = useContext(SetMyContexts);

  /* States */
  const [passwordType, setPasswordType] = useState("password");
  const [tooltipText, setTooltipText] = useState("Vis adgangskode");
  const [accountType, setAccountType] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailValid, setEmailValid] = useState(false);
  const [passwordValid, setPasswordValid] = useState(false);
  const [passwordCriteria, setPasswordCriteria] = useState(false);
  const [passwordCriteria2, setPasswordCriteria2] = useState(false);
  const [error, setError] = useState("");

  /* Effects */
  useEffect(() => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
    setEmailValid(emailRegex.test(email));
    setPasswordValid(passwordRegex.test(password));

    const capitalNumber = /^(?=.*[A-Z])(?=.*\d)/.test(password);
    setPasswordCriteria(capitalNumber);
    setPasswordCriteria2(password.length >= 8);
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
    setError("");
    if (myContexts.loginType === "login") {
      myContextsDispatch((old) => ({
        ...old,
        loginType: "create",
      }));
    } else {
      myContextsDispatch((old) => ({
        ...old,
        loginType: "login",
      }));
    }
  }

  function chooseAccountType(selectedType) {
    setEmail("");
    setPassword("");
    setEmailValid(false);
    setPasswordValid(false);
    setAccountType(selectedType);
  }

  const handleSignIn = async (e) => {
    e.preventDefault();

    try {
      const res = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (res.error) {
        setError("Forkert email eller adgangskode");
        return;
      }

      if (!myContexts.loggedIn) {
        myContextsDispatch((old) => ({
          ...old,
          loggedIn: true,
        }));
      } else {
        myContextsDispatch((old) => ({
          ...old,
          loggedIn: false,
        }));
      }

      router.replace("/pages/dashboard");
    } catch (error) {
      console.log(error);
    }
  };

  const handleCreateLogin = async (e) => {
    e.preventDefault();

    if (!name || !email || !password) {
      setError("Udfyld alle felter");
      return;
    }

    try {
      const resUserExists = await fetch("api/userExists", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const { user } = await resUserExists.json();

      if (user) {
        setError("Email allerede brugt");
        return;
      }

      // Default values for additional fields
      const phone = 31929302; // Set default value for phone
      const school = "Ikke specificeret"; // Set default value for school
      const subjects = ["Matematik"]; // Set default value for subjects

      const res = await fetch("api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          password,
          phone,
          school,
          subjects,
        }),
      });

      console.log("name: ", name);
      console.log("email: ", email);
      console.log("password: ", password);
      console.log("phone: ", phone);
      console.log("school: ", school);
      console.log("subjects: ", subjects);

      if (res.ok) {
        const form = e.target;

        handleSignIn(e);
      } else {
        console.log("User registration failed.");
      }
    } catch (error) {
      console.log("Error during registration: ", error);
    }
  };

  /* Other Stuff */

  const router = useRouter();

  const userIcon = (
    <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" fill="currentColor" class="bi bi-person-fill" viewBox="0 0 16 16">
      <path d="M3 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1H3zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" />
    </svg>
  );

  const visible = (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-eye-fill" viewBox="0 0 16 16">
      <path d="M10.5 8a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0z" />
      <path d="M0 8s3-5.5 8-5.5S16 8 16 8s-3 5.5-8 5.5S0 8 0 8zm8 3.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7z" />
    </svg>
  );

  const notVisible = (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-eye-slash-fill" viewBox="0 0 16 16">
      <path d="M10.79 12.912l-1.614-1.615a3.5 3.5 0 0 1-4.474-4.474l-2.06-2.06C.938 6.278 0 8 0 8s3 5.5 8 5.5a7.027 7.027 0 0 0 2.79-.588zM5.21 3.088A7.028 7.028 0 0 1 8 2.5c5 0 8 5.5 8 5.5s-.939 1.721-2.641 3.238l-2.062-2.062a3.5 3.5 0 0 0-4.474-4.474L5.21 3.088z" />
      <path d="M5.525 7.646a2.5 2.5 0 0 0 2.829 2.829l-2.83-2.829zm4.95.708l-2.829-2.83a2.5 2.5 0 0 1 2.829 2.829zm3.171 6l-12-12 .708-.708 12 12-.708.707z" />
    </svg>
  );

  const cross = (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#ff3333" class="bi bi-x-circle-fill" viewBox="0 0 16 16">
      <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM5.354 4.646a.5.5 0 1 0-.708.708L7.293 8l-2.647 2.646a.5.5 0 0 0 .708.708L8 8.707l2.646 2.647a.5.5 0 0 0 .708-.708L8.707 8l2.647-2.646a.5.5 0 0 0-.708-.708L8 7.293 5.354 4.646z" />
    </svg>
  );

  const checkMark = (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#4BB543" class="bi bi-check-circle-fill" viewBox="0 0 16 16">
      <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z" />
    </svg>
  );

  const buttonTooltip = !emailValid ? "Indtast en korrekt emailadresse (eks: planetpeanut@hotmail.com" : !passwordValid ? "Indtast en korrekt adgangskode (min. 8 karakterer, min. 1 stort bogstav, min. 1 tal)" : "";

  return (
    <div id="loginContainer">
      {myContexts.loginType === "login" ? (
        <div id="loginForm" className={styles.loginFormContainer}>
          <form onSubmit={handleSignIn} className={styles.loginForm} action="">
            <h2>{myContexts.loginType === "login" ? "Log ind" : "Opret en bruger"}</h2>
            <div className={styles.inputField}>
              <label htmlFor="email">Email-adresse</label>
              <input type="email" id="email" name="email" title="Indtast din email-adresse" onChange={(e) => setEmail(e.target.value)} required />
            </div>

            <div className={styles.inputField}>
              <label htmlFor="password">Adgangskode</label>
              <div className={styles.passwordContainer}>
                <input type={passwordType} id="password" name="password" title={myContexts.loginType === "login" ? "Indtast din adgangskode" : "Indtast din ønskede adgangskode"} onChange={(e) => setPassword(e.target.value)} required />
                <button type="button" className={styles.showPassword} onClick={showPassword}>
                  {passwordType === "password" ? notVisible : visible} <span className={styles.passwordTooltip}>{tooltipText}</span>
                </button>
              </div>
            </div>

            {error && <p>{error}</p>}

            <button className={`${styles.loginButton} ${emailValid && password.length > 0 ? styles.validButton : ""}`} type="submit" title={buttonTooltip} disabled={!emailValid || password.length === 0}>
              {myContexts.loginType === "login" ? "Log ind" : "Opret"}
            </button>

            <div className={styles.switchButtonContainer}>
              <p> {myContexts.loginType === "login" ? "Har du ikke en bruger endnu?" : "Har du allerede en bruger?"}</p>
              <button
                type="button"
                className={`${styles.switchButton} hover-link`}
                onClick={() => {
                  switchLogin();
                  setAccountType("");
                }}
              >
                {myContexts.loginType === "login" ? "Opret nu" : "Log ind"}
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

      {myContexts.loginType === "create" ? (
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
                <p> {myContexts.loginType === "login" ? "Har du ikke en bruger endnu?" : "Har du allerede en bruger?"}</p>
                <button type="button" className={`${styles.switchButton} hover-link`} onClick={switchLogin}>
                  {myContexts.loginType === "login" ? "Opret nu" : "Log ind"}
                </button>
              </div>
            </div>
          ) : (
            ""
          )}

          {accountType && !myContexts.loggedIn ? (
            <form onSubmit={(e) => handleCreateLogin(e)} className={styles.createForm} action="">
              <h2>
                {myContexts.loginType === "login" ? "Log ind" : "Opret en bruger"} som <span className={styles.accountType}>{accountType}</span>
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
                <label htmlFor="email">Fulde navn</label>
                <input type="name" id="name" name="name" title="Indtast dit fulde navn" onChange={(e) => setName(e.target.value)} required />
              </div>

              <div className={styles.inputField}>
                <label htmlFor="email">Email-adresse</label>
                <input type="email" id="email" name="email" title="Indtast din email-adresse" onChange={(e) => setEmail(e.target.value)} required />
              </div>

              <div className={styles.inputField}>
                <label htmlFor="password">Adgangskode</label>
                <div className={styles.passwordContainer}>
                  <input type={passwordType} id="password" name="password" title={myContexts.loginType === "login" ? "Indtast din adgangskode" : "Indtast din ønskede adgangskode"} onChange={(e) => setPassword(e.target.value)} required />
                  <button type="button" className={styles.showPassword} onClick={showPassword}>
                    {passwordType === "password" ? notVisible : visible} <span className={styles.passwordTooltip}>{tooltipText}</span>
                  </button>
                </div>
              </div>

              <div className={styles.passwordCriteria}>
                <div>
                  {passwordCriteria ? checkMark : cross}
                  <p className={passwordCriteria ? "valid" : ""}>Minimum 1 stort bogstav og 1 tal</p>
                </div>
                <div>
                  {passwordCriteria2 ? checkMark : cross}
                  <p>Minimum 8 karakterer langt</p>
                </div>
              </div>

              {error && <p>{error}</p>}

              <button className={`${styles.loginButton} ${emailValid && passwordValid ? styles.validButton : ""}`} type="submit" title={buttonTooltip} disabled={!emailValid || !passwordValid}>
                {myContexts.loginType === "login" ? "Log ind" : "Opret"}
              </button>

              <div className={styles.switchButtonContainer}>
                <p> {myContexts.loginType === "login" ? "Har du ikke en bruger endnu?" : "Har du allerede en bruger?"}</p>
                <button type="button" className={`${styles.switchButton} hover-link`} onClick={switchLogin}>
                  {myContexts.loginType === "login" ? "Opret nu" : "Log ind"}
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
    </div>
  );
}

export default Login;
