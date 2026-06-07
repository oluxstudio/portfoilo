import { createConfigForNuxt } from '@nuxt/eslint-config/flat'

export default createConfigForNuxt({
  features: {
    stylistic: {
      indent: 'tab', // Use tabs for indentation
      quotes: 'single',
      semi: false,
    },
  },
})
  .append({
    rules: {
      // Enforce tabs with tab width of 4
      'no-mixed-spaces-and-tabs': ['error', 'smart-tabs'],
      'indent': ['error', 'tab', {
        SwitchCase: 1,
        VariableDeclarator: 1,
        outerIIFEBody: 1,
        MemberExpression: 1,
        FunctionDeclaration: { parameters: 1, body: 1 },
        FunctionExpression: { parameters: 1, body: 1 },
        CallExpression: { arguments: 1 },
        ArrayExpression: 1,
        ObjectExpression: 1,
        ImportDeclaration: 1,
        flatTernaryExpressions: false,
        ignoreComments: false,
      }],
      'vue/html-indent': ['error', 'tab', {
        attribute: 1,
        baseIndent: 1,
        closeBracket: 0,
        alignAttributesVertically: true,
        ignores: [],
      }],
      'vue/script-indent': ['error', 'tab', {
        baseIndent: 0,
        switchCase: 1,
        ignores: [],
      }],
      '@typescript-eslint/no-unused-vars': ['error', {
        argsIgnorePattern: '^_',
        varsIgnorePattern: '^_',
      }],
    },
  })
