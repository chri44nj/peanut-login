"use client";
import { useContext, useEffect } from "react";
import { useSession } from "next-auth/react";
import axios from "axios";
import styles from "../styles/DashboardAccount.module.css";
import { MyContexts, SetMyContexts } from "./Contexts";

function DashboardAccount() {
  /* Contexts */
  const myContexts = useContext(MyContexts);
  const myContextsDispatch = useContext(SetMyContexts);

  /* Effects */
  const { data: session } = useSession();

  useEffect(() => {
    if (session) {
      fetchTeacherData();
    }
  }, [session]);

  useEffect(() => {
    fetchClasses();
  }, [myContexts.teacherData.classesIDs]);

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

      const updatedTeacherData = {
        id: response.data._id,
        name: response.data.name,
        email: response.data.email,
        phone: response.data.phone,
        school: response.data.school,
        subjects: response.data.subjects,
        classesIDs: response.data.classes,
        accountType: response.data.accountType,
      };

      console.log("Heell yeah?");

      myContextsDispatch((old) => ({
        ...old,
        teacherData: {
          ...old.teacherData,
          ...updatedTeacherData,
        },
      }));
    } catch (error) {
      console.error("Error fetching teacher data:", error);
    }
  };

  const fetchClasses = async () => {
    if (myContexts.teacherData.id) {
      const classes = await axios.get(`https://skillzy-node.fly.dev/api/get-teacher-classes`, {
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
    }
  };

  /* Other */

  return (
    <div className={styles.homeContainer}>
      <h2 className={styles.name}>{session?.user?.name}</h2>
      <p>{session?.user?.email}</p>
      <p className={styles.phone}>+45 {myContexts.teacherData.phone}</p>
      <p className={styles.school}>
        {myContexts.teacherData.accountType} <span className={styles.lowercase}>på</span> {myContexts.teacherData.school}
      </p>
      {myContexts.teacherData.subjects ? (
        <p className={styles.subjects}>
          {myContexts.teacherData.subjects.map((subject, index) => (
            <span key={index}>{subject} </span>
          ))}
        </p>
      ) : (
        ""
      )}
      <a className="hover-link" href="#dashboardContainer" onClick={() => switchDashboardType("Dine klasser")}>
        {myContexts.teacherData.classesIDs.length} klasser
      </a>
    </div>
  );
}

export default DashboardAccount;
