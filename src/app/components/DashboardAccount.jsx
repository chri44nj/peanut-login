"use client";
import { useState, useContext, useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import axios from "axios";
import styles from "../styles/DashboardAccount.module.css";
import { MyContexts, SetMyContexts } from "./Contexts";

function DashboardAccount() {
  /* States */
  const [editAccount, setEditAccount] = useState(false);
  const [changePassword, setChangePassword] = useState(false);
  const [deleteAccount, setDeleteAccount] = useState(false);
  const [passwordType, setPasswordType] = useState("password");
  const [passwordType2, setPasswordType2] = useState("password");
  const [tooltipText, setTooltipText] = useState("Vis adgangskode");
  const [tooltipText2, setTooltipText2] = useState("Vis adgangskode");
  const [school, setSchool] = useState("ingen");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [email2, setEmail2] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [phone, setPhone] = useState(null);
  const [emailValid, setEmailValid] = useState(false);
  const [passwordValid, setPasswordValid] = useState(false);
  const [deleteValid, setDeleteValid] = useState(false);
  const [passwordCriteria, setPasswordCriteria] = useState(false);
  const [passwordCriteria2, setPasswordCriteria2] = useState(false);
  const [passwordCriteria3, setPasswordCriteria3] = useState(true);
  const [passwordCriteria4, setPasswordCriteria4] = useState(false);
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

    const capitalNumber = /^(?=.*[A-Z])(?=.*\d)/.test(password);
    setPasswordCriteria(capitalNumber);
    setPasswordCriteria2(password.length >= 8);
    setPasswordCriteria3(!/\s/.test(password));
    setError("");

    if (password === password2 && password !== "") {
      setPasswordCriteria4(true);
      setPasswordValid(passwordRegex.test(password));
    } else {
      setPasswordCriteria4(false);
      setPasswordValid(false);
    }
  }, [email, password, password2, changePassword]);

  useEffect(() => {
    if (passwordCriteria3 === false) {
      setError("Mellemrum ikke tilladt i adgangskoden");
    } else {
      setError("");
    }
  }, [passwordCriteria3]);

  useEffect(() => {
    if (error) {
      setError("");
    }

    if (email2 === myContexts.teacherData.email) {
      setDeleteValid(true);
    } else {
      setDeleteValid(false);
    }
  }, [email2]);

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

  const handleSchoolClick = (school) => {
    setSchool(school);
    setSearchTerm(school);
    setDropdownHidden(true);
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

  const showPassword2 = () => {
    if (passwordType2 === "password") {
      setPasswordType2("text");
      setTooltipText2("Skjul adgangskode");
    } else {
      setPasswordType2("password");
      setTooltipText2("Vis adgangskode");
    }
  };

  const handleEditAccountClick = (e) => {
    if (e === "editAccount") {
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
    } else if (e === "changePassword") {
      if (!changePassword) {
        setChangePassword(true);
      } else {
        setChangePassword(false);
        setPassword("");
        setPassword2("");
        setError("");
      }
    } else if (e === "deleteAccount") {
      if (!deleteAccount) {
        setDeleteAccount(true);
      } else {
        setDeleteAccount(false);
        setEmail2("");
      }
    }
  };

  const confirmEditAccount = () => {
    console.log("Her skal være kode der ændrer brugerens kontooplysninger");
    setEditAccount(false);
    setName("");
    setSearchTerm("");
    setPhone("");
    setEmail("");
    setPassword("");
    setPassword2("");
  };

  const confirmChangePassword = () => {
    if (passwordValid) {
      console.log("Her skal være kode der ændrer brugerens adgangskode");
      setChangePassword(false);
      setPassword("");
      setPassword2("");
    } else {
      setError("Opfyld samtlige adgangskodekriterier");
    }
  };

  const confirmDeleteAccount = () => {
    console.log("Her skal være kode der sletter brugerens konto");
    setDeleteAccount(false);
    setEmail2("");
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

  return (
    <div className={styles.homeContainer}>
      {!editAccount && !changePassword && !deleteAccount ? (
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
          <button className={styles.editAccountButton} value="editAccount" onClick={(e) => handleEditAccountClick(e.target.value)}>
            Rediger kontooplysninger
          </button>
          <button className={styles.editPasswordButton} value="changePassword" onClick={(e) => handleEditAccountClick(e.target.value)}>
            Skift adgangskode
          </button>
          <button className={styles.deleteAccountButton} value="deleteAccount" onClick={(e) => handleEditAccountClick(e.target.value)}>
            Slet konto
          </button>
        </div>
      ) : (
        ""
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

          <div className={styles.buttonErrorContainer}>
            <div className={styles.editAccountButtonsContainer}>
              <button className={styles.cancelButton} value="editAccount" onClick={(e) => handleEditAccountClick(e.target.value)}>
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

      {changePassword && (
        <div className={styles.editAccount}>
          <div className={styles.inputField}>
            <label htmlFor="password">Ny adgangskode</label>
            <div className={styles.passwordContainer}>
              <input type={passwordType} id="password" name="password" title={myContexts.loginType === "login" ? "Indtast din adgangskode" : "Indtast din ønskede adgangskode"} onChange={(e) => setPassword(e.target.value)} required />
              <button type="button" className={styles.showPassword} onClick={showPassword}>
                {passwordType === "password" ? notVisible : visible} <span className={styles.passwordTooltip}>{tooltipText}</span>
              </button>
            </div>
          </div>

          <div className={styles.inputField}>
            <label htmlFor="password">Bekræft ny adgangskode</label>
            <div className={styles.passwordContainer}>
              <input type={passwordType2} id="passwordConfirm" name="passwordConfirm" title={myContexts.loginType === "login" ? "Indtast din adgangskode" : "Indtast din ønskede adgangskode"} onChange={(e) => setPassword2(e.target.value)} required />
              <button type="button" className={styles.showPassword} onClick={showPassword2}>
                {passwordType2 === "password" ? notVisible : visible} <span className={styles.passwordTooltip}>{tooltipText2}</span>
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
              <div>
                {passwordCriteria4 ? checkMark : cross}
                <p>Adgangskoder skal matche</p>
              </div>
            </div>
          </div>

          <div className={styles.buttonErrorContainer}>
            <div className={styles.editAccountButtonsContainer}>
              <button className={styles.cancelButton} value="changePassword" onClick={(e) => handleEditAccountClick(e.target.value)}>
                Afbryd
              </button>
              <button className={styles.confirmButton} onClick={confirmChangePassword}>
                Gem ændringer
              </button>
            </div>
            {error && <p className={styles.error}>{error}</p>}
          </div>
        </div>
      )}

      {deleteAccount && (
        <>
          <p className={styles.sadMessage}>Vi er kede af at miste dig! Hvis du er sikker på, du vil slette din bruger, så bekræft din email-adresse forneden og klik på &quot;Slet konto&quot;.</p>
          <div className={styles.editAccount}>
            <div className={styles.inputField}>
              <label htmlFor="email">Email-adresse</label>
              <input type="email" id="email2" name="email2" title="Indtast din email-adresse" value={email2} onChange={(e) => setEmail2(e.target.value.toLowerCase())} required />
            </div>

            <div className={styles.buttonErrorContainer}>
              <div className={styles.editAccountButtonsContainer}>
                <button className={styles.confirmButton} value="deleteAccount" onClick={(e) => handleEditAccountClick(e.target.value)}>
                  Afbryd
                </button>
                <button className={!deleteValid ? styles.deleteButton : styles.deleteAccountButton2} onClick={!deleteValid ? () => setError("Indtast den korrekte email-adresse") : confirmDeleteAccount}>
                  Slet konto
                </button>
              </div>
              {error && <p className={styles.error}>{error}</p>}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default DashboardAccount;
