<template>
  <a-col v-bind="colProps">
    <a-card
      :hoverable="hoverable"
      :bordered="bordered"
      size="small"
      :style="cardStyle"
    >
      <a-flex vertical gap="small">
        <a-flex justify="space-between" gap="small" wrap="wrap">
          <a-space align="center">
            <!-- hanya tampil kalau ada icon -->
            <component
              v-if="icon"
              :is="icon"
              :style="{ fontSize: '24px', color: computedIconColor }"
            />
            <span class="large bold">{{ title }}</span>
          </a-space>
          <span class="large">{{ value }} {{ suffix }}</span>
        </a-flex>
        <a-typography-text
          type="secondary"
          v-if="description"
          :ellipsis="false"
        >
          {{ description }}
        </a-typography-text>
        <slot name="description" />
      </a-flex>
    </a-card>
  </a-col>
</template>

<script setup>
import { computed } from 'vue'
import { useThemeStore } from '@/stores/theme'
import { UserOutlined } from '@ant-design/icons-vue'

const props = defineProps({
  description: { type: String },
  title: { type: String, required: true },
  value: { type: [String, Number] },
  suffix: { type: String },
  icon: { type: [Object, Function, String], default: () => UserOutlined },
  iconColor: { type: String, default: null },
  col: {
    type: Object,
    default: () => ({
      xs: 24,
      sm: 24,
      md: 12,
      lg: 12,
      xl: 6,
    }),
  },
  hoverable: { type: Boolean, default: true },
  bordered: { type: Boolean, default: true },
  height: { type: [String, Number], default: null },
})

const themeStore = useThemeStore()

const colProps = computed(() => props.col)

const computedIconColor = computed(
  () => props.iconColor || themeStore.colorPrimary,
)

const cardStyle = computed(() => {
  if (props.height) {
    const heightValue =
      typeof props.height === 'number' ? `${props.height}px` : props.height
    return {
      height: heightValue,
    }
  }
  return {}
})
</script>
