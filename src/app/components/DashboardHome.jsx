import { useContext } from "react";

import styles from "../styles/DashboardHome.module.css";

import { MyContexts, SetMyContexts } from "./Contexts";

function DashboardHome() {
  /* Contexts */
  const myContexts = useContext(MyContexts);
  const myContextsDispatch = useContext(SetMyContexts);

  return (
    <div className={styles.homeContainer}>
      <h2>
        Velkommen tilbage, {myContexts.user.name} {myContexts.user.lastName}!
      </h2>
      <p>{myContexts.user.email}</p>
      <p>+45 {myContexts.user.phone}</p>
      <p>{myContexts.user.school}</p>
      <p>
        {myContexts.user.subjects.map((subject, index) => (
          <span key={index}>{subject.name} </span>
        ))}
      </p>
    </div>
  );
}

export default DashboardHome;
