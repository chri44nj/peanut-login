"use client";
import { useState, useContext } from "react";
import styles from "../styles/DashboardClasses.module.css";
import { MyContexts, SetMyContexts } from "./Contexts";

function DashboardClasses() {
  /* Contexts */
  const myContexts = useContext(MyContexts);
  const myContextsDispatch = useContext(SetMyContexts);

  /* States */
  const [formVisible, setFormVisible] = useState(false);
  const [grade, setGrade] = useState("");
  const [letter, setLetter] = useState("");
  const [newClass, setNewClass] = useState({
    name: myContexts.teacherData.school,
    grade: null,
    letter: null,
    students: 0,
    allStudents: [],
    joinCode: "",
    id: "",
  });

  /* Functions */
  const handleClassClick = (classId) => {
    myContextsDispatch((prevContexts) => ({
      ...prevContexts,
      clickedClass: classId,
      selectedStudent: "Alle elever",
    }));
  };

  const handleSelectStudent = (studentName) => {
    myContextsDispatch((prevContexts) => ({
      ...prevContexts,
      selectedStudent: studentName,
    }));
    console.log("handleSelectStudent called");
    const dashboardContainer = document.getElementById("dashboardContainer");
    if (dashboardContainer) {
      dashboardContainer.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewClass((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    const updatedNewClass = {
      ...newClass,
      joinCode: generateID(8),
      id: generateID(8),
    };
    myContextsDispatch((prevContexts) => ({
      ...prevContexts,
      classes: [...prevContexts.classes, updatedNewClass],
    }));
    setNewClass({ name: myContexts.teacherData.school, grade: null, students: 0, allStudents: [], letter: null, joinCode: "", id: "" });
    setGrade("");
    setLetter("");
    setFormVisible(false);
  };

  function generateID(length) {
    let id = "";
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
      id += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return id;
  }

  /* Other */
  const alphabetPattern = /[a-zA-ZæøåÆØÅ]/;
  const numbersPattern = /^(10|[0-9])$/;

  return (
    <div id="classesContainer" className={styles.classesContainer}>
      <div className={styles.dropdownsContainer}>
        <select className={styles.dropdown} id="classes" name="classes" value={myContexts.clickedClass} onChange={(e) => handleClassClick(e.target.value)}>
          <option value="Alle klasser">Alle klasser</option>
          {myContexts.classes.map((theclass, index) => (
            <option className={styles.dropdownClass} key={index} value={theclass.id}>
              {theclass.grade}.{theclass.letter}
            </option>
          ))}
        </select>
        {myContexts.clickedClass !== "Alle klasser" && (
          <select className={styles.dropdown} id="students" name="students" value={myContexts.selectedStudent} onChange={(e) => handleSelectStudent(e.target.value)}>
            <option className={styles.dropdownClass}>Alle elever</option>
            {myContexts.clickedClass !== "Alle klasser" &&
              myContexts.classes
                .find((specificClass) => specificClass.id === myContexts.clickedClass)
                .allStudents.map((student, index) => (
                  <option className={styles.dropdownClass} key={index} value={student.name}>
                    {student.name}
                  </option>
                ))}
          </select>
        )}
      </div>
      {formVisible && (
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
                  handleInputChange(e);
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
                  handleInputChange(e);
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
            id={styles.closeForm}
            type="button"
            onClick={() => {
              setFormVisible((old) => !old);
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

      {myContexts.clickedClass === "Alle klasser" && (
        <>
          {myContexts.classes && (
            <div className={`${styles.classesGrid}`}>
              {myContexts.classes.map((theclass) => (
                <div className={styles.classContainer} key={theclass.id} onClick={() => handleClassClick(theclass.id)}>
                  <div>
                    <p className={styles.class}>
                      {theclass.grade}.{theclass.letter}
                    </p>
                    <p className={styles.school}>{theclass.name}</p>
                  </div>
                  <p className={styles.students}>{theclass.students} elever</p>
                </div>
              ))}
            </div>
          )}
          {myContexts.classes === 0 ? <p>Klik på knappen herunder for at tilføje en klasse.</p> : ""}
          <div className={styles.buttonContainer}>
            <button className={styles.openFormButton} type="button" onClick={() => setFormVisible((old) => !old)}>
              {formVisible ? "Luk" : "Tilføj klasse"}
            </button>
          </div>
        </>
      )}

      {myContexts.clickedClass !== "Alle klasser" && (
        <>
          {myContexts.classes.map((theclass, index) => {
            if (theclass.id === myContexts.clickedClass)
              return (
                <div className={styles.singleClassDetails} key={index}>
                  <h2>
                    <span className={styles.school}>{theclass.name}</span>, {theclass.grade}.{theclass.letter}
                  </h2>
                  {myContexts.selectedStudent === "Alle elever" ? <p>Klassekode: {theclass.joinCode}</p> : ""}
                  <section className={styles.studentsListSection}>
                    {myContexts.selectedStudent === "Alle elever" ? <h3>{theclass.allStudents.length > 0 ? "Alle " + theclass.allStudents.length : 0} elever</h3> : <h3>{myContexts.selectedStudent}</h3>}

                    {theclass.allStudents && myContexts.selectedStudent === "Alle elever" ? (
                      <ul className={styles.studentsList}>
                        {theclass.allStudents.map((student, index) => (
                          <li className={styles.singleStudent} key={index} onClick={() => handleSelectStudent(student.name)}>
                            {student.name}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      ""
                    )}

                    {theclass.allStudents.length === 0 ? <p>Klik på knappen herunder eller del din klassekode med eleverne, for at tilføje dem til klassen.</p> : ""}
                    {myContexts.selectedStudent === "Alle elever" && (
                      <div className={styles.buttonContainer}>
                        <button className={styles.addStudentsButton} type="button">
                          Tilføj elev
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
  );
}

export default DashboardClasses;
