<template>
  <a-form layout="vertical" :model="form" @finish="handleAction(props.mode)">
    <a-form-item label="Username" name="name">
      <a-input
        placeholder="Username"
        v-model:value="form.name"
        :disabled="true"
      />
    </a-form-item>
    <a-form-item label="Email" name="email">
      <a-input
        placeholder="Email"
        v-model:value="form.email"
        :disabled="true"
      />
    </a-form-item>
    <a-form-item label="Role" name="role">
      <a-select
        v-model:value="form.roleId"
        placeholder="Role"
        :options="roleStore.roleOptions"
      />
    </a-form-item>
    <a-alert
      message="If you submit it will delete the above data from the database"
      type="warning"
      show-icon
      v-if="props.mode == 'delete'"
      style="margin-bottom: 1rem"
    />
    <a-form-item>
      <a-flex justify="flex-end">
        <a-space :size="10">
          <a-button type="primary" html-type="submit"> Submit </a-button>
        </a-space>
      </a-flex>
    </a-form-item>
  </a-form>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useUserStore } from '@/stores/user'
import { useRoleStore } from '@/stores/role'
const emit = defineEmits(['close', 'update'])

const roleStore = useRoleStore()
const userStore = useUserStore()
const props = defineProps({
  mode: {
    type: String,
    default: 'update',
  },
  data: {
    type: Object,
    default: () => ({}),
  },
})

const form = ref({
  email: props.data?.email || '',
  name: props.data?.name || '',
  roleId: props.data?.roleId || '',
})

watch(
  () => props.data,
  async newData => {
    if (newData) {
      await roleStore.getRoleOptions()
      form.value.email = newData.email
      form.value.name = newData.name
      form.value.roleId = newData.roleId
    }
  },
  { immediate: true },
)

const handleAction = async mode => {
  if (mode === 'update') {
    await userStore.updateRole(props.data?.id, form.value)
    emit('update')
  }
  emit('close')
}
</script>
