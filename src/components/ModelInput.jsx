import { TextField, Button, CircularProgress, Box } from '@mui/material';

export default function ModelInput({
  model,
  onModelChange,
  onFetch,
  loading,
  buttonText = 'Fetch',
  onKeyPress,
}) {
  return (
    <Box sx={{ display: 'flex', gap: 2 }}>
      <TextField
        fullWidth
        label="Model Name"
        value={model}
        onChange={(e) => onModelChange(e.target.value)}
        onKeyPress={onKeyPress}
        placeholder="e.g., ROG STRIX X870E-E GAMING WIFI"
        disabled={loading}
      />
      <Button
        variant="contained"
        onClick={onFetch}
        disabled={loading}
        sx={{ minWidth: 120 }}
      >
        {loading ? <CircularProgress size={24} /> : buttonText}
      </Button>
    </Box>
  );
}
