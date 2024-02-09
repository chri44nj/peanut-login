"use client";
import { useState, useContext, useEffect } from "react";
import styles from "../styles/DashboardMilestones.module.css";
import { MyContexts, SetMyContexts } from "./Contexts";

function DashboardMilestones() {
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
  const handleClassChange = (event) => {
    const className = event.target.value;
    myContextsDispatch((prevContexts) => ({
      ...prevContexts,
      chosenClass: className,
    }));
  };

  return (
    <div className={styles.milestonesContainer}>
      <div className={styles.classes}>
        <select className={styles.dropdown} id="classes" name="classes" value={myContexts.chosenClass} onChange={handleClassChange}>
          {myContexts.classes.map((theclass, index) => (
            <option className={styles.dropdownClass} key={index} value={theclass.class}>
              {theclass.class}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}

export default DashboardMilestones;
