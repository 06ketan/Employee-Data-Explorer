import {
  FormControl,
  Select,
  MenuItem,
  Checkbox,
  ListItemText,
  OutlinedInput,
  Chip,
  Box,
  Divider,
  Typography,
} from "@mui/material";
import type { FilterInputProps } from "../../types";

export default function MultiSelectFilterInput({
  value,
  onChange,
  fieldConfig,
}: FilterInputProps) {
  const options = fieldConfig.options || [];
  const selected = (value as string[]) || [];
  const allSelected = selected.length === options.length;

  const handleSelectAll = () => {
    onChange(allSelected ? [] : [...options]);
  };

  return (
    <FormControl size="small" sx={{ minWidth: 220 }} fullWidth>
      <Select
        multiple
        value={selected}
        onChange={(e) => {
          const val = e.target.value;
          onChange(typeof val === "string" ? val.split(",") : val);
        }}
        input={<OutlinedInput />}
        displayEmpty
        renderValue={(sel) => {
          const arr = sel as string[];
          if (arr.length === 0) {
            return (
              <em style={{ color: "#999" }}>Select {fieldConfig.label}...</em>
            );
          }
          if (arr.length > 2) {
            return (
              <Typography variant="body2" sx={{ color: "text.primary" }}>
                {arr.length} selected
              </Typography>
            );
          }
          return (
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
              {arr.map((v) => (
                <Chip key={v} label={v} size="small" />
              ))}
            </Box>
          );
        }}
        aria-label={`Select ${fieldConfig.label}`}
        MenuProps={{
          PaperProps: {
            style: { maxHeight: 350 },
          },
        }}
      >
        <MenuItem
          onClick={(e) => {
            e.preventDefault();
            handleSelectAll();
          }}
          sx={{
            fontWeight: 600,
            fontSize: "0.8rem",
            color: "primary.main",
          }}
        >
          <Checkbox
            size="small"
            checked={allSelected}
            indeterminate={selected.length > 0 && !allSelected}
          />
          <ListItemText primary={allSelected ? "Clear All" : "Select All"} />
        </MenuItem>
        <Divider />

        {options.map((opt) => (
          <MenuItem key={opt} value={opt}>
            <Checkbox checked={selected.indexOf(opt) > -1} />
            <ListItemText primary={opt} />
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}
