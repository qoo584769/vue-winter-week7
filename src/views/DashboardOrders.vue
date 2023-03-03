<template>
  <Loading v-model:active="isLoading"></Loading>
  <table class="table mt-4">
    <thead>
      <tr>
        <th>購買時間</th>
        <th>Email</th>
        <th>購買款項</th>
        <th>應付金額</th>
        <th>是否付款</th>
        <th>編輯</th>
      </tr>
    </thead>
    <tbody>
      <template v-for="item in orders.data" :key="item.id">
        <tr v-if="orders.data.length" :class="{ 'text-secondary': !item.is_paid }">
          <!-- <td>{{ $filters.date(item.create_at) }}</td> -->
          <td>{{ filterDate(item.create_at) }}</td>
          <td><span v-text="item.user.email" v-if="item.user"></span></td>
          <td>
            <ul class="list-unstyled">
              <li v-for="(product, i) in item.products" :key="i">
                {{ product.product.title }} 數量：{{ product.qty }}
                {{ product.product.unit }}
              </li>
            </ul>
          </td>
          <td class="text-right">{{ item.total }}</td>
          <td>
            <div class="form-check form-switch">
              <input
                class="form-check-input"
                type="checkbox"
                :id="`paidSwitch${item.id}`"
                v-model="item.is_paid"
                @change="updatePaid(item)"
              />
              <label class="form-check-label" :for="`paidSwitch${item}`">
                <span v-if="item.is_paid">已付款</span>
                <span v-else>未付款</span>
              </label>
            </div>
          </td>
          <td>
            <div class="btn-group">
              <button class="btn btn-outline-primary btn-sm" type="button" @click="openModal(item)">
                檢視
              </button>
              <button
                class="btn btn-outline-danger btn-sm"
                type="button"
                @click="openDelOrderModal(item)"
              >
                刪除
              </button>
            </div>
          </td>
        </tr>
      </template>
    </tbody>
  </table>
  <OrderModal :modalStatus="modalStatus" :tempOrder="tempOrderData.data" @emitModalSataus = "openModal" @emitUpdatePaid="updatePaid"></OrderModal>
  <DelModal :modalStatus="delModalStatus" :tempOrder="tempOrderData.data" @emitModalSataus = "openDelOrderModal" @emitDelItem = "delOrder"></DelModal>
</template>

<script setup>
import { ref, reactive, inject, onMounted } from 'vue'
import Loading from 'vue-loading-overlay'
import OrderModal from '../components/OrderModal.vue'
import DelModal from '../components/DelModal.vue'

// 註冊axios
const axios = inject('axios')
// loading變數
const isLoading = ref(false)
// 網址路徑
const path = import.meta.env.VITE_PATH
const url = import.meta.env.VITE_API

const orders = reactive({ data: {} })

const modalStatus = ref(false)
const delModalStatus = ref(false)
const tempOrderData = reactive({ data: {} })

const openModal = (item) => {
  if(item === false){
    modalStatus.value = false
  }else{
    modalStatus.value = true
    tempOrderData.data = { ...item }
  }
}

const openDelOrderModal = (item)=>{
  if(item === false){
    delModalStatus.value = false
  }else{
    delModalStatus.value = true
    tempOrderData.data = { ...item }
  }
}

// 取得訂單列表
const getOrders = (page = 1) => {
  isLoading.value = true;
  axios
    .get(`${url}/api/${path}/admin/orders?${page}`)
    .then((res) => {
      orders.data = res.data.orders
      isLoading.value = false;
    })
    .catch((err) => {
      alert(err)
      isLoading.value = false;
    })
}
// 修改付款狀態
const updatePaid = (item)=>{
  isLoading.value = true;
  const data = {...item}
  data.is_paid = item.is_paid
  axios
    .put(`${url}/api/${path}/admin/order/${item.id}`,{data})
    .then(() => {
      getOrders()
    })
    .catch((err) => {
      alert(err)
      isLoading.value = false;
    })
}

const delOrder = (item)=>{
  isLoading.value = true;
  axios
    .delete(`${url}/api/${path}/admin/order/${item.id}`)
    .then(() => {
      isLoading.value = false;
      delModalStatus.value = false;
      getOrders()
    })
    .catch((err) => {
      alert(err)
      isLoading.value = false;
    })
}

const filterDate = (timeStamp) => {
  const localDate = new Date(timeStamp * 1000)
  return localDate.toLocaleDateString()
}

onMounted(() => {
  const token = document.cookie.replace(/(?:(?:^|.*;\s*)hexschool\s*=\s*([^;]*).*$)|^.*$/, '$1')
  // 把token預設到axios的標頭
  // 之後的發送都會加上這個標頭
  axios.defaults.headers.common.Authorization = token
  getOrders()
})
</script>

<style lang="scss" scoped></style>
