import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import react from 'eslint-plugin-react'
import prettier from 'eslint-config-prettier'
import { globalIgnores } from 'eslint/config'

export default [
  globalIgnores(['dist', 'node_modules']), // 忽略 dist 和 node_modules 目录
  {
    files: ['**/*.{ts,tsx}'], // 对所有 TypeScript 和 TypeScript React 文件应用规则
    extends: [
      js.configs.recommended, // ✅ JavaScript 规则
      ...tseslint.configs.recommended, // ✅ TypeScript 规则 // 最新写法需要展开
      reactHooks.configs['recommended-latest'], // ✅ React Hooks 规则
      reactRefresh.configs.vite, // ✅ React Refresh 规则
      react.configs.recommended,   // ✅ React 规则
      prettier,                    // ✅ 关闭和 Prettier 冲突的规则
    ],
    languageOptions: {
      ecmaVersion: 2020, // ✅ 语法检查 支持的 ES 版本
      globals: globals.browser, // ✅ 浏览器全局变量
    },
    settings: {
      react: {
        version: 'detect', // 自动检测 React 版本
      },
    },
    rules: {
      '@typescript-eslint/no-unused-expressions': 'off', // ✅ 关闭未使用表达式校验，开启React常用的短路规则可能误判
      '@typescript-eslint/no-unused-vars': ['warn'], // ✅ 警告未使用变量 如遇到 与tsconfig.json 冲突，以ts为准
    },
  },
]
