import styles from "../styles/DashboardClasses.module.css";

function DashboardClasses() {
  return (
    <div className={styles.classesContainer}>
      <div className={styles.classContainer}>
        <div>
          <p className={styles.class}>4.a</p>
          <p>Jyderup Skole</p>
        </div>
        <p>24 elever</p>
      </div>
      <div className={styles.classContainer}>
        <div>
          <p className={styles.class}>4.b</p>
          <p>Jyderup Skole</p>
        </div>
        <p>21 elever</p>
      </div>
      <div className={styles.classContainer}>
        <div>
          <p className={styles.class}>4.c</p>
          <p>Jyderup Skole</p>
        </div>
        <p>25 elever</p>
      </div>
      <div className={styles.classContainer}>
        <div>
          <p className={styles.class}>5.a</p>
          <p>Jyderup Skole</p>
        </div>
        <p>24 elever</p>
      </div>
      <div className={styles.classContainer}>
        <div>
          <p className={styles.class}>5.b</p>
          <p>Jyderup Skole</p>
        </div>
        <p>27 elever</p>
      </div>
      <div className={styles.classContainer}>
        <div>
          <p className={styles.class}>6.b</p>
          <p>Jyderup Skole</p>
        </div>
        <p>32 elever</p>
      </div>
      <div className={styles.classContainer}>
        <div>
          <p className={styles.class}>6.c</p>
          <p>Jyderup Skole</p>
        </div>
        <p>21 elever</p>
      </div>
    </div>
  );
}

export default DashboardClasses;
