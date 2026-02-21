import {
  Box,
  FormControlLabel,
  Switch,
  Typography,
  ToggleButtonGroup,
  ToggleButton,
} from '@mui/material';

export default function FilterControls({
  showOnlyReleased,
  onShowOnlyReleasedChange,
  selectedCategory,
  onCategoryChange,
  categories,
}) {
  return (
    <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
      <FormControlLabel
        control={
          <Switch
            checked={showOnlyReleased}
            onChange={(e) => onShowOnlyReleasedChange(e.target.checked)}
          />
        }
        label="Show only released versions"
      />

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Typography variant="body2">Category:</Typography>
        <ToggleButtonGroup
          value={selectedCategory}
          exclusive
          onChange={(e, newValue) => {
            if (newValue !== null) {
              onCategoryChange(newValue);
            }
          }}
          size="small"
        >
          <ToggleButton value="all">All</ToggleButton>
          {categories.map((cat) => (
            <ToggleButton key={cat} value={cat}>
              {cat}
            </ToggleButton>
          ))}
        </ToggleButtonGroup>
      </Box>
    </Box>
  );
}
