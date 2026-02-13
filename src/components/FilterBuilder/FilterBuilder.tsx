import {
  Box,
  Button,
  Typography,
  Chip,
  Paper,
  Divider,
  Tooltip,
} from "@mui/material";
import { Plus, FilterX, Filter } from "lucide-react";
import type { FilterCondition, FilterOperator, FilterValue } from "../../types";
import { FIELD_CONFIGS } from "../../config/filterConfig";
import FilterRow from "../FilterRow/FilterRow";

interface FilterBuilderProps {
  conditions: FilterCondition[];
  onAddFilter: () => void;
  onRemoveFilter: (id: string) => void;
  onFieldChange: (id: string, fieldKey: string) => void;
  onOperatorChange: (id: string, operator: FilterOperator) => void;
  onValueChange: (id: string, value: FilterValue) => void;
  onToggleFilter: (id: string) => void;
  onClearAll: () => void;
  activeFilterCount: number;
  canAddMore: boolean;
}

export default function FilterBuilder({
  conditions,
  onAddFilter,
  onRemoveFilter,
  onFieldChange,
  onOperatorChange,
  onValueChange,
  onToggleFilter,
  onClearAll,
  activeFilterCount,
  canAddMore,
}: FilterBuilderProps) {
  const summaryChips = conditions
    .filter((c) => c.enabled !== false && c.fieldKey && c.value !== null)
    .map((c) => {
      const config = FIELD_CONFIGS.find((fc) => fc.key === c.fieldKey);
      if (!config) return null;
      let label = config.label + ": ";
      if (typeof c.value === "string") {
        label += c.value;
      } else if (Array.isArray(c.value)) {
        label += c.value.length + " selected";
      } else if (
        typeof c.value === "object" &&
        c.value !== null &&
        "min" in c.value
      ) {
        const parts: string[] = [];
        if (c.value.min) parts.push("from " + c.value.min);
        if (c.value.max) parts.push("to " + c.value.max);
        label += parts.join(" ") || "any";
      }
      return { id: c.id, label };
    })
    .filter(Boolean);

  return (
    <Paper
      elevation={0}
      sx={{
        p: 2.5,
        borderRadius: 3,
        border: "1px solid",
        borderColor: "divider",
        background:
          "linear-gradient(135deg, rgba(99,102,241,0.04) 0%, rgba(139,92,246,0.04) 100%)",
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: { xs: "flex-start", sm: "center" },
          justifyContent: "space-between",
          flexDirection: { xs: "column", sm: "row" },
          gap: { xs: 1.5, sm: 0 },
          mb: 2,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <Filter size={20} />
          <Typography
            variant="h6"
            component="h2"
            sx={{ fontWeight: 700, fontSize: "1.05rem" }}
          >
            Filters
          </Typography>
          {activeFilterCount > 0 && (
            <Chip
              label={`${activeFilterCount} active`}
              size="small"
              color="primary"
              sx={{ fontWeight: 600, fontSize: "0.75rem" }}
            />
          )}
        </Box>

        <Box sx={{ display: "flex", gap: 1 }}>
          {conditions.length > 0 && (
            <Button
              variant="outlined"
              size="small"
              startIcon={<FilterX size={16} />}
              onClick={onClearAll}
              color="error"
              sx={{
                borderRadius: 2,
                textTransform: "none",
                fontWeight: 600,
              }}
            >
              Clear All
            </Button>
          )}
          <Tooltip
            title={
              canAddMore
                ? "Add a new filter condition"
                : "Maximum of 10 filters reached"
            }
            arrow
          >
            <span>
              <Button
                variant="contained"
                size="small"
                startIcon={<Plus size={16} />}
                onClick={onAddFilter}
                disabled={!canAddMore}
                sx={{
                  borderRadius: 2,
                  textTransform: "none",
                  fontWeight: 600,
                  background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
                  "&:hover": {
                    background: "linear-gradient(135deg, #4f46e5, #7c3aed)",
                  },
                  "&.Mui-disabled": {
                    background: "rgba(99,102,241,0.2)",
                  },
                }}
              >
                Add Filter
                {!canAddMore && ` (${conditions.length}/10)`}
              </Button>
            </span>
          </Tooltip>
        </Box>
      </Box>

      {summaryChips.length > 0 && (
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.75, mb: 2 }}>
          {summaryChips.map(
            (chip) =>
              chip && (
                <Chip
                  key={chip.id}
                  label={chip.label}
                  size="small"
                  variant="outlined"
                  color="info"
                  onDelete={() => onRemoveFilter(chip.id)}
                  sx={{
                    fontSize: "0.7rem",
                    height: 24,
                    borderRadius: 1.5,
                  }}
                />
              ),
          )}
        </Box>
      )}

      {conditions.length > 0 && <Divider sx={{ mb: 2 }} />}

      <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
        {conditions.map((condition, index) => (
          <Box
            key={condition.id}
            sx={{
              animation: "fadeSlideIn 0.3s ease-out",
              "@keyframes fadeSlideIn": {
                from: { opacity: 0, transform: "translateY(-8px)" },
                to: { opacity: 1, transform: "translateY(0)" },
              },
            }}
          >
            {index > 0 && (
              <Typography
                variant="caption"
                sx={{
                  display: "inline-block",
                  mb: 1,
                  px: 1.5,
                  py: 0.25,
                  borderRadius: 1,
                  backgroundColor: "rgba(99,102,241,0.12)",
                  color: "primary.main",
                  fontWeight: 700,
                  fontSize: "0.65rem",
                  letterSpacing: "0.05em",
                  textTransform: "uppercase",
                }}
              >
                AND
              </Typography>
            )}
            <FilterRow
              condition={condition}
              index={index}
              onFieldChange={onFieldChange}
              onOperatorChange={onOperatorChange}
              onValueChange={onValueChange}
              onToggle={onToggleFilter}
              onRemove={onRemoveFilter}
            />
          </Box>
        ))}
      </Box>

      {conditions.length === 0 && (
        <Box
          sx={{
            py: 3,
            textAlign: "center",
            color: "text.secondary",
          }}
        >
          <Typography variant="body2" sx={{ mb: 0.5 }}>
            No filters applied
          </Typography>
          <Typography variant="caption">
            Click &quot;Add Filter&quot; to start filtering data
          </Typography>
        </Box>
      )}
    </Paper>
  );
}
