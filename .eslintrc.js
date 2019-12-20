module.exports = {
    parser: '@typescript-eslint/parser',
    extends: ['plugin:@typescript-eslint/recommended'],
    parserOptions: {
        project: './tsconfig.json',
        createDefaultProgram: true
    },
    plugins: ['@typescript-eslint'],
    env: {
        browser: true,
        node: true
    },
    rules: {
        semi: ['warn', 'always'],
        'no-unused-vars': [
            'warn',
            {
                args: 'none',
                vars: 'local',
                args: 'none'
            }
        ],
        quotes: ['warn', 'single'],
        'require-jsdoc': [
            'warn',
            {
                require: {
                    FunctionDeclaration: true,
                    MethodDefinition: false,
                    ArrowFunctionExpression: false,
                    FunctionExpression: false
                }
            }
        ]
    }
};
