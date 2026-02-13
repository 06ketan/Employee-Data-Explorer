import {
  Box,
  FormControl,
  Select,
  MenuItem,
  IconButton,
  Tooltip,
  Typography,
  Switch,
  ListSubheader,
} from "@mui/material";
import { Trash2 } from "lucide-react";
import type { FilterCondition, FilterOperator, FilterValue } from "../../types";
import { OPERATOR_LABELS } from "../../types";
import { getGroupedFieldConfigs } from "../../config/filterConfig";
import { FILTER_INPUT_REGISTRY } from "../FilterInputs";

const GROUPED_FIELDS = getGroupedFieldConfigs();

interface FilterRowProps {
  condition: FilterCondition;
  index: number;
  onFieldChange: (id: string, fieldKey: string) => void;
  onOperatorChange: (id: string, operator: FilterOperator) => void;
  onValueChange: (id: string, value: FilterValue) => void;
  onToggle: (id: string) => void;
  onRemove: (id: string) => void;
}

export default function FilterRow({
  condition,
  index,
  onFieldChange,
  onOperatorChange,
  onValueChange,
  onToggle,
  onRemove,
}: FilterRowProps) {
  const fieldConfig = GROUPED_FIELDS.flatMap((g) => g.fields).find(
    (fc) => fc.key === condition.fieldKey,
  );
  const operators = fieldConfig?.operators || [];
  const isEnabled = condition.enabled !== false;

  const InputComponent = fieldConfig
    ? FILTER_INPUT_REGISTRY[fieldConfig.type]
    : null;

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        flexWrap: "wrap",
        gap: { xs: 1, sm: 1.5 },
        py: 1,
        px: { xs: 1, sm: 1.5 },
        borderRadius: 2,
        backgroundColor: "rgba(255,255,255,0.05)",
        border: "1px solid",
        borderColor: isEnabled ? "divider" : "transparent",
        opacity: isEnabled ? 1 : 0.6,
        transition: "all 0.2s ease",
        "&:hover": {
          backgroundColor: "rgba(255,255,255,0.08)",
          borderColor: isEnabled ? "primary.main" : "divider",
          opacity: 1,
        },
      }}
    >
      <Typography
        variant="caption"
        sx={{
          minWidth: 24,
          height: 24,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: "50%",
          backgroundColor: isEnabled ? "primary.main" : "action.disabled",
          color: "primary.contrastText",
          fontWeight: 700,
          fontSize: "0.7rem",
          flexShrink: 0,
        }}
      >
        {index + 1}
      </Typography>

      <Tooltip title={isEnabled ? "Disable filter" : "Enable filter"} arrow>
        <Switch
          size="small"
          checked={isEnabled}
          onChange={() => onToggle(condition.id)}
          aria-label="Toggle filter"
          sx={{ flexShrink: 0 }}
        />
      </Tooltip>

      <FormControl size="small" sx={{ minWidth: 150 }}>
        <Select
          value={condition.fieldKey || ""}
          onChange={(e) => onFieldChange(condition.id, e.target.value)}
          displayEmpty
          aria-label="Select field"
        >
          <MenuItem value="" disabled>
            <em>Select Field</em>
          </MenuItem>
          {GROUPED_FIELDS.map((group) => [
            <ListSubheader
              key={`header-${group.category}`}
              sx={{
                fontWeight: 700,
                fontSize: "0.7rem",
                letterSpacing: "0.06em",
                textTransform: "uppercase",
                color: "primary.main",
                backgroundColor: "background.paper",
                lineHeight: "32px",
              }}
            >
              {group.category}
            </ListSubheader>,
            ...group.fields.map((fc) => (
              <MenuItem key={fc.key} value={fc.key} sx={{ pl: 3 }}>
                {fc.label}
              </MenuItem>
            )),
          ])}
        </Select>
      </FormControl>

      {condition.fieldKey && (
        <FormControl size="small" sx={{ minWidth: 160 }}>
          <Select
            value={condition.operator || ""}
            onChange={(e) =>
              onOperatorChange(condition.id, e.target.value as FilterOperator)
            }
            displayEmpty
            aria-label="Select operator"
          >
            <MenuItem value="" disabled>
              <em>Select Operator</em>
            </MenuItem>
            {operators.map((op) => (
              <MenuItem key={op} value={op}>
                {OPERATOR_LABELS[op]}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      )}

      {condition.fieldKey &&
        condition.operator &&
        InputComponent &&
        fieldConfig && (
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <InputComponent
              value={condition.value}
              onChange={(val) => onValueChange(condition.id, val)}
              fieldConfig={fieldConfig}
              operator={condition.operator}
            />
          </Box>
        )}

      {!condition.fieldKey && <Box sx={{ flex: 1 }} />}

      <Tooltip title="Remove filter" arrow>
        <IconButton
          onClick={() => onRemove(condition.id)}
          size="small"
          aria-label="Remove filter"
          sx={{
            color: "error.main",
            opacity: 0.7,
            transition: "all 0.2s",
            "&:hover": {
              opacity: 1,
              backgroundColor: "error.dark",
              color: "#fff",
            },
          }}
        >
          <Trash2 size={18} />
        </IconButton>
      </Tooltip>
    </Box>
  );
}
