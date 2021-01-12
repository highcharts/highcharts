module.exports = {
    extends: [],
    parser: '@typescript-eslint/parser',
    parserOptions: {
        ecmaVersion: 2020,
        sourceType: 'module'
    },
    plugins: [
        'highcharts',
        '@typescript-eslint'
    ],
    env: {
        es2021: true,
        node: true
    },
    rules: {
        'no-console': 0,
        'require-jsdoc': 0,
        quotes: [1, 'single']
    },
    root: true
};
