import { useState, useMemo, useEffect, useRef } from 'react';
import { Link, Outlet, useLocation } from 'react-router';
import {
  ThemeProvider,
  createTheme,
  CssBaseline,
  Container,
  Box,
  Typography,
  IconButton,
  Tabs,
  Tab,
  Paper,
  TextField,
  Button,
} from '@mui/material';
import { Brightness4, Brightness7 } from '@mui/icons-material';

import {useApp} from "../context/UseApp.jsx";

export default function Layout() {
  const [darkMode, setDarkMode] = useState(true);
  const location = useLocation();
  const { model, setModel, triggerFetch } = useApp();
  const previousTab = useRef(null);

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: darkMode ? 'dark' : 'light',
        },
      }),
    [darkMode]
  );

  const getCurrentTab = () => {
    if (location.pathname === '/drivers') return 'drivers';
    if (location.pathname === '/manuals') return 'manuals';
    return 'bios';
  };

  // Auto-fetch when tab changes (but not on initial mount)
  useEffect(() => {
    const currentTab = getCurrentTab();
    if (previousTab.current !== null && previousTab.current !== currentTab && model.trim()) {
      triggerFetch();
    }
    previousTab.current = currentTab;
  }, [location.pathname]);

  const handleFetch = () => {
    if (model.trim()) {
      triggerFetch();
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleFetch();
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mb: 4,
          }}
        >
          <Typography variant="h3" component="h1">
            ASUS Support Downloader
          </Typography>
          <IconButton onClick={() => setDarkMode(!darkMode)} color="inherit">
            {darkMode ? <Brightness7 /> : <Brightness4 />}
          </IconButton>
        </Box>

        <Paper sx={{ p: 3, mb: 3 }}>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <TextField
              fullWidth
              label="Model Name"
              value={model}
              onChange={(e) => setModel(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="e.g., ROG STRIX X870E-E GAMING WIFI"
            />
            <Button
              variant="contained"
              onClick={handleFetch}
              disabled={!model.trim()}
              sx={{ minWidth: 120 }}
            >
              Fetch
            </Button>
          </Box>
        </Paper>

        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
          <Tabs value={getCurrentTab()}>
            <Tab label="BIOS/Firmware" value="bios" component={Link} to="/" />
            <Tab label="Drivers" value="drivers" component={Link} to="/drivers" />
            <Tab label="Manuals" value="manuals" component={Link} to="/manuals" />
          </Tabs>
        </Box>

        <Outlet />
      </Container>
    </ThemeProvider>
  );
}
