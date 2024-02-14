"use client";

import { createContext, useState } from "react";

export const MyContexts = createContext();
export const SetMyContexts = createContext();

const listOfStudents = [{ name: "James Wan" }, { name: "LeBron James" }, { name: "Francis McDermott" }, { name: "Christopher Walken" }, { name: "Peter Hitchens" }, { name: "Tilda Swinton" }, { name: "James Wan" }, { name: "LeBron James" }, { name: "Francis McDermott" }, { name: "Christopher Walken" }, { name: "Peter Hitchens" }, { name: "Tilda Swinton" }, { name: "James Wan" }, { name: "LeBron James" }, { name: "Francis McDermott" }, { name: "Christopher Walken" }, { name: "Peter Hitchens" }, { name: "Tilda Swinton" }, { name: "James Wan" }, { name: "LeBron James" }, { name: "Francis McDermott" }, { name: "Christopher Walken" }, { name: "Peter Hitchens" }, { name: "Tilda Swinton" }];

function Contexts({ children }) {
  const [myContexts, setMyContexts] = useState({
    loggedIn: false,
    loginType: "login",
    dashboardType: "Hjem",
    user: {
      name: "Abraham",
      lastName: "Lincoln",
      email: "abe.lincoln@hotmail.com",
      phone: 69420420,
      school: "Jyderup Skole",
      subjects: [{ name: "Matematik" }, { name: "Fysik" }, { name: "Biologi" }],
    },
    classes: [
      { class: "4.a", school: "Jyderup Skole", joinCode: "34JKS5OS", students: 24, allStudents: listOfStudents, bestSubject: "Brøker", worstSubject: "Division" },
      { class: "4.b", school: "Jyderup Skole", joinCode: "78IED37K", students: 23, allStudents: listOfStudents, bestSubject: "Division", worstSubject: "Brøker" },
      { class: "4.c", school: "Jyderup Skole", joinCode: "99DJK69S", students: 28, allStudents: listOfStudents, bestSubject: "Addition", worstSubject: "Subtraktion" },
      { class: "5.b", school: "Jyderup Skole", joinCode: "13QWS47J", students: 32, allStudents: listOfStudents, bestSubject: "Subtraktion", worstSubject: "Division" },
      { class: "6.a", school: "Jyderup Skole", joinCode: "74OIR44X", students: 30, allStudents: listOfStudents, bestSubject: "Brøker", worstSubject: "Division" },
    ],
    selectedClass: "",
    clickedClass: "Alle klasser",
    selectedStudent: "Alle elever",
  });

  return (
    <SetMyContexts.Provider value={setMyContexts}>
      <MyContexts.Provider value={myContexts}>{children}</MyContexts.Provider>
    </SetMyContexts.Provider>
  );
}

export default Contexts;
