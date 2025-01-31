<template>
  <div v-if="showModal" class="modal-overlay" @click.self="$emit('close')">
    <div class="modal">
      <h4 v-if="title" class="modal-title">{{ title }}</h4>
      <p class="modal-message">{{ message }}</p>
      <div class="modal-btn-block">
        <AppButton text="Да" class="filled-btn" @click="$emit('confirm')"/>
        <AppButton text="Отмена" class="outline-btn" @click="$emit('close')" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import AppButton from './AppButton.vue'

defineProps<{
  showModal: boolean,
  title?: string,
  message: string,
}>()

</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  background: var(--modal-bg-color);
  backdrop-filter: blur(2px);
  z-index: 9998;
}
.modal {
  max-width: 500px;
  padding: 20px;
  border-radius: var(--border-radius);
  background: var(--main-color);
}
.modal-title {
  margin-bottom: 20px;
  color: var(--font-color);
}
.modal-message {
  margin-bottom: 20px;
  line-height: 1.4;
  color: var(--font-color);
}
.modal-btn-block {
  display: flex;
  justify-content: flex-end;
  align-items: center;
}
</style>