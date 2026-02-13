import { useState, useCallback, useEffect, useMemo, useRef } from "react";
import type {
  FilterCondition,
  FilterValue,
  FilterOperator,
  Employee,
  FieldConfig,
} from "../types";
import { generateId } from "../utils/helpers";
import { applyFilters } from "../engine/filterEngine";
import { FIELD_CONFIGS } from "../config/filterConfig";

const STORAGE_KEY = "dynamic-filter-conditions";
const MAX_FILTERS = 10;

function loadPersistedFilters(): FilterCondition[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch {}
  return [];
}

function persistFilters(conditions: FilterCondition[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(conditions));
  } catch {}
}

export interface UseFiltersResult {
  conditions: FilterCondition[];
  filteredData: Employee[];
  addFilter: () => void;
  removeFilter: (id: string) => void;
  updateFilterField: (id: string, fieldKey: string) => void;
  updateFilterOperator: (id: string, operator: FilterOperator) => void;
  updateFilterValue: (id: string, value: FilterValue) => void;
  toggleFilter: (id: string) => void;
  clearAll: () => void;
  activeFilterCount: number;
  canAddMore: boolean;
}

export function useFilters(data: Employee[]): UseFiltersResult {
  const [conditions, setConditions] =
    useState<FilterCondition[]>(loadPersistedFilters);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      persistFilters(conditions);
    }, 300);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [conditions]);

  const canAddMore = conditions.length < MAX_FILTERS;

  const addFilter = useCallback(() => {
    setConditions((prev) => {
      if (prev.length >= MAX_FILTERS) return prev;
      const newCondition: FilterCondition = {
        id: generateId(),
        fieldKey: "",
        operator: "" as FilterOperator,
        value: null,
        enabled: true,
      };
      return [...prev, newCondition];
    });
  }, []);

  const removeFilter = useCallback((id: string) => {
    setConditions((prev) => prev.filter((c) => c.id !== id));
  }, []);

  const updateFilterField = useCallback((id: string, fieldKey: string) => {
    setConditions((prev) =>
      prev.map((c) => {
        if (c.id !== id) return c;
        const config = FIELD_CONFIGS.find((fc) => fc.key === fieldKey);
        const defaultOp = config?.operators[0] || ("" as FilterOperator);
        const defaultValue = getDefaultValue(config);
        return { ...c, fieldKey, operator: defaultOp, value: defaultValue };
      }),
    );
  }, []);

  const updateFilterOperator = useCallback(
    (id: string, operator: FilterOperator) => {
      setConditions((prev) =>
        prev.map((c) => {
          if (c.id !== id) return c;
          const wasBetween = c.operator === "between";
          const isBetween = operator === "between";
          if (wasBetween !== isBetween) {
            return {
              ...c,
              operator,
              value: isBetween ? { min: "", max: "" } : "",
            };
          }
          return { ...c, operator };
        }),
      );
    },
    [],
  );

  const updateFilterValue = useCallback((id: string, value: FilterValue) => {
    setConditions((prev) =>
      prev.map((c) => (c.id === id ? { ...c, value } : c)),
    );
  }, []);

  const toggleFilter = useCallback((id: string) => {
    setConditions((prev) =>
      prev.map((c) => (c.id === id ? { ...c, enabled: !c.enabled } : c)),
    );
  }, []);

  const clearAll = useCallback(() => {
    setConditions([]);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  const filteredData = useMemo(() => {
    return applyFilters(data, conditions, FIELD_CONFIGS as FieldConfig[]);
  }, [data, conditions]);

  const activeFilterCount = useMemo(() => {
    return conditions.filter(
      (c) =>
        c.enabled !== false && c.fieldKey && c.operator && c.value !== null,
    ).length;
  }, [conditions]);

  return {
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
  };
}

function getDefaultValue(config: FieldConfig | undefined): FilterValue {
  if (!config) return null;
  switch (config.type) {
    case "date":
    case "amount":
      return { min: "", max: "" };
    case "multiSelect":
      return [];
    case "boolean":
      return "true";
    default:
      return "";
  }
}
