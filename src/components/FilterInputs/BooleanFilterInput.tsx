import { FormControlLabel, Switch } from "@mui/material";
import type { FilterInputProps } from "../../types";

export default function BooleanFilterInput({
  value,
  onChange,
}: FilterInputProps) {
  const isChecked = value === "true";

  return (
    <FormControlLabel
      control={
        <Switch
          checked={isChecked}
          onChange={(e) => onChange(e.target.checked ? "true" : "false")}
          aria-label="Boolean filter toggle"
          color="primary"
        />
      }
      label={isChecked ? "Active" : "Inactive"}
      sx={{ minWidth: 120 }}
    />
  );
}
