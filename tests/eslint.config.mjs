import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import playwright from 'eslint-plugin-playwright';
import stylistic from '@stylistic/eslint-plugin';

export default tseslint.config(
    {
        plugins: {
            '@stylistic': stylistic
        },
        rules: {
            '@stylistic/semi': 'error',
            "@stylistic/indent": ["error", 4],
            "@stylistic/no-tabs": 'error',
            "@stylistic/comma-dangle": ["error", "only-multiline"],
            "@stylistic/space-before-function-paren": ["error", { anonymous: "always", named: "never"}],
            "@stylistic/max-len": [
                "error",
                {
                    code: 80,
                    ignoreTemplateLiterals: true,
                    ignoreStrings: true,
                    ignoreComments: true
                }
            ],
            "@stylistic/quotes": ["error", "single"],
        }
    },
    {
       ignores: [
            'eslint.config.mjs',
            'qunit/vendor/**',
            'tsconfig.json',
            'visual/visual-setup.js'
        ]
    },
    eslint.configs.recommended,
    ...tseslint.configs.recommended,
    ...tseslint.configs.recommendedTypeChecked,
    {
        ...playwright.configs['flat/recommended'],
        files: ['**/*.spec.*'],
        rules: {
            ...playwright.configs['flat/recommended'].rules,
            "playwright/no-networkidle": "off",
            // Disabling some rules that makes tests cumbersome to write
            "@typescript-eslint/no-unsafe-member-access": "off",
            "@typescript-eslint/no-unsafe-assignment": "off",
            "@typescript-eslint/no-unsafe-argument": "off",
            "@typescript-eslint/no-unsafe-call": "off",
            "@typescript-eslint/no-unsafe-return": "off",
            "@typescript-eslint/no-explicit-any": "off",
        },
    },
    {
        languageOptions: {
            parser: tseslint.parser,
            parserOptions: {
                projectService: true,
                allowDefaultProject: true,
                tsconfigRootDir: import.meta.dirname,
            },
        },
    }
);
