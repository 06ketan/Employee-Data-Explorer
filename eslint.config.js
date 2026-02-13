import js from "@eslint/js";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import tseslint from "typescript-eslint";
import { defineConfig, globalIgnores } from "eslint/config";
import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
});

export default defineConfig([
  globalIgnores(["dist", "vite.config.ts", "eslint.config.js"]),

  // ─── Legacy plugins via FlatCompat ───────────────────────────────
  ...compat.extends(
    "plugin:import/errors",
    "plugin:import/warnings",
    "plugin:prettier/recommended",
  ),

  // ─── Main config (flat-config native plugins) ───────────────────
  {
    files: ["**/*.{ts,tsx}"],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parserOptions: {
        project: "./tsconfig.app.json",
        tsconfigRootDir: __dirname,
        sourceType: "module",
      },
    },
    settings: {
      "import/resolver": {
        typescript: {
          project: `${__dirname}/tsconfig.app.json`,
        },
      },
    },
    rules: {
      "no-unused-expressions": "off",
      "@typescript-eslint/no-unused-expressions": "off",
      "@typescript-eslint/no-explicit-any": "warn",
      "prettier/prettier": "off",
      "import/order": [
        "warn",
        {
          groups: [
            ["builtin", "external"],
            ["internal"],
            ["sibling", "parent", "index"],
          ],
          pathGroups: [
            { pattern: "@actions/**", group: "internal", position: "before" },
            { pattern: "@api/**", group: "internal", position: "before" },
            { pattern: "@app/**", group: "internal", position: "before" },
            { pattern: "@assets/**", group: "internal", position: "before" },
            {
              pattern: "@components/**",
              group: "internal",
              position: "before",
            },
            { pattern: "@config/**", group: "internal", position: "before" },
            { pattern: "@engine/**", group: "internal", position: "before" },
            {
              pattern: "@middleware/**",
              group: "internal",
              position: "before",
            },
            { pattern: "@mock/**", group: "internal", position: "before" },
            { pattern: "@models/**", group: "internal", position: "before" },
            { pattern: "@schema/**", group: "internal", position: "before" },
            { pattern: "@store/**", group: "internal", position: "before" },
          ],
          alphabetize: { order: "asc", caseInsensitive: true },
        },
      ],
      "@typescript-eslint/consistent-type-imports": [
        "warn",
        {
          prefer: "type-imports",
          fixStyle: "separate-type-imports",
          disallowTypeAnnotations: false,
        },
      ],
      "@typescript-eslint/no-unused-vars": [
        "warn",
        {
          args: "all",
          argsIgnorePattern: "^_",
          caughtErrors: "all",
          caughtErrorsIgnorePattern: "^_",
          destructuredArrayIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          ignoreRestSiblings: true,
        },
      ],
      "@typescript-eslint/explicit-function-return-type": "off",
      "@typescript-eslint/explicit-module-boundary-types": "off",
    },
  },
]);
