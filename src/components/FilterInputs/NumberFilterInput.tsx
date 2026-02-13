import { TextField, Box, Typography } from "@mui/material";
import type { FilterInputProps } from "../../types";

export default function NumberFilterInput({
  value,
  onChange,
  fieldConfig,
  operator,
}: FilterInputProps) {
  if (operator === "between") {
    const range = (value as { min: string; max: string }) || {
      min: "",
      max: "",
    };
    return (
      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        <TextField
          type="number"
          size="small"
          placeholder="Min"
          value={range.min}
          onChange={(e) => onChange({ ...range, min: e.target.value })}
          aria-label={`${fieldConfig.label} minimum`}
          sx={{ flex: 1 }}
        />
        <Typography variant="caption" sx={{ color: "text.secondary", px: 0.5 }}>
          –
        </Typography>
        <TextField
          type="number"
          size="small"
          placeholder="Max"
          value={range.max}
          onChange={(e) => onChange({ ...range, max: e.target.value })}
          aria-label={`${fieldConfig.label} maximum`}
          sx={{ flex: 1 }}
        />
      </Box>
    );
  }

  return (
    <TextField
      type="number"
      size="small"
      fullWidth
      placeholder={`Enter ${fieldConfig.label}...`}
      value={(value as string) || ""}
      onChange={(e) => onChange(e.target.value)}
      aria-label={`Enter ${fieldConfig.label}`}
    />
  );
}
