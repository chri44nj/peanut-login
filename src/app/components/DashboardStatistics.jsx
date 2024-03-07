"use client";
import { useContext, useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import axios from "axios";
import styles from "../styles/DashboardStatistics.module.css";
import { MyContexts, SetMyContexts } from "./Contexts";

function DashboardStatistics() {
  /* Contexts */
  const myContexts = useContext(MyContexts);
  const myContextsDispatch = useContext(SetMyContexts);

  /* States */
  const [numberOfStudents, setNumberOfStudents] = useState(0);
  const [totalTime, setTotalTime] = useState(null);
  const [totalCorrect, setTotalCorrect] = useState(null);
  const [totalWrong, setTotalWrong] = useState(null);
  const [totalSolved, setTotalSolved] = useState(null);

  const [activeStudentsThisPeriod, setActiveStudentsThisPeriod] = useState(0);
  const [totalTimeThisPeriod, setTotalTimeThisPeriod] = useState(null);
  const [totalCorrectThisPeriod, setTotalCorrectThisPeriod] = useState(null);
  const [totalWrongThisPeriod, setTotalWrongThisPeriod] = useState(null);
  const [totalSolvedThisPeriod, setTotalSolvedThisPeriod] = useState(null);

  /* Effects */
  const { data: session } = useSession();

  useEffect(() => {
    if (session) {
      fetchTeacherData();
    }
  }, [session]);

  useEffect(() => {
    fetchClasses();
  }, [myContexts.teacherData.classesIDs]);

  useEffect(() => {
    if (myContexts.teacherData.classes.length > 0 && myContexts.selectedClass) {
      const selectedClassData = myContexts.teacherData.classes.find((specificClass) => specificClass._id === myContexts.selectedClass);
      if (selectedClassData && selectedClassData.students) {
        setNumberOfStudents(selectedClassData.students.length);
      }
    }
  }, [myContexts.selectedClass]);

  useEffect(() => {
    if (!myContexts.selectedClass && myContexts.teacherData.classes.length > 0) {
      myContextsDispatch((old) => ({
        ...old,
        selectedClass: myContexts.teacherData.classes[0]._id,
      }));
    }
    fetchProblemsSolved();
    if (myContexts.selectedPeriod === "Denne uge") {
      fetchProblemsSolvedThisWeek();
    } else if (myContexts.selectedPeriod === "Denne måned") {
      fetchProblemsSolvedThisMonth();
    } else if (myContexts.selectedPeriod === "Dette år") {
      fetchProblemsSolvedThisYear();
    }
  }, [myContexts.selectedClass, myContexts.teacherData.classes, myContexts.selectedPeriod]);

  /* Functions */
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

      console.log("hell fucking yeah");

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

  const handleClassChange = (event) => {
    const className = event.target.value;
    myContextsDispatch((prevContexts) => ({
      ...prevContexts,
      selectedClass: className,
    }));
  };

  const handleSubjectChange = (e) => {
    myContextsDispatch((prevContexts) => ({
      ...prevContexts,
      selectedSubject: e.target.value,
    }));
  };

  const handlePeriodChange = (e) => {
    myContextsDispatch((prevContexts) => ({
      ...prevContexts,
      selectedPeriod: e.target.value,
    }));
  };

  const fetchProblemsSolved = async () => {
    if (myContexts.selectedClass) {
      const problemsSolved = await axios.get(`http://localhost:8000/api/get-problems-solved`, {
        params: {
          classID: myContexts.selectedClass,
        },
      });

      setTotalTime(problemsSolved.data.time);
      setTotalCorrect(problemsSolved.data.totalCorrect);
      setTotalWrong(problemsSolved.data.totalWrong);
      setTotalSolved(problemsSolved.data.totalProblemsSolved);

      console.log("Altid", problemsSolved.data);
    }
  };

  const fetchProblemsSolvedThisWeek = async () => {
    if (myContexts.selectedClass) {
      const problemsSolved = await axios.get(`http://localhost:8000/api/get-problems-solved-this-week`, {
        params: {
          classID: myContexts.selectedClass,
        },
      });

      setActiveStudentsThisPeriod(problemsSolved.data.activeStudents);
      setTotalTimeThisPeriod(problemsSolved.data.time);
      setTotalCorrectThisPeriod(problemsSolved.data.totalCorrect);
      setTotalWrongThisPeriod(problemsSolved.data.totalWrong);
      setTotalSolvedThisPeriod(problemsSolved.data.totalProblemsSolved);

      console.log("Denne uge", problemsSolved.data);
    }
  };

  const fetchProblemsSolvedThisMonth = async () => {
    if (myContexts.selectedClass) {
      const problemsSolved = await axios.get(`http://localhost:8000/api/get-problems-solved-this-month`, {
        params: {
          classID: myContexts.selectedClass,
        },
      });

      setActiveStudentsThisPeriod(problemsSolved.data.activeStudents);
      setTotalTimeThisPeriod(problemsSolved.data.time);
      setTotalCorrectThisPeriod(problemsSolved.data.totalCorrect);
      setTotalWrongThisPeriod(problemsSolved.data.totalWrong);
      setTotalSolvedThisPeriod(problemsSolved.data.totalProblemsSolved);

      console.log("Denne måned", problemsSolved.data);
    }
  };

  const fetchProblemsSolvedThisYear = async () => {
    if (myContexts.selectedClass) {
      const problemsSolved = await axios.get(`http://localhost:8000/api/get-problems-solved-this-year`, {
        params: {
          classID: myContexts.selectedClass,
        },
      });

      setActiveStudentsThisPeriod(problemsSolved.data.activeStudents);
      setTotalTimeThisPeriod(problemsSolved.data.time);
      setTotalCorrectThisPeriod(problemsSolved.data.totalCorrect);
      setTotalWrongThisPeriod(problemsSolved.data.totalWrong);
      setTotalSolvedThisPeriod(problemsSolved.data.totalProblemsSolved);

      console.log("Dette år", problemsSolved.data);
    }
  };

  /* Other */
  const book16 = (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-book-fill" viewBox="0 0 16 16">
      <path d="M8 1.783C7.015.936 5.587.81 4.287.94c-1.514.153-3.042.672-3.994 1.105A.5.5 0 0 0 0 2.5v11a.5.5 0 0 0 .707.455c.882-.4 2.303-.881 3.68-1.02 1.409-.142 2.59.087 3.223.877a.5.5 0 0 0 .78 0c.633-.79 1.814-1.019 3.222-.877 1.378.139 2.8.62 3.681 1.02A.5.5 0 0 0 16 13.5v-11a.5.5 0 0 0-.293-.455c-.952-.433-2.48-.952-3.994-1.105C10.413.809 8.985.936 8 1.783z" />
    </svg>
  );

  const book24 = (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" class="bi bi-book-fill" viewBox="0 0 16 16">
      <path d="M8 1.783C7.015.936 5.587.81 4.287.94c-1.514.153-3.042.672-3.994 1.105A.5.5 0 0 0 0 2.5v11a.5.5 0 0 0 .707.455c.882-.4 2.303-.881 3.68-1.02 1.409-.142 2.59.087 3.223.877a.5.5 0 0 0 .78 0c.633-.79 1.814-1.019 3.222-.877 1.378.139 2.8.62 3.681 1.02A.5.5 0 0 0 16 13.5v-11a.5.5 0 0 0-.293-.455c-.952-.433-2.48-.952-3.994-1.105C10.413.809 8.985.936 8 1.783z" />
    </svg>
  );

  const halfBook24 = (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" class="bi bi-book-half" viewBox="0 0 16 16">
      <path d="M8.5 2.687c.654-.689 1.782-.886 3.112-.752 1.234.124 2.503.523 3.388.893v9.923c-.918-.35-2.107-.692-3.287-.81-1.094-.111-2.278-.039-3.213.492V2.687zM8 1.783C7.015.936 5.587.81 4.287.94c-1.514.153-3.042.672-3.994 1.105A.5.5 0 0 0 0 2.5v11a.5.5 0 0 0 .707.455c.882-.4 2.303-.881 3.68-1.02 1.409-.142 2.59.087 3.223.877a.5.5 0 0 0 .78 0c.633-.79 1.814-1.019 3.222-.877 1.378.139 2.8.62 3.681 1.02A.5.5 0 0 0 16 13.5v-11a.5.5 0 0 0-.293-.455c-.952-.433-2.48-.952-3.994-1.105C10.413.809 8.985.936 8 1.783z" />
    </svg>
  );

  const pen16 = (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pen-fill" viewBox="0 0 16 16">
      <path d="M13.498.795l.149-.149a1.207 1.207 0 1 1 1.707 1.708l-.149.148a1.5 1.5 0 0 1-.059 2.059L4.854 14.854a.5.5 0 0 1-.233.131l-4 1a.5.5 0 0 1-.606-.606l1-4a.5.5 0 0 1 .131-.232l9.642-9.642a.5.5 0 0 0-.642.056L6.854 4.854a.5.5 0 1 1-.708-.708L9.44.854A1.5 1.5 0 0 1 11.5.796a1.5 1.5 0 0 1 1.998-.001z" />
    </svg>
  );

  const clock16 = (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-clock-fill" viewBox="0 0 16 16">
      <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM8 3.5a.5.5 0 0 0-1 0V9a.5.5 0 0 0 .252.434l3.5 2a.5.5 0 0 0 .496-.868L8 8.71V3.5z" />
    </svg>
  );

  const trophy16 = (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trophy-fill" viewBox="0 0 16 16">
      <path d="M2.5.5A.5.5 0 0 1 3 0h10a.5.5 0 0 1 .5.5c0 .538-.012 1.05-.034 1.536a3 3 0 1 1-1.133 5.89c-.79 1.865-1.878 2.777-2.833 3.011v2.173l1.425.356c.194.048.377.135.537.255L13.3 15.1a.5.5 0 0 1-.3.9H3a.5.5 0 0 1-.3-.9l1.838-1.379c.16-.12.343-.207.537-.255L6.5 13.11v-2.173c-.955-.234-2.043-1.146-2.833-3.012a3 3 0 1 1-1.132-5.89A33.076 33.076 0 0 1 2.5.5zm.099 2.54a2 2 0 0 0 .72 3.935c-.333-1.05-.588-2.346-.72-3.935zm10.083 3.935a2 2 0 0 0 .72-3.935c-.133 1.59-.388 2.885-.72 3.935z" />
    </svg>
  );

  const thumbs16 = (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-hand-thumbs-up-fill" viewBox="0 0 16 16">
      <path d="M6.956 1.745C7.021.81 7.908.087 8.864.325l.261.066c.463.116.874.456 1.012.964.22.817.533 2.512.062 4.51a9.84 9.84 0 0 1 .443-.05c.713-.065 1.669-.072 2.516.21.518.173.994.68 1.2 1.273.184.532.16 1.162-.234 1.733.058.119.103.242.138.363.077.27.113.567.113.856 0 .289-.036.586-.113.856-.039.135-.09.273-.16.404.169.387.107.819-.003 1.148a3.162 3.162 0 0 1-.488.9c.054.153.076.313.076.465 0 .306-.089.626-.253.912C13.1 15.522 12.437 16 11.5 16H8c-.605 0-1.07-.081-1.466-.218a4.826 4.826 0 0 1-.97-.484l-.048-.03c-.504-.307-.999-.609-2.068-.722C2.682 14.464 2 13.846 2 13V9c0-.85.685-1.432 1.357-1.616.849-.231 1.574-.786 2.132-1.41.56-.626.914-1.279 1.039-1.638.199-.575.356-1.54.428-2.59z" />
    </svg>
  );

  const class24 = (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" class="bi bi-people-fill" viewBox="0 0 16 16">
      <path d="M7 14s-1 0-1-1 1-4 5-4 5 3 5 4-1 1-1 1H7zm4-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" />
      <path fill-rule="evenodd" d="M5.216 14A2.238 2.238 0 0 1 5 13c0-1.355.68-2.75 1.936-3.72A6.325 6.325 0 0 0 5 9c-4 0-5 3-5 4s1 1 1 1h4.216z" />
      <path d="M4.5 8a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z" />
    </svg>
  );

  const student21 = (
    <svg xmlns="http://www.w3.org/2000/svg" width="21" height="21" fill="currentColor" class="bi bi-person-fill" viewBox="0 0 16 16">
      <path d="M3 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1H3zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" />
    </svg>
  );

  const activeStudent21 = (
    <svg xmlns="http://www.w3.org/2000/svg" width="21" height="21" fill="currentColor" class="bi bi-person-check-fill" viewBox="0 0 16 16">
      <path fill-rule="evenodd" d="M15.854 5.146a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708 0l-1.5-1.5a.5.5 0 0 1 .708-.708L12.5 7.793l2.646-2.647a.5.5 0 0 1 .708 0z" />
      <path d="M1 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1H1zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" />
    </svg>
  );

  const calendar24 = (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" class="bi bi-calendar-week-fill" viewBox="0 0 16 16">
      <path d="M4 .5a.5.5 0 0 0-1 0V1H2a2 2 0 0 0-2 2v1h16V3a2 2 0 0 0-2-2h-1V.5a.5.5 0 0 0-1 0V1H4V.5zM16 14V5H0v9a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2zM9.5 7h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1a.5.5 0 0 1 .5-.5zm3 0h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1a.5.5 0 0 1 .5-.5zM2 10.5a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1zm3.5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1a.5.5 0 0 1 .5-.5z" />
    </svg>
  );

  return (
    <div className={styles.statisticsContainer}>
      <div className={styles.classes}>
        <div>
          <select className={styles.dropdown} id="classes" name="classes" value={myContexts.selectedClass} onChange={handleClassChange}>
            {myContexts.teacherData.classes
              .sort((classA, classB) => {
                if (classA.grade !== classB.grade) {
                  return classA.grade - classB.grade;
                } else {
                  return classA.letter.localeCompare(classB.letter);
                }
              })
              .map((theclass, index) => (
                <option className={styles.dropdownClass} key={index} value={theclass._id}>
                  {theclass.grade}.{theclass.letter}
                </option>
              ))}
          </select>
        </div>
      </div>

      {myContexts.teacherData.classes ? (
        <div className={styles.selectedClassContainer}>
          <div className={`${styles.classOverview} ${styles.overviewSubject}`}>
            <div className={styles.overviewTop}>
              {book24}
              <select className={styles.dropdown2} id="subjects" name="subjects" value={myContexts.selectedSubject} onChange={handleSubjectChange}>
                <option className={styles.dropdownClass}>Alle emner</option>
                <option className={styles.dropdownClass}>Brøker</option>
                <option className={styles.dropdownClass}>Procent</option>
                <option className={styles.dropdownClass}>Algebra</option>
                <option className={styles.dropdownClass}>Eksponenter</option>
                <option className={styles.dropdownClass}>Enheder</option>
                <option className={styles.dropdownClass}>Parenteser</option>
                <option className={styles.dropdownClass}>Priser</option>
                <option className={styles.dropdownClass}>Ligninger</option>
              </select>
            </div>
            <p className={`${styles.marginTop} ${styles.overviewTimespan}`}>Altid</p>
            <div className={styles.overviewBottomFlex2}>
              <div className={styles.overviewFlex}>
                <p className={`${styles.bold} ${styles.bigStat}`}>{totalSolved ? totalSolved : "-"}</p>
                <div className={styles.overviewFlex2}>
                  {pen16}
                  <p>Opgaver</p>
                </div>
              </div>
              <div className={styles.overviewFlex}>
                <p className={`${styles.bold} ${styles.bigStat}`}>{totalTime ? Math.ceil(totalTime / 60) : "-"}</p>
                <div className={styles.overviewFlex2}>
                  {clock16}
                  <p>Minutter</p>
                </div>
              </div>
              <div className={styles.overviewFlex}>
                <p className={`${styles.bold} ${styles.bigStat}`}>{totalSolved ? Math.floor((totalCorrect / totalSolved) * 100) + "%" : "-"}</p>
                <div className={styles.overviewFlex2}>
                  {thumbs16}
                  <p>Korrekt</p>
                </div>
              </div>
            </div>
            <p className={styles.overviewTimespan}>{myContexts.selectedPeriod}</p>
            <div className={styles.overviewBottomFlex2}>
              <div className={styles.overviewFlex}>
                <p className={`${styles.bold} ${styles.bigStat}`}>{totalSolvedThisPeriod ? totalSolvedThisPeriod : "-"}</p>
                <div className={styles.overviewFlex2}>
                  {pen16}
                  <p>Opgaver</p>
                </div>
              </div>
              <div className={styles.overviewFlex}>
                <p className={`${styles.bold} ${styles.bigStat}`}>{totalTimeThisPeriod ? Math.ceil(totalTimeThisPeriod / 60) : "-"}</p>
                <div className={styles.overviewFlex2}>
                  {clock16}
                  <p>Minutter</p>
                </div>
              </div>
              <div className={styles.overviewFlex}>
                <p className={`${styles.bold} ${styles.bigStat}`}>{totalSolvedThisPeriod ? Math.floor((totalCorrectThisPeriod / totalSolvedThisPeriod) * 100) + "%" : "-"}</p>
                <div className={styles.overviewFlex2}>
                  {thumbs16}
                  <p>Korrekt</p>
                </div>
              </div>
            </div>
          </div>

          <div className={`${styles.classOverview} ${styles.overviewClass}`}>
            <div className={styles.overviewTop}>
              {class24}
              <h2>Klassen</h2>
            </div>
            <div className={styles.overviewBottomFlex}>
              <div className={styles.overviewBottomGrid}>
                <div className={styles.overviewFlex}>
                  <p className={`${styles.bold} ${styles.bigStat}`}>{numberOfStudents ? numberOfStudents : "-"}</p>
                  <div className="flex-next-to">
                    {student21}
                    <p>Elever</p>
                  </div>
                </div>
                <div className={styles.overviewBottomGrid2}>
                  <div>
                    <div className={styles.overviewFlex2}>
                      {pen16}
                      <p>Opgaver</p>
                    </div>
                    <div className={styles.overviewFlex2}>
                      {clock16}
                      <p>Minutter</p>
                    </div>
                    <div className={styles.overviewFlex2}>
                      {trophy16}
                      <p>Rang</p>
                    </div>
                  </div>
                  <div>
                    <p className={styles.bold}>{totalSolved ? totalSolved : "-"}</p>
                    <p className={styles.bold}>{totalTime ? Math.ceil(totalTime / 60) : "-"}</p>
                    <p className={styles.bold}>-</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className={`${styles.classOverview} ${styles.overviewPeriod}`}>
            <div className={styles.overviewTop}>
              {calendar24}
              <select className={styles.dropdown2} id="subjects" name="subjects" value={myContexts.selectedPeriod} onChange={handlePeriodChange}>
                <option className={styles.dropdownClass}>Denne uge</option>
                <option className={styles.dropdownClass}>Denne måned</option>
                <option className={styles.dropdownClass}>Dette år</option>
              </select>
            </div>
            <div className={styles.overviewBottomFlex}>
              <div className={styles.overviewBottomGrid}>
                <div className={styles.overviewFlex}>
                  <p className={`${styles.bold} ${styles.bigStat}`}>{activeStudentsThisPeriod ? activeStudentsThisPeriod : ""}</p>
                  <div className="flex-next-to">
                    {activeStudent21}
                    <p>Aktive elever</p>
                  </div>
                </div>
                <div className={styles.overviewBottomGrid2}>
                  <div>
                    <div className={styles.overviewFlex2}>
                      {pen16}
                      <p>Opgaver</p>
                    </div>
                    <div className={styles.overviewFlex2}>
                      {clock16}
                      <p>Minutter</p>
                    </div>
                    <div className={styles.overviewFlex2}>
                      {trophy16}
                      <p>Rang</p>
                    </div>
                  </div>
                  <div>
                    <p className={styles.bold}>{totalSolvedThisPeriod ? totalSolvedThisPeriod : "-"}</p>
                    <p className={styles.bold}>{totalTimeThisPeriod ? Math.ceil(totalTimeThisPeriod / 60) : "-"}</p>
                    <p className={styles.bold}>-</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className={`${styles.classOverview} ${styles.overviewBestSubject}`}>
            <div className={styles.overviewTop}>
              {book24}
              <h2>Bedste emne</h2>
            </div>
            <div className={styles.overviewBottomFlex}>
              <div className={styles.overviewBottomGrid}>
                <div className={styles.overviewFlex}>
                  <p className={`${styles.bold} ${styles.bigStat}`}>-</p>
                  <div className="flex-next-to">
                    {thumbs16}
                    <p>Korrekt</p>
                  </div>
                </div>
                <div className={styles.overviewBottomGrid2}>
                  <div>
                    <div className={styles.overviewFlex2}>
                      {book16}
                      <p className={styles.subjectHeader}>Division</p>
                    </div>
                    <div className={styles.overviewFlex2}>
                      {pen16}
                      <p>Opgaver</p>
                    </div>
                    <div className={styles.overviewFlex2}>
                      {clock16}
                      <p>Minutter</p>
                    </div>
                  </div>
                  <div className={styles.alignBottom}>
                    <p className={styles.bold}>-</p>
                    <p className={styles.bold}>-</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className={`${styles.classOverview} ${styles.overviewWorstSubject}`}>
            <div className={styles.overviewTop}>
              {halfBook24}
              <h2>Sværeste emne</h2>
            </div>
            <div className={styles.overviewBottomFlex}>
              <div className={styles.overviewBottomGrid}>
                <div className={styles.overviewFlex}>
                  <p className={`${styles.bold} ${styles.bigStat}`}>-</p>
                  <div className="flex-next-to">
                    {thumbs16}
                    <p>Korrekt</p>
                  </div>
                </div>
                <div className={styles.overviewBottomGrid2}>
                  <div>
                    <div className={styles.overviewFlex2}>
                      {book16}
                      <p className={styles.subjectHeader}>Algebra</p>
                    </div>
                    <div className={styles.overviewFlex2}>
                      {pen16}
                      <p>Opgaver</p>
                    </div>
                    <div className={styles.overviewFlex2}>
                      {clock16}
                      <p>Minutter</p>
                    </div>
                  </div>
                  <div className={styles.alignBottom}>
                    <p className={styles.bold}>-</p>
                    <p className={styles.bold}>-</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <p>Det ser ud til, du ikke har nogle klasser forbundet endnu. Tilføj nu!</p>
      )}
    </div>
  );
}

export default DashboardStatistics;
