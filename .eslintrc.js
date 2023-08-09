/* eslint-env node */
module.exports = {
    extends: [
        'eslint:recommended',
        'plugin:@typescript-eslint/recommended'
    ],
    parser: '@typescript-eslint/parser',
    plugins: ['@typescript-eslint'],
    root: true,
    rules: {
        'eqeqeq': ['error', 'always'],
        'dot-notation': 'error',
        'new-cap': 'error',
        'no-extra-semi': 'error',
        'no-empty': 'warn',
        'no-undef-init': 'error',
        'no-var': 'error',
        'prefer-const': 'error',
        'sort-imports': 'warn',
        'quotes': ['error', 'single'],

        '@typescript-eslint/array-type': ['error', { default: 'array-simple' }],
        '@typescript-eslint/ban-types': 'error',
        '@typescript-eslint/no-explicit-any': 'error',
    },
    ignorePatterns: [
        'node_modules/',
        'dist/',
        'coverage/',
        'scripts/'
    ]
};