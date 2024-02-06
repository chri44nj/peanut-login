import { useContext, useState, useEffect } from "react";
import styles from "../styles/DashboardStatistics.module.css";
import { MyContexts, SetMyContexts } from "./Contexts";

function DashboardStatistics() {
  /* Contexts */
  const myContexts = useContext(MyContexts);
  const myContextsDispatch = useContext(SetMyContexts);

  /* States */
  const [chosenClass, setChosenClass] = useState("");
  const [chosenSubject, setChosenSubject] = useState("Alle emner");

  /* Effects */
  useEffect(() => {
    if (myContexts.chosenClass) {
      const findChosenClass = myContexts.classes.find((theclass) => theclass.class === myContexts.chosenClass);
      setChosenClass(findChosenClass || null);
    } else {
      setChosenClass(myContexts.classes.length > 0 ? myContexts.classes[0] : null);
    }
  }, [myContexts.chosenClass]);

  /* Functions */
  const handleClassChange = (event) => {
    const className = event.target.value;
    myContextsDispatch((prevContexts) => ({
      ...prevContexts,
      chosenClass: className,
    }));
  };

  const handleSubjectChange = (event) => {
    const subjectName = event.target.value;
    setChosenSubject(subjectName);
  };

  return (
    <div className={styles.statisticsContainer}>
      <div className={styles.classes}>
        <div>
          <h2 className={styles.chooseClass}>Klasse</h2>
          <select className={styles.classesDropdown} id="classes" name="classes" value={myContexts.chosenClass} onChange={handleClassChange}>
            {myContexts.classes.map((theclass, index) => (
              <option className={styles.dropdownClass} key={index} value={theclass.class}>
                {theclass.class}
              </option>
            ))}
          </select>
        </div>
        <div>
          <h2 className={styles.chooseClass}>Emne</h2>
          <select className={styles.classesDropdown} id="subjects" name="subjects" onChange={handleSubjectChange}>
            <option className={styles.dropdownClass}>Alle emner</option>
            <option className={styles.dropdownClass}>Addition</option>
            <option className={styles.dropdownClass}>Subtraktion</option>
            <option className={styles.dropdownClass}>Multiplikation</option>
            <option className={styles.dropdownClass}>Division</option>
            <option className={styles.dropdownClass}>Brøkregning</option>
          </select>
        </div>
      </div>

      {chosenClass ? (
        <div className={styles.chosenClassContainer}>
          <div className={`${styles.classOverview} ${styles.overviewClass}`}>
            <h2>Klasse</h2>
            <p>Navn: {chosenClass.class}</p>
            <p>Skole: {chosenClass.school}</p>
            <p>Bedste emne: {chosenClass.bestSubject}</p>
            <p>Sværeste emne: {chosenClass.worstSubject}</p>
          </div>
          <div className={`${styles.classOverview} ${styles.overviewStudents}`}>
            <h2>Elever</h2>
            <p>Antal: {chosenClass.students}</p>
            <p>Spørgsmål pr. dag: 16</p>
            <p>Tid pr. dag: 33 min</p>
          </div>
          <div className={`${styles.classOverview} ${styles.overviewSubject}`}>
            <h2>{chosenSubject}</h2>
            <p>Total spørgsmål: 1600</p>
            <p>Total tid: 330 min</p>
          </div>
        </div>
      ) : (
        <p>Det ser ud til, du ikke har nogle klasser forbundet endnu. Tilføj nu!</p>
      )}
    </div>
  );
}

export default DashboardStatistics;
