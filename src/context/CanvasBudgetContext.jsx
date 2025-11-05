import { createContext, useContext, useMemo, useState } from "react";

const CanvasBudgetContext = createContext({
  suspendAboveOf: null,
  setSuspendAboveOf: () => {},
  exclusiveSection: null,
  setExclusiveSection: () => {},
});

export const CanvasBudgetProvider = ({ children }) => {
  const [suspendAboveOf, setSuspendAboveOf] = useState(null); // number | null (legacy/optional)
  const [exclusiveSection, setExclusiveSection] = useState(null); // number | null
  const value = useMemo(
    () => ({ suspendAboveOf, setSuspendAboveOf, exclusiveSection, setExclusiveSection }),
    [suspendAboveOf, exclusiveSection]
  );
  return (
    <CanvasBudgetContext.Provider value={value}>
      {children}
    </CanvasBudgetContext.Provider>
  );
};

export const useCanvasBudget = () => useContext(CanvasBudgetContext);
