"use client";

import { useContext, useState, useEffect, useRef } from "react";
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
  const [school, setSchool] = useState("ingen");
  const [selectedSubjects, setSelectedSubjects] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState(null);
  const [emailValid, setEmailValid] = useState(false);
  const [passwordValid, setPasswordValid] = useState(false);
  const [passwordCriteria, setPasswordCriteria] = useState(false);
  const [passwordCriteria2, setPasswordCriteria2] = useState(false);
  const [passwordCriteria3, setPasswordCriteria3] = useState(true);
  const [error, setError] = useState("");
  const [listOfSchools, setListOfSchools] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredSchools, setFilteredSchools] = useState([]);
  const [dropdownHidden, setDropdownHidden] = useState(true);
  const [loggingIn, setLoggingIn] = useState(false);
  const [recoverPassword, setRecoverPassword] = useState(false);
  const [recoverTokenSent, setRecoverTokenSent] = useState(false);
  const [recoverToken, setRecoverToken] = useState("");
  const [recoverTokenValidated, setRecoverTokenValidated] = useState(false);
  const [passwordChangeSucces, setPasswordChangeSucces] = useState(false);

  /* Effects */
  useEffect(() => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[\w\S]*$/;
    setEmailValid(emailRegex.test(email));
    setPasswordValid(passwordRegex.test(password));

    const capitalNumber = /^(?=.*[A-Z])(?=.*\d)/.test(password);
    setPasswordCriteria(capitalNumber);
    setPasswordCriteria2(password.length >= 8);
    setPasswordCriteria3(!/\s/.test(password));
  }, [email, password]);

  useEffect(() => {
    if (passwordCriteria3 === false) {
      setError("Mellemrum ikke tilladt i adgangskoden");
    } else {
      setError("");
    }
  }, [passwordCriteria3]);

  useEffect(() => {
    if (selectedSubjects.length !== 0) {
      setError("");
    }
  }, [selectedSubjects]);

  useEffect(() => {
    setError("");
    if (listOfSchools.length === 0) {
      fetchSchools();
    }
  }, [myContexts.loginType]);

  const dropdownRef = useRef(null);
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownHidden(true);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef]);

  useEffect(() => {
    if (dropdownHidden === false) {
      document.querySelector("#dropdown").scrollTop = 0;
    }
  }, [dropdownHidden]);

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
    setName("");
    setEmail("");
    setPassword("");
    setSchool("ingen");
    setSubjects([]);
    setEmailValid(false);
    setPasswordValid(false);
    setError("");
    setSelectedSubjects([]);
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
    setName("");
    setEmail("");
    setPassword("");
    setSubjects([]);
    setEmailValid(false);
    setPasswordValid(false);
    setAccountType(selectedType);
    setSelectedSubjects([]);
  }

  const handleSignIn = async (e) => {
    e.preventDefault();
    setLoggingIn(true);

    try {
      const res = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (res.error) {
        setError("Forkert email eller adgangskode");
        setLoggingIn(false);
        return;
      } else {
        router.replace("/pages/dashboard");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleCreateLogin = async (e) => {
    e.preventDefault();

    if (!name || !school || !email || !password) {
      setError("Udfyld alle felter");
      return;
    }

    setLoggingIn(true);
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
        setLoggingIn(false);
        setError("Email er allerede i brug");
        return;
      }

      const classes = [];

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
          accountType,
          classes,
        }),
      });

      if (res.ok) {
        handleSignIn(e);
      } else {
        setLoggingIn(false);
        console.log("User registration failed.");
        setError("Email er allerede i brug");
      }
    } catch (error) {
      setLoggingIn(false);
      console.log("Error during registration: ", error);
      setError("Der opstod en ukendt fejl");
    }
  };

  const toggleSubject = (subject) => {
    if (selectedSubjects.includes(subject)) {
      setSelectedSubjects(selectedSubjects.filter((item) => item !== subject));
    } else {
      setSelectedSubjects([...selectedSubjects, subject]);
    }
  };

  const handleSubjects = () => {
    if (selectedSubjects.length === 0) {
      setError("Vælg et eller flere fag");
    } else {
      setError("");
      setSubjects(selectedSubjects);
    }
  };

  const fetchSchools = async () => {
    let headersList = {
      Accept: "application/json",
    };

    let response = await fetch("https://skillzy-node.fly.dev/api/list-of-schools", {
      method: "GET",
      headers: headersList,
    });

    let list = await response.json();

    setListOfSchools(list.data);

    return list.data;
  };

  const handleSearchInputChange = (e) => {
    setSearchTerm(e.target.value);
    const searchTerm = e.target.value.toLowerCase(); // Convert input to lowercase for case-insensitive search

    // Filter the list of schools based on the search term
    const filteredList = listOfSchools.filter((school) => school.value.toLowerCase().includes(searchTerm));

    setFilteredSchools(filteredList);
    if (dropdownHidden) {
      setDropdownHidden(false);
    } else if (searchTerm.length === 0) {
      setDropdownHidden(true);
    }
  };

  const handleSchoolClick = (school) => {
    setSchool(school);
    setSearchTerm(school);
    setDropdownHidden(true);
  };

  const validateRecoverEmail = () => {
    console.log("Her skal skrives kode der tjekker om emailen eksisterer i databasen");
    setRecoverTokenSent(true);
  };

  const validateRecoverToken = () => {
    console.log("Her skal skrives kode der tjekker om recover tokenen er gyldig");
    setRecoverTokenValidated(true);
  };

  const handleChangePassword = (e) => {
    e.preventDefault();
    console.log("Her skal skrives kode der ændrer brugerens password");
    setPasswordChangeSucces(true);
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

  const cross2 = (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#0000001A" class="bi bi-x-circle-fill" viewBox="0 0 16 16">
      <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM5.354 4.646a.5.5 0 1 0-.708.708L7.293 8l-2.647 2.646a.5.5 0 0 0 .708.708L8 8.707l2.646 2.647a.5.5 0 0 0 .708-.708L8.707 8l2.647-2.646a.5.5 0 0 0-.708-.708L8 7.293 5.354 4.646z" />
    </svg>
  );

  const checkMark = (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#5a31f2" class="bi bi-check-circle-fill" viewBox="0 0 16 16">
      <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z" />
    </svg>
  );

  const subjectsList = ["Matematik", "Biologi", "Kemi", "Fysik"];
  const buttonTooltip = !emailValid ? "Indtast en korrekt emailadresse (eks: planetpeanut@hotmail.com)" : !passwordValid ? "Indtast en gyldig adgangskode (min. 8 karakterer, min. 1 stort bogstav, min. 1 tal)" : "";
  const buttonTooltip2 = !name ? "Indtast dit navn" : school === "ingen" ? "Vælg en skole" : !emailValid ? "Indtast en korrekt emailadresse (eks: planetpeanut@hotmail.com)" : !passwordValid ? "Indtast en gyldig adgangskode (min. 8 karakterer, min. 1 stort bogstav, min. 1 tal)" : "";
  const buttonTooltip3 = selectedSubjects.length === 0 ? "Vælg et eller flere fag" : "";

  return (
    <div id="loginContainer">
      {myContexts.loginType === "login" && !recoverPassword ? (
        <div id="loginForm" className={styles.loginFormContainer}>
          <form onSubmit={handleSignIn} className={styles.loginForm}>
            <h2>{myContexts.loginType === "login" && loggingIn ? "Logger ind..." : myContexts.loginType === "login" ? "Log Ind" : "Opret en bruger"}</h2>
            <div className={styles.inputField}>
              <label htmlFor="email">Email-adresse</label>
              <input type="email" id="email" name="email" title="Indtast din email-adresse" onChange={(e) => setEmail(e.target.value.toLowerCase())} required />
            </div>

            <div className={styles.inputField}>
              <label htmlFor="password">Adgangskode</label>
              <div className={styles.passwordContainer}>
                <input type={passwordType} id="password" name="password" title={myContexts.loginType === "login" ? "Indtast din adgangskode" : "Indtast din ønskede adgangskode"} onChange={(e) => setPassword(e.target.value)} required />
                <button type="button" className={styles.showPassword} onClick={showPassword}>
                  {passwordType === "password" ? notVisible : visible} <span className={styles.passwordTooltip}>{tooltipText}</span>
                </button>
              </div>
              <div className={styles.forgotButtonContainer}>
                <button
                  type="button"
                  className={`${styles.forgotButton} hover-link`}
                  onClick={() => {
                    setRecoverPassword(true);
                    setEmail("");
                    setPassword("");
                  }}
                >
                  Glemt adgangskode?
                </button>
              </div>
            </div>

            <div className={styles.buttonErrorContainer}>
              <button className={`${styles.loginButton} ${emailValid && password.length > 0 ? styles.validButton : ""}`} type="submit" title={buttonTooltip} disabled={!emailValid || password.length === 0}>
                {myContexts.loginType === "login" ? "Log ind" : "Opret"}
              </button>
              {error && <p className={styles.error}>{error}</p>}
            </div>

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
          </form>
        </div>
      ) : (
        ""
      )}

      {myContexts.loginType === "create" && !recoverPassword ? (
        <div id="createForm" className={styles.createFormContainer}>
          {!accountType ? (
            <div className={styles.chooseAccountContainer}>
              <h2>Hvilken type bruger ønsker du at oprette?</h2>
              <div className={styles.optionsContainer}>
                <OptionCard onClick={() => chooseAccountType("lærer")} top={userIcon} bottom="Lærer"></OptionCard>
                <OptionCard onClick={() => chooseAccountType("forælder")} top={userIcon} bottom="Forælder"></OptionCard>
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

          {accountType === "lærer" && subjects.length === 0 ? (
            <div className={styles.chooseSubjectsContainer}>
              <h2>Hvilke af disse fag underviser du i?</h2>

              <ul className={styles.subjectsContainer}>
                {subjectsList.map((subject) => (
                  <li
                    className={selectedSubjects.includes(subject) ? styles.selectedSubject : ""}
                    key={subject}
                    onClick={() => toggleSubject(subject)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        toggleSubject(subject);
                      }
                    }}
                    tabIndex="0"
                  >
                    {subject}
                  </li>
                ))}
              </ul>
              <div className={styles.buttonErrorContainer}>
                <button className={`${styles.subjectsButton} ${selectedSubjects.length > 0 ? styles.validButton : ""}`} type="button" onClick={handleSubjects} title={buttonTooltip3}>
                  Fortsæt
                </button>
                {error && <p className={styles.error}>{error}</p>}
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

          {(accountType === "lærer" && subjects.length > 0) || (accountType && accountType !== "lærer") ? (
            <form onSubmit={(e) => handleCreateLogin(e)} className={styles.createForm}>
              <div className={styles.switchButtonContainer}>
                <h2>
                  {!loggingIn ? "Opret en bruger" : "Opretter en bruger"} som <span className={styles.accountType}>{accountType}</span>
                  {loggingIn ? "..." : ""}
                </h2>
                {accountType ? (
                  <button type="button" className={`${styles.switchButton} hover-link`} onClick={() => chooseAccountType("")}>
                    Vælg anden type
                  </button>
                ) : (
                  ""
                )}
              </div>

              <div className={styles.inputField}>
                <label htmlFor="name">Fulde navn</label>
                <input type="name" id="name" name="name" title="Indtast dit fulde navn" onChange={(e) => setName(e.target.value.toLowerCase())} required />
              </div>

              <div className={styles.inputField}>
                <div className={styles.inputField}>
                  <label htmlFor="search">Skole</label>
                  <input
                    type="text"
                    id="search"
                    placeholder="Søg efter skole..."
                    value={searchTerm}
                    onChange={handleSearchInputChange}
                    onClick={() => {
                      if (dropdownHidden) {
                        setDropdownHidden(false);
                      }
                    }}
                  />
                  <div className={styles.dropdownContainer} ref={dropdownRef}>
                    <div id="dropdown" className={`${styles.dropdown} ${dropdownHidden ? styles.dropdownHidden : ""}`}>
                      <ul className={styles.dropdownMenu}>
                        {filteredSchools.map((school, index) => (
                          <li
                            role="button"
                            key={index}
                            value={school.value}
                            onClick={() => handleSchoolClick(school.value)}
                            tabIndex="0"
                            onKeyDown={(e) => {
                              if (e.key === "Enter") {
                                handleSchoolClick(school.value);
                              }
                            }}
                          >
                            {school.value}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              <div className={styles.inputField}>
                <label htmlFor="phone">Telefonnummer</label>
                <input type="tel" id="phone" name="phone" title="Indtast dit telefonnummer" maxlength="8" onChange={(e) => setPhone(e.target.value)} required />
              </div>

              <div className={styles.inputField}>
                <label htmlFor="email">Email-adresse</label>
                <input type="email" id="email" name="email" title="Indtast din email-adresse" onChange={(e) => setEmail(e.target.value.toLowerCase())} required />
              </div>

              <div className={styles.inputField}>
                <label htmlFor="password">Adgangskode</label>
                <div className={styles.passwordContainer}>
                  <input type={passwordType} id="password" name="password" title={myContexts.loginType === "login" ? "Indtast din adgangskode" : "Indtast din ønskede adgangskode"} onChange={(e) => setPassword(e.target.value)} required />
                  <button type="button" className={styles.showPassword} onClick={showPassword}>
                    {passwordType === "password" ? notVisible : visible} <span className={styles.passwordTooltip}>{tooltipText}</span>
                  </button>
                </div>
                <div className={styles.passwordCriteria}>
                  <div>
                    {passwordCriteria ? checkMark : !password ? cross2 : cross}
                    <p>Minimum 1 stort bogstav og 1 tal</p>
                  </div>
                  <div>
                    {passwordCriteria2 ? checkMark : !password ? cross2 : cross}
                    <p>Minimum 8 karakterer langt</p>
                  </div>
                </div>
              </div>

              <div className={styles.buttonErrorContainer}>
                <button className={`${styles.loginButton} ${emailValid && passwordValid && name && school !== "ingen" ? styles.validButton : ""}`} type="submit" title={buttonTooltip2} disabled={!emailValid || !passwordValid}>
                  {myContexts.loginType === "login" ? "Log ind" : "Opret"}
                </button>
                {error && <p className={styles.error}>{error}</p>}
              </div>

              <div className={styles.switchButtonContainer}>
                <p> {myContexts.loginType === "login" ? "Har du ikke en bruger endnu?" : "Har du allerede en bruger?"}</p>
                <button type="button" className={`${styles.switchButton} hover-link`} onClick={switchLogin}>
                  {myContexts.loginType === "login" ? "Opret nu" : "Log ind"}
                </button>
              </div>
            </form>
          ) : (
            ""
          )}
        </div>
      ) : (
        ""
      )}

      {recoverPassword ? (
        <div id="recoverForm" className={styles.recoverFormContainer}>
          <form className={styles.recoverForm} onSubmit={(e) => handleChangePassword(e)}>
            <h2>{!recoverTokenSent ? "Glemt adgangskode" : recoverTokenSent && !recoverTokenValidated ? "Bekræft kode" : recoverTokenSent && recoverTokenValidated && !passwordChangeSucces ? "Ny adgangskode" : "Success!"}</h2>
            <p>{!recoverTokenSent ? "Bare rolig, vi har din ryg!" : recoverTokenSent && !recoverTokenValidated ? `Vi har sendt en gendannelseskode til ${email}` : recoverTokenSent && recoverTokenValidated && !passwordChangeSucces ? "Hvad skal den være?" : "Du har nu en ny (og meget sejere) adgangskode"}</p>
            {!recoverTokenSent && (
              <>
                <div className={`${styles.inputField}`}>
                  <label htmlFor="email">Indtast din email-adresse</label>
                  <input type="email" id="email" name="email" title="Indtast din email-adresse" onChange={(e) => setEmail(e.target.value.toLowerCase())} required />
                </div>
                <div className={styles.buttonErrorContainer}>
                  <button className={`${styles.loginButton} ${emailValid ? styles.validButton : ""}`} type="button" title={buttonTooltip} disabled={!emailValid} onClick={validateRecoverEmail}>
                    Send gendannelseskode
                  </button>
                  {error && <p className={styles.error}>{error}</p>}
                </div>
              </>
            )}

            {recoverTokenSent && !recoverTokenValidated ? (
              <>
                <div className={`${styles.inputField}`}>
                  <label htmlFor="recoverToken">Indtast din 8-cifrede gendannelseskode</label>
                  <input type="text" id="recoverToken" maxLength={8} name="recoverToken" title="Indtast din 8-cifrede gendannelseskode" onChange={(e) => setRecoverToken(e.target.value.toLowerCase())} required />
                </div>
                <div className={styles.buttonErrorContainer}>
                  <button className={`${styles.loginButton} ${recoverToken.length === 8 ? styles.validButton : ""}`} type="button" disabled={!recoverToken.length === 8} onClick={validateRecoverToken}>
                    Bekræft kode
                  </button>
                  {error && <p className={styles.error}>{error}</p>}
                </div>
              </>
            ) : (
              ""
            )}

            {recoverTokenSent && recoverTokenValidated && !passwordChangeSucces ? (
              <>
                <div className={styles.inputField}>
                  <label htmlFor="password">Adgangskode</label>
                  <div className={styles.passwordContainer}>
                    <input type={passwordType} id="password" name="password" title={myContexts.loginType === "login" ? "Indtast din adgangskode" : "Indtast din ønskede adgangskode"} onChange={(e) => setPassword(e.target.value)} required />
                    <button type="button" className={styles.showPassword} onClick={showPassword}>
                      {passwordType === "password" ? notVisible : visible} <span className={styles.passwordTooltip}>{tooltipText}</span>
                    </button>
                  </div>
                  <div className={styles.passwordCriteria}>
                    <div>
                      {passwordCriteria ? checkMark : !password ? cross2 : cross}
                      <p>Minimum 1 stort bogstav og 1 tal</p>
                    </div>
                    <div>
                      {passwordCriteria2 ? checkMark : !password ? cross2 : cross}
                      <p>Minimum 8 karakterer langt</p>
                    </div>
                  </div>
                </div>

                <div className={styles.buttonErrorContainer}>
                  <button className={`${styles.loginButton} ${passwordValid ? styles.validButton : ""}`} type="submit" disabled={!passwordValid}>
                    Bekræft adgangskode
                  </button>
                  {error && <p className={styles.error}>{error}</p>}
                </div>
              </>
            ) : (
              ""
            )}

            {passwordChangeSucces ? (
              <>
                <div className={styles.buttonErrorContainer}>
                  <button
                    name="logMeIn"
                    className={styles.loginButton2}
                    type="button"
                    onClick={() => {
                      setRecoverPassword(false);
                      setRecoverTokenSent(false);
                      setRecoverTokenValidated(false);
                      setEmail("");
                      setPassword("");
                      setRecoverToken("");
                      setPasswordChangeSucces(false);
                    }}
                  >
                    Log ind
                  </button>
                  {error && <p className={styles.error}>{error}</p>}
                </div>
              </>
            ) : (
              ""
            )}

            {!passwordChangeSucces && (
              <div className={styles.switchButtonContainer}>
                <p>Har du husket dit password?</p>
                <button
                  type="button"
                  className={`${styles.forgotButton2} hover-link`}
                  onClick={() => {
                    setRecoverPassword(false);
                    setRecoverTokenSent(false);
                    setRecoverTokenValidated(false);
                    setEmail("");
                    setPassword("");
                    setRecoverToken("");
                  }}
                >
                  Tilbage til log ind
                </button>
              </div>
            )}
          </form>
        </div>
      ) : (
        ""
      )}
    </div>
  );
}

export default Login;
