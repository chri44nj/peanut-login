"use client";
import axios from "axios";
import { useState, useContext, useEffect } from "react";
import styles from "../styles/DashboardClasses.module.css";
import { MyContexts, SetMyContexts } from "./Contexts";

function DashboardClasses() {
  /* Contexts */
  const myContexts = useContext(MyContexts);
  const myContextsDispatch = useContext(SetMyContexts);

  /* States */
  const [createFormVisible, setCreateFormVisible] = useState(false);
  const [removeClassFormVisible, setRemoveClassFormVisible] = useState(false);
  const [removeStudentFormVisible, setRemoveStudentFormVisible] = useState(false);
  const [grade, setGrade] = useState("");
  const [letter, setLetter] = useState("");

  /* Effects */
  useEffect(() => {
    fetchClasses();
  }, [myContexts.teacherData.classesIDs]);

  /* Functions */
  const handleClassClick = async (classID) => {
    await myContextsDispatch((prevContexts) => ({
      ...prevContexts,
      clickedClass: classID,
      selectedStudent: "Alle elever",
    }));
  };

  const handleSelectStudent = (studentName) => {
    myContextsDispatch((prevContexts) => ({
      ...prevContexts,
      selectedStudent: studentName,
    }));

    const dashboardContainer = document.getElementById("dashboardContainer");
    if (dashboardContainer) {
      dashboardContainer.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    await postClass();
    setGrade("");
    setLetter("");
    setCreateFormVisible(false);
    /*  await updateTeacherData(); */
    fetchClasses();
  };

  const postClass = async () => {
    const res = await axios.post(`https://skillzy-node.fly.dev/api/create-class`, {
      school: { name: myContexts.teacherData.school, grade: grade, letter: letter },
      teacherID: myContexts.teacherData.id,
    });
  };

  const fetchClasses = async () => {
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
  };

  const removeClass = async () => {
    const res = await axios.post(`https://skillzy-node.fly.dev/api/remove-class-from-teacher`, {
      classID: myContexts.clickedClass,
      teacherID: myContexts.teacherData.id,
    });

    setRemoveClassFormVisible(false);
    await myContextsDispatch((prevContexts) => ({
      ...prevContexts,
      clickedClass: "Alle klasser",
    }));
    fetchClasses();
  };

  const removeStudent = async () => {
    const res = await axios.post(`https://skillzy-node.fly.dev/api/remove-student-from-class`, {
      classID: myContexts.clickedClass,
      username: myContexts.selectedStudent,
    });

    setRemoveStudentFormVisible(false);
    await myContextsDispatch((prevContexts) => ({
      ...prevContexts,
      selectedStudent: "Alle elever",
    }));
    fetchClasses();
  };

  /* Other */

  const book16 = (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-book-fill" viewBox="0 0 16 16">
      <path d="M8 1.783C7.015.936 5.587.81 4.287.94c-1.514.153-3.042.672-3.994 1.105A.5.5 0 0 0 0 2.5v11a.5.5 0 0 0 .707.455c.882-.4 2.303-.881 3.68-1.02 1.409-.142 2.59.087 3.223.877a.5.5 0 0 0 .78 0c.633-.79 1.814-1.019 3.222-.877 1.378.139 2.8.62 3.681 1.02A.5.5 0 0 0 16 13.5v-11a.5.5 0 0 0-.293-.455c-.952-.433-2.48-.952-3.994-1.105C10.413.809 8.985.936 8 1.783z" />
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

  return (
    <>
      {myContexts.clickedClass !== "Alle klasser" ? (
        <div className={styles.breadcrumb}>
          <button
            className="hover-link"
            type="button"
            onClick={() => {
              myContextsDispatch((prevContexts) => ({
                ...prevContexts,
                clickedClass: "Alle klasser",
                selectedStudent: "Alle elever",
              }));
            }}
          >
            Alle klasser
          </button>

          <span> / </span>
          <button
            className="hover-link"
            type="button"
            onClick={() => {
              myContextsDispatch((prevContexts) => ({
                ...prevContexts,
                selectedStudent: "Alle elever",
              }));
            }}
          >
            {myContexts.teacherData.classes.map((theclass) => {
              if (theclass._id === myContexts.clickedClass) {
                return `${theclass.grade}.${theclass.letter}`;
              }
            })}
          </button>

          {myContexts.selectedStudent !== "Alle elever" ? (
            <>
              <span> / </span>
              <button className="hover-link" type="button">
                {myContexts.selectedStudent}
              </button>
            </>
          ) : (
            ""
          )}
        </div>
      ) : (
        ""
      )}

      <div id="classesContainer" className={styles.classesContainer}>
        <div className={styles.dropdownsContainer}>
          <select className={styles.dropdown} id="classes" name="classes" value={myContexts.clickedClass} onChange={(e) => handleClassClick(e.target.value)}>
            <option value="Alle klasser">Alle klasser</option>
            {myContexts.teacherData.classes
              ? myContexts.teacherData.classes.map((theclass, index) => (
                  <option className={styles.dropdownClass} key={index} value={theclass._id}>
                    {theclass.grade}.{theclass.letter}
                  </option>
                ))
              : ""}
          </select>
          {myContexts.clickedClass !== "Alle klasser" && (
            <select className={styles.dropdown} id="students" name="students" value={myContexts.selectedStudent} onChange={(e) => handleSelectStudent(e.target.value)}>
              <option className={styles.dropdownClass}>Alle elever</option>
              {myContexts.clickedClass !== "Alle klasser" &&
                myContexts.teacherData.classes
                  .find((specificClass) => specificClass._id === myContexts.clickedClass)
                  .students?.map((student, index) => (
                    <option className={styles.dropdownClass} key={index} value={student}>
                      {student}
                    </option>
                  ))}
            </select>
          )}
        </div>

        {myContexts.clickedClass === "Alle klasser" && (
          <>
            {myContexts.teacherData.classes && (
              <div className={`${styles.classesGrid}`}>
                {myContexts.teacherData.classes
                  .sort((a, b) => {
                    if (a.grade === b.grade) {
                      return a.letter.localeCompare(b.letter);
                    }
                    return a.grade - b.grade;
                  })
                  .map((theclass) => (
                    <div className={styles.classContainer} key={theclass._id} onClick={() => handleClassClick(theclass._id)}>
                      <div>
                        <p className={styles.class}>
                          {theclass.grade}.{theclass.letter}
                        </p>
                        <p className={styles.school}>{theclass.name}</p>
                      </div>
                      <p className={styles.students}>
                        {theclass.students ? theclass.students.length : "0"} {theclass.students?.length === 1 ? "elev" : "elever"}
                      </p>
                    </div>
                  ))}
              </div>
            )}
            {myContexts.teacherData.classesIDs.length === 0 ? <p>Klik på knappen herunder for at tilføje en klasse.</p> : ""}
            <div className={styles.buttonContainer}>
              <button className={styles.openFormButton} type="button" onClick={() => setCreateFormVisible((old) => !old)}>
                {createFormVisible ? "Luk" : "Tilføj klasse"}
              </button>
            </div>
          </>
        )}

        {myContexts.clickedClass !== "Alle klasser" && (
          <>
            {myContexts.teacherData.classes.map((theclass, index) => {
              if (theclass._id === myContexts.clickedClass)
                return (
                  <div className={styles.singleClassDetails} key={index}>
                    <h2>
                      <span className={styles.school}>{theclass.name}</span>, {theclass.grade}.{theclass.letter}
                    </h2>
                    {myContexts.selectedStudent === "Alle elever" ? <p>Klassekode: {myContexts.clickedClass}</p> : ""}

                    <section className={styles.studentsListSection}>
                      {myContexts.selectedStudent === "Alle elever" ? <h3>{theclass.students?.length === 0 ? "Der er ingen elever tilføjet til klassen" : theclass.students?.length === 1 ? "Din ene elev" : "Dine " + theclass.students?.length + " elever"} </h3> : ""}

                      {theclass.students && myContexts.selectedStudent === "Alle elever" ? (
                        <ul className={styles.studentsList}>
                          {theclass.students
                            // Sort the students alphabetically
                            .sort((a, b) => a.localeCompare(b))
                            .map((student, index) => (
                              <li className={styles.singleStudent} key={index} onClick={() => handleSelectStudent(student)}>
                                {student}
                              </li>
                            ))}
                        </ul>
                      ) : (
                        ""
                      )}

                      {theclass.students?.length === 0 ? <p>Klik på knappen herunder eller del din klassekode med eleverne, for at tilføje dem til klassen.</p> : ""}
                      {myContexts.selectedStudent === "Alle elever" && (
                        <div className={styles.buttonContainer}>
                          <button className={styles.addStudentsButton} type="button">
                            Tilføj elev
                          </button>
                          <button
                            className={styles.removeButton}
                            type="button"
                            onClick={() => {
                              setRemoveClassFormVisible((old) => !old);
                            }}
                          >
                            {removeClassFormVisible ? "Luk" : "Fjern klasse"}
                          </button>
                        </div>
                      )}
                    </section>
                  </div>
                );
              else {
                return null;
              }
            })}
          </>
        )}
      </div>

      {myContexts.selectedStudent !== "Alle elever" ? (
        <>
          <div className={styles.clickedClassContainer}>
            <div className={`${styles.classOverview} ${styles.overviewSubject}`}>
              <div className={styles.overviewTop}>
                <h2>{myContexts.selectedStudent}s statistik</h2>
              </div>
              <p className={`${styles.marginTop} ${styles.overviewTimespan}`}>Altid</p>
              <div className={styles.overviewBottomFlex2}>
                <div className={styles.overviewFlex}>
                  <p className={`${styles.bold} ${styles.bigStat}`}>50</p>
                  <div className={styles.overviewFlex2}>
                    {pen16}
                    <p>Opgaver</p>
                  </div>
                </div>
                <div className={styles.overviewFlex}>
                  <p className={`${styles.bold} ${styles.bigStat}`}>25</p>
                  <div className={styles.overviewFlex2}>
                    {clock16}
                    <p>Minutter</p>
                  </div>
                </div>
                <div className={styles.overviewFlex}>
                  <p className={`${styles.bold} ${styles.bigStat}`}>75%</p>
                  <div className={styles.overviewFlex2}>
                    {thumbs16}
                    <p>Korrekt</p>
                  </div>
                </div>
              </div>
              <p className={styles.overviewTimespan}>Seneste 7 dage</p>
              <div className={styles.overviewBottomFlex2}>
                <div className={styles.overviewFlex}>
                  <p className={`${styles.bold} ${styles.bigStat}`}>85</p>
                  <div className={styles.overviewFlex2}>
                    {pen16}
                    <p>Opgaver</p>
                  </div>
                </div>
                <div className={styles.overviewFlex}>
                  <p className={`${styles.bold} ${styles.bigStat}`}>89</p>
                  <div className={styles.overviewFlex2}>
                    {clock16}
                    <p>Minutter</p>
                  </div>
                </div>
                <div className={styles.overviewFlex}>
                  <p className={`${styles.bold} ${styles.bigStat}`}>97%</p>
                  <div className={styles.overviewFlex2}>
                    {thumbs16}
                    <p>Korrekt</p>
                  </div>
                </div>
              </div>
            </div>

            <div className={`${styles.classOverview} ${styles.overviewClass}`}>
              <div className={styles.overviewTop}>
                <h2>Klassen</h2>
              </div>
              <div className={styles.overviewBottomFlex}>
                <div className={styles.overviewBottomGrid}>
                  <div className={styles.overviewFlex}>
                    <p className={`${styles.bold} ${styles.bigStat}`}>25</p>
                    <p>Elever</p>
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
                      <p>1040</p>
                      <p>1080</p>
                      <p>85/489</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className={`${styles.classOverview} ${styles.overviewLastWeek}`}>
              <div className={styles.overviewTop}>
                <h2>Seneste 7 dage</h2>
              </div>
              <div className={styles.overviewBottomFlex}>
                <div className={styles.overviewBottomGrid}>
                  <div className={styles.overviewFlex}>
                    <p className={`${styles.bold} ${styles.bigStat}`}>87%</p>
                    <p>Korrekt</p>
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
                      <p>77</p>
                      <p>108</p>
                      <p>4/489</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className={`${styles.classOverview} ${styles.overviewBestSubject}`}>
              <div className={styles.overviewTop}>
                <h2>Bedste emne</h2>
              </div>
              <div className={styles.overviewBottomFlex}>
                <div className={styles.overviewBottomGrid}>
                  <div className={styles.overviewFlex}>
                    <p className={`${styles.bold} ${styles.bigStat}`}>66%</p>
                    <p>Korrekt</p>
                  </div>
                  <div className={styles.overviewBottomGrid2}>
                    <div>
                      <div className={styles.overviewFlex2}>
                        {book16}
                        <p className={styles.subjectHeader}>Addition</p>
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
                      <p>152</p>
                      <p>97</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className={`${styles.classOverview} ${styles.overviewWorstSubject}`}>
              <div className={styles.overviewTop}>
                <h2>Sværeste emne</h2>
              </div>
              <div className={styles.overviewBottomFlex}>
                <div className={styles.overviewBottomGrid}>
                  <div className={styles.overviewFlex}>
                    <p className={`${styles.bold} ${styles.bigStat}`}>66%</p>
                    <p>Korrekt</p>
                  </div>
                  <div className={styles.overviewBottomGrid2}>
                    <div>
                      <div className={styles.overviewFlex2}>
                        {book16}
                        <p className={styles.subjectHeader}>Ligninger</p>
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
                      <p>77</p>
                      <p>108</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <button
            className={styles.removeButton}
            type="button"
            onClick={() => {
              setRemoveStudentFormVisible((old) => !old);
            }}
          >
            {removeStudentFormVisible ? "Luk" : "Fjern elev"}
          </button>
        </>
      ) : (
        ""
      )}

      {createFormVisible && (
        <form className={styles.addClass} onSubmit={handleFormSubmit}>
          <div className={styles.addClassFlex}>
            <div>
              <p>Klassetrin</p>

              <select
                id="grade"
                name="grade"
                type="text"
                value={grade}
                onChange={(e) => {
                  {
                    e.target.value !== "Vælg" ? setGrade(e.target.value) : setGrade("");
                  }
                }}
              >
                <option>Vælg</option>
                {Array.from({ length: 11 }, (_, i) => i).map((number) => (
                  <option key={number}>{number}</option>
                ))}
              </select>
            </div>
            <div>
              <p>Bogstav</p>
              <select
                id="letter"
                name="letter"
                type="text"
                value={letter}
                onChange={(e) => {
                  e.target.value !== "Vælg" ? setLetter(e.target.value) : setLetter("");
                }}
              >
                <option>Vælg</option>
                {Array.from({ length: 29 }, (_, i) => String.fromCharCode(97 + i)) // Lowercase Danish alphabet 'a' to 'z'
                  .concat("æ", "ø", "å") // Adding additional Danish characters
                  .filter((letter) => /[a-zA-ZæøåÆØÅ]/.test(letter)) // Filtering out non-alphabetic characters
                  .map((letter, index) => (
                    <option key={index}>{letter}</option>
                  ))}
                <option>kl</option>
              </select>
            </div>
          </div>
          <h3>
            {grade && letter ? `${grade}.${letter}, ` : ""}
            <span>{myContexts.teacherData.school}</span>
          </h3>

          <button
            id={styles.closeCreateForm}
            type="button"
            onClick={() => {
              setCreateFormVisible((old) => !old);
              setGrade("");
              setLetter("");
            }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-x-circle-fill" viewBox="0 0 16 16">
              <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM5.354 4.646a.5.5 0 1 0-.708.708L7.293 8l-2.647 2.646a.5.5 0 0 0 .708.708L8 8.707l2.646 2.647a.5.5 0 0 0 .708-.708L8.707 8l2.647-2.646a.5.5 0 0 0-.708-.708L8 7.293 5.354 4.646z" />
            </svg>
          </button>
          <button className={`${styles.addClassButton} ${grade && letter ? styles.validButton : ""}`} type="submit" disabled={!grade || !letter}>
            Tilføj
          </button>
        </form>
      )}

      {removeStudentFormVisible && (
        <div className={styles.removeStudent}>
          {myContexts.teacherData.classes.map((theclass, index) => {
            if (theclass._id === myContexts.clickedClass) {
              return (
                <p key={index}>
                  Er du sikker på du vil fjerne {myContexts.selectedStudent} fra <span className={styles.capitalize}>{theclass.name}</span>, {theclass.grade}.{theclass.letter}?
                </p>
              );
            }
          })}
          <button
            id={styles.closeRemoveForm}
            type="button"
            onClick={() => {
              setRemoveStudentFormVisible((old) => !old);
            }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-x-circle-fill" viewBox="0 0 16 16">
              <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM5.354 4.646a.5.5 0 1 0-.708.708L7.293 8l-2.647 2.646a.5.5 0 0 0 .708.708L8 8.707l2.646 2.647a.5.5 0 0 0 .708-.708L8.707 8l2.647-2.646a.5.5 0 0 0-.708-.708L8 7.293 5.354 4.646z" />
            </svg>
          </button>
          <button className={`${styles.removeButton2} ${removeStudentFormVisible ? styles.redBackground : ""}`} type="button" onClick={removeStudent}>
            Fjern {myContexts.selectedStudent}
          </button>
        </div>
      )}

      {removeClassFormVisible && (
        <div className={styles.removeStudent}>
          {myContexts.teacherData.classes.map((theclass, index) => {
            if (theclass._id === myContexts.clickedClass) {
              return (
                <p key={index}>
                  Er du sikker på du vil fjerne <span className={styles.capitalize}>{theclass.name}</span>, {theclass.grade}.{theclass.letter} fra dine klasser?
                </p>
              );
            }
          })}
          <button
            id={styles.closeRemoveForm}
            type="button"
            onClick={() => {
              setRemoveClassFormVisible((old) => !old);
            }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-x-circle-fill" viewBox="0 0 16 16">
              <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM5.354 4.646a.5.5 0 1 0-.708.708L7.293 8l-2.647 2.646a.5.5 0 0 0 .708.708L8 8.707l2.646 2.647a.5.5 0 0 0 .708-.708L8.707 8l2.647-2.646a.5.5 0 0 0-.708-.708L8 7.293 5.354 4.646z" />
            </svg>
          </button>
          <button className={`${styles.removeButton2} ${removeStudentFormVisible ? styles.redBackground : ""}`} type="button" onClick={removeClass}>
            {myContexts.teacherData.classes.map((theclass) => {
              if (theclass._id === myContexts.clickedClass) {
                return `Fjern ${theclass.grade}.${theclass.letter}`;
              }
            })}
          </button>
        </div>
      )}
    </>
  );
}

export default DashboardClasses;
