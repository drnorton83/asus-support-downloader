import { createContext, useContext, useState, useCallback } from 'react';

const AppContext = createContext();

export function AppProvider({ children }) {
  const [model, setModel] = useState('ROG STRIX X870E-E GAMING WIFI');
  const [shouldFetch, setShouldFetch] = useState(false);

  // Persistent data for each view
  const [biosData, setBiosData] = useState(null);
  const [driversData, setDriversData] = useState(null);
  const [manualsData, setManualsData] = useState(null);
  const [osList, setOsList] = useState([]);
  const [selectedOS, setSelectedOS] = useState('');

  const triggerFetch = useCallback(() => {
    setShouldFetch(true);
    // Reset after triggering
    setTimeout(() => setShouldFetch(false), 100);
  }, []);

  const clearBiosData = useCallback(() => {
    setBiosData(null);
  }, []);

  const clearDriversData = useCallback(() => {
    setDriversData(null);
    setOsList([]);
    setSelectedOS('');
  }, []);

  const clearManualsData = useCallback(() => {
    setManualsData(null);
  }, []);

  return (
    <AppContext.Provider
      value={{
        model,
        setModel,
        shouldFetch,
        triggerFetch,
        biosData,
        setBiosData,
        driversData,
        setDriversData,
        manualsData,
        setManualsData,
        osList,
        setOsList,
        selectedOS,
        setSelectedOS,
        clearBiosData,
        clearDriversData,
        clearManualsData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
}
