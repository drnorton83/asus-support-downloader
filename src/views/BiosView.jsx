import { useState, useMemo, useEffect } from 'react';
import { Paper, Box, Typography, Alert } from '@mui/material';
import axios from 'axios';
import FilterControls from '../components/FilterControls';
import FileTable from '../components/FileTable';
import LoadingSkeleton from '../components/LoadingSkeleton';

import {useApp} from "../context/UseApp.jsx";

export default function BiosView() {
  const { model, shouldFetch, biosData, setBiosData } = useApp();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showOnlyReleased, setShowOnlyReleased] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');

  const fetchData = async () => {
    if (!model.trim()) {
      setError('Please enter a model name');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await axios.get('/api/GetPDBIOS', {
        params: {
          website: 'us',
          model: model.trim(),
        },
      });

      if (response.data?.Result) {
        setBiosData(response.data.Result);
      } else {
        setError('No data found for this model');
        setBiosData(null);
      }
    } catch (err) {
      setError(err.message || 'Failed to fetch data');
      setBiosData(null);
    } finally {
      setLoading(false);
    }
  };

  // Listen for fetch trigger from global context
  useEffect(() => {
    if (shouldFetch) {
      fetchData();
    }
  }, [shouldFetch]);

  const filteredData = useMemo(() => {
    if (!biosData?.Obj) return [];

    let filtered = biosData.Obj;

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
  }, [biosData, selectedCategory, showOnlyReleased]);

  const allFiles = useMemo(() => {
    return filteredData.flatMap((category) =>
      category.Files.map((file) => ({
        ...file,
        categoryName: category.Name,
      }))
    );
  }, [filteredData]);

  const categories = useMemo(() => {
    if (!biosData?.Obj) return [];
    return biosData.Obj.map((cat) => cat.Name);
  }, [biosData]);

  if (loading) {
    return <LoadingSkeleton />;
  }

  return (
    <>
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {biosData && (
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
                Total files: {allFiles.length}
              </Typography>
            </Box>

            <FileTable files={allFiles} />
          </Paper>
        </>
      )}
    </>
  );
}
