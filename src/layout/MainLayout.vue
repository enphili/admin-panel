<template>
  <div>
    <Header></Header>
    <LeftBar></LeftBar>
    <div class="iframe"></div>
    <div class="right-bar"></div>
  </div>
</template>

<script setup lang="ts">
import Header from '../components/Header.vue'
import LeftBar from '../components/LeftBar.vue'

</script>

<style>
.iframe {
  height: 2000px;
  top: var(--header-height);
  left: var(--left-sidebar-collapse-width);
  right: var(--right-sidebar-width);
  background: darkmagenta;
}
.right-bar {
  position: fixed;
  right: 0;
  bottom: 0;
  width: var(--right-sidebar-width);
  height: calc(100vh - var(--header-height));
  background: aqua;
  z-index: 20;
}
</style>