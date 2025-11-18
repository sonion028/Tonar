import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import dts from 'vite-plugin-dts';
import path from 'path';
import { libInjectCss } from 'vite-plugin-lib-inject-css';

export default defineConfig({
  plugins: [
    react(),
    dts({ insertTypesEntry: true }), // 生成类型声明文件
    libInjectCss(), // 注入 CSS 到每个生成的 chunk 文件
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  // CSS 配置
  css: {
    modules: {
      localsConvention: 'camelCaseOnly', // 推荐使用驼峰命名
    },
    preprocessorOptions: {
      scss: {
        // 如果你有全局 SCSS 变量，可以在这里导入
        // additionalData: `@import "@/styles/variables.scss";`,
      },
    },
  },
  build: {
    lib: {
      entry: 'src/index.ts',
      name: 'Tonar',
      formats: ['es'], // 只输出 ESM
      fileName: (format) => `index.${format}.js`,
    },
    rollupOptions: {
      external: ['react', 'react-dom'],
      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
        },
        assetFileNames: `css/[name].[hash][extname]`,
        // assetFileNames: ({ names }) => {
        //   const path = /\.(css|scss|sass)$/i.test(names[0]) ? 'css' : 'assets';
        //   return `${path}/[name].[hash][extname]`;
        // },
      },
    },
    // 不用 libInjectCss 设置cssCodeSplit css文件名会变为index，不设置就跟随build.lib.name
    cssCodeSplit: true, // 开启 CSS 代码分割
  },
});
