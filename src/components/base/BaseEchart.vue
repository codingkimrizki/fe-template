<template>
  <template v-if="wrapper">
    <a-card size="small">
      <v-chart :option="option" :style="{ height: height + 'px' }" autoresize />
    </a-card>
  </template>
  <template v-else>
    <v-chart :option="option" :style="{ height: height + 'px' }" autoresize />
  </template>
</template>

<script setup>
import { use } from 'echarts/core'
import { useThemeStore } from '@/stores/theme'
import { LineChart, BarChart, ScatterChart } from 'echarts/charts'
import {
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  ToolboxComponent,
  GridComponent,
  DataZoomComponent,
  MarkPointComponent,
} from 'echarts/components'
import { CanvasRenderer } from 'echarts/renderers'
import { ref, provide, watchEffect, nextTick } from 'vue'
import VChart, { THEME_KEY } from 'vue-echarts'

use([
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  ToolboxComponent,
  DataZoomComponent,
  GridComponent,
  LineChart,
  ScatterChart,
  BarChart,
  CanvasRenderer,
  MarkPointComponent,
])

provide(THEME_KEY, 'light')

const themeStore = useThemeStore()

const yformat = function (value) {
  var newValue = value
  if (value >= 1000000000) {
    newValue = (value / 1000000000).toFixed(0) + ' B'
  } else if (value >= 1000000) {
    newValue = (value / 1000000).toFixed(0) + ' M'
  } else if (value >= 1000) {
    newValue = (value / 1000).toFixed(0) + ' K'
  }
  return newValue
}

const labelFormatter = function (value) {
  const raw = value.data

  if (raw === 0) return ''

  if (raw >= 1e9) {
    return Math.floor(raw / 1e8) / 10 + ' B' // floor to 1 decimal
  } else if (raw >= 1e6) {
    return Math.floor(raw / 1e5) / 10 + ' M'
  } else if (raw >= 1e3) {
    return Math.floor(raw / 1e2) / 10 + ' K'
  } else {
    return raw
  }
}

const props = defineProps({
  wrapper: {
    type: Boolean,
    default: true,
  },
  height: {
    type: Number,
    default: 300,
  },
  title: {
    type: String,
    default: 'Title Chart',
  },
  xAxisName: {
    type: String,
    default: null,
  },
  yAxisName: {
    type: String,
    default: null,
  },
  // Tambahkan props untuk dual y-axis
  yAxisName2: {
    type: String,
    default: null,
  },
  yAxisIndex: {
    type: Array,
    default: () => [0, 0], // Array untuk menentukan y-axis index setiap series
  },
  xAxisData: {
    type: Array,
    default: () => [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
  },
  seriesName: {
    type: Array,
    default: () => ['In', 'Out'],
  },
  seriesData: {
    type: Array,
    default: () => [
      [1, 2, 3, 4, 5, 1, 2, 3, 4, 5, 2, 4],
      [2, 1, 4, 5, 2, 2, 1, 4, 5, 2, 5, 3],
    ],
  },
  seriesType: {
    type: Array,
    default: () => ['line', 'line'],
  },
  titleSize: {
    type: Number,
    default: 18,
  },
  showLabelSeries: {
    type: Boolean,
    default: false,
  },
  seriesColor: {
    type: Array,
    default: () => ['#2EAA8D', '#DC1A21', '#006CE3', '#EA9500'],
  },
  toolbox: {
    type: Boolean,
    default: false,
  },
  dataZoom: {
    type: Boolean,
    default: false,
  },
  grid: {
    type: Object,
    default: () => ({
      left: '7%',
      right: '7%',
    }),
  },
  legendOrient: {
    type: String,
    default: 'horizontal',
  },
  barWidth: {
    type: String,
    default: '100%',
  },
  xAxisRotate: {
    type: Number,
    default: 0,
  },
})

const option = ref({
  color: props.seriesColor,
  textStyle: {
    fontFamily: themeStore.fontFamily,
  },
  title: {
    text: props.title,
    textStyle: {
      fontSize: props.titleSize,
      color: 'var(--text-color)',
    },
  },
  toolbox: {
    show: props.toolbox,
    feature: {
      dataZoom: {
        yAxisIndex: 'none',
      },
      dataView: { show: true, readOnly: false },
      magicType: { show: true, type: ['line', 'bar'] },
      restore: { show: true },
      saveAsImage: { shot: true },
    },
  },
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      type: 'shadow',
    },
  },
  grid: {
    left: props.grid.left,
    right: props.grid.right,
    bottom: props.dataZoom ? '25%' : '10%',
    containLabel: true,
  },
  legend: {
    data: props.seriesName,
    bottom: '0%',
    right: '0%',
    orient: props.legendOrient,
    textStyle: {
      color: 'var(--text-color)',
    },
  },
  xAxis: {
    name: props.xAxisName,
    type: 'category',
    boundaryGap: true,
    data: props.xAxisData,
    nameLocation: 'middle',
    nameGap: 25,
    axisLabel: {
      fontSize: 12,
      rotate: props.xAxisRotate,
      fontFamily: 'Poppins',
    },
  },
  yAxis: [
    {
      name: props.yAxisName,
      type: 'value',
      splitLine: {
        show: false,
      },
      min: 0,
      nameLocation: 'middle',
      nameGap: 40,
      axisLabel: {
        formatter: yformat,
        fontSize: 11,
        fontFamily: 'Poppins',
      },
    },
    // Tambahkan y-axis kedua jika yAxisName2 ada
    ...(props.yAxisName2
      ? [
          {
            name: props.yAxisName2,
            type: 'value',
            splitLine: {
              show: false,
            },
            min: 0,
            nameLocation: 'middle',
            nameGap: 40,
            axisLabel: {
              formatter: yformat,
              fontSize: 11,
              fontFamily: 'Poppins',
            },
          },
        ]
      : []),
  ],
  series: [],
  ...(props.dataZoom && {
    dataZoom: [
      {
        type: 'slider',
        show: true,
        xAxisIndex: [0],
        start: 0,
        end: 100,
      },
      {
        type: 'inside',
        start: 0,
        end: 20,
      },
    ],
  }),
})

const updateChart = async () => {
  // Wait for DOM update to ensure CSS variables are applied
  await nextTick()

  // Get color from CSS variable
  const textColor = getComputedStyle(document.body)
    .getPropertyValue('--text-color')
    .trim()

  // Global text style
  option.value.textStyle = {
    fontFamily: themeStore.fontFamily,
    color: textColor,
  }

  // Reset option.value.series
  option.value.series = []
  option.value.legend = {
    ...option.value.legend,
    data: props.seriesName,
    textStyle: {
      color: textColor,
    },
  }

  // Update Title
  option.value.title = {
    text: props.title,
    textStyle: {
      fontSize: props.titleSize,
      color: textColor,
    },
  }

  option.value.xAxis.data = props.xAxisData
  option.value.yAxis[0].name = props.yAxisName

  // Update y-axis kedua jika ada
  if (props.yAxisName2 && option.value.yAxis[1]) {
    option.value.yAxis[1].name = props.yAxisName2
  }

  if (props.dataZoom) {
    option.value.dataZoom = [
      {
        type: 'slider',
        show: true,
        xAxisIndex: [0],
        start: 0,
        end: 100,
      },
      {
        type: 'inside',
        start: 0,
        end: 20,
      },
    ]
  } else {
    delete option.value.dataZoom
  }

  // Loop through props.seriesData and push each series to option.value.series
  props.seriesData.forEach((data, index) => {
    const seriesConfig = {
      name: props.seriesName[index],
      type: props.seriesType[index],
      lineStyle: {
        width: 5,
        opacity: 0.7,
      },
      label: {
        show: props.showLabelSeries,
        formatter: labelFormatter,
        fontSize: 10,
        fontFamily: 'Poppins',
        position: 'top',
        // Inherit color from global textStyle
      },
      emphasis: {
        focus: 'series',
      },
      smooth: true,
      data: data,
      // Tambahkan yAxisIndex untuk menentukan y-axis mana yang digunakan
      yAxisIndex: props.yAxisIndex[index] || 0,
    }
    option.value.series.push(seriesConfig)
  })
}

watchEffect(() => {
  // Trigger update when theme changes
  // Accessing themeStore.isDarkMode to ensure reactivity
  themeStore.isDarkMode
  updateChart()
})
</script>
