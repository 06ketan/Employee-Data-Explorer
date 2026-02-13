import { useState, useEffect } from "react";
import type { Employee } from "../types";
import { fetchEmployees } from "../api/employeeApi";

interface UseEmployeesResult {
  data: Employee[];
  loading: boolean;
  error: string | null;
}

export function useEmployees(): UseEmployeesResult {
  const [data, setData] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        setLoading(true);
        const employees = await fetchEmployees();
        if (!cancelled) {
          setData(employees);
          setError(null);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Failed to load data");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  return { data, loading, error };
}
