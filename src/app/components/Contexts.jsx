"use client";
import { createContext, useState } from "react";
export const MyContexts = createContext();
export const SetMyContexts = createContext();

function Contexts({ children }) {
  const [myContexts, setMyContexts] = useState({
    loginType: "login",
    dashboardType: "Statistik",
    selectedClass: "",
    clickedClass: "Alle klasser",
    selectedStudent: "Alle elever",
    teacherData: { id: "", name: "", email: "", phone: "", school: "", subjects: [], classesIDs: [], classes: [], accountType: "" },
  });

  return (
    <SetMyContexts.Provider value={setMyContexts}>
      <MyContexts.Provider value={myContexts}>{children}</MyContexts.Provider>
    </SetMyContexts.Provider>
  );
}

export default Contexts;
