<template>
  <p class="subtitle onImg">Загрузить новое изображение</p>
  <p class="file-info-title">Текущий файл изображения:</p>
  <p class="file-info">{{ '63cc75764_1_img.db3b94e9.jpg' }}</p>
  <p class="file-info-title">Текущий размер изображения:</p>
  <p class="file-info mb20">{{ '1200 х 800' }} {{ '589kB' }}</p>
  <label for="loadFile1" class="file-upload">
    Выбрать файл
    <input id="loadFile0" type="file" class="upload-input" accept="image/*">
  </label>

  <p class="subtitle second">Атрибуты</p>
  <label for="imgAlt" class="attribute">
    <span class="atr-span">alt</span>
    <input id="imgAlt" type="text" class="rightSideBar-input atr-input" placeholder="Описание изображения">
  </label>

  <label for="imgTitle" class="attribute">
    <span class="atr-span">title</span>
    <input id="imgTitle" type="text" class="rightSideBar-input atr-input" placeholder="Текст подсказки">
  </label>

  <label for="imgWidth" class="attribute">
    <span class="atr-span">width</span>
    <input id="imgWidth" type="text" class="rightSideBar-input atr-input" placeholder="Ширина изображения в px">
  </label>

  <label for="imgHeight" class="attribute">
    <span class="atr-span">height</span>
    <input id="imgHeight" type="text" class="rightSideBar-input atr-input" placeholder="Высота изображения в px">
  </label>

  <label for="imgLazy" class="attribute-for-checkbox">
    <span class="atr-span">loading = "lazy"</span>
    <input id="imgLazy" type="checkbox" class="checkbox-input">
    <svg class="checkbox-input-svg" width="8.003906" height="7.845459" viewBox="0 0 8.00391 7.84546" fill="none">
      <path id="check" d="M0.5 3.5L3.55 7L7.5 0.5" stroke="#FFFFFF" stroke-opacity="1.000000" stroke-width="1.000000" stroke-linecap="round"/>
    </svg>
  </label>

  <p class="subtitle second">Альтернативные изображения</p>
  <div class="atr-header">
    <span>srcset</span>
    <span>sizes</span>
    <button class="atr-btn-add-more">
      <svg width="10.000000" height="10.000000" viewBox="0 0 10 10" fill="none">
        <path id="plus" d="M5.76 0.76C5.76 0.34 5.42 0 5 0C4.57 0 4.23 0.34 4.23 0.76L4.23 4.23L0.76 4.23C0.34 4.23 0 4.57 0 5C0 5.42 0.34 5.76 0.76 5.76L4.23 5.76L4.23 9.23C4.23 9.65 4.57 10 5 10C5.42 10 5.76 9.65 5.76 9.23L5.76 5.76L9.23 5.76C9.65 5.76 10 5.42 10 5C10 4.57 9.65 4.23 9.23 4.23L5.76 4.23L5.76 0.76Z" fill="#FFFFFF" fill-opacity="1.000000" fill-rule="nonzero"/>
      </svg>
    </button>
  </div>
  <div class="art-values">
    <input type="text" class="art-values-input first-width" placeholder="800w">
    <input type="text" class="art-values-input second-width" placeholder="(max-width: 768px) 800px">
    <label for="loadFile1" class="file-upload for-art">
      <input id="loadFile1" class="upload-input" type="file" accept="image/*">
      <svg width="10.000000" height="10.000000" viewBox="0 0 10 10" fill="none">
        <path id="download" d="M5.62 0.62C5.62 0.27 5.34 0 5 0C4.65 0 4.37 0.27 4.37 0.62L4.37 5.36L2.94 3.93C2.69 3.68 2.3 3.68 2.05 3.93C1.81 4.17 1.81 4.57 2.05 4.81L4.55 7.31C4.8 7.56 5.19 7.56 5.44 7.31L7.94 4.81C8.18 4.57 8.18 4.17 7.94 3.93C7.69 3.68 7.3 3.68 7.05 3.93L5.62 5.36L5.62 0.62ZM1.25 6.87C0.56 6.87 0 7.43 0 8.12L0 8.75C0 9.43 0.56 10 1.25 10L8.75 10C9.43 10 10 9.43 10 8.75L10 8.12C10 7.43 9.43 6.87 8.75 6.87L6.76 6.87L5.88 7.75C5.39 8.24 4.6 8.24 4.11 7.75L3.23 6.87L1.25 6.87ZM8.43 7.96C8.46 7.96 8.49 7.97 8.52 7.97C8.55 7.98 8.58 7.99 8.61 8C8.64 8.01 8.67 8.03 8.69 8.04C8.72 8.06 8.74 8.08 8.76 8.1C8.79 8.12 8.81 8.15 8.82 8.17C8.84 8.2 8.85 8.22 8.87 8.25C8.88 8.28 8.89 8.31 8.89 8.34C8.9 8.37 8.9 8.4 8.9 8.43C8.9 8.46 8.9 8.49 8.89 8.52C8.89 8.55 8.88 8.58 8.87 8.61C8.85 8.64 8.84 8.67 8.82 8.69C8.81 8.72 8.79 8.74 8.76 8.76C8.74 8.79 8.72 8.81 8.69 8.82C8.67 8.84 8.64 8.85 8.61 8.87C8.58 8.88 8.55 8.89 8.52 8.89C8.49 8.9 8.46 8.9 8.43 8.9C8.4 8.9 8.37 8.9 8.34 8.89C8.31 8.89 8.28 8.88 8.25 8.87C8.22 8.85 8.2 8.84 8.17 8.82C8.15 8.81 8.12 8.79 8.1 8.76C8.08 8.74 8.06 8.72 8.04 8.69C8.03 8.67 8.01 8.64 8 8.61C7.99 8.58 7.98 8.55 7.97 8.52C7.97 8.49 7.96 8.46 7.96 8.43C7.96 8.4 7.97 8.37 7.97 8.34C7.98 8.31 7.99 8.28 8 8.25C8.01 8.22 8.03 8.2 8.04 8.17C8.06 8.15 8.08 8.12 8.1 8.1C8.12 8.08 8.15 8.06 8.17 8.04C8.2 8.03 8.22 8.01 8.25 8C8.28 7.99 8.31 7.98 8.34 7.97C8.37 7.97 8.4 7.96 8.43 7.96Z" fill="#FFFFFF" fill-opacity="1.000000" fill-rule="nonzero"/>
      </svg>
    </label>
  </div>
  <div class="art-values">
    <input type="text" class="art-values-input first-width" placeholder="800w / 1х">
    <input type="text" class="art-values-input second-width" placeholder="(max-width: 768px) 100vw">
    <label for="loadFile1" class="file-upload for-art">
      <input id="loadFile1" class="upload-input" type="file" accept="image/*">
      <svg width="10.000000" height="10.000000" viewBox="0 0 10 10" fill="none">
        <path id="download" d="M5.62 0.62C5.62 0.27 5.34 0 5 0C4.65 0 4.37 0.27 4.37 0.62L4.37 5.36L2.94 3.93C2.69 3.68 2.3 3.68 2.05 3.93C1.81 4.17 1.81 4.57 2.05 4.81L4.55 7.31C4.8 7.56 5.19 7.56 5.44 7.31L7.94 4.81C8.18 4.57 8.18 4.17 7.94 3.93C7.69 3.68 7.3 3.68 7.05 3.93L5.62 5.36L5.62 0.62ZM1.25 6.87C0.56 6.87 0 7.43 0 8.12L0 8.75C0 9.43 0.56 10 1.25 10L8.75 10C9.43 10 10 9.43 10 8.75L10 8.12C10 7.43 9.43 6.87 8.75 6.87L6.76 6.87L5.88 7.75C5.39 8.24 4.6 8.24 4.11 7.75L3.23 6.87L1.25 6.87ZM8.43 7.96C8.46 7.96 8.49 7.97 8.52 7.97C8.55 7.98 8.58 7.99 8.61 8C8.64 8.01 8.67 8.03 8.69 8.04C8.72 8.06 8.74 8.08 8.76 8.1C8.79 8.12 8.81 8.15 8.82 8.17C8.84 8.2 8.85 8.22 8.87 8.25C8.88 8.28 8.89 8.31 8.89 8.34C8.9 8.37 8.9 8.4 8.9 8.43C8.9 8.46 8.9 8.49 8.89 8.52C8.89 8.55 8.88 8.58 8.87 8.61C8.85 8.64 8.84 8.67 8.82 8.69C8.81 8.72 8.79 8.74 8.76 8.76C8.74 8.79 8.72 8.81 8.69 8.82C8.67 8.84 8.64 8.85 8.61 8.87C8.58 8.88 8.55 8.89 8.52 8.89C8.49 8.9 8.46 8.9 8.43 8.9C8.4 8.9 8.37 8.9 8.34 8.89C8.31 8.89 8.28 8.88 8.25 8.87C8.22 8.85 8.2 8.84 8.17 8.82C8.15 8.81 8.12 8.79 8.1 8.76C8.08 8.74 8.06 8.72 8.04 8.69C8.03 8.67 8.01 8.64 8 8.61C7.99 8.58 7.98 8.55 7.97 8.52C7.97 8.49 7.96 8.46 7.96 8.43C7.96 8.4 7.97 8.37 7.97 8.34C7.98 8.31 7.99 8.28 8 8.25C8.01 8.22 8.03 8.2 8.04 8.17C8.06 8.15 8.08 8.12 8.1 8.1C8.12 8.08 8.15 8.06 8.17 8.04C8.2 8.03 8.22 8.01 8.25 8C8.28 7.99 8.31 7.98 8.34 7.97C8.37 7.97 8.4 7.96 8.43 7.96Z" fill="#FFFFFF" fill-opacity="1.000000" fill-rule="nonzero"/>
      </svg>
    </label>
  </div>

  <p class="subtitle second">Контейнер <\picture>\'</p>
  <div class="atr-header">
    <span>srcset</span>
    <span>sizes</span>
    <button class="atr-btn-add-more">
      <svg width="10.000000" height="10.000000" viewBox="0 0 10 10" fill="none">
        <path id="plus" d="M5.76 0.76C5.76 0.34 5.42 0 5 0C4.57 0 4.23 0.34 4.23 0.76L4.23 4.23L0.76 4.23C0.34 4.23 0 4.57 0 5C0 5.42 0.34 5.76 0.76 5.76L4.23 5.76L4.23 9.23C4.23 9.65 4.57 10 5 10C5.42 10 5.76 9.65 5.76 9.23L5.76 5.76L9.23 5.76C9.65 5.76 10 5.42 10 5C10 4.57 9.65 4.23 9.23 4.23L5.76 4.23L5.76 0.76Z" fill="#FFFFFF" fill-opacity="1.000000" fill-rule="nonzero"/>
      </svg>
    </button>
  </div>
  <div class="art-values">
    <input type="text" class="art-values-input first-width" placeholder="800w">
    <input type="text" class="art-values-input second-width" placeholder="(max-width: 768px) 800px">
    <label for="loadFile1" class="file-upload for-art">
      <input id="loadFile1" class="upload-input" type="file" accept="image/*">
      <svg width="10.000000" height="10.000000" viewBox="0 0 10 10" fill="none">
        <path id="download" d="M5.62 0.62C5.62 0.27 5.34 0 5 0C4.65 0 4.37 0.27 4.37 0.62L4.37 5.36L2.94 3.93C2.69 3.68 2.3 3.68 2.05 3.93C1.81 4.17 1.81 4.57 2.05 4.81L4.55 7.31C4.8 7.56 5.19 7.56 5.44 7.31L7.94 4.81C8.18 4.57 8.18 4.17 7.94 3.93C7.69 3.68 7.3 3.68 7.05 3.93L5.62 5.36L5.62 0.62ZM1.25 6.87C0.56 6.87 0 7.43 0 8.12L0 8.75C0 9.43 0.56 10 1.25 10L8.75 10C9.43 10 10 9.43 10 8.75L10 8.12C10 7.43 9.43 6.87 8.75 6.87L6.76 6.87L5.88 7.75C5.39 8.24 4.6 8.24 4.11 7.75L3.23 6.87L1.25 6.87ZM8.43 7.96C8.46 7.96 8.49 7.97 8.52 7.97C8.55 7.98 8.58 7.99 8.61 8C8.64 8.01 8.67 8.03 8.69 8.04C8.72 8.06 8.74 8.08 8.76 8.1C8.79 8.12 8.81 8.15 8.82 8.17C8.84 8.2 8.85 8.22 8.87 8.25C8.88 8.28 8.89 8.31 8.89 8.34C8.9 8.37 8.9 8.4 8.9 8.43C8.9 8.46 8.9 8.49 8.89 8.52C8.89 8.55 8.88 8.58 8.87 8.61C8.85 8.64 8.84 8.67 8.82 8.69C8.81 8.72 8.79 8.74 8.76 8.76C8.74 8.79 8.72 8.81 8.69 8.82C8.67 8.84 8.64 8.85 8.61 8.87C8.58 8.88 8.55 8.89 8.52 8.89C8.49 8.9 8.46 8.9 8.43 8.9C8.4 8.9 8.37 8.9 8.34 8.89C8.31 8.89 8.28 8.88 8.25 8.87C8.22 8.85 8.2 8.84 8.17 8.82C8.15 8.81 8.12 8.79 8.1 8.76C8.08 8.74 8.06 8.72 8.04 8.69C8.03 8.67 8.01 8.64 8 8.61C7.99 8.58 7.98 8.55 7.97 8.52C7.97 8.49 7.96 8.46 7.96 8.43C7.96 8.4 7.97 8.37 7.97 8.34C7.98 8.31 7.99 8.28 8 8.25C8.01 8.22 8.03 8.2 8.04 8.17C8.06 8.15 8.08 8.12 8.1 8.1C8.12 8.08 8.15 8.06 8.17 8.04C8.2 8.03 8.22 8.01 8.25 8C8.28 7.99 8.31 7.98 8.34 7.97C8.37 7.97 8.4 7.96 8.43 7.96Z" fill="#FFFFFF" fill-opacity="1.000000" fill-rule="nonzero"/>
      </svg>
    </label>
  </div>
  <div class="art-values">
    <input type="text" class="art-values-input first-width" placeholder="800w / 1х">
    <input type="text" class="art-values-input second-width" placeholder="(max-width: 768px) 100vw">
    <label for="loadFile1" class="file-upload for-art">
      <input id="loadFile1" class="upload-input" type="file" accept="image/*">
      <svg width="10.000000" height="10.000000" viewBox="0 0 10 10" fill="none">
        <path id="download" d="M5.62 0.62C5.62 0.27 5.34 0 5 0C4.65 0 4.37 0.27 4.37 0.62L4.37 5.36L2.94 3.93C2.69 3.68 2.3 3.68 2.05 3.93C1.81 4.17 1.81 4.57 2.05 4.81L4.55 7.31C4.8 7.56 5.19 7.56 5.44 7.31L7.94 4.81C8.18 4.57 8.18 4.17 7.94 3.93C7.69 3.68 7.3 3.68 7.05 3.93L5.62 5.36L5.62 0.62ZM1.25 6.87C0.56 6.87 0 7.43 0 8.12L0 8.75C0 9.43 0.56 10 1.25 10L8.75 10C9.43 10 10 9.43 10 8.75L10 8.12C10 7.43 9.43 6.87 8.75 6.87L6.76 6.87L5.88 7.75C5.39 8.24 4.6 8.24 4.11 7.75L3.23 6.87L1.25 6.87ZM8.43 7.96C8.46 7.96 8.49 7.97 8.52 7.97C8.55 7.98 8.58 7.99 8.61 8C8.64 8.01 8.67 8.03 8.69 8.04C8.72 8.06 8.74 8.08 8.76 8.1C8.79 8.12 8.81 8.15 8.82 8.17C8.84 8.2 8.85 8.22 8.87 8.25C8.88 8.28 8.89 8.31 8.89 8.34C8.9 8.37 8.9 8.4 8.9 8.43C8.9 8.46 8.9 8.49 8.89 8.52C8.89 8.55 8.88 8.58 8.87 8.61C8.85 8.64 8.84 8.67 8.82 8.69C8.81 8.72 8.79 8.74 8.76 8.76C8.74 8.79 8.72 8.81 8.69 8.82C8.67 8.84 8.64 8.85 8.61 8.87C8.58 8.88 8.55 8.89 8.52 8.89C8.49 8.9 8.46 8.9 8.43 8.9C8.4 8.9 8.37 8.9 8.34 8.89C8.31 8.89 8.28 8.88 8.25 8.87C8.22 8.85 8.2 8.84 8.17 8.82C8.15 8.81 8.12 8.79 8.1 8.76C8.08 8.74 8.06 8.72 8.04 8.69C8.03 8.67 8.01 8.64 8 8.61C7.99 8.58 7.98 8.55 7.97 8.52C7.97 8.49 7.96 8.46 7.96 8.43C7.96 8.4 7.97 8.37 7.97 8.34C7.98 8.31 7.99 8.28 8 8.25C8.01 8.22 8.03 8.2 8.04 8.17C8.06 8.15 8.08 8.12 8.1 8.1C8.12 8.08 8.15 8.06 8.17 8.04C8.2 8.03 8.22 8.01 8.25 8C8.28 7.99 8.31 7.98 8.34 7.97C8.37 7.97 8.4 7.96 8.43 7.96Z" fill="#FFFFFF" fill-opacity="1.000000" fill-rule="nonzero"/>
      </svg>
    </label>
  </div>

  <p class="subtitle second">Фоновые изображения CSS</p>
  <p class="file-info-title">Текущий файл изображения:</p>
  <p class="file-info">{{ '63cc75764_1_img.db3b94e9.jpg' }}</p>
  <p class="file-info-title">Текущий размер изображения:</p>
  <p class="file-info">{{ '1200 х 800' }} {{ '589kB' }}</p>
  <AppButton text="Выбрать файл" class="filled-btn"></AppButton>
</template>

<script setup lang="ts">
import AppButton from '../ui/AppButton.vue'


</script>

<style>
.onImg {
  margin-bottom: 8px;
}
.file-info-title {
  margin-bottom: 5px;
  font-size: 10px;
  line-height: 12px;
  color: var(--lines);
}
.file-info {
  margin-bottom: 10px;
  font-size: 10px;
  line-height: 12px;
  color: var(--font-color-transparent);
}
.mb20 {
  margin-bottom: 20px;
}
.file-upload {
  position: relative;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  height: 30px;
  padding: 3px 15px;
  border-radius: var(--border-radius) 5px;
  color: white;
  font-size: 16px;
  cursor: pointer;
  user-select: none;
  border: none;
  outline: none;
  background: var(--accent);
  transition: all 0.3s ease;
  overflow: hidden;
}
.file-upload:hover {
  background: var(--accent-hover);
}
.upload-input {
  position: absolute;
  width: 1px;
  height: 1px;
  opacity: 0;
  visibility: hidden;
}
.attribute {
  display: flex;
  align-items: center;
  flex-direction: row;
  justify-content: space-between;
  margin-bottom: 10px;
  user-select: none;
}
.atr-input {
  margin-bottom: 0;
  width: 150px;
}
.atr-span {
  font-size: 10px;
  line-height: 12px;
  color: var(--font-color);
}
.attribute-for-checkbox {
  position: relative;
  display: inline-flex;
  align-items: center;
  flex-direction: row;
  gap: 10px;
  user-select: none;
  cursor: pointer;
}
.attribute-for-checkbox:after {
  content: '';
  display: inline-block;
  width: 17px;
  height: 17px;
  flex-shrink: 0;
  flex-grow: 0;
  border: 1px solid var(--accent);
  border-radius: var(--border-radius) 5px;
  background-repeat: no-repeat;
  background-position: center center;
  background-size: 50% 50%;
  transition: all 0.2s ease;
}
.checkbox-input {
  position: absolute;
  width: 1px;
  height: 1px;
  z-index: -1;
  opacity: 0;
}
.checkbox-input-svg {
  position: absolute;
  left: 88px;
  top: 4px;
  width: 10px;
  height: 9px;
  visibility: hidden;
  opacity: 0;
  transition: all 0.3s ease;
}
.checkbox-input-svg path {
  stroke: var(--font-color);
}
.checkbox-input:checked + .checkbox-input-svg {
  visibility: visible;
  opacity: 1;
}
.atr-header {
  display: flex;
  align-items: center;
  flex-direction: row;
  margin-bottom: 8px;
}
.atr-header span {
  font-size: 10px;
  line-height: 12px;
  color: var(--font-color);
}
.atr-header span:first-child {
  margin-right: 25px;
}
.atr-btn-add-more {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 20px;
  height: 20px;
  margin-left: auto;
  border-radius: var(--border-radius) 5px;
  background: none;
  border: none;
  outline: none;
  cursor: pointer;
  transition: background-color 0.2s ease;
}
.atr-btn-add-more svg {
  height: 12px;
  width: 12px;
}
.atr-btn-add-more svg path {
  fill: var(--font-color);
}
.atr-btn-add-more:hover {
  background: var(--main-color-hover);
}
.art-values {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-direction: row;
  margin-bottom: 5px;
}
.art-values-input {
  display: flex;
  align-items: center;
  width: 100%;
  height: 18px;
  border: 1px solid var(--accent);
  border-radius: var(--border-radius) 5px;
  padding: 3px 4px;
  background: none;
  outline: none;
  font-size: 8px;
  color: var(--font-color);
}
.first-width {
  width: 46px;
}
.second-width {
  width: 114px;
}
.for-art {
  height: 18px;
  width: 20px;
  padding: 0;
}
</style>