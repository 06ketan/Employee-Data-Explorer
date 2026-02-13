import { useMemo } from "react";
import {
  ThemeProvider,
  createTheme,
  CssBaseline,
  Container,
  Box,
  Typography,
  Button,
  IconButton,
  Tooltip,
  alpha,
} from "@mui/material";
import { Download, FileJson, Database } from "lucide-react";
import FilterBuilder from "./components/FilterBuilder/FilterBuilder";
import DataTable from "./components/DataTable/DataTable";
import { useEmployees } from "./hooks/useEmployees";
import { useFilters } from "./hooks/useFilters";
import { exportCSV, exportJSON } from "./utils/csv";

const darkTheme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#6366f1",
      light: "#818cf8",
      dark: "#4f46e5",
    },
    secondary: {
      main: "#8b5cf6",
    },
    background: {
      default: "#0f0f1a",
      paper: "#16162a",
    },
    error: {
      main: "#ef4444",
    },
    success: {
      main: "#22c55e",
    },
    warning: {
      main: "#f59e0b",
    },
    divider: "rgba(255,255,255,0.08)",
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: "none",
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          borderColor: "rgba(255,255,255,0.06)",
        },
      },
    },
    MuiSelect: {
      styleOverrides: {
        root: {
          borderRadius: 8,
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: 8,
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: "none",
          fontWeight: 600,
        },
      },
    },
  },
});

function App() {
  const { data: employees, loading, error } = useEmployees();
  const {
    conditions,
    filteredData,
    addFilter,
    removeFilter,
    updateFilterField,
    updateFilterOperator,
    updateFilterValue,
    toggleFilter,
    clearAll,
    activeFilterCount,
    canAddMore,
  } = useFilters(employees);

  const totalCount = useMemo(() => employees.length, [employees]);

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Box
        sx={{
          minHeight: "100vh",
          background:
            "linear-gradient(180deg, #0f0f1a 0%, #1a1a2e 50%, #0f0f1a 100%)",
        }}
      >
        <Container maxWidth="xl" sx={{ py: 4 }}>
          <Box
            sx={{
              display: "flex",
              alignItems: { xs: "flex-start", sm: "center" },
              justifyContent: "space-between",
              flexDirection: { xs: "column", sm: "row" },
              gap: { xs: 2, sm: 0 },
              mb: 4,
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Box
                sx={{
                  width: { xs: 36, sm: 44 },
                  height: { xs: 36, sm: 44 },
                  borderRadius: 2.5,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
                  boxShadow: "0 4px 16px rgba(99,102,241,0.3)",
                  flexShrink: 0,
                }}
              >
                <Database size={24} color="#fff" />
              </Box>
              <Box>
                <Typography
                  variant="h4"
                  component="h1"
                  sx={{
                    fontWeight: 800,
                    fontSize: { xs: "1.4rem", sm: "1.8rem", md: "2.125rem" },
                    background: "linear-gradient(135deg, #c7d2fe, #e0e7ff)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    lineHeight: 1.2,
                  }}
                >
                  Employee Data Explorer
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    color: "text.secondary",
                    mt: 0.25,
                    fontSize: { xs: "0.7rem", sm: "0.875rem" },
                  }}
                >
                  Dynamic filter component system · Real-time client-side
                  filtering
                </Typography>
              </Box>
            </Box>

            <Box sx={{ display: "flex", gap: 1, flexShrink: 0 }}>
              <Tooltip title="Export filtered data as CSV" arrow>
                <Button
                  variant="outlined"
                  size="small"
                  startIcon={<Download size={16} />}
                  onClick={() => exportCSV(filteredData)}
                  disabled={filteredData.length === 0}
                  sx={{
                    borderColor: (theme) =>
                      alpha(theme.palette.primary.main, 0.3),
                    "&:hover": {
                      borderColor: "primary.main",
                      backgroundColor: (theme) =>
                        alpha(theme.palette.primary.main, 0.08),
                    },
                  }}
                >
                  CSV
                </Button>
              </Tooltip>
              <Tooltip title="Export filtered data as JSON" arrow>
                <IconButton
                  size="small"
                  aria-label="Export as JSON"
                  onClick={() => exportJSON(filteredData)}
                  disabled={filteredData.length === 0}
                  sx={{
                    border: "1px solid",
                    borderColor: (theme) =>
                      alpha(theme.palette.primary.main, 0.3),
                    borderRadius: 2,
                    "&:hover": {
                      borderColor: "primary.main",
                      backgroundColor: (theme) =>
                        alpha(theme.palette.primary.main, 0.08),
                    },
                  }}
                >
                  <FileJson size={18} />
                </IconButton>
              </Tooltip>
            </Box>
          </Box>

          {error && (
            <Box
              sx={{
                mb: 3,
                p: 2,
                borderRadius: 2,
                backgroundColor: "rgba(239,68,68,0.1)",
                border: "1px solid rgba(239,68,68,0.2)",
                color: "error.main",
              }}
            >
              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                Error loading data: {error}
              </Typography>
            </Box>
          )}

          <Box sx={{ mb: 3 }}>
            <FilterBuilder
              conditions={conditions}
              onAddFilter={addFilter}
              onRemoveFilter={removeFilter}
              onFieldChange={updateFilterField}
              onOperatorChange={updateFilterOperator}
              onValueChange={updateFilterValue}
              onToggleFilter={toggleFilter}
              onClearAll={clearAll}
              activeFilterCount={activeFilterCount}
              canAddMore={canAddMore}
            />
          </Box>

          <DataTable
            data={filteredData}
            totalCount={totalCount}
            loading={loading}
          />
        </Container>
      </Box>
    </ThemeProvider>
  );
}

export default App;
