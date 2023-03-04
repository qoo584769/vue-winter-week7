<template>
  <nav aria-label="Page navigation example">
    <ul class="pagination">
      <li class="page-item" :class="{ disabled: !pagination.data.has_pre }">
        <a
          class="page-link"
          href="#"
          aria-label="Previous"
          @click="changePage(pagination.data.current_page - 1)"
        >
          <span aria-hidden="true">&laquo;</span>
        </a>
      </li>

      <li
        v-for="(page, index) in pagination.data.total_pages"
        :key="index"
        class="page-item"
        :class="{ active: page === pagination.data.current_page }"
      >
        <a class="page-link" href="#" @click="changePage(page)">{{ page }}</a>
      </li>

      <li class="page-item" :class="{ disabled: !pagination.data.has_next }">
        <a
          class="page-link"
          href="#"
          aria-label="Next"
          @click="changePage(pagination.data.current_page + 1)"
        >
          <span aria-hidden="true">&raquo;</span>
        </a>
      </li>
    </ul>
  </nav>
</template>

<script setup>
import { reactive } from 'vue'

const props = defineProps(['pagination'])
const emits = defineEmits(['emitChangePage'])
const pagination = reactive(props.pagination)

const changePage = (page) => {
  emits('emitChangePage', page)
}
</script>

<style lang="scss" scoped></style>
