<template>
  <div class="container">
    <div class="row justify-content-center">
      <h1 class="h3 mb-3 font-weight-normal">請先登入</h1>
      <div class="col-8">
        <form id="form" class="form-signin">
          <div class="form-floating mb-3">
            <input
              type="email"
              class="form-control"
              id="username"
              placeholder="name@example.com"
              required
              autofocus
              v-model.trim="userData.username"
            />
            <label for="username">Email address</label>
          </div>
          <div class="form-floating">
            <input
              type="password"
              class="form-control"
              id="password"
              placeholder="Password"
              required
              v-model.trim="userData.password"
            />
            <label for="password">Password</label>
          </div>
          <!-- 不加修飾詞會變成預設get導致錯誤 -->
          <button class="btn btn-lg btn-primary w-100 mt-3" type="submit" @click.prevent="login">
            登入
          </button>
        </form>
      </div>
    </div>
    <p class="mt-5 mb-3 text-muted">&copy; 2021~∞ - 六角學院</p>
  </div>
</template>

<script setup>
import { reactive,onMounted, inject } from 'vue'
import { useRouter } from 'vue-router'

const axios = inject('axios')
const router = useRouter()
// 網址路徑
// const path = import.meta.env.VITE_PATH;
const url = import.meta.env.VITE_API

const userData = reactive({
  username: '',
  password: ''
})

// 登入按鈕的函式
const login =  () => {
  console.log(url);
  axios
    .post(`${url}/admin/signin`, userData)
    .then((res) => {
      const { token, expired } = res.data
      // 把後端傳回來的token寫入cookie
      // 要驗證需要這個cookie
      document.cookie = `hexschool=${token}; expires=${new Date(expired)}`
      router.push({ path: `/products` })
    })
    .catch((err) => {
      alert('axios錯誤', err)
    })
}
onMounted(()=>{
})
</script>

<style lang="scss" scoped>
* {
  margin: 0;
  padding: 0;
  text-decoration: none;
  list-style: none;
}
</style>
