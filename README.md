# Employee Data Explorer

A dynamic filter component system built with **React**, **TypeScript**, **Material UI**, and **Vite**. Browse, filter, sort, and export employee data through a rich, dark-themed interface.

## Features

### Filtering

- **14 filterable fields** across Personal Info, Employment, Performance, and Location categories
- **7 field types**: text, number, date, amount, single-select, multi-select, boolean
- **16 operators** including equals, contains, between, in/not-in, and more
- **AND logic** between fields, **OR logic** within the same field
- **Max 10 concurrent filters** with group-by-category dropdown
- **Toggle filters** on/off without removing them
- **Active filter summary** chips above the table
- **Filter persistence** via `localStorage`

### Data Table

- Sortable columns (click headers)
- Paginated with 25 rows/page default (5, 10, 25, 50 options)
- Smart rendering for arrays, currencies, dates, and booleans
- Responsive layout

### Export

- **CSV** and **JSON** export of filtered data
- Timestamped filenames (e.g. `employees_filtered_2026-02-13_080000.csv`)

## Tech Stack

| Layer      | Technology            |
| ---------- | --------------------- |
| Framework  | React 19 + TypeScript |
| Build      | Vite 6                |
| UI Library | Material UI 6         |
| Icons      | Lucide React          |
| Dates      | Day.js                |
| Mock API   | json-server           |
| Linting    | ESLint + Prettier     |

## Getting Started

```bash
# Install dependencies
npm install

# Start mock API server (port 3001)
npx json-server --watch db.json --port 3001

# Start dev server (port 5173)
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

## Project Structure

```
src/
├── api/
│   └── employeeApi.ts          # Data fetching with API fallback
├── components/
│   ├── DataTable/
│   │   └── DataTable.tsx       # Sortable, paginated table
│   ├── FilterBuilder/
│   │   └── FilterBuilder.tsx   # Filter orchestrator with summary
│   ├── FilterInputs/
│   │   ├── index.ts            # Registry mapping FieldType → Component
│   │   ├── TextFilterInput.tsx
│   │   ├── NumberFilterInput.tsx       # Supports Between range
│   │   ├── DateRangeFilterInput.tsx
│   │   ├── AmountRangeFilterInput.tsx
│   │   ├── SingleSelectFilterInput.tsx
│   │   ├── MultiSelectFilterInput.tsx  # Select All / Clear All
│   │   └── BooleanFilterInput.tsx
│   └── FilterRow/
│       └── FilterRow.tsx       # Grouped dropdown + toggle switch
├── config/
│   └── filterConfig.ts         # Field definitions with categories
├── engine/
│   └── filterEngine.ts         # Client-side filter logic
├── hooks/
│   ├── useEmployees.ts         # Data fetching hook
│   └── useFilters.ts           # Filter state management
├── types/
│   └── index.ts                # All TypeScript interfaces
├── utils/
│   ├── csv.ts                  # CSV/JSON export with timestamps
│   └── helpers.ts              # Utilities (nested access, debounce)
├── App.tsx                     # Root component
├── main.tsx                    # Entry point
└── index.css                   # Global styles
```

## Extending the Filter System

### Adding a New Filterable Field

1. **Add the field config** in `src/config/filterConfig.ts`:

   ```ts
   {
     key: "newField",
     label: "New Field",
     type: "text",
     category: "Employment",
     operators: ["equals", "contains"],
   }
   ```

2. If using a new field type, create a component in `src/components/FilterInputs/` and register it in the `FILTER_INPUT_REGISTRY` in `index.ts`.

### Adding a New Operator

1. Add the operator to the `FilterOperator` union in `src/types/index.ts`
2. Add its label in `OPERATOR_LABELS`
3. Implement the matching logic in `src/engine/filterEngine.ts`

## Scripts

| Command           | Description              |
| ----------------- | ------------------------ |
| `npm run dev`     | Start Vite dev server    |
| `npm run build`   | Production build         |
| `npm run lint`    | Run ESLint               |
| `npm run preview` | Preview production build |

## License

MIT
