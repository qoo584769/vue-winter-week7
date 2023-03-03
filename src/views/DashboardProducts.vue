<template>
  <div class="container">
    <div class="text-end mt-4">
      <button class="btn btn-primary" @click="openModal('create')">建立新的產品</button>
    </div>
    <table class="table mt-4">
      <thead>
        <tr>
          <th width="120">分類</th>
          <th>產品名稱</th>
          <th width="120">原價</th>
          <th width="120">售價</th>
          <th width="100">是否啟用</th>
          <th width="120">編輯</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="product in products.data" :key="product.id">
          <td>{{ product.category }}</td>
          <td>{{ product.title }}</td>
          <td class="text-end">{{ product.origin_price }}</td>
          <td class="text-end">{{ product.price }}</td>
          <td>
            <span class="text-success" v-if="product.is_enabled">啟用</span>
            <span v-else>未啟用</span>
          </td>
          <td>
            <div class="btn-group">
              <button
                type="button"
                class="btn btn-outline-primary btn-sm"
                @click="openModal('edit', product)"
              >
                編輯
              </button>
              <button
                type="button"
                class="btn btn-outline-danger btn-sm"
                @click="openModal('del', product)"
              >
                刪除
              </button>
            </div>
          </td>
        </tr>
      </tbody>
    </table>

    <Pagination :pagination="pagination" :get-products="getProducts"></Pagination>
  </div>
  <!-- Modal -->
  <div
    id="productModal"
    ref="productModal"
    class="modal fade"
    tabindex="-1"
    aria-labelledby="productModalLabel"
    aria-hidden="true"
  >
    <MyModal
      :temp-data="tempData"
      :add-img="addImg"
      :del-img="delImg"
      :submit-btn="submitBtn"
    ></MyModal>
  </div>

  <div
    id="delProductModal"
    ref="delProductModal"
    class="modal fade"
    tabindex="-1"
    aria-labelledby="delProductModalLabel"
    aria-hidden="true"
  >
    <div class="modal-dialog">
      <div class="modal-content border-0">
        <div class="modal-header bg-danger text-white">
          <h5 id="delProductModalLabel" class="modal-title">
            <span>刪除產品</span>
          </h5>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>
        </div>
        <div class="modal-body">
          是否刪除
          <strong class="text-danger"></strong> 商品(刪除後將無法恢復)。
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-outline-secondary" data-bs-dismiss="modal">
            取消
          </button>
          <button type="button" class="btn btn-danger" @click.prevent="delProduct">確認刪除</button>
        </div>
      </div>
    </div>
  </div>
  <!-- Modal -->
</template>

<script setup>
import { ref, reactive, inject, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import Modal from 'bootstrap/js/dist/modal'

import MyModal from '../components/UandCModal.vue'
import Pagination from '../components/ProductPagination.vue'

const router = useRouter()
// 網址路徑
const path = import.meta.env.VITE_PATH
const url = import.meta.env.VITE_API
// axios註冊
const axios = inject('axios')
// 取得的產品資料儲存變數
const products = reactive({ data: [] })
// 編輯暫存變數
const tempData = reactive({ data: {} })
const addStatus = ref(true)
// 獲取DOM元素
const productModal = ref(null)
const delProductModal = ref(null)
// modal儲存變數
const bsProductModal = ref('')
const bsDelProductModal = ref('')
// 頁碼變數
const pagination = reactive({ data: {} })

// 取得產品列表
const getProducts = (page = 1) => {
  axios
    .get(`${url}/api/${path}/admin/products?page=${page}`)
    .then((res) => {
      products.data = res.data.products
      pagination.data = res.data.pagination
    })
    .catch((err) => {
      alert('取得產品列表錯誤', err)
    })
}
// 驗證token
const checkToken = () => {
  axios
    .post(`${url}/api/user/check`)
    .then(() => {
      getProducts()
    })
    .catch((err) => {
      alert('token驗證錯誤', err)
      router.push({ path: '/login' })
    })
}
// 新增產品
const createProduct = async (data = tempData.data) => {
  let result = ''
  await axios
    .post(`${url}/api/${path}/admin/product`, { data })
    .then((res) => {
      result = res
    })
    .catch((err) => {
      alert('新增產品錯誤', err)
    })
  return result
}

// 編輯產品
const editProduct = async (data = tempData.data) => {
  let result = ''
  await axios
    .put(`${url}/api/${path}/admin/product/${tempData.data.id}`, { data })
    .then((res) => {
      result = res
    })
    .catch((err) => {
      alert('編輯產品錯誤', err)
    })
  return result
}

// 刪除商品
const delProduct = async () => {
  await axios
    .delete(`${url}/api/${path}/admin/product/${tempData.data.id}`)
    .then(() => {
      bsDelProductModal.value.hide()
      getProducts()
    })
    .catch((err) => {
      alert('刪除產品錯誤', err)
    })
}
// 新增圖片按鈕
const addImg = () => {
  if (!tempData.data.imagesUrl) {
    tempData.data.imagesUrl = []
    tempData.data.imagesUrl.push('')
  } else {
    tempData.data.imagesUrl.push('')
    addStatus.value = false
  }
}

// 刪除圖片按鈕
const delImg = (index) => {
  if (tempData.data.imagesUrl.length !== 0) {
    tempData.data.imagesUrl.splice(index, 1)
    addStatus.value = true
  } else {
    tempData.data.imagesUrl = undefined
    addStatus.value = true
  }
}

// 確認送出按鈕
const submitBtn = async () => {
  if (tempData.data.status === 'create') {
    try {
      const res = await createProduct()
      if (res.status === 200) {
        bsProductModal.value.hide()
        getProducts()
      }
    } catch (error) {
      alert('新增失敗', error)
    }
  } else {
    try {
      const res = await editProduct()
      if (res.status === 200) {
        bsProductModal.value.hide()
        getProducts()
      }
    } catch (error) {
      console.log(error)
      alert('編輯失敗')
    }
  }
}
// 打開Model
const openModal = (status, data = {}) => {
  if (status === 'create') {
    tempData.data = {}
    tempData.data.status = status
    bsProductModal.value.show()
  } else if (status === 'edit') {
    tempData.data = data
    tempData.data.status = status
    bsProductModal.value.show()
  } else if (status === 'del') {
    tempData.data = data
    tempData.data.status = status
    bsDelProductModal.value.show()
  }
}
onMounted(() => {
  // Modal控制項
  bsProductModal.value = new Modal(productModal.value, {})
  bsDelProductModal.value = new Modal(delProductModal.value, {})
  const token = document.cookie.replace(/(?:(?:^|.*;\s*)hexschool\s*=\s*([^;]*).*$)|^.*$/, '$1')

  // 把token預設到axios的標頭
  // 之後的發送都會加上這個標頭
  axios.defaults.headers.common.Authorization = token
  checkToken()
})
</script>

<style lang="scss" scoped></style>
