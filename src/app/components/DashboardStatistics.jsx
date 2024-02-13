"use client";
import { useContext, useState, useEffect } from "react";
import styles from "../styles/DashboardStatistics.module.css";
import { MyContexts, SetMyContexts } from "./Contexts";

function DashboardStatistics() {
  /* Contexts */
  const myContexts = useContext(MyContexts);
  const myContextsDispatch = useContext(SetMyContexts);

  /* States */
  const [selectedClass, setSelectedClass] = useState("");
  const [chosenSubject, setChosenSubject] = useState("Alle emner");

  /* Effects */
  useEffect(() => {
    if (myContexts.selectedClass) {
      const findSelectedClass = myContexts.classes.find((theclass) => theclass.class === myContexts.selectedClass);
      setSelectedClass(findSelectedClass || null);
    } else {
      setSelectedClass(myContexts.classes.length > 0 ? myContexts.classes[0] : null);
    }
  }, [myContexts.selectedClass]);

  /* Functions */
  const handleClassChange = (event) => {
    const className = event.target.value;
    myContextsDispatch((prevContexts) => ({
      ...prevContexts,
      selectedClass: className,
    }));
  };

  const handleSubjectChange = (event) => {
    const subjectName = event.target.value;
    setChosenSubject(subjectName);
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
    <div className={styles.statisticsContainer}>
      <div className={styles.classes}>
        <div>
          <select className={styles.dropdown} id="classes" name="classes" value={myContexts.selectedClass} onChange={handleClassChange}>
            {myContexts.classes.map((theclass, index) => (
              <option className={styles.dropdownClass} key={index} value={theclass.class}>
                {theclass.class}
              </option>
            ))}
          </select>
        </div>
        <div>
          <select className={styles.dropdown} id="subjects" name="subjects" onChange={handleSubjectChange}>
            <option className={styles.dropdownClass}>Alle emner</option>
            <option className={styles.dropdownClass}>Addition</option>
            <option className={styles.dropdownClass}>Subtraktion</option>
            <option className={styles.dropdownClass}>Multiplikation</option>
            <option className={styles.dropdownClass}>Division</option>
            <option className={styles.dropdownClass}>Brøkregning</option>
          </select>
        </div>
      </div>

      {selectedClass ? (
        <div className={styles.selectedClassContainer}>
          <div className={`${styles.classOverview} ${styles.overviewSubject}`}>
            <div className={styles.overviewTop}>
              <h2>{chosenSubject}</h2>
            </div>
            <p className={styles.marginTop}>Altid</p>
            <div className={styles.overviewBottomFlex2}>
              <div className={styles.overviewFlex}>
                <p className={`${styles.bold} ${styles.bigStat}`}>{selectedClass.students * 50}</p>
                <div className={styles.overviewFlex2}>
                  {pen16}
                  <p>Opgaver</p>
                </div>
              </div>
              <div className={styles.overviewFlex}>
                <p className={`${styles.bold} ${styles.bigStat}`}>{selectedClass.students * 23}</p>
                <div className={styles.overviewFlex2}>
                  {clock16}
                  <p>Minutter</p>
                </div>
              </div>
              <div className={styles.overviewFlex}>
                <p className={`${styles.bold} ${styles.bigStat}`}>{selectedClass.students * 3}%</p>
                <div className={styles.overviewFlex2}>
                  {thumbs16}
                  <p>Korrekt</p>
                </div>
              </div>
            </div>
            <p>Seneste 7 dage</p>
            <div className={styles.overviewBottomFlex2}>
              <div className={styles.overviewFlex}>
                <p className={`${styles.bold} ${styles.bigStat}`}>{selectedClass.students * 10}</p>
                <div className={styles.overviewFlex2}>
                  {pen16}
                  <p>Opgaver</p>
                </div>
              </div>
              <div className={styles.overviewFlex}>
                <p className={`${styles.bold} ${styles.bigStat}`}>{selectedClass.students * 3}</p>
                <div className={styles.overviewFlex2}>
                  {clock16}
                  <p>Minutter</p>
                </div>
              </div>
              <div className={styles.overviewFlex}>
                <p className={`${styles.bold} ${styles.bigStat}`}>86%</p>
                <div className={styles.overviewFlex2}>
                  {thumbs16}
                  <p>Korrekt</p>
                </div>
              </div>
            </div>
          </div>

          <div className={`${styles.classOverview} ${styles.overviewClass}`}>
            <div className={styles.overviewTop}>
              <h2>Klasse</h2>
            </div>
            <div className={styles.overviewBottomFlex}>
              <div className={styles.overviewBottomGrid}>
                <div className={styles.overviewFlex}>
                  <p className={`${styles.bold} ${styles.bigStat}`}>{selectedClass.students}</p>
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
                  <p className={`${styles.bold} ${styles.bigStat}`}>{selectedClass.students - 3}</p>
                  <p>Aktive elever</p>
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
                  <p className={`${styles.bold} ${styles.bigStat}`}>{selectedClass.students * 2.5}%</p>
                  <p>Korrekt</p>
                </div>
                <div className={styles.overviewBottomGrid2}>
                  <div>
                    <div className={styles.overviewFlex2}>
                      {book16}
                      <p>{selectedClass.bestSubject}</p>
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
                  <div>
                    <br />
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
                  <p className={`${styles.bold} ${styles.bigStat}`}>{selectedClass.students * 1.5}%</p>
                  <p>Korrekt</p>
                </div>
                <div className={styles.overviewBottomGrid2}>
                  <div>
                    <div className={styles.overviewFlex2}>
                      {book16}
                      <p>{selectedClass.worstSubject}</p>
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
                  <div>
                    <br />
                    <p>77</p>
                    <p>108</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <p>Det ser ud til, du ikke har nogle klasser forbundet endnu. Tilføj nu!</p>
      )}
    </div>
  );
}

export default DashboardStatistics;
