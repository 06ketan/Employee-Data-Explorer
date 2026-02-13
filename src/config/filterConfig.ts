import type { FieldConfig, FieldCategory } from "../types";

export const ALL_SKILLS = [
  "React",
  "TypeScript",
  "Node.js",
  "GraphQL",
  "Python",
  "Java",
  "AWS",
  "Docker",
  "Kubernetes",
  "MongoDB",
  "PostgreSQL",
  "Redis",
  "Go",
  "Rust",
  "Vue.js",
  "Angular",
  "Swift",
  "Kotlin",
  "Figma",
  "TensorFlow",
  "Machine Learning",
  "CSS",
  "HTML",
  "Next.js",
  "Django",
];

export const ALL_DEPARTMENTS = [
  "Engineering",
  "Design",
  "Marketing",
  "Sales",
  "Human Resources",
  "Finance",
  "Product",
  "Operations",
  "Customer Support",
  "Data Science",
];

export const ALL_ROLES = [
  "Senior Developer",
  "Junior Developer",
  "Lead Developer",
  "Staff Engineer",
  "Engineering Manager",
  "UI/UX Designer",
  "Senior Designer",
  "Product Designer",
  "Marketing Manager",
  "Content Strategist",
  "SEO Specialist",
  "Sales Representative",
  "Account Executive",
  "Sales Manager",
  "HR Coordinator",
  "HR Manager",
  "Financial Analyst",
  "Senior Accountant",
  "Product Manager",
  "Product Owner",
  "Operations Manager",
  "DevOps Engineer",
  "Support Lead",
  "Support Specialist",
  "Data Scientist",
  "Data Analyst",
  "ML Engineer",
];

export const ALL_COUNTRIES = [
  "USA",
  "Canada",
  "UK",
  "Germany",
  "India",
  "Australia",
];

export const FIELD_CONFIGS: FieldConfig[] = [
  {
    key: "name",
    label: "Name",
    type: "text",
    category: "Personal Info",
    operators: [
      "equals",
      "contains",
      "startsWith",
      "endsWith",
      "doesNotContain",
    ],
  },
  {
    key: "email",
    label: "Email",
    type: "text",
    category: "Personal Info",
    operators: [
      "equals",
      "contains",
      "startsWith",
      "endsWith",
      "doesNotContain",
    ],
  },
  {
    key: "isActive",
    label: "Active Status",
    type: "boolean",
    category: "Personal Info",
    operators: ["is"],
  },

  {
    key: "department",
    label: "Department",
    type: "singleSelect",
    category: "Employment",
    operators: ["is", "isNot"],
    options: ALL_DEPARTMENTS,
  },
  {
    key: "role",
    label: "Role",
    type: "singleSelect",
    category: "Employment",
    operators: ["is", "isNot"],
    options: ALL_ROLES,
  },
  {
    key: "salary",
    label: "Salary",
    type: "amount",
    category: "Employment",
    operators: ["between"],
  },
  {
    key: "joinDate",
    label: "Join Date",
    type: "date",
    category: "Employment",
    operators: ["between"],
  },
  {
    key: "skills",
    label: "Skills",
    type: "multiSelect",
    category: "Employment",
    operators: ["in", "notIn"],
    options: ALL_SKILLS,
  },

  {
    key: "projects",
    label: "Projects",
    type: "number",
    category: "Performance",
    operators: [
      "equals",
      "greaterThan",
      "lessThan",
      "greaterThanOrEqual",
      "lessThanOrEqual",
      "between",
    ],
  },
  {
    key: "lastReview",
    label: "Last Review",
    type: "date",
    category: "Performance",
    operators: ["between"],
  },
  {
    key: "performanceRating",
    label: "Performance Rating",
    type: "number",
    category: "Performance",
    operators: [
      "equals",
      "greaterThan",
      "lessThan",
      "greaterThanOrEqual",
      "lessThanOrEqual",
      "between",
    ],
  },

  {
    key: "address.city",
    label: "City",
    type: "text",
    category: "Location",
    operators: [
      "equals",
      "contains",
      "startsWith",
      "endsWith",
      "doesNotContain",
    ],
  },
  {
    key: "address.state",
    label: "State",
    type: "text",
    category: "Location",
    operators: [
      "equals",
      "contains",
      "startsWith",
      "endsWith",
      "doesNotContain",
    ],
  },
  {
    key: "address.country",
    label: "Country",
    type: "singleSelect",
    category: "Location",
    operators: ["is", "isNot"],
    options: ALL_COUNTRIES,
  },
];

export function getGroupedFieldConfigs(): {
  category: FieldCategory;
  fields: FieldConfig[];
}[] {
  const groups: { category: FieldCategory; fields: FieldConfig[] }[] = [];
  const seen = new Set<FieldCategory>();

  for (const fc of FIELD_CONFIGS) {
    if (!seen.has(fc.category)) {
      seen.add(fc.category);
      groups.push({
        category: fc.category,
        fields: FIELD_CONFIGS.filter((f) => f.category === fc.category),
      });
    }
  }
  return groups;
}
