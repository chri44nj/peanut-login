"use client";

import { createContext, useState } from "react";

export const TestContext = createContext();
export const SetTestContext = createContext();

function Contexts({ children }) {
  const [test, setTest] = useState(false);

  return (
    <SetTestContext.Provider value={setTest}>
      <TestContext.Provider value={test}>{children}</TestContext.Provider>
    </SetTestContext.Provider>
  );
}

export default Contexts;
