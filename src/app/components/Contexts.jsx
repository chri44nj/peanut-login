"use client";

import { createContext, useState } from "react";

export const MyContexts = createContext();
export const SetMyContexts = createContext();

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
      { class: "4.a", school: "Jyderup Skole", students: 24, bestSubject: "Brøker", worstSubject: "Division" },
      { class: "4.b", school: "Jyderup Skole", students: 23, bestSubject: "Division", worstSubject: "Brøker" },
      { class: "4.c", school: "Jyderup Skole", students: 28, bestSubject: "Addition", worstSubject: "Subtraktion" },
      { class: "5.b", school: "Jyderup Skole", students: 32, bestSubject: "Subtraktion", worstSubject: "Division" },
      { class: "6.a", school: "Jyderup Skole", students: 30, bestSubject: "Brøker", worstSubject: "Division" },
    ],
    selectedClass: "",
    clickedClass: "Alle klasser",
  });

  return (
    <SetMyContexts.Provider value={setMyContexts}>
      <MyContexts.Provider value={myContexts}>{children}</MyContexts.Provider>
    </SetMyContexts.Provider>
  );
}

export default Contexts;
