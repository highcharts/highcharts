import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import playwright from 'eslint-plugin-playwright'

export default tseslint.config(
    {
       ignores: [ "eslint.config.mjs" ]
    },
    eslint.configs.recommended,
    tseslint.configs.recommended,
    tseslint.configs.recommendedTypeChecked,
    {
        ...playwright.configs['flat/recommended'],
        files: ['**/*.spec.*'],
        rules: {
            ...playwright.configs['flat/recommended'].rules,
            "playwright/no-networkidle": "off",
            // Disabling some rules that makes tests cumbersome to write
            "@typescript-eslint/no-unsafe-member-access": "off",
            "@typescript-eslint/no-unsafe-assignment": "off",
            "@typescript-eslint/no-unsafe-call": "off",
            "@typescript-eslint/no-unsafe-return": "off",
            "@typescript-eslint/no-explicit-any": "off",
        },
    },
    {
        languageOptions: {
            parserOptions: {
                projectService: true,
                allowDefaultProject: true,
                tsconfigRootDir: import.meta.dirname,
            },
        },
    }
);
