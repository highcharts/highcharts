module.exports = {
    extends: [],
    parser: '@typescript-eslint/parser',
    parserOptions: {
        ecmaVersion: 2020,
        sourceType: 'module'
    },
    plugins: [
        '@typescript-eslint'
    ],
    env: {
        es2021: true,
        node: true,
        browser: true
    },
    rules: {
        'no-console': 0,
        'require-jsdoc': 0,
        'no-underscore-dangle': 0,
        quotes: [1, 'single'],
        'semi': 1,
        'keyword-spacing': 1,
        'object-curly-spacing': [1, 'always']
    },
    overrides: [
        {
            // Browser runtimes are injected as ES5 scripts, not modules.
            files: ['**/runtime.js'],
            parser: 'espree',
            parserOptions: {
                ecmaVersion: 2020,
                sourceType: 'script'
            }
        }
    ],
    root: true
};
