"use client";

import { createContext, useState } from "react";

export const MyContexts = createContext();
export const SetMyContexts = createContext();

const listOfStudents = [{ name: "James Wan" }, { name: "LeBron James" }, { name: "Francis McDermott" }, { name: "Christopher Walken" }, { name: "Peter Hitchens" }, { name: "Tilda Swinton" }, { name: "James Wan" }, { name: "LeBron James" }, { name: "Francis McDermott" }, { name: "Christopher Walken" }, { name: "Peter Hitchens" }, { name: "Tilda Swinton" }, { name: "James Wan" }, { name: "LeBron James" }, { name: "Francis McDermott" }, { name: "Christopher Walken" }, { name: "Peter Hitchens" }, { name: "Tilda Swinton" }, { name: "James Wan" }, { name: "LeBron James" }, { name: "Francis McDermott" }, { name: "Christopher Walken" }, { name: "Peter Hitchens" }, { name: "Tilda Swinton" }];

function Contexts({ children }) {
  const [myContexts, setMyContexts] = useState({
    loggedIn: false,
    loginType: "login",
    dashboardType: "Velkommen hjem",
    user: {
      accountType: "lærer",
      name: "abraham",
      lastName: "aincoln",
      email: "abe.lincoln@hotmail.com",
      phone: 69420420,
      school: "jyderup skole",
      subjects: [{ name: "matematik" }, { name: "fysik" }, { name: "biologi" }],
    },
    classes: [
      { id: "abcdefgh", grade: "4", letter: "a", name: "Jyderup Skole", joinCode: "34JKS5OS", students: 24, allStudents: listOfStudents, bestSubject: "Brøker", worstSubject: "Division" },
      { id: "abbdefgh", grade: "4", letter: "b", name: "Jyderup Skole", joinCode: "78IED37K", students: 23, allStudents: listOfStudents, bestSubject: "Division", worstSubject: "Brøker" },
      { id: "abbbefgh", grade: "4", letter: "c", name: "Jyderup Skole", joinCode: "99DJK69S", students: 28, allStudents: listOfStudents, bestSubject: "Addition", worstSubject: "Subtraktion" },
      { id: "abbbbfgh", grade: "5", letter: "a", name: "Jyderup Skole", joinCode: "13QWS47J", students: 32, allStudents: listOfStudents, bestSubject: "Subtraktion", worstSubject: "Division" },
      { id: "abbbbbgh", grade: "6", letter: "x", name: "Jyderup Skole", joinCode: "74OIR44X", students: 30, allStudents: listOfStudents, bestSubject: "Brøker", worstSubject: "Division" },
    ],
    selectedClass: "",
    clickedClass: "Alle klasser",
    selectedStudent: "Alle elever",
    teacherData: { name: "", email: "", phone: "", school: "", subjects: [], classes: [], accountType: "" },
  });

  return (
    <SetMyContexts.Provider value={setMyContexts}>
      <MyContexts.Provider value={myContexts}>{children}</MyContexts.Provider>
    </SetMyContexts.Provider>
  );
}

export default Contexts;
