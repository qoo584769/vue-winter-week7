<template>
    <nav aria-label="Page navigation example">
  <ul class="pagination">
    <li class="page-item" :class="{'disabled':!pagination.data.has_pre}">
      <a class="page-link" href="#" aria-label="Previous" @click="getProducts(pagination.data.current_page - 1)">
        <span aria-hidden="true">&laquo;</span>
      </a>
    </li>
    <li v-for="(page,index) in pagination.data.total_pages" :key="index" class="page-item"
      :class="{'active':page === pagination.data.current_page}"><a class="page-link" href="#" @click="getProducts(page)">{{page}}</a></li>
    <li class="page-item" :class="{'disabled':!pagination.data.has_next}">
      <a class="page-link" href="#" aria-label="Next" @click="getProducts(pagination.data.current_page + 1)">
        <span aria-hidden="true">&raquo;</span>
      </a>
    </li>
  </ul>
</nav>
</template>

<script setup>
import { reactive } from 'vue';

const props = defineProps(['pagination','getProducts'])
const pagination = reactive(props.pagination)
</script>

<style lang="scss" scoped>

</style>