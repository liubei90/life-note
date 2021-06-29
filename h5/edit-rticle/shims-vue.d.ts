/*
 * @Author: liubei
 * @Date: 2021-06-17 17:09:09
 * @LastEditTime: 2021-06-29 10:03:15
 * @Description: 
 */
declare module '*.vue' {
  import { App, defineComponent } from 'vue'
  const component: ReturnType<typeof defineComponent> & {
    // install?: (app: App) => void
  }
  export default component
}

