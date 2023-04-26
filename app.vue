<template>
  <div v-if="start && end && source">
    <template v-if="list.length > 1">
      Расписание на период - нужно обозначить период
      {{  list }}
    </template>
    <template v-else-if="list.length === 1">
      Расписание на целый день - верстка
      {{  list[0] }}
      День недели: {{  list[0].week }}
    </template>
    <template v-else>
      На выбранный период отсутсвует расписание
    </template>
  </div>
  <div v-else>
    Параметры некорректны
  </div>
</template>
<script async setup lang="ts">
import moment from "moment"
const route = useRoute()
const router = useRouter()

const start = computed({
  get() {
    return route.query.start || null
  },
  set(newValue) {
    router.push({
      name: "index",
      query: {
        ...route.query,
        start: newValue,
      },
    })
  }
})

const end = computed({
  get() {
    return route.query.end || null
  },
  set(newValue) {
    router.push({
      name: "index",
      query: {
        ...route.query,
        end: newValue,
      },
    })
  }
})

// Default start date - current date
if (!unref(start)) {
  start.value = moment(new Date()).format("DD-MM-YYYY")
}

if (!unref(end)) {
  end.value = unref(start)
}

const sourceURL = computed({
  get() {
    return route.query.source || null
  },
  set(newValue) {
    router.push({
      name: "index",
      query: {
        ...route.query,
        source: newValue,
      },
    })
  }
})

const source = ref()

async function handleSource(url) {
  try {
    const { data, error }= await useFetch(url)
    if (unref(error)) {
      throw error
    }
    // Запустить оптимизацию данных и использовать источник для поиска
    /*

    из диапазона нужно определить - какие недели будут использоваться и какие дни из этих недель
    {
      13: [5,6],
      14: [1,2]
    }


    {
      [Номер недели]: {
        [Порядковый номер дня]: []
      }
    }


    Смотрим на диапазон - считаем неделю от даты отсчета

    Допустим  мы подсчитали недели в диапазоне, который нам нужен - это [13]


    далее обращяемся к неделе по ее номеру - 13
    получаем набор дней, которые нас интересуют
    */
    const _data = unref(data)
    const dayOfWeeks = {}

    source.value = {
      13: {
        1: [],
        3: [
          {
            start: "9:00",
            end: "10:30",
            type: "practice",
            label: "Иностранный язык",
          },
          {
            start: "10:30",
            end: "11:00",
            type: "pause",
          },
          {
            start: "11:00",
            end: "12:30",
            type: "lecture",
            label: "Анатомия",
            addr: "9 пав. слева"
          }
        ],
        4: [
          {
            start: "9:00",
            end: "10:30",
            type: "practice",
            label: "Иностранный язык",
          },
          {
            start: "10:30",
            end: "11:00",
            type: "pause",
          },
          {
            start: "11:00",
            end: "12:30",
            type: "lecture",
            label: "Анатомия",
            addr: "9 пав. слева"
          }
        ],
        5: [
          {
            start: "9:00",
            end: "10:30",
            type: "practice",
            label: "Иностранный язык",
          },
          {
            start: "10:30",
            end: "11:00",
            type: "pause",
          },
          {
            start: "11:00",
            end: "12:30",
            type: "lecture",
            label: "Анатомия",
            addr: "9 пав. слева"
          }
        ],
      },
      14: {
        1: [
          {
            start: "9:00",
            end: "10:30",
            type: "practice",
            label: "Первый",
          },
          {
            start: "10:30",
            end: "11:00",
            type: "pause",
          },
          {
            start: "11:00",
            end: "12:30",
            type: "lecture",
            label: "Второй",
            addr: "9 пав. слева"
          }
        ],
        2: [
          {
            start: "9:00",
            end: "10:30",
            type: "practice",
            label: "Иностранный язык",
          },
          {
            start: "10:30",
            end: "11:00",
            type: "pause",
          },
          {
            start: "11:00",
            end: "12:30",
            type: "lecture",
            label: "Анатомия",
            addr: "9 пав. слева"
          }
        ],
      }
    }
    
  } catch (e) {
    console.error(e)
    source.value = null
  }
}

if (!unref(sourceURL)) {
  sourceURL.value = "https://morozovspace.github.io/mechnikova-test/timetable.json"
}

await handleSource(unref(sourceURL))
// нужно провести оптимизация
/*
Берем дату начала - берем дату конца

Считаем массив недель, которые нам нужны по диапазону - для каждого дня свой подсчет

*/
const list = reactive([])

function replaceReactiveArray(src, arr) {
  return Array.prototype.splice.apply(src, [0, src.length].concat(arr))
}

// Подписаться на ряд параметров из которых и будем строить view
watch(
  computed(() => {
    return {
      start: unref(start),
      end: unref(end),
      source: unref(source),
    }
  }), (newValue) => {
    // Сгенерировать диапазон
    const diapazone = {
      13: [5,6],
      // 14: [1,2]
    }

    const newList = []
    for (const week in diapazone) {
      if (_has(newValue.source, week)) {
        // Список полей, которые нам нужны
        const days = diapazone[week]
        const weekFromSource = _get(newValue.source, [week])
        const daysFromSource = Object.keys(weekFromSource).filter((key) => !_isEmpty(_get(weekFromSource, [key]))).map((el) => parseInt(el))
        const day = {
          week,
        }
        console.log("DAY EXIST", diapazone, days, weekFromSource, week, daysFromSource)
        newList.push(day)
      }
    }

    replaceReactiveArray(list, newList)
}, {
  immediate: true,
})
</script>
