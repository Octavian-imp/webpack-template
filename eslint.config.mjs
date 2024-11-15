import typescriptEslintEslintPlugin from "@typescript-eslint/eslint-plugin"
import react from "eslint-plugin-react"
import tsParser from "@typescript-eslint/parser"
import typescriptEslint from "typescript-eslint"

export default [
  {
    plugins: {
      "@typescript-eslint": typescriptEslint,
      "@typescript-eslint": typescriptEslintEslintPlugin,
      react,
    },

    languageOptions: {
      parser: tsParser,
    },
  },
]
