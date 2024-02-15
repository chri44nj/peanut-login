"use client";
import { useContext, useEffect } from "react";
import { useSession } from "next-auth/react";
import axios from "axios";

import styles from "../styles/DashboardHome.module.css";

import { MyContexts, SetMyContexts } from "./Contexts";

function DashboardHome() {
  /* Contexts */
  const myContexts = useContext(MyContexts);
  const myContextsDispatch = useContext(SetMyContexts);

  /* Effects */
  useEffect(() => {
    if (session) {
      fetchTeacherData();
      console.log("Kører første gang");
    }
  }, []);

  /* Functions */
  function switchDashboardType(dashboardType) {
    myContextsDispatch((old) => ({
      ...old,
      dashboardType: dashboardType,
      clickedClass: "Alle klasser",
    }));
  }

  const fetchTeacherData = async () => {
    try {
      const response = await axios.get("https://skillzy-node.fly.dev/api/get-teacher", {
        params: { email: session?.user?.email },
      });

      // Map the response data to the structure of teacherData in the context
      const updatedTeacherData = {
        name: response.data.name,
        email: response.data.email,
        phone: response.data.phone,
        school: response.data.school,
        subjects: response.data.subjects,
        classes: response.data.classes,
        accountType: response.data.accountType,
      };

      // Update teacherData in the context with the mapped data
      myContextsDispatch((old) => ({
        ...old,
        teacherData: updatedTeacherData,
      }));

      // Now, when you log teacherData, it should reflect the updated data
      console.log("Updated teacherData:", updatedTeacherData);
    } catch (error) {
      console.error("Error fetching teacher data:", error);
    }
  };

  /* Other */
  const { data: session } = useSession();
  console.log("Session:", session);
  return (
    <div className={styles.homeContainer}>
      <h2 className={styles.name}>{session?.user?.name}</h2>
      <p>{session?.user?.email}</p>
      <p className={styles.phone}>+45 {myContexts.teacherData.phone}</p>
      <p className={styles.school}>
        {myContexts.teacherData.accountType} <span className={styles.lowercase}>på</span> {myContexts.teacherData.school}
      </p>
      {myContexts.user.subjects ? (
        <p className={styles.subjects}>
          {myContexts.teacherData.subjects.map((subject, index) => (
            <span key={index}>{subject} </span>
          ))}
        </p>
      ) : (
        ""
      )}
      <a className="hover-link" href="#dashboardContainer" onClick={() => switchDashboardType("Dine klasser")}>
        {myContexts.classes.length} klasser
      </a>
    </div>
  );
}

export default DashboardHome;
