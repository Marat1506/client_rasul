import importPlugin from 'eslint-plugin-import';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default [
    {
        files: ['**/*.{js,ts,jsx,tsx}'],
        languageOptions: {
            parser: tseslint.parser,
            parserOptions: {
                ecmaVersion: 2020,
                sourceType: 'module',
                ecmaFeatures: { jsx: true },
            },
            globals: {
                ...globals.browser,
                ...globals.node,
            },
        },
        plugins: {
            react,
            'react-hooks': reactHooks,
            '@typescript-eslint': tseslint.plugin,
            import: importPlugin,
        },
        rules: {
            'semi': ['error', 'always'],
            'quotes': ['error', 'single'],
            'no-unused-vars': 'off',
            '@typescript-eslint/no-unused-vars': 'off',
            'no-console': 'off', // Console log warnings disabled

            '@typescript-eslint/no-explicit-any': 'off',
            '@typescript-eslint/consistent-type-definitions': ['error', 'interface'],

            'react/jsx-uses-react': 'off',
            'react/react-in-jsx-scope': 'off',
            'react/self-closing-comp': 'off',

            'react-hooks/rules-of-hooks': 'error',
            'react-hooks/exhaustive-deps': 'off', // useEffect dependencies check disabled

            'import/order': [
                'warn', // Changed from 'error' to 'warn' to not block deployment
                {
                    groups: [
                        'builtin',
                        'external',
                        'internal',
                        ['parent', 'sibling', 'index'],
                    ],
                    pathGroups: [
                        {
                            pattern: 'react',
                            group: 'builtin',
                            position: 'before',
                        },
                        {
                            pattern: 'next',
                            group: 'builtin',
                            position: 'before',
                        },
                        {
                            pattern: '@/**',
                            group: 'internal',
                        },
                    ],
                    pathGroupsExcludedImportTypes: ['react'],
                    alphabetize: {
                        order: 'asc',
                        caseInsensitive: true,
                    },
                    'newlines-between': 'always',
                },
            ],
        },
        settings: {
            react: {
                version: 'detect',
            },
        },
    },
];