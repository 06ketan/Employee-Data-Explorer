import { FormControl, Select, MenuItem } from "@mui/material";
import type { FilterInputProps } from "../../types";

export default function SingleSelectFilterInput({
  value,
  onChange,
  fieldConfig,
}: FilterInputProps) {
  const options = fieldConfig.options || [];

  return (
    <FormControl size="small" sx={{ minWidth: 180 }} fullWidth>
      <Select
        value={(value as string) || ""}
        onChange={(e) => onChange(e.target.value as string)}
        displayEmpty
        aria-label={`Select ${fieldConfig.label}`}
      >
        <MenuItem value="" disabled>
          <em>Select {fieldConfig.label}...</em>
        </MenuItem>
        {options.map((opt) => (
          <MenuItem key={opt} value={opt}>
            {opt}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}
