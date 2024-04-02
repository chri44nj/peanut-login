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
  const [classSelectedOnce, setClassSelectedOnce] = useState(false);

  const [numberOfStudents, setNumberOfStudents] = useState(0);
  const [activeStudentsThisPeriod, setActiveStudentsThisPeriod] = useState(0);
  const [totalTimeThisPeriod, setTotalTimeThisPeriod] = useState(null);
  const [totalCorrectThisPeriod, setTotalCorrectThisPeriod] = useState(null);
  const [totalWrongThisPeriod, setTotalWrongThisPeriod] = useState(null);
  const [totalSolvedThisPeriod, setTotalSolvedThisPeriod] = useState(null);
  const [correctPercentageThisperiod, setCorrectPercentageThisPeriod] = useState(null);
  const [sortBy, setSortBy] = useState("alphabetically");
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
    if (myContexts.teacherData.classes.length > 0 && classSelectedOnce === false) {
      myContextsDispatch((old) => ({
        ...old,
        selectedClass: myContexts.teacherData.classes[0]._id,
      }));
      setClassSelectedOnce(true);
    }

    if (myContexts.selectedPeriod === "I dag") {
      fetchProblemsSolvedToday();
    } else if (myContexts.selectedPeriod === "Denne uge") {
      fetchProblemsSolvedThisWeek();
      console.log("wtf??", subjectData);
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
    if (myContexts.userAuthenticated === false) {
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
          userAuthenticated: true,
          teacherData: {
            ...old.teacherData,
            ...updatedTeacherData,
          },
        }));
      } catch (error) {
        console.error("Error fetching teacher data:", error);
      }
    } else {
      console.log("Teacher data already fetched");
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
      try {
        const problemsSolved = await axios.get(`http://localhost:8000/api/get-problems-solved-today`, {
          params: {
            classID: myContexts.selectedClass,
          },
        });

        const allSubjectsData = problemsSolved.data.find((item) => item._id === "allSubjects");
        const individualSubjectsData = problemsSolved.data.filter((item) => item._id !== "allSubjects");

        // Set state for "allSubjects" data
        setActiveStudentsThisPeriod(allSubjectsData.activeStudents.length);
        setTotalTimeThisPeriod(allSubjectsData.time);
        setTotalCorrectThisPeriod(allSubjectsData.totalCorrect);
        setTotalWrongThisPeriod(allSubjectsData.totalWrong);
        setTotalSolvedThisPeriod(allSubjectsData.totalProblemsSolved);
        setCorrectPercentageThisPeriod(Math.round((allSubjectsData.totalCorrect / allSubjectsData.totalProblemsSolved) * 100));

        // Set state for individual subjects
        const subjectData = {};
        individualSubjectsData.forEach((subject) => {
          subjectData[subject._id] = {
            correctPercentage: Math.round((subject.totalCorrect / subject.totalProblemsSolved) * 100),
            totalSolved: subject.totalProblemsSolved,
            minutesSpent: Math.ceil(subject.time / 60),
            activeStudents: subject.activeStudents,
          };
        });
        setSubjectData(subjectData);

        if (!fetchedOnce) {
          setFetchedOnce(true);
        }
        console.log("I dag", problemsSolved.data);
      } catch (error) {
        console.error("Error occurred while fetching problems solved this week:", error);
        // Handle error appropriately
      }
    }
  };

  const fetchProblemsSolvedThisWeek = async () => {
    if (myContexts.selectedClass) {
      try {
        const problemsSolved = await axios.get(`http://localhost:8000/api/get-problems-solved-this-week`, {
          params: {
            classID: myContexts.selectedClass,
          },
        });

        const allSubjectsData = problemsSolved.data.find((item) => item._id === "allSubjects");
        const individualSubjectsData = problemsSolved.data.filter((item) => item._id !== "allSubjects");

        // Set state for "allSubjects" data
        setActiveStudentsThisPeriod(allSubjectsData.activeStudents.length);
        setTotalTimeThisPeriod(allSubjectsData.time);
        setTotalCorrectThisPeriod(allSubjectsData.totalCorrect);
        setTotalWrongThisPeriod(allSubjectsData.totalWrong);
        setTotalSolvedThisPeriod(allSubjectsData.totalProblemsSolved);
        setCorrectPercentageThisPeriod(Math.round((allSubjectsData.totalCorrect / allSubjectsData.totalProblemsSolved) * 100));

        // Set state for individual subjects
        const subjectData = {};
        individualSubjectsData.forEach((subject) => {
          subjectData[subject._id] = {
            correctPercentage: Math.round((subject.totalCorrect / subject.totalProblemsSolved) * 100),
            totalSolved: subject.totalProblemsSolved,
            minutesSpent: Math.ceil(subject.time / 60),
            activeStudents: subject.activeStudents,
          };
        });
        setSubjectData(subjectData);

        if (!fetchedOnce) {
          setFetchedOnce(true);
        }
        console.log("Denne uge", problemsSolved.data);
      } catch (error) {
        console.error("Error occurred while fetching problems solved this week:", error);
        // Handle error appropriately
      }
    }
  };

  const fetchProblemsSolvedThisMonth = async () => {
    if (myContexts.selectedClass) {
      try {
        const problemsSolved = await axios.get(`http://localhost:8000/api/get-problems-solved-this-month`, {
          params: {
            classID: myContexts.selectedClass,
          },
        });

        const allSubjectsData = problemsSolved.data.find((item) => item._id === "allSubjects");
        const individualSubjectsData = problemsSolved.data.filter((item) => item._id !== "allSubjects");

        setActiveStudentsThisPeriod(allSubjectsData.activeStudents.length);
        setTotalTimeThisPeriod(allSubjectsData.time);
        setTotalCorrectThisPeriod(allSubjectsData.totalCorrect);
        setTotalWrongThisPeriod(allSubjectsData.totalWrong);
        setTotalSolvedThisPeriod(allSubjectsData.totalProblemsSolved);
        setCorrectPercentageThisPeriod(Math.round((allSubjectsData.totalCorrect / allSubjectsData.totalProblemsSolved) * 100));

        const subjectData = {};
        individualSubjectsData.forEach((subject) => {
          subjectData[subject._id] = {
            correctPercentage: Math.round((subject.totalCorrect / subject.totalProblemsSolved) * 100),
            totalSolved: subject.totalProblemsSolved,
            minutesSpent: Math.ceil(subject.time / 60),
            activeStudents: subject.activeStudents,
          };
        });
        setSubjectData(subjectData);

        if (!fetchedOnce) {
          setFetchedOnce(true);
        }

        console.log("Denne måned", problemsSolved.data);
      } catch (error) {
        console.error("Error occurred while fetching problems solved this month:", error);
        // Handle error appropriately
      }
    }
  };

  const fetchProblemsSolvedThisYear = async () => {
    if (myContexts.selectedClass) {
      try {
        const problemsSolved = await axios.get(`http://localhost:8000/api/get-problems-solved-this-year`, {
          params: {
            classID: myContexts.selectedClass,
          },
        });

        const allSubjectsData = problemsSolved.data.find((item) => item._id === "allSubjects");
        const individualSubjectsData = problemsSolved.data.filter((item) => item._id !== "allSubjects");

        // Set state for "allSubjects" data
        setActiveStudentsThisPeriod(allSubjectsData.activeStudents.length);
        setTotalTimeThisPeriod(allSubjectsData.time);
        setTotalCorrectThisPeriod(allSubjectsData.totalCorrect);
        setTotalWrongThisPeriod(allSubjectsData.totalWrong);
        setTotalSolvedThisPeriod(allSubjectsData.totalProblemsSolved);
        setCorrectPercentageThisPeriod(Math.round((allSubjectsData.totalCorrect / allSubjectsData.totalProblemsSolved) * 100));

        // Set state for individual subjects
        const subjectData = {};
        individualSubjectsData.forEach((subject) => {
          subjectData[subject._id] = {
            correctPercentage: Math.round((subject.totalCorrect / subject.totalProblemsSolved) * 100),
            totalSolved: subject.totalProblemsSolved,
            minutesSpent: Math.ceil(subject.time / 60),
            activeStudents: subject.activeStudents,
          };
        });
        setSubjectData(subjectData);

        if (!fetchedOnce) {
          setFetchedOnce(true);
        }

        console.log("Dette år", problemsSolved.data);
      } catch (error) {
        console.error("Error occurred while fetching problems solved this year:", error);
        // Handle error appropriately
      }
    }
  };

  const fetchProblemsSolvedAllTime = async () => {
    if (myContexts.selectedClass) {
      try {
        const problemsSolved = await axios.get(`http://localhost:8000/api/get-problems-solved-all-time`, {
          params: {
            classID: myContexts.selectedClass,
          },
        });

        const allSubjectsData = problemsSolved.data.find((item) => item._id === "allSubjects");
        const individualSubjectsData = problemsSolved.data.filter((item) => item._id !== "allSubjects");

        // Set state for "allSubjects" data
        setActiveStudentsThisPeriod(allSubjectsData.activeStudents.length);
        setTotalTimeThisPeriod(allSubjectsData.time);
        setTotalCorrectThisPeriod(allSubjectsData.totalCorrect);
        setTotalWrongThisPeriod(allSubjectsData.totalWrong);
        setTotalSolvedThisPeriod(allSubjectsData.totalProblemsSolved);
        setCorrectPercentageThisPeriod(Math.round((allSubjectsData.totalCorrect / allSubjectsData.totalProblemsSolved) * 100));

        // Set state for individual subjects
        const subjectData = {};
        individualSubjectsData.forEach((subject) => {
          subjectData[subject._id] = {
            correctPercentage: Math.round((subject.totalCorrect / subject.totalProblemsSolved) * 100),
            totalSolved: subject.totalProblemsSolved,
            minutesSpent: Math.ceil(subject.time / 60),
            activeStudents: subject.activeStudents,
          };
        });
        setSubjectData(subjectData);

        if (!fetchedOnce) {
          setFetchedOnce(true);
        }

        console.log("Altid", problemsSolved.data);
      } catch (error) {
        console.error("Error occurred while fetching problems solved all-time:", error);
        // Handle error appropriately
      }
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

  const arrow16 = (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-arrow-right-short" viewBox="0 0 16 16">
      <path fill-rule="evenodd" d="M4 8a.5.5 0 0 1 .5-.5h5.793L8.146 5.354a.5.5 0 1 1 .708-.708l3 3a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708-.708L10.293 8.5H4.5A.5.5 0 0 1 4 8z" />
    </svg>
  );

  const book16 = (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-book-fill" viewBox="0 0 16 16">
      <path d="M8 1.783C7.015.936 5.587.81 4.287.94c-1.514.153-3.042.672-3.994 1.105A.5.5 0 0 0 0 2.5v11a.5.5 0 0 0 .707.455c.882-.4 2.303-.881 3.68-1.02 1.409-.142 2.59.087 3.223.877a.5.5 0 0 0 .78 0c.633-.79 1.814-1.019 3.222-.877 1.378.139 2.8.62 3.681 1.02A.5.5 0 0 0 16 13.5v-11a.5.5 0 0 0-.293-.455c-.952-.433-2.48-.952-3.994-1.105C10.413.809 8.985.936 8 1.783z" />
    </svg>
  );

  const subjectDataArray = Object.entries(subjectData).map(([subject, data]) => ({ subject, ...data }));

  subjectDataArray.sort((a, b) => {
    if (sortBy === "alphabetically") {
      return a.subject.localeCompare(b.subject);
    } else {
      return b[sortBy] - a[sortBy];
    }
  });
  const findExtremeValue = (subject, dataType) => {
    if (dataType === "alphabetically") {
      return "";
    }

    const data = subject[dataType];
    const values = subjectDataArray.map((item) => item[dataType]);
    const maxValue = Math.max(...values);
    const minValue = Math.min(...values);

    if (data === maxValue) return "highest";
    if (data === minValue) return "lowest";
    return "";
  };

  return (
    <div className={styles.statisticsContainer}>
      {fetchedOnce === false && myContexts.teacherData.classesIDs.length > 0 ? (
        <p className="loading">Indlæser data...</p>
      ) : myContexts.teacherData.classesIDs.length === 0 && myContexts.teacherData.classes.length === 0 ? (
        <div className={styles.addClassContainer}>
          <p>Tilføj klasser til din profil, for at få adgang til dine klassers statistik!</p>
          <button
            className={styles.addClassButton}
            type="button"
            onClick={() => {
              myContextsDispatch((prevContexts) => ({
                ...prevContexts,
                dashboardType: "Klasser",
              }));
            }}
          >
            Mine klasser
          </button>
        </div>
      ) : (
        ""
      )}
      <div className={styles.classes}>
        {myContexts.teacherData.classesIDs.length > 0 ? (
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
              <option value="alphabetically">Alfabetisk</option>
              <option value="correctPercentage">Korrekt</option>
              <option value="totalSolved">Opgaver</option>
              <option value="minutesSpent">Minutter</option>
            </select>
          </div>
        ) : (
          ""
        )}
      </div>

      {myContexts.teacherData.classesIDs.length > 0 && myContexts.teacherData.classes ? (
        <>
          <div className={styles.selectedClassContainer}>
            <div className={`${styles.classOverview} ${styles.overviewHighlight}`}>
              <div className={styles.overviewHighlightHeading}>
                {overview20}
                <h3>Overblik ({myContexts.selectedPeriod.toLowerCase()})</h3>
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
                            stroke: `#ffffff`,
                            strokeLinecap: "round",
                            transition: "stroke-dashoffset 1s ease 0s",
                          },
                          trail: {
                            stroke: "#e8a328",
                            strokeLinecap: "butt",
                            transform: "rotate(0.25turn)",
                            transformOrigin: "center center",
                          },
                          text: {
                            fill: "#ffffff",
                            fontSize: "1.5rem",
                            fontWeight: "bold",
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

            {subjectDataArray.map((subjectObj) => (
              <div key={subjectObj.subject} className={`${styles.classOverview} ${styles.overviewSubject} ${styles[findExtremeValue(subjectObj.subject, sortBy)]}`}>
                <div className={styles.flexRow}>
                  <h3 className={styles.overviewSubjectHeading}>{subjectObj.subject}</h3>
                </div>
                <div className={styles.overviewSubjectGrid}>
                  <div className={styles.flexColumn}>
                    <div className={styles.flexRow}>
                      {sortBy === "correctPercentage" && arrow16}
                      <p>Korrekt</p>
                    </div>
                    <div className={styles.flexRow}>
                      {sortBy === "totalSolved" && arrow16}
                      <p>Opgaver</p>
                    </div>
                    <div className={styles.flexRow}>
                      {sortBy === "minutesSpent" && arrow16}
                      <p>Minutter</p>
                    </div>
                  </div>
                  <div className={styles.flexColumn}>
                    <p>{subjectObj.correctPercentage ? subjectObj.correctPercentage + "%" : "-"}</p>
                    <p>{subjectObj.totalSolved ? subjectObj.totalSolved : "-"}</p>
                    <p>{subjectObj.minutesSpent ? subjectObj.minutesSpent : "-"}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      ) : (
        ""
      )}
    </div>
  );
}

export default DashboardStatistics;
