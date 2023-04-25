<template>
  <div v-if="value">

  </div>
  <div v-else>
    Параметры некорректны
  </div>
</template>
<script setup lang="ts">
import moment from "moment"
const route = useRoute()
const router = useRouter()

const value = computed({
  get() {
    return route.query.date || null
  },
  set(newValue) {
    router.push({
      name: "index",
      query: {
        ...route.query,
        date: newValue,
      },
    })
  }
})
// Default date - current day
if (!unref(value)) {
  value.value = moment(new Date()).format("DD-MM-YYYY")
}

const list = reactive([])

watch(value, (newValue) => {
  /*
    0) Ссылка на источник данных
    1) Использовать дату старта как источник данных
  */
  console.log(newValue)
}, {
  immediate: true,
})
</script>