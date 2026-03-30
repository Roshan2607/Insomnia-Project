import React, { createContext, useContext, useState } from 'react';
import { defaults } from '../theme';

const AssessmentContext = createContext(null);

export function AssessmentProvider({ children }) {
  const [data, setData] = useState({ ...defaults });
  const [result, setResult] = useState(null);

  const setField = (key, value) => setData(d => ({ ...d, [key]: value }));
  const reset = () => { setData({ ...defaults }); setResult(null); };

  return (
    <AssessmentContext.Provider value={{ data, setField, result, setResult, reset }}>
      {children}
    </AssessmentContext.Provider>
  );
}

export const useAssessment = () => useContext(AssessmentContext);