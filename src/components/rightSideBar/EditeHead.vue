<template>
  <p class="subtitle">Для создания Favicon можно воспользоваться таким сервисом как
    <a class="subtitle-link" href="https://realfavicongenerator.net/">RealFaviconGenerator</a>
  </p>
  <p class="subtitle">Путь к фавикону</p>
  <input class="rightSideBar-input" type="text" value="/">
  <AppButton text="Загрузить на сервер" class="filled-btn"></AppButton>
  <p class="subtitle second">Перед сохранением рекомендуется проверить валидность кода</p>
  <AppButton text="Проверить" class="filled-btn"></AppButton>
</template>

<script setup lang="ts">
import AppButton from '../ui/AppButton.vue'

</script>

<style>
.rightSideBar-input {
  width: 100%;
  height: 30px;
  margin-bottom: 20px;
  padding: 5px 10px;
  border: 1px solid var(--accent);
  border-radius: var(--border-radius) 5px;
  background: none;
  outline: none;
  font-size: 12px;
  color: var(--font-color);
}
.subtitle-link {
  color: var(--font-color);
}
</style>