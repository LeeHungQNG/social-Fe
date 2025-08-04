import { Box, Paper } from '@mui/material';

interface IBgColorSelectorProps {
  colors: string[];
  selectedColor: string;
  onSelect: (color: string) => void;
}

const BgColorSelector = ({ colors, onSelect, selectedColor }: IBgColorSelectorProps) => {
  return (
    <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
      {colors.map((color) => (
        <Paper
          key={color}
          onClick={() => onSelect(color)}
          sx={{ width: 50, height: 50, bgcolor: color, cursor: 'pointer', border: selectedColor === color ? '2px solid #1976d2' : '2px solid #ddd' }}
        ></Paper>
      ))}
    </Box>
  );
};
export default BgColorSelector;
