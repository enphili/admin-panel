<template>
  <component :is="currentComponent" @authenticated="handleAuthentication"></component>
</template>

<script setup lang="ts">
import { defineAsyncComponent } from 'vue'
import {computed, ref} from 'vue'

// Динамическая загрузка компонентов
const AuthLayout = defineAsyncComponent(() => import('./layout/AuthLayout.vue'))
const MainLayout = defineAsyncComponent(() => import('./layout/MainLayout.vue'))


// Состояние аутентификации
const isAuthenticated = ref(false)

// Функция для переключения между состояниями
const currentComponent = computed(() => (isAuthenticated.value ? MainLayout : AuthLayout))

// Логика изменения состояния аутентификации
const handleAuthentication = (authenticated: boolean) => {
  isAuthenticated.value = authenticated
}

</script>

<style>
:root {
  --body-color: white;
  --main-color: rgb(226, 232, 255);
  --main-color-hover: rgb(206, 216, 255);
  --font-color: rgb(44, 42, 64);
  --font-color-transparent: rgba(44, 42, 64, 0.6);
  --accent: rgb(128, 90, 212);
  --accent-hover: rgb(136, 119, 176);
  --lines: rgb(136, 119, 176);
  --header-height: 60px;
  --left-sidebar-collapse-width: 60px;
  --left-sidebar-width: 190px;
  --right-sidebar-width: 240px;
}
@font-face {
  font-family: 'Inter';
  font-style: normal;
  font-weight: 400;
  src: local(Inter-Regular),
  url("/fonts/Inter-Regular.woff2") format("woff2"),
  url("/fonts/Inter-Regular.woff") format("woff"),
  url("/fonts/Inter-Regular.ttf") format("truetype");
  font-display: swap;
}
@font-face {
  font-family: 'Inter';
  font-style: normal;
  font-weight: bold;
  src: local(Inter-Bold),
  url("/fonts/Inter-Bold.woff2") format("woff2"),
  url("/fonts/Inter-Bold.woff") format("woff"),
  url("/fonts/Inter-Bold.ttf") format("truetype");
  font-display: swap;
}
html {
  line-height: 1.15;
  -webkit-text-size-adjust: 100%;
  height: 100%;
}

body {
  margin: 0;
  font-family: 'Inter', 'Roboto', sans-serif;
  width: 100%;
  height: 100%;
  background: var(--body-color);
  font-size: 16px;
  font-weight: normal;
  color: var(--font-color);
  transition: background-color 0.3s, color 0.3s;
}
main {
  display: block;
}
h1 {
  font-size: 2em;
  margin: 0.67em 0;
}
hr {
  box-sizing: content-box;
  height: 0;
  overflow: visible;
}
pre {
  font-family: monospace, monospace;
  font-size: 1em;
}
a {
  background-color: transparent;
}
abbr[title] {
  border-bottom: none;
  text-decoration: underline;
}
b,
strong {
  font-weight: bolder;
}
code,
kbd,
samp {
  font-family: monospace, monospace;
  font-size: 1em;
}
small {
  font-size: 80%;
}
sub,
sup {
  font-size: 75%;
  line-height: 0;
  position: relative;
  vertical-align: baseline;
}
sub {
  bottom: -0.25em;
}
sup {
  top: -0.5em;
}
img {
  border-style: none;
}
button,
input,
optgroup,
select,
textarea {
  font-family: inherit;
  font-size: 100%;
  line-height: 1.15;
  margin: 0;
}
button,
input {
  overflow: visible;
}
button,
select {
  text-transform: none;
}
button,
[type="button"],
[type="reset"],
[type="submit"] {
  -webkit-appearance: button;
}
button::-moz-focus-inner,
[type="button"]::-moz-focus-inner,
[type="reset"]::-moz-focus-inner,
[type="submit"]::-moz-focus-inner {
  border-style: none;
  padding: 0;
}
button:-moz-focusring,
[type="button"]:-moz-focusring,
[type="reset"]:-moz-focusring,
[type="submit"]:-moz-focusring {
  outline: 1px dotted ButtonText;
}
legend {
  color: inherit;
  display: table;
  max-width: 100%;
  padding: 0;
  white-space: normal;
}
progress {
  vertical-align: baseline;
}
textarea {
  overflow: auto;
}
[type="checkbox"],
[type="radio"] {
  box-sizing: border-box;
  padding: 0;
}
[type="number"]::-webkit-inner-spin-button,
[type="number"]::-webkit-outer-spin-button {
  height: auto;
}
[type="search"] {
  -webkit-appearance: textfield;
  outline-offset: -2px;
}
[type="search"]::-webkit-search-decoration {
  -webkit-appearance: none;
}
::-webkit-file-upload-button {
  -webkit-appearance: button;
  font: inherit;
}
details {
  display: block;
}
summary {
  display: list-item;
}
template {
  display: none;
}
[hidden] {
  display: none;
}
* {
  padding: 0;
  margin: 0;
  border: none;
}
*,
*::before,
*::after {
  box-sizing: border-box;
}
.fl-row {
  display: flex;
  flex-direction: row;
  align-items: center;
}
</style>
