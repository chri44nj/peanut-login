"use client";

import { createContext, useState } from "react";

export const LoggedInContext = createContext();
export const SetLoggedInContext = createContext();

function Contexts({ children }) {
  const [loggedIn, setLoggedIn] = useState(true);

  return (
    <SetLoggedInContext.Provider value={setLoggedIn}>
      <LoggedInContext.Provider value={loggedIn}>{children}</LoggedInContext.Provider>
    </SetLoggedInContext.Provider>
  );
}

export default Contexts;
