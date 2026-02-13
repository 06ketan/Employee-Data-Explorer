export interface Address {
  city: string;
  state: string;
  country: string;
}

export interface Employee {
  id: number;
  name: string;
  email: string;
  department: string;
  role: string;
  salary: number;
  joinDate: string;
  isActive: boolean;
  skills: string[];
  address: Address;
  projects: number;
  lastReview: string;
  performanceRating: number;
}

export type FieldType =
  | "text"
  | "number"
  | "date"
  | "amount"
  | "singleSelect"
  | "multiSelect"
  | "boolean";

export type FilterOperator =
  | "equals"
  | "contains"
  | "startsWith"
  | "endsWith"
  | "doesNotContain"
  | "greaterThan"
  | "lessThan"
  | "greaterThanOrEqual"
  | "lessThanOrEqual"
  | "between"
  | "is"
  | "isNot"
  | "in"
  | "notIn";

export const OPERATOR_LABELS: Record<FilterOperator, string> = {
  equals: "Equals",
  contains: "Contains",
  startsWith: "Starts With",
  endsWith: "Ends With",
  doesNotContain: "Does Not Contain",
  greaterThan: "Greater Than",
  lessThan: "Less Than",
  greaterThanOrEqual: "≥ (Greater or Equal)",
  lessThanOrEqual: "≤ (Less or Equal)",
  between: "Between",
  is: "Is",
  isNot: "Is Not",
  in: "In",
  notIn: "Not In",
};

export type FieldCategory =
  | "Personal Info"
  | "Employment"
  | "Performance"
  | "Location";

export interface FieldConfig {
  key: string;
  label: string;
  type: FieldType;
  operators: FilterOperator[];
  options?: string[];
  category: FieldCategory;
}

export type FilterValue =
  | string
  | number
  | string[]
  | { min: string; max: string }
  | null;

export interface FilterCondition {
  id: string;
  fieldKey: string;
  operator: FilterOperator;
  value: FilterValue;
  enabled: boolean;
}

export interface SortConfig {
  field: string;
  direction: "asc" | "desc";
}

export interface FilterInputProps {
  value: FilterValue;
  onChange: (value: FilterValue) => void;
  fieldConfig: FieldConfig;
  operator: FilterOperator;
}
