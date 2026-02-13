import { useEffect, useMemo, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  TablePagination,
  Paper,
  Typography,
  Box,
  Chip,
  alpha,
} from "@mui/material";
import { SearchX } from "lucide-react";
import type { Employee, SortConfig } from "../../types";
import {
  formatCurrency,
  formatDate,
  getNestedValue,
} from "../../utils/helpers";

interface ColumnDef {
  key: string;
  label: string;
  sortable: boolean;
  minWidth?: number;
  render?: (employee: Employee) => React.ReactNode;
}

const COLUMNS: ColumnDef[] = [
  { key: "id", label: "ID", sortable: true, minWidth: 60 },
  { key: "name", label: "Name", sortable: true, minWidth: 140 },
  { key: "email", label: "Email", sortable: true, minWidth: 200 },
  { key: "department", label: "Department", sortable: true, minWidth: 130 },
  { key: "role", label: "Role", sortable: true, minWidth: 150 },
  {
    key: "salary",
    label: "Salary",
    sortable: true,
    minWidth: 100,
    render: (e) => formatCurrency(e.salary),
  },
  {
    key: "joinDate",
    label: "Join Date",
    sortable: true,
    minWidth: 110,
    render: (e) => formatDate(e.joinDate),
  },
  {
    key: "isActive",
    label: "Active",
    sortable: true,
    minWidth: 80,
    render: (e) => (
      <Chip
        label={e.isActive ? "Active" : "Inactive"}
        size="small"
        color={e.isActive ? "success" : "default"}
        sx={{
          fontWeight: 600,
          fontSize: "0.7rem",
        }}
      />
    ),
  },
  {
    key: "skills",
    label: "Skills",
    sortable: false,
    minWidth: 200,
    render: (e) => (
      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
        {e.skills.map((skill) => (
          <Chip
            key={skill}
            label={skill}
            size="small"
            variant="outlined"
            sx={{ fontSize: "0.65rem", height: 22 }}
          />
        ))}
      </Box>
    ),
  },
  {
    key: "address.city",
    label: "City",
    sortable: true,
    minWidth: 120,
    render: (e) => e.address.city,
  },
  {
    key: "address.country",
    label: "Country",
    sortable: true,
    minWidth: 90,
    render: (e) => e.address.country,
  },
  { key: "projects", label: "Projects", sortable: true, minWidth: 80 },
  {
    key: "lastReview",
    label: "Last Review",
    sortable: true,
    minWidth: 110,
    render: (e) => formatDate(e.lastReview),
  },
  {
    key: "performanceRating",
    label: "Rating",
    sortable: true,
    minWidth: 80,
    render: (e) => (
      <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
        <Typography
          variant="body2"
          sx={{
            fontWeight: 700,
            color:
              e.performanceRating >= 4
                ? "success.main"
                : e.performanceRating >= 3
                  ? "warning.main"
                  : "error.main",
          }}
        >
          {e.performanceRating.toFixed(1)}
        </Typography>
        <Typography variant="caption" sx={{ color: "text.secondary" }}>
          / 5
        </Typography>
      </Box>
    ),
  },
];

interface DataTableProps {
  data: Employee[];
  totalCount: number;
  loading: boolean;
}

export default function DataTable({
  data,
  totalCount,
  loading,
}: DataTableProps) {
  const [sort, setSort] = useState<SortConfig>({
    field: "id",
    direction: "asc",
  });
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(25);

  const sortedData = useMemo(() => {
    const sorted = [...data].sort((a, b) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const aVal = getNestedValue(
        a as unknown as Record<string, any>,
        sort.field,
      );
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const bVal = getNestedValue(
        b as unknown as Record<string, any>,
        sort.field,
      );

      if (aVal == null && bVal == null) return 0;
      if (aVal == null) return 1;
      if (bVal == null) return -1;

      let comparison = 0;
      if (typeof aVal === "string" && typeof bVal === "string") {
        comparison = aVal.localeCompare(bVal);
      } else if (typeof aVal === "number" && typeof bVal === "number") {
        comparison = aVal - bVal;
      } else if (typeof aVal === "boolean" && typeof bVal === "boolean") {
        comparison = aVal === bVal ? 0 : aVal ? -1 : 1;
      } else {
        comparison = String(aVal).localeCompare(String(bVal));
      }

      return sort.direction === "asc" ? comparison : -comparison;
    });
    return sorted;
  }, [data, sort]);

  const paginatedData = useMemo(() => {
    return sortedData.slice(
      page * rowsPerPage,
      page * rowsPerPage + rowsPerPage,
    );
  }, [sortedData, page, rowsPerPage]);

  const handleSort = (field: string) => {
    setSort((prev) => ({
      field,
      direction:
        prev.field === field && prev.direction === "asc" ? "desc" : "asc",
    }));
  };

  const handleChangePage = (_: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  useEffect(() => {
    setPage(0);
  }, [data.length]);

  return (
    <Paper
      elevation={0}
      sx={{
        borderRadius: 3,
        border: "1px solid",
        borderColor: "divider",
        overflow: "hidden",
      }}
    >
      <Box
        sx={{
          px: 2.5,
          py: 1.5,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderBottom: "1px solid",
          borderColor: "divider",
          background: (theme) => alpha(theme.palette.primary.main, 0.03),
        }}
      >
        <Typography
          variant="body2"
          sx={{ fontWeight: 600, color: "text.primary" }}
        >
          Showing{" "}
          <Typography
            component="span"
            sx={{ color: "text.primary", fontWeight: 700 }}
          >
            {data.length}
          </Typography>{" "}
          of{" "}
          <Typography component="span" sx={{ fontWeight: 700 }}>
            {totalCount}
          </Typography>{" "}
          records
        </Typography>
        {data.length < totalCount && (
          <Chip
            label={`${totalCount - data.length} filtered out`}
            size="small"
            variant="outlined"
            color="warning"
            sx={{ fontSize: "0.7rem" }}
          />
        )}
      </Box>

      {loading ? (
        <Box sx={{ p: 4, textAlign: "center" }}>
          <Typography>Loading data...</Typography>
        </Box>
      ) : data.length === 0 ? (
        <Box
          sx={{
            py: 8,
            textAlign: "center",
            color: "text.secondary",
          }}
        >
          <SearchX size={48} style={{ marginBottom: 12, opacity: 0.4 }} />
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
            No results found
          </Typography>
          <Typography variant="body2">
            No records match your current filters. Try adjusting or removing
            some filters.
          </Typography>
        </Box>
      ) : (
        <>
          <TableContainer sx={{ maxHeight: 600 }}>
            <Table stickyHeader size="small">
              <TableHead>
                <TableRow>
                  {COLUMNS.map((col) => (
                    <TableCell
                      key={col.key}
                      sx={{
                        fontWeight: 700,
                        fontSize: "0.75rem",
                        textTransform: "uppercase",
                        letterSpacing: "0.04em",
                        minWidth: col.minWidth,
                        backgroundColor: (theme) =>
                          theme.palette.mode === "dark" ? "#1a1a2e" : "#f8f9fa",
                        borderBottom: "2px solid",
                        borderColor: "primary.main",
                      }}
                    >
                      {col.sortable ? (
                        <TableSortLabel
                          active={sort.field === col.key}
                          direction={
                            sort.field === col.key ? sort.direction : "asc"
                          }
                          onClick={() => handleSort(col.key)}
                        >
                          {col.label}
                        </TableSortLabel>
                      ) : (
                        col.label
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedData.map((employee) => (
                  <TableRow
                    key={employee.id}
                    hover
                    sx={{
                      transition: "background-color 0.15s",
                      "&:last-child td": { borderBottom: 0 },
                    }}
                  >
                    {COLUMNS.map((col) => (
                      <TableCell
                        key={col.key}
                        sx={{ fontSize: "0.82rem", py: 1.2 }}
                      >
                        {col.render
                          ? col.render(employee)
                          : String(
                              getNestedValue(
                                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                employee as unknown as Record<string, any>,
                                col.key,
                              ) ?? "",
                            )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          <TablePagination
            component="div"
            count={data.length}
            page={page}
            rowsPerPage={rowsPerPage}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            rowsPerPageOptions={[5, 10, 25, 50]}
            sx={{
              borderTop: "1px solid",
              borderColor: "divider",
            }}
          />
        </>
      )}
    </Paper>
  );
}
