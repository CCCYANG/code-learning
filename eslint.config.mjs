import js from '@eslint/js'
import tseslint from 'typescript-eslint'

export default tseslint.config(
  {
    ignores: ['node_modules/**']
  },
  {
    files: ['**/*.{js,mjs,cjs}'],
    ...js.configs.recommended,
    rules: {
      semi: ['error', 'never'],
      indent: ['error', 2, { SwitchCase: 1 }],
      'space-before-function-paren': ['error', 'always']
    }
  },
  {
    files: ['**/*.{ts,mts,cts}'],
    extends: [...tseslint.configs.recommended],
    rules: {
      semi: ['error', 'never'],
      indent: ['error', 2, { SwitchCase: 1 }],
      'space-before-function-paren': ['error', 'always']
    }
  }
)
