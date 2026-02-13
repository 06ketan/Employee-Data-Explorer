import type { Employee } from "../types";

const API_BASE = "http://localhost:3001";

export async function fetchEmployees(): Promise<Employee[]> {
  try {
    // In production, skip the network request entirely and use local data
    if (import.meta.env.PROD) {
      const data = await import("../data/employees.json");
      return data.default as Employee[];
    }
    const response = await fetch(`${API_BASE}/employees`);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return await response.json();
  } catch {
    console.warn("json-server unavailable, using local data fallback");
    const data = await import("../data/employees.json");
    return data.default as Employee[];
  }
}
