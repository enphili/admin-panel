<template>
  <p class="subtitle">Выбрать файл страницы</p>
  <ul class="pages-list">
    <li
      v-for="(page, index) in pages"
      :key="index"
    >

      <a
        href="#"
        class="page-link"
      >
        {{ `${index + 1}. ${page}`}}
      </a>

    </li>
  </ul>
</template>

<script setup lang="ts">
const pages = [
  'index.html',
  'about.html',
  'portfolio.html',
  'contacts.html',
  'terms.html',
]

</script>

<style>
.subtitle {
  margin-bottom: 20px;
  font-size: 12px;
  font-weight: normal;
  line-height: 15px;
  color: var(--font-color);
}
.pages-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 100%;
  padding: 15px;
  border: 1px solid var(--accent);
  border-radius: 5px;
  list-style: none;
  overflow-y: auto;
  scrollbar-width: thin;
  scrollbar-color: var(--font-color) var(--lines);
}
.pages-list li:hover a {
  color: var(--accent);
}
.second {
  margin-top: 30px;
}
.pages-list::-webkit-scrollbar {
  width: 6px;
}
.pages-list::-webkit-scrollbar-track {
  background: var(--font-color);
}
.pages-list::-webkit-scrollbar-thumb {
  background-color: var(--lines);
  border-radius: 2px;
  border: 3px solid var(--font-color)
}
.page-link {
  font-size: 12px;
  font-weight: normal;
  line-height: 15px;
  color: var(--font-color);
  text-decoration: none;
  transition: color 0.1s ease;
}
</style>