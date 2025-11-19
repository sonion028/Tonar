import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import dts from 'vite-plugin-dts';
import path from 'path';
import { libInjectCss } from 'vite-plugin-lib-inject-css';

export default defineConfig({
  plugins: [
    react(),
    dts({ insertTypesEntry: true, outDir: 'dist/types' }), // 生成类型声明文件
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
  },
  build: {
    lib: {
      entry: {
        index: 'src/index.ts',
        hooks: 'src/hooks/index.ts',
        utils: 'src/utils/index.ts',
        components: 'src/components/index.ts',
      },
      name: 'Tonar',
      formats: ['es'], // 只输出 ESM
      fileName: (format, entryName) => `index.${entryName}.${format}.js`,
    },
    rollupOptions: {
      external: ['react', 'react-dom'],
      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
        },
        assetFileNames: `css/[name].[hash][extname]`,
        chunkFileNames: `js/[name].[hash].js`, // 除入口外的 chunk 文件放js文件夹
      },
    },
    // 不用 libInjectCss 设置cssCodeSplit css文件名会变为index，不设置就跟随build.lib.name
    cssCodeSplit: true, // 开启 CSS 代码分割
  },
});
