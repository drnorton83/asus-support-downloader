import {useCallback, useState} from 'react';
import {AppContext} from './UseApp.jsx';

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