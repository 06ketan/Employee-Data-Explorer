import type { Employee } from "../types";

function getTimestamp(): string {
  const now = new Date();
  const pad = (n: number) => n.toString().padStart(2, "0");
  return [
    now.getFullYear(),
    "-",
    pad(now.getMonth() + 1),
    "-",
    pad(now.getDate()),
    "_",
    pad(now.getHours()),
    pad(now.getMinutes()),
    pad(now.getSeconds()),
  ].join("");
}

export function employeesToCSV(employees: Employee[]): string {
  const headers = [
    "ID",
    "Name",
    "Email",
    "Department",
    "Role",
    "Salary",
    "Join Date",
    "Active",
    "Skills",
    "City",
    "State",
    "Country",
    "Projects",
    "Last Review",
    "Performance Rating",
  ];

  const rows = employees.map((e) => [
    e.id,
    `"${e.name}"`,
    `"${e.email}"`,
    `"${e.department}"`,
    `"${e.role}"`,
    e.salary,
    e.joinDate,
    e.isActive,
    `"${e.skills.join(", ")}"`,
    `"${e.address.city}"`,
    `"${e.address.state}"`,
    `"${e.address.country}"`,
    e.projects,
    e.lastReview,
    e.performanceRating,
  ]);

  return [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
}

export function downloadFile(
  content: string,
  filename: string,
  mimeType: string,
) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function exportCSV(employees: Employee[]) {
  const csv = employeesToCSV(employees);
  downloadFile(
    csv,
    `employees_filtered_${getTimestamp()}.csv`,
    "text/csv;charset=utf-8;",
  );
}

export function exportJSON(employees: Employee[]) {
  const json = JSON.stringify(employees, null, 2);
  downloadFile(
    json,
    `employees_filtered_${getTimestamp()}.json`,
    "application/json",
  );
}
