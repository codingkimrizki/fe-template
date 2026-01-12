import api from '@/axios/interceptor'
import { message } from 'ant-design-vue'

export const uploadData = async (endpoint, formData) => {
  try {
    const response = await api.post(`upload/${endpoint}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    return response.data
  } catch (error) {
    message.error(error.response.data?.message)
    console.error(error)
  }
}
