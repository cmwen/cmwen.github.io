import js from "@eslint/js";
import astroEslintParser from "astro-eslint-parser";
import * as tsParser from "@typescript-eslint/parser";
import astroPlugin from "eslint-plugin-astro";

export default [
  js.configs.recommended,
  ...astroPlugin.configs.recommended,
  {
    files: ["**/*.astro"],
    languageOptions: {
      parser: astroEslintParser,
      parserOptions: {
        parser: tsParser,
        extraFileExtensions: [".astro"],
      },
    },
  },
  {
    ignores: [
      ".husky",
      ".vscode",
      ".astro",
      "node_modules",
      "public",
      "dist",
      ".yarn",
      ".eslintrc.js",
    ],
  },
];
