"use client";
import { useState, useContext, useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import axios from "axios";
import styles from "../styles/DashboardAccount.module.css";
import { MyContexts, SetMyContexts } from "./Contexts";

function DashboardAccount() {
  /* States */
  const [editAccount, setEditAccount] = useState(false);
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

  /* Contexts */
  const myContexts = useContext(MyContexts);
  const myContextsDispatch = useContext(SetMyContexts);

  /* Effects */
  const { data: session } = useSession();

  useEffect(() => {
    if (session) {
      fetchTeacherData();
      fetchSchools();
    }
  }, [session]);

  useEffect(() => {
    fetchClasses();
  }, [myContexts.teacherData.classesIDs]);

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

  /* Functions */
  function switchDashboardType(dashboardType) {
    myContextsDispatch((old) => ({
      ...old,
      dashboardType: dashboardType,
      clickedClass: "Alle klasser",
    }));
  }

  const fetchTeacherData = async () => {
    try {
      const response = await axios.get("https://skillzy-node.fly.dev/api/get-teacher", {
        params: { email: session?.user?.email },
      });

      const updatedTeacherData = {
        id: response.data._id,
        name: response.data.name,
        email: response.data.email,
        phone: response.data.phone,
        school: response.data.school,
        subjects: response.data.subjects,
        classesIDs: response.data.classes,
        accountType: response.data.accountType,
      };

      console.log("Heell yeah?");

      myContextsDispatch((old) => ({
        ...old,
        teacherData: {
          ...old.teacherData,
          ...updatedTeacherData,
        },
      }));
    } catch (error) {
      console.error("Error fetching teacher data:", error);
    }
  };

  const fetchClasses = async () => {
    if (myContexts.teacherData.id) {
      const classes = await axios.get(`https://skillzy-node.fly.dev/api/get-teacher-classes`, {
        params: {
          teacherID: myContexts.teacherData.id,
        },
      });

      myContextsDispatch((prevContexts) => ({
        ...prevContexts,
        teacherData: {
          ...prevContexts.teacherData,
          classes: classes.data.map((specificClass) => ({
            ...specificClass,
          })),
        },
      }));
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

  const showPassword = () => {
    if (passwordType === "password") {
      setPasswordType("text");
      setTooltipText("Skjul adgangskode");
    } else {
      setPasswordType("password");
      setTooltipText("Vis adgangskode");
    }
  };

  const handleEditAccountClick = () => {
    if (!editAccount) {
      setEditAccount(true);
      setName(myContexts.teacherData.name);
      setSearchTerm(myContexts.teacherData.school);
      setPhone(myContexts.teacherData.phone);
      setEmail(myContexts.teacherData.email);
    } else {
      setEditAccount(false);
      setName("");
      setSearchTerm("");
      setPhone("");
      setEmail("");
    }
  };

  const confirmEditAccount = () => {
    console.log("Her skal være kode der ændrer brugerens kontooplysninger");
    setEditAccount(false);
    setName("");
    setSearchTerm("");
    setPhone("");
    setEmail("");
  };

  /* Other */
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
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#5a31f2" class="bi bi-check-circle-fill" viewBox="0 0 16 16">
      <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z" />
    </svg>
  );

  const subjectsList = ["Matematik", "Biologi", "Kemi", "Fysik"];
  const buttonTooltip = !emailValid ? "Indtast en korrekt emailadresse (eks: planetpeanut@hotmail.com)" : !passwordValid ? "Indtast en gyldig adgangskode (min. 8 karakterer, min. 1 stort bogstav, min. 1 tal)" : "";
  const buttonTooltip2 = !name ? "Indtast dit navn" : school === "ingen" ? "Vælg en skole" : !emailValid ? "Indtast en korrekt emailadresse (eks: planetpeanut@hotmail.com)" : !passwordValid ? "Indtast en gyldig adgangskode (min. 8 karakterer, min. 1 stort bogstav, min. 1 tal)" : "";
  const buttonTooltip3 = selectedSubjects.length === 0 ? "Vælg et eller flere fag" : "";

  return (
    <div className={styles.homeContainer}>
      {!editAccount && (
        <div>
          <h2 className={styles.name}>{session?.user?.name}</h2>
          <p>{session?.user?.email}</p>
          <p className={styles.phone}>+45 {myContexts.teacherData.phone}</p>
          <p className={styles.school}>
            {myContexts.teacherData.accountType} <span className={styles.lowercase}>på</span> {myContexts.teacherData.school}
          </p>
          {myContexts.teacherData.subjects ? (
            <p className={styles.subjects}>
              {myContexts.teacherData.subjects.map((subject, index) => (
                <span key={index}>{subject} </span>
              ))}
            </p>
          ) : (
            ""
          )}
          <a className="hover-link" href="#dashboardContainer" onClick={() => switchDashboardType("Dine klasser")}>
            {myContexts.teacherData.classesIDs.length} {myContexts.teacherData.classesIDs.length === 1 ? "klasse" : "klasser"}
          </a>
          <button className={styles.editAccountButton} onClick={handleEditAccountClick}>
            Ændre kontooplysninger
          </button>
        </div>
      )}

      {editAccount && (
        <div className={styles.editAccount}>
          <div className={styles.inputField}>
            <label htmlFor="name">Fulde navn</label>
            <input className={styles.capitalize} type="name" id="name" name="name" title="Indtast dit fulde navn" value={name} onChange={(e) => setName(e.target.value.toLowerCase())} required />
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
            <input type="tel" id="phone" name="phone" title="Indtast dit telefonnummer" maxlength="8" value={phone} onChange={(e) => setPhone(e.target.value)} required />
          </div>

          <div className={styles.inputField}>
            <label htmlFor="email">Email-adresse</label>
            <input type="email" id="email" name="email" title="Indtast din email-adresse" value={email} onChange={(e) => setEmail(e.target.value.toLowerCase())} required />
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
                {passwordCriteria ? checkMark : cross}
                <p>Minimum 1 stort bogstav og 1 tal</p>
              </div>
              <div>
                {passwordCriteria2 ? checkMark : cross}
                <p>Minimum 8 karakterer langt</p>
              </div>
            </div>
          </div>

          <div className={styles.buttonErrorContainer}>
            <div className={styles.editAccountButtonsContainer}>
              <button className={styles.cancelButton} onClick={handleEditAccountClick}>
                Afbryd
              </button>
              <button className={styles.confirmButton} onClick={confirmEditAccount}>
                Gem ændringer
              </button>
            </div>
            {error && <p className={styles.error}>{error}</p>}
          </div>
        </div>
      )}
    </div>
  );
}

export default DashboardAccount;
