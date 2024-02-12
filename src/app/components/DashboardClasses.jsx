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
  const [newClass, setNewClass] = useState({
    class: "",
    school: "",
    students: "",
  });

  /* Functions */
  const handleClassClick = (className) => {
    myContextsDispatch((prevContexts) => ({
      ...prevContexts,
      clickedClass: className,
    }));
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
    myContextsDispatch((prevContexts) => ({
      ...prevContexts,
      classes: [...prevContexts.classes, newClass],
    }));
    setNewClass({ class: "", school: "", students: "" });
    setFormVisible(false);
  };

  /* Other */

  return (
    <div className={styles.classesContainer}>
      <select className={styles.dropdown} id="classes" name="classes" value={myContexts.clickedClass} onChange={(e) => handleClassClick(e.target.value)}>
        <option value="Alle klasser">Alle klasser</option>
        {myContexts.classes.map((theclass, index) => (
          <option className={styles.dropdownClass} key={index} value={theclass.class}>
            {theclass.class}
          </option>
        ))}
      </select>
      {formVisible && (
        <form anchor="addClass" className={styles.addClass} onSubmit={handleFormSubmit}>
          <div>
            <label htmlFor="className">Klasse</label>
            <input id="className" name="class" type="text" value={newClass.class} onChange={handleInputChange} />
          </div>
          <div>
            <label htmlFor="school">Skole</label>
            <input id="school" name="school" type="text" value={newClass.school} onChange={handleInputChange} />
          </div>
          <div>
            <label htmlFor="students">Antal elever</label>
            <input id="students" name="students" type="number" value={newClass.students} onChange={handleInputChange} />
          </div>
          <button id={styles.closeForm} type="button" onClick={() => setFormVisible((old) => !old)}>
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-x-circle-fill" viewBox="0 0 16 16">
              <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM5.354 4.646a.5.5 0 1 0-.708.708L7.293 8l-2.647 2.646a.5.5 0 0 0 .708.708L8 8.707l2.646 2.647a.5.5 0 0 0 .708-.708L8.707 8l2.647-2.646a.5.5 0 0 0-.708-.708L8 7.293 5.354 4.646z" />
            </svg>
          </button>
          <button type="submit">Tilføj</button>
        </form>
      )}

      {myContexts.clickedClass === "Alle klasser" && (
        <>
          <div className={`${styles.classesGrid} ${formVisible ? styles.blurBackground : ""}`}>
            {myContexts.classes.map((theclass, index) => (
              <div className={styles.classContainer} key={index} onClick={() => handleClassClick(theclass.class)}>
                <div>
                  <p className={styles.class}>{theclass.class}</p>
                  <p className={styles.school}>{theclass.school}</p>
                </div>
                <p className={styles.students}>{theclass.students} elever</p>
              </div>
            ))}
          </div>
          <button className={styles.addClassButton} type="button" onClick={() => setFormVisible((old) => !old)}>
            {formVisible ? "Luk" : "Tilføj klasse"}
          </button>
        </>
      )}

      {myContexts.clickedClass !== "Alle klasser" && (
        <>
          {myContexts.classes.map((theclass, index) => {
            if (theclass.class === myContexts.clickedClass)
              return (
                <div className={styles.singleClassDetails} key={index}>
                  <div>
                    <p className={styles.class}>{theclass.class}</p>
                    <p className={styles.school}>{theclass.school}</p>
                  </div>
                  <p className={styles.students}>{theclass.students} Pishoveder</p>
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
