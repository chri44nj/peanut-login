import { useState } from "react";
import styles from "../styles/DashboardClasses.module.css";

function DashboardClasses() {
  const [formVisible, setFormVisible] = useState(false);
  const [newClass, setNewClass] = useState({
    klasse: "",
    skole: "",
    elever: "",
  });
  const [mineKlasser, setMineKlasser] = useState([
    { klasse: "4.a", skole: "Jyderup Skole", elever: 24 },
    { klasse: "4.b", skole: "Jyderup Skole", elever: 23 },
    { klasse: "4.c", skole: "Jyderup Skole", elever: 28 },
    { klasse: "5.b", skole: "Jyderup Skole", elever: 32 },
    { klasse: "6.a", skole: "Jyderup Skole", elever: 30 },
  ]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewClass((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    setMineKlasser((prevClasses) => [...prevClasses, newClass]);
    setNewClass({ klasse: "", skole: "", elever: "" });
    setFormVisible(false);
  };

  return (
    <>
      <button className={styles.addClassButton} type="button" onClick={() => setFormVisible((old) => !old)}>
        {formVisible ? "Luk" : "Tilføj klasse"}
      </button>
      <p className={styles.classesNumber}>Antal klasser: {mineKlasser.length}</p>
      {formVisible && (
        <form anchor="addClass" className={styles.addClass} onSubmit={handleFormSubmit}>
          <div>
            <label htmlFor="className">Klasse</label>
            <input id="className" name="klasse" type="text" value={newClass.klasse} onChange={handleInputChange} />
          </div>
          <div>
            <label htmlFor="school">Skole</label>
            <input id="school" name="skole" type="text" value={newClass.skole} onChange={handleInputChange} />
          </div>
          <div>
            <label htmlFor="students">Antal elever</label>
            <input id="students" name="elever" type="number" value={newClass.elever} onChange={handleInputChange} />
          </div>
          <button id={styles.closeForm} type="button" onClick={() => setFormVisible((old) => !old)}>
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-x-circle-fill" viewBox="0 0 16 16">
              <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM5.354 4.646a.5.5 0 1 0-.708.708L7.293 8l-2.647 2.646a.5.5 0 0 0 .708.708L8 8.707l2.646 2.647a.5.5 0 0 0 .708-.708L8.707 8l2.647-2.646a.5.5 0 0 0-.708-.708L8 7.293 5.354 4.646z" />
            </svg>
          </button>
          <button type="submit">Tilføj</button>
        </form>
      )}
      <div id="addClass" className={`${styles.classesContainer} ${formVisible ? styles.blurBackground : ""}`}>
        {mineKlasser.map((klasse, index) => (
          <div className={styles.classContainer} key={index}>
            <div>
              <p className={styles.class}>{klasse.klasse}</p>
              <p className={styles.school}>{klasse.skole}</p>
            </div>
            <p className={styles.students}>{klasse.elever} elever</p>
          </div>
        ))}
      </div>
    </>
  );
}

export default DashboardClasses;
