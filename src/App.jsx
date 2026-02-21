import { BrowserRouter, Routes, Route } from 'react-router';
import { AppProvider } from './context/AppContext';
import Layout from './components/Layout';
import BiosView from './views/BiosView';
import DriversView from './views/DriversView';
import ManualsView from './views/ManualsView';
import './App.css';

function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<BiosView />} />
            <Route path="drivers" element={<DriversView />} />
            <Route path="manuals" element={<ManualsView />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AppProvider>
  );
}

export default App;
