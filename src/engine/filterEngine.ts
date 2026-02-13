import type {
  Employee,
  FilterCondition,
  FieldConfig,
  FilterValue,
} from "../types";
import { getNestedValue } from "../utils/helpers";
import dayjs from "dayjs";

export function applyFilters(
  data: Employee[],
  conditions: FilterCondition[],
  fieldConfigs: FieldConfig[],
): Employee[] {
  const validConditions = conditions.filter(
    (c) => c.enabled !== false && isConditionValid(c),
  );
  if (validConditions.length === 0) return data;

  const configMap = new Map<string, FieldConfig>();
  fieldConfigs.forEach((fc) => configMap.set(fc.key, fc));

  const grouped = new Map<string, FilterCondition[]>();
  validConditions.forEach((c) => {
    const existing = grouped.get(c.fieldKey) || [];
    existing.push(c);
    grouped.set(c.fieldKey, existing);
  });

  return data.filter((record) => {
    for (const [fieldKey, fieldConditions] of grouped) {
      const config = configMap.get(fieldKey);
      if (!config) continue;

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const fieldValue = getNestedValue(
        record as unknown as Record<string, any>,
        fieldKey,
      );

      const anyMatch = fieldConditions.some((cond) =>
        matchCondition(fieldValue, cond, config),
      );

      if (!anyMatch) return false;
    }

    return true;
  });
}

function isConditionValid(condition: FilterCondition): boolean {
  const { value, fieldKey, operator } = condition;
  if (!fieldKey || !operator) return false;
  if (value === null || value === undefined) return false;

  if (typeof value === "string") return value.trim().length > 0;
  if (Array.isArray(value)) return value.length > 0;
  if (typeof value === "object" && "min" in value && "max" in value) {
    return value.min.trim().length > 0 || value.max.trim().length > 0;
  }
  return true;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function matchCondition(
  fieldValue: any,
  condition: FilterCondition,
  config: FieldConfig,
): boolean {
  const { operator, value } = condition;

  if (fieldValue === null || fieldValue === undefined) return false;

  switch (config.type) {
    case "text":
      return matchText(String(fieldValue), operator, value as string);

    case "number":
      return matchNumber(Number(fieldValue), operator, value);

    case "date":
      return matchDateRange(
        String(fieldValue),
        value as { min: string; max: string },
      );

    case "amount":
      return matchAmountRange(
        Number(fieldValue),
        value as { min: string; max: string },
      );

    case "singleSelect":
      return matchSingleSelect(String(fieldValue), operator, value as string);

    case "multiSelect":
      return matchMultiSelect(
        fieldValue as string[],
        operator,
        value as string[],
      );

    case "boolean":
      return matchBoolean(fieldValue as boolean, value as string);

    default:
      return true;
  }
}

function matchText(
  fieldVal: string,
  operator: string,
  filterVal: string,
): boolean {
  const fv = fieldVal.toLowerCase();
  const sv = filterVal.toLowerCase();

  switch (operator) {
    case "equals":
      return fv === sv;
    case "contains":
      return fv.includes(sv);
    case "startsWith":
      return fv.startsWith(sv);
    case "endsWith":
      return fv.endsWith(sv);
    case "doesNotContain":
      return !fv.includes(sv);
    default:
      return true;
  }
}

function matchNumber(
  fieldVal: number,
  operator: string,
  filterVal: FilterValue,
): boolean {
  if (
    operator === "between" &&
    typeof filterVal === "object" &&
    filterVal !== null &&
    !Array.isArray(filterVal) &&
    "min" in filterVal
  ) {
    const range = filterVal as { min: string; max: string };
    let pass = true;
    if (range.min) {
      const min = parseFloat(range.min);
      if (!isNaN(min)) pass = pass && fieldVal >= min;
    }
    if (range.max) {
      const max = parseFloat(range.max);
      if (!isNaN(max)) pass = pass && fieldVal <= max;
    }
    return pass;
  }

  if (typeof filterVal === "string") {
    const num = parseFloat(filterVal);
    if (isNaN(num)) return true;

    switch (operator) {
      case "equals":
        return fieldVal === num;
      case "greaterThan":
        return fieldVal > num;
      case "lessThan":
        return fieldVal < num;
      case "greaterThanOrEqual":
        return fieldVal >= num;
      case "lessThanOrEqual":
        return fieldVal <= num;
      default:
        return true;
    }
  }
  return true;
}

function matchDateRange(
  fieldVal: string,
  range: { min: string; max: string },
): boolean {
  const date = dayjs(fieldVal);
  if (!date.isValid()) return false;

  let pass = true;
  if (range.min) {
    const minDate = dayjs(range.min);
    if (minDate.isValid())
      pass = pass && (date.isAfter(minDate) || date.isSame(minDate, "day"));
  }
  if (range.max) {
    const maxDate = dayjs(range.max);
    if (maxDate.isValid())
      pass = pass && (date.isBefore(maxDate) || date.isSame(maxDate, "day"));
  }
  return pass;
}

function matchAmountRange(
  fieldVal: number,
  range: { min: string; max: string },
): boolean {
  let pass = true;
  if (range.min) {
    const min = parseFloat(range.min);
    if (!isNaN(min)) pass = pass && fieldVal >= min;
  }
  if (range.max) {
    const max = parseFloat(range.max);
    if (!isNaN(max)) pass = pass && fieldVal <= max;
  }
  return pass;
}

function matchSingleSelect(
  fieldVal: string,
  operator: string,
  filterVal: string,
): boolean {
  const fv = fieldVal.toLowerCase();
  const sv = filterVal.toLowerCase();
  switch (operator) {
    case "is":
      return fv === sv;
    case "isNot":
      return fv !== sv;
    default:
      return true;
  }
}

function matchMultiSelect(
  fieldVal: string[],
  operator: string,
  filterVal: string[],
): boolean {
  const fieldSet = new Set(fieldVal.map((v) => v.toLowerCase()));
  const filterSet = filterVal.map((v) => v.toLowerCase());

  switch (operator) {
    case "in":
      return filterSet.some((v) => fieldSet.has(v));
    case "notIn":
      return !filterSet.some((v) => fieldSet.has(v));
    default:
      return true;
  }
}

function matchBoolean(fieldVal: boolean, filterVal: string): boolean {
  return fieldVal === (filterVal === "true");
}
