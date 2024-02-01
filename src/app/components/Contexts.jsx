"use client";

import { createContext, useState } from "react";

export const MyContexts = createContext();
export const SetMyContexts = createContext();

function Contexts({ children }) {
  const [myContexts, setMyContexts] = useState({
    loggedIn: true,
    loginType: "login",
    dashboardType: "Hjem",
    user: {
      name: "Abraham",
      lastName: "Lincoln",
      email: "abe.lincoln@hotmail.com",
      phone: 69420420,
    },
  });

  return (
    <SetMyContexts.Provider value={setMyContexts}>
      <MyContexts.Provider value={myContexts}>{children}</MyContexts.Provider>
    </SetMyContexts.Provider>
  );
}

export default Contexts;
