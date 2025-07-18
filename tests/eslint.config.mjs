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
            "playwright/no-networkidle": "off"
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
