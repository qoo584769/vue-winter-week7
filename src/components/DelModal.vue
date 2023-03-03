<template>
  <div
    class="modal fade"
    id="delModal"
    tabindex="-1"
    role="dialog"
    aria-labelledby="exampleModalLabel"
    aria-hidden="true"
    ref="modal"
  >
    <div class="modal-dialog" role="document">
      <div class="modal-content border-0">
        <div class="modal-header bg-danger text-white">
          <h5 class="modal-title">
            <span>刪除 {{ tempOrder.title }}</span>
          </h5>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
            @click="closeModal"
          ></button>
        </div>
        <div class="modal-body">
          是否刪除 <strong class="text-danger">{{ tempOrder.title }}</strong> (刪除後將無法恢復)。
        </div>
        <div class="modal-footer">
          <button
            type="button"
            class="btn btn-outline-secondary"
            data-bs-dismiss="modal"
            @click="closeModal"
          >
            取消
          </button>
          <button type="button" class="btn btn-danger" @click="delItem(tempOrder)">確認刪除</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref, watch } from 'vue'
import Modal from 'bootstrap/js/dist/modal'

const props = defineProps(['modalStatus', 'tempOrder'])
const emits = defineEmits(['emitModalSataus', 'emitDelItem'])
const modal = ref(null)
const bsModal = ref('')
const closeModal = () => {
  bsModal.value.hide()
  emits('emitModalSataus', false)
}
const delItem = (item) => {
  emits('emitDelItem', item)
}
watch(
  () => props.modalStatus,
  () => {
    if (props.modalStatus) {
      bsModal.value.show()
      return
    } else {
      bsModal.value.hide()
      return
    }
  }
)
onMounted(() => {
  bsModal.value = new Modal(modal.value, {})
})
</script>

<style lang="scss" scoped></style>
