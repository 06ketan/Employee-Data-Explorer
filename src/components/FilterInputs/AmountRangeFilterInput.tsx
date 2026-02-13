import { Box, TextField, Typography, InputAdornment } from "@mui/material";
import type { FilterInputProps } from "../../types";

export default function AmountRangeFilterInput({
  value,
  onChange,
}: FilterInputProps) {
  const range = (value as { min: string; max: string }) || { min: "", max: "" };

  const handleMinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange({ ...range, min: e.target.value });
  };

  const handleMaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange({ ...range, max: e.target.value });
  };

  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 1, minWidth: 280 }}>
      <TextField
        size="small"
        type="number"
        placeholder="Min"
        value={range.min}
        onChange={handleMinChange}
        aria-label="Minimum amount"
        slotProps={{
          input: {
            startAdornment: <InputAdornment position="start">$</InputAdornment>,
          },
          htmlInput: { min: 0, step: 1000 },
        }}
        sx={{ flex: 1 }}
      />
      <Typography variant="body2" sx={{ color: "text.secondary", px: 0.5 }}>
        to
      </Typography>
      <TextField
        size="small"
        type="number"
        placeholder="Max"
        value={range.max}
        onChange={handleMaxChange}
        aria-label="Maximum amount"
        slotProps={{
          input: {
            startAdornment: <InputAdornment position="start">$</InputAdornment>,
          },
          htmlInput: { min: 0, step: 1000 },
        }}
        sx={{ flex: 1 }}
      />
    </Box>
  );
}
