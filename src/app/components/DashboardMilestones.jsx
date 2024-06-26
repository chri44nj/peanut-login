"use client";
import { useContext, useEffect } from "react";
import axios from "axios";
import styles from "../styles/DashboardMilestones.module.css";
import { MyContexts, SetMyContexts } from "./Contexts";

function DashboardMilestones() {
  /* Contexts */
  const myContexts = useContext(MyContexts);
  const myContextsDispatch = useContext(SetMyContexts);

  /* States */

  /* Effects */

  useEffect(() => {
    fetchClasses();
  }, [myContexts.teacherData.classesIDs]);

  /* Functions */
  const handleClassChange = (e) => {
    myContextsDispatch((prevContexts) => ({
      ...prevContexts,
      selectedClass: e.target.value,
    }));
  };

  const fetchClasses = async () => {
    const classes = await axios.get(`${process.env.NEXT_PUBLIC_SKILLZY_SERVER}get-teacher-classes`, {
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

  return (
    <div className={styles.milestonesContainer}>
      {myContexts.teacherData.classesIDs.length > 0 ? (
        <div className={styles.classes}>
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
      ) : (
        <div className={styles.addClassContainer}>
          <p>Tilføj klasser til din profil, for at kunne sætte milepæle for dine klasser!</p>
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
      )}
    </div>
  );
}

export default DashboardMilestones;
