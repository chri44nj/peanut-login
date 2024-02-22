"use client";

import { createContext, useState } from "react";

export const MyContexts = createContext();
export const SetMyContexts = createContext();

const listOfStudents = [{ name: "James Wan" }, { name: "LeBron James" }, { name: "Francis McDermott" }, { name: "Christopher Walken" }, { name: "Peter Hitchens" }, { name: "Tilda Swinton" }, { name: "James Wan" }, { name: "LeBron James" }, { name: "Francis McDermott" }, { name: "Christopher Walken" }, { name: "Peter Hitchens" }, { name: "Tilda Swinton" }, { name: "James Wan" }, { name: "LeBron James" }, { name: "Francis McDermott" }, { name: "Christopher Walken" }, { name: "Peter Hitchens" }, { name: "Tilda Swinton" }, { name: "James Wan" }, { name: "LeBron James" }, { name: "Francis McDermott" }, { name: "Christopher Walken" }, { name: "Peter Hitchens" }, { name: "Tilda Swinton" }];

function Contexts({ children }) {
  const [myContexts, setMyContexts] = useState({
    loginType: "login",
    dashboardType: "Velkommen hjem",
    selectedClass: "",
    clickedClass: "Alle klasser",
    selectedStudent: "Alle elever",
    teacherData: { name: "", email: "", phone: "", school: "", subjects: [], classesIDs: [], classes: [], accountType: "" },
  });

  return (
    <SetMyContexts.Provider value={setMyContexts}>
      <MyContexts.Provider value={myContexts}>{children}</MyContexts.Provider>
    </SetMyContexts.Provider>
  );
}

export default Contexts;
