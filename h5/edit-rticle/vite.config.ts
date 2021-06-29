/*
 * @Author: liubei
 * @Date: 2021-06-17 16:43:25
 * @LastEditTime: 2021-06-29 10:04:10
 * @Description: 
 */
const path = require('path');

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    minify: false,
    // lib: {
    //   entry: path.resolve(__dirname, 'src/index.ts'),
    //   name: 'MdEdit'
    // },
    // rollupOptions: {
    //   // 请确保外部化那些你的库中不需要的依赖
    //   external: ['vue'],
    //   output: {
    //     // 在 UMD 构建模式下为这些外部化的依赖提供一个全局变量
    //     globals: {
    //       vue: 'Vue'
    //     }
    //   }
    // }
  },
  plugins: [vue()]
})
