"use client";
import { useState, useContext, useEffect } from "react";
import styles from "../styles/DashboardMilestones.module.css";
import { MyContexts, SetMyContexts } from "./Contexts";

function DashboardMilestones() {
  /* Contexts */
  const myContexts = useContext(MyContexts);
  const myContextsDispatch = useContext(SetMyContexts);

  /* States */
  const [selectedClass, setSelectedClass] = useState("");

  /* Effects */
  useEffect(() => {
    const findSelectedClass = myContexts.classes.find((theclass) => theclass.id === myContexts.selectedClass);
    setSelectedClass(findSelectedClass || null);
  }, [myContexts.selectedClass]);

  /* Functions */
  const handleClassChange = (event) => {
    const className = event.target.value;
    myContextsDispatch((prevContexts) => ({
      ...prevContexts,
      selectedClass: className,
    }));
  };

  return (
    <div className={styles.milestonesContainer}>
      <div className={styles.classes}>
        <select className={styles.dropdown} id="classes" name="classes" value={myContexts.selectedClass} onChange={handleClassChange}>
          {myContexts.classes.map((theclass, index) => (
            <option className={styles.dropdownClass} key={index} value={theclass.id}>
              {theclass.grade}.{theclass.letter}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}

export default DashboardMilestones;
