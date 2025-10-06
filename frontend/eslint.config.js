import js from '@eslint/js';
import globals from 'globals';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import tseslint from 'typescript-eslint';
import prettier from 'eslint-config-prettier';
import eslintPluginImport from 'eslint-plugin-import';

export default tseslint.config([
    {
        ignores: [
            'dist',
            'vite.config.js',
            '**/*.test.ts',
            '**/*.test.tsx',
            '**/__tests__/**',
        ],
    },
    {
        files: ['**/*.{ts,tsx}'],
        extends: [
            js.configs.recommended,
            ...tseslint.configs.recommended,
            prettier,
        ],
        languageOptions: {
            ecmaVersion: 2020,
            globals: globals.browser,
            parserOptions: {
                ecmaFeatures: {
                    jsx: true,
                },
            },
        },
        plugins: {
            react,
            'react-hooks': reactHooks,
            'react-refresh': reactRefresh,
            import: eslintPluginImport,
        },
        rules: {
            ...reactHooks.configs.recommended.rules,
            'react-refresh/only-export-components': [
                'warn',
                {
                    allowConstantExport: true,
                    allowExportNames: ['buttonVariants'],
                },
            ],
            'react/react-in-jsx-scope': 'off',
            'react/jsx-uses-react': 'off',
            // Unused variables and imports
            'no-unused-vars': 'off', // TypeScript에서는 이 규칙을 끄고 아래 TypeScript 전용 규칙 사용
            '@typescript-eslint/no-unused-vars': [
                'error',
                {
                    'argsIgnorePattern': '^_',
                    'varsIgnorePattern': '^_',
                    'caughtErrorsIgnorePattern': '^_'
                }
            ],
            // Duplicate import protection
            'no-duplicate-imports': 'error',
            'import/no-duplicates': 'error',
            // Duplicate code detection
            'no-dupe-keys': 'error',
            'no-dupe-args': 'error',
            'no-duplicate-case': 'error',
            // Allow usage of 'any' type explicitly
            '@typescript-eslint/no-explicit-any': 'warn',
            '@typescript-eslint/naming-convention': [
                'error',
                // 외부 API / OAuth 응답 또는 HTTP 헤더 등 snake_case · 하이픈 포함 키 예외 허용
                // 이 목록의 프로퍼티 이름은 네이밍 규칙 검사에서 제외합니다.
                {
                    selector: 'property',
                    format: null,
                    filter: {
                        regex: '^(Content-Type)$',
                        match: true,
                    },
                },
                {
                    selector: 'variable',
                    format: ['camelCase', 'PascalCase', 'UPPER_CASE'],
                    leadingUnderscore: 'allow',
                },
                {
                    selector: 'function',
                    format: ['camelCase', 'PascalCase'],
                },
                {
                    selector: 'parameter',
                    format: ['camelCase'],
                    leadingUnderscore: 'allow',
                },
                {
                    selector: 'class',
                    format: ['PascalCase'],
                },
                {
                    selector: 'method',
                    format: ['camelCase'],
                },
                {
                    selector: 'property',
                    format: ['camelCase', 'PascalCase', 'UPPER_CASE'],
                    leadingUnderscore: 'allow',
                    filter: {
                        regex: '^(@|[0-9])',
                        match: false,
                    },
                },
                {
                    selector: 'interface',
                    format: ['PascalCase'],
                },
                {
                    selector: 'typeAlias',
                    format: ['PascalCase'],
                },
                {
                    selector: 'typeParameter',
                    format: ['PascalCase'],
                },
                {
                    selector: 'enum',
                    format: ['PascalCase'],
                },
                {
                    selector: 'enumMember',
                    format: ['PascalCase', 'UPPER_CASE'],
                },
            ],
        },
        settings: {
            react: {
                version: 'detect',
            },
        },
    },
]);
