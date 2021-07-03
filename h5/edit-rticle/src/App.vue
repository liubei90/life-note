<!--
 * @Author: liubei
 * @Date: 2021-06-17 16:45:54
 * @LastEditTime: 2021-06-30 11:44:22
 * @Description: 
-->
<template>
  <div id="vditor"></div>
</template>

<script lang="ts">
import { defineComponent, onMounted, onUnmounted } from "vue";
import Vditor from "vditor";
import "vditor/src/assets/scss/index.scss";

export default defineComponent({
  name: "App",
  setup: () => {
    let theVditor;
    onMounted(() => {
      theVditor = new Vditor("vditor", {
        toolbarConfig: {
          pin: true,
        },
        counter: {
          enable: true,
        },
        height: window.innerHeight / 2,
        toolbar: [
          "emoji",
          "link",
          "upload",
          "edit-mode",
          {
            name: "more",
            toolbar: ["insert-after", "fullscreen", "preview", "info", "help"],
          },
        ],
      });
    });

    onUnmounted(() => {
      theVditor.destroy();
    });

    return {};
  },
});
</script>

<style>
html,
body {
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  padding: 0;
  margin: 0;
}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  width: 100%;
  height: 100%;
}

.vditor-container {
  width: 100%;
  height: 100%;
}
</style>
