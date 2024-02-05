import { useContext, useState, useEffect } from "react";
import styles from "../styles/DashboardStatistics.module.css";
import { MyContexts, SetMyContexts } from "./Contexts";

function DashboardStatistics() {
  /* Contexts */
  const myContexts = useContext(MyContexts);
  const myContextsDispatch = useContext(SetMyContexts);

  /* States */
  const [chosenClass, setChosenClass] = useState("");

  /* Effects */
  useEffect(() => {
    const findChosenClass = myContexts.classes.find((theclass) => theclass.class === myContexts.chosenClass);
    setChosenClass(findChosenClass || null);
  }, [myContexts.chosenClass]);

  /* Functions */
  const handleClassClick = (event) => {
    // Modify function to receive event
    const className = event.target.value; // Get selected value from event
    myContextsDispatch((prevContexts) => ({
      ...prevContexts,
      chosenClass: className,
    }));
  };

  return (
    <div className={styles.statisticsContainer}>
      <div className={styles.classes}>
        <p className={styles.chooseClass}>Vælg klasse</p>
        <select className={styles.classesDropdown} id="classes" name="classes" onChange={handleClassClick}>
          {myContexts.classes.map((theclass, index) => (
            <option className={styles.dropdownClass} key={index} value={theclass.name}>
              {theclass.class}
            </option>
          ))}
        </select>
      </div>

      {chosenClass ? (
        <>
          <div className={styles.chosenClass}>
            <p>Klasse: {chosenClass.class}</p>
            <p>Skole: {chosenClass.school}</p>
            <p>Elever: {chosenClass.students}</p>
            <p>Bedste emne: {chosenClass.bestSubject}</p>
            <p>Værste emne: {chosenClass.worstSubject}</p>
          </div>
        </>
      ) : (
        ""
      )}
    </div>
  );
}

export default DashboardStatistics;
