import { TextField } from "@mui/material";
import type { FilterInputProps } from "../../types";

export default function TextFilterInput({ value, onChange }: FilterInputProps) {
  return (
    <TextField
      size="small"
      placeholder="Enter text..."
      value={(value as string) || ""}
      onChange={(e) => onChange(e.target.value)}
      fullWidth
      aria-label="Text filter value"
      sx={{ minWidth: 180 }}
    />
  );
}
