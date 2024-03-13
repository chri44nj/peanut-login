"use client";
import { useContext, useState, useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import axios from "axios";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

import styles from "../styles/DashboardStatistics.module.css";
import { MyContexts, SetMyContexts } from "./Contexts";

function DashboardStatistics() {
  /* Contexts */
  const myContexts = useContext(MyContexts);
  const myContextsDispatch = useContext(SetMyContexts);

  /* States */
  const [fetchedOnce, setFetchedOnce] = useState(false);

  const [numberOfStudents, setNumberOfStudents] = useState(0);
  const [activeStudentsThisPeriod, setActiveStudentsThisPeriod] = useState(0);
  const [totalTimeThisPeriod, setTotalTimeThisPeriod] = useState(null);
  const [totalCorrectThisPeriod, setTotalCorrectThisPeriod] = useState(null);
  const [totalWrongThisPeriod, setTotalWrongThisPeriod] = useState(null);
  const [totalSolvedThisPeriod, setTotalSolvedThisPeriod] = useState(null);
  const [correctPercentageThisperiod, setCorrectPercentageThisPeriod] = useState(null);
  const [sortBy, setSortBy] = useState("correctPercentage");
  const [subjectData, setSubjectData] = useState({
    correctPercentage: {
      Brøker: 74,
      Procent: 32,
      Algebra: 91,
      Eksponenter: 55,
      Enheder: 12,
      Parenteser: 87,
      Priser: 42,
      Ligninger: 68,
    },
    totalSolved: {
      Brøker: 45,
      Procent: 87,
      Algebra: 23,
      Eksponenter: 79,
      Enheder: 54,
      Parenteser: 32,
      Priser: 65,
      Ligninger: 92,
    },
    minutesSpent: {
      Brøker: 64,
      Procent: 53,
      Algebra: 95,
      Eksponenter: 95,
      Enheder: 11,
      Parenteser: 88,
      Priser: 27,
      Ligninger: 73,
    },
  });

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

    if (myContexts.selectedPeriod === "I dag") {
      fetchProblemsSolvedToday();
    } else if (myContexts.selectedPeriod === "Denne uge") {
      fetchProblemsSolvedThisWeek();
    } else if (myContexts.selectedPeriod === "Denne måned") {
      fetchProblemsSolvedThisMonth();
    } else if (myContexts.selectedPeriod === "Dette år") {
      fetchProblemsSolvedThisYear();
    } else if (myContexts.selectedPeriod === "Altid") {
      fetchProblemsSolvedAllTime();
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

  const handlePeriodChange = (e) => {
    myContextsDispatch((prevContexts) => ({
      ...prevContexts,
      selectedPeriod: e.target.value,
    }));
  };

  const fetchProblemsSolvedToday = async () => {
    if (myContexts.selectedClass) {
      const problemsSolved = await axios.get(`http://localhost:8000/api/get-problems-solved-today`, {
        params: {
          classID: myContexts.selectedClass,
        },
      });

      setActiveStudentsThisPeriod(problemsSolved.data.activeStudents);
      setTotalTimeThisPeriod(problemsSolved.data.time);
      setTotalCorrectThisPeriod(problemsSolved.data.totalCorrect);
      setTotalWrongThisPeriod(problemsSolved.data.totalWrong);
      setTotalSolvedThisPeriod(problemsSolved.data.totalProblemsSolved);
      setCorrectPercentageThisPeriod(Math.round((problemsSolved.data.totalCorrect / problemsSolved.data.totalProblemsSolved) * 100));

      if (fetchedOnce !== true) {
        setFetchedOnce(true);
      }
      console.log("I dag", problemsSolved.data);
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
      setCorrectPercentageThisPeriod(Math.round((problemsSolved.data.totalCorrect / problemsSolved.data.totalProblemsSolved) * 100));

      if (fetchedOnce !== true) {
        setFetchedOnce(true);
      }
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
      setCorrectPercentageThisPeriod(Math.round((problemsSolved.data.totalCorrect / problemsSolved.data.totalProblemsSolved) * 100));

      if (fetchedOnce !== true) {
        setFetchedOnce(true);
      }

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
      setCorrectPercentageThisPeriod(Math.round((problemsSolved.data.totalCorrect / problemsSolved.data.totalProblemsSolved) * 100));

      if (fetchedOnce !== true) {
        setFetchedOnce(true);
      }

      console.log("Dette år", problemsSolved.data);
    }
  };

  const fetchProblemsSolvedAllTime = async () => {
    if (myContexts.selectedClass) {
      const problemsSolved = await axios.get(`http://localhost:8000/api/get-problems-solved-all-time`, {
        params: {
          classID: myContexts.selectedClass,
        },
      });

      setActiveStudentsThisPeriod(problemsSolved.data.activeStudents);
      setTotalTimeThisPeriod(problemsSolved.data.time);
      setTotalCorrectThisPeriod(problemsSolved.data.totalCorrect);
      setTotalWrongThisPeriod(problemsSolved.data.totalWrong);
      setTotalSolvedThisPeriod(problemsSolved.data.totalProblemsSolved);
      setCorrectPercentageThisPeriod(Math.round((problemsSolved.data.totalCorrect / problemsSolved.data.totalProblemsSolved) * 100));

      if (fetchedOnce !== true) {
        setFetchedOnce(true);
      }
      console.log("Altid", problemsSolved.data);
    }
  };

  /* Other */
  const overview20 = (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="#232b2b" class="bi bi-people-fill" viewBox="0 0 16 16">
      <path d="M7 14s-1 0-1-1 1-4 5-4 5 3 5 4-1 1-1 1H7zm4-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" />
      <path fill-rule="evenodd" d="M5.216 14A2.238 2.238 0 0 1 5 13c0-1.355.68-2.75 1.936-3.72A6.325 6.325 0 0 0 5 9c-4 0-5 3-5 4s1 1 1 1h4.216z" />
      <path d="M4.5 8a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z" />
    </svg>
  );

  const subjects = Object.keys(subjectData.correctPercentage).sort((a, b) => {
    const valueA = subjectData[sortBy][a];
    const valueB = subjectData[sortBy][b];
    return valueB - valueA;
  });

  const findExtremeValue = (subject, dataType) => {
    const data = subjectData[dataType][subject];
    const values = Object.values(subjectData[dataType]);
    const maxValue = Math.max(...values);
    const minValue = Math.min(...values);

    if (data === maxValue) return "highest";
    if (data === minValue) return "lowest";
    return "";
  };

  return (
    <div className={styles.statisticsContainer}>
      <div className={styles.classes}>
        <div className={styles.dropdownContainer}>
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
                <option key={index} value={theclass._id}>
                  {theclass.grade}.{theclass.letter}
                </option>
              ))}
          </select>
          <select className={styles.dropdown} id="subjects" name="subjects" value={myContexts.selectedPeriod} onChange={handlePeriodChange}>
            <option>I dag</option>
            <option>Denne uge</option>
            <option>Denne måned</option>
            <option>Dette år</option>
            <option>Altid</option>
          </select>
          <select className={styles.dropdown} id="sortBy" name="sortBy" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            <option value="correctPercentage">Korrekt</option>
            <option value="totalSolved">Opgaver</option>
            <option value="minutesSpent">Minutter</option>
          </select>
        </div>
      </div>

      {myContexts.teacherData.classes ? (
        <>
          {fetchedOnce === false && <p className="loading">Indlæser data...</p>}
          <div className={styles.selectedClassContainer}>
            <div className={`${styles.classOverview} ${styles.overviewHighlight}`}>
              <div className={styles.overviewHighlightHeading}>
                {overview20}
                <h3>Overblik ({myContexts.selectedPeriod})</h3>
              </div>
              <div className={styles.overviewHighlightGrid}>
                <div className={styles.overviewHighlightPercentage}>
                  <div className={styles.flexColumn2}>
                    <div className={styles.percentageCircle}>
                      <CircularProgressbar
                        value={correctPercentageThisperiod ? correctPercentageThisperiod : 0}
                        text={correctPercentageThisperiod ? correctPercentageThisperiod + "%" : "-"}
                        styles={{
                          root: {},
                          path: {
                            stroke: `#232b2b`,
                            strokeLinecap: "round",
                            transition: "stroke-dashoffset 1s ease 0s",
                          },
                          trail: {
                            stroke: "#ffffff",
                            strokeLinecap: "butt",
                            transform: "rotate(0.25turn)",
                            transformOrigin: "center center",
                          },
                          text: {
                            fill: "#232b2b",
                            fontSize: "1.25rem",
                          },
                        }}
                      />
                    </div>
                    <p>Korrekt</p>
                  </div>
                </div>
                <div className={styles.flexColumn}>
                  <p>Elever</p>
                  <p>Aktive elever</p>
                  <p>Opgaver</p>
                  <p>Minutter</p>
                </div>
                <div className={`${styles.flexColumn} ${styles.overviewHighlightNumbers}`}>
                  <p>{numberOfStudents ? numberOfStudents : "-"}</p>
                  <p>{activeStudentsThisPeriod ? activeStudentsThisPeriod : "-"}</p>
                  <p>{totalSolvedThisPeriod ? totalSolvedThisPeriod : "-"}</p>
                  <p>{totalTimeThisPeriod ? Math.ceil(totalTimeThisPeriod / 60) : "-"}</p>
                </div>
              </div>
            </div>

            {subjects.map((subject) => (
              <div key={subject} className={`${styles.classOverview} ${styles.overviewSubject} ${styles[findExtremeValue(subject, sortBy)]}`}>
                <h3>{subject}</h3>
                <div className={styles.overviewSubjectGrid}>
                  <div className={styles.flexColumn}>
                    <p>Korrekt</p>
                    <p>Opgaver</p>
                    <p>Minutter</p>
                  </div>
                  <div className={styles.flexColumn}>
                    <p>{subjectData.correctPercentage[subject] ? subjectData.correctPercentage[subject] + "%" : "-"}</p>
                    <p>{subjectData.totalSolved[subject] ? subjectData.totalSolved[subject] : "-"}</p>
                    <p>{subjectData.minutesSpent[subject] ? subjectData.minutesSpent[subject] : "-"}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      ) : (
        <p>Det ser ud til, du ikke har nogle klasser forbundet endnu. Tilføj nu!</p>
      )}
    </div>
  );
}

export default DashboardStatistics;
