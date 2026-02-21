import { useState, useMemo, useEffect } from 'react';
import {
  Paper,
  Box,
  Typography,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import axios from 'axios';
import FilterControls from '../components/FilterControls';
import FileTable from '../components/FileTable';
import LoadingSkeleton from '../components/LoadingSkeleton';

import {useApp} from "../context/UseApp.jsx";

export default function DriversView() {
  const {
    model,
    shouldFetch,
    driversData,
    setDriversData,
    osList,
    setOsList,
    selectedOS,
    setSelectedOS,
  } = useApp();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showOnlyReleased, setShowOnlyReleased] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [loadingOS, setLoadingOS] = useState(false);
  const [osListFetched, setOsListFetched] = useState(false);

  const fetchOSList = async () => {
    if (!model.trim()) {
      setError('Please enter a model name');
      return;
    }

    setLoadingOS(true);
    setError(null);
    setOsList([]);
    setSelectedOS('');
    setDriversData(null);
    setOsListFetched(false);

    try {
      const response = await axios.get('/api/GetPDOS', {
        params: {
          website: 'us',
          model: model.trim(),
        },
      });

      if (response.data?.Result?.Obj && response.data.Result.Obj.length > 0) {
        setOsList(response.data.Result.Obj);
        setSelectedOS(response.data.Result.Obj[0].Id);
        setOsListFetched(true);
      } else {
        setError('No operating systems found for this model');
        setOsList([]);
      }
    } catch (err) {
      console.error('Error fetching OS list:', err);
      setError(err.message || 'Failed to fetch OS list');
      setOsList([]);
    } finally {
      setLoadingOS(false);
    }
  };

  const fetchDrivers = async (osId) => {
    if (!model.trim()) {
      setError('Please enter a model name');
      return;
    }

    if (!osId) {
      setError('Please select an operating system');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await axios.get('/api/GetPDDrivers', {
        params: {
          website: 'us',
          model: model.trim(),
          osid: osId,
        },
      });

      if (response.data?.Result) {
        setDriversData(response.data.Result);
      } else {
        setError('No drivers found for this model and OS');
        setDriversData(null);
      }
    } catch (err) {
      setError(err.message || 'Failed to fetch drivers');
      setDriversData(null);
    } finally {
      setLoading(false);
    }
  };

  // Listen for fetch trigger from global context
  useEffect(() => {
    if (shouldFetch) {
      fetchOSList();
    }
  }, [shouldFetch]);

  // Auto-fetch drivers when OS is selected (after OS list is loaded)
  useEffect(() => {
    if (selectedOS && osListFetched) {
      fetchDrivers(selectedOS);
    }
  }, [selectedOS]);

  const handleOSChange = (newOS) => {
    setSelectedOS(newOS);
  };

  const filteredData = useMemo(() => {
    if (!driversData?.Obj) return [];

    let filtered = driversData.Obj;

    if (selectedCategory !== 'all') {
      filtered = filtered.filter((cat) => cat.Name === selectedCategory);
    }

    if (showOnlyReleased) {
      filtered = filtered.map((cat) => ({
        ...cat,
        Files: cat.Files.filter((file) => file.IsRelease === '1'),
      }));
    }

    return filtered;
  }, [driversData, selectedCategory, showOnlyReleased]);

  const allFiles = useMemo(() => {
    return filteredData.flatMap((category) =>
      category.Files.map((file) => ({
        ...file,
        categoryName: category.Name,
      }))
    );
  }, [filteredData]);

  const categories = useMemo(() => {
    if (!driversData?.Obj) return [];
    return driversData.Obj.map((cat) => cat.Name);
  }, [driversData]);

  if (loadingOS || loading) {
    return <LoadingSkeleton />;
  }

  return (
    <>
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {osListFetched && (
        <Paper sx={{ p: 3, mb: 3 }}>
          <FormControl fullWidth>
            <InputLabel>Operating System</InputLabel>
            <Select
              value={selectedOS}
              onChange={(e) => handleOSChange(e.target.value)}
              label="Operating System"
            >
              {osList.map((os) => (
                <MenuItem key={os.Id} value={os.Id}>
                  {os.Name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Paper>
      )}

      {driversData && (
        <>
          <Paper sx={{ p: 3, mb: 3 }}>
            <FilterControls
              showOnlyReleased={showOnlyReleased}
              onShowOnlyReleasedChange={setShowOnlyReleased}
              selectedCategory={selectedCategory}
              onCategoryChange={setSelectedCategory}
              categories={categories}
            />
          </Paper>

          <Paper sx={{ p: 3 }}>
            <Box sx={{ mb: 2 }}>
              <Typography variant="h5" gutterBottom>
                Results for: {model}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {selectedOS && (
                  <>OS: {osList.find((os) => os.Id === selectedOS)?.Name} | </>
                )}
                Total files: {allFiles.length}
              </Typography>
            </Box>

            <FileTable files={allFiles} emphasizeTitle={true} />
          </Paper>
        </>
      )}
    </>
  );
}
