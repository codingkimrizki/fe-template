import { defineStore } from 'pinia'
import Paho from 'paho-mqtt'
import { updateDashboard } from '@/composable/updateDashboard'
import { notification } from 'ant-design-vue'
import { updateOperatorDashboard } from '@/composable/trayAndLotfull'
import { maintenanceNotify } from '../composable/maintenanceNotify'
import { syncControlledSparepartShotCount } from '@/composable/syncControlledSparepartShotCount'

export const useMqttStore = defineStore('mqtt', {
  state: () => ({
    client: null,
    isConnected: false,
    subscribedTopics: [],
    responseListeners: [], // Array to store pending response listeners
  }),

  actions: {
    // 🔌 Connect ke broker dengan Promise
    connect(
      host = import.meta.env.VITE_MQTT_WS_HOST,
      port = import.meta.env.VITE_MQTT_WS_PORT,
    ) {
      return new Promise((resolve, reject) => {
        if (this.client) {
          console.warn('Client already connected')
          resolve() // langsung resolve jika sudah ada client
          return
        }

        const clientId = 'clientID_' + Math.random().toString(16).substr(2, 8)
        this.client = new Paho.Client(host, Number(port), clientId)

        // Callback saat koneksi lost
        this.client.onConnectionLost = responseObject => {
          console.warn('🔌 MQTT Connection Lost', responseObject.errorMessage)
          this.isConnected = false
        }

        // Callback saat message diterima
        this.client.onMessageArrived = message => {
          // Check response listeners first
          const listeners = [...this.responseListeners]
          listeners.forEach(listener => {
            if (
              listener.predicate(message.destinationName, message.payloadString)
            ) {
              listener.resolve(message.payloadString)
              // Remove listener after success
              this.responseListeners = this.responseListeners.filter(
                l => l.id !== listener.id,
              )
            }
          })

          // for kanagata & machine dashboard
          updateDashboard(message.destinationName, message.payloadString)

          // for operator dashboard
          updateOperatorDashboard(
            message.destinationName,
            message.payloadString,
          )

          // for realtime maintenance notification
          maintenanceNotify(message.destinationName, message.payloadString)

          // for controlled shot count sparepart
          syncControlledSparepartShotCount(
            message.destinationName,
            message.payloadString,
          )
        }

        // Opsi koneksi
        const options = {
          useSSL: false,
          userName: import.meta.env.VITE_MQTT_USERNAME,
          password: import.meta.env.VITE_MQTT_PASSWORD,
          onSuccess: () => {
            console.log('✅ MQTT Connected')
            this.isConnected = true
            this.subscribe('#') // langsung sub ke all topic
            resolve() // ✅ resolve Promise saat koneksi berhasil
          },
          onFailure: err => {
            console.error('❌ MQTT Connect Failed:', err.errorMessage)
            this.disconnect()
            reject(err) // ❌ reject Promise jika gagal
          },
          reconnect: true,
        }

        this.client.connect(options)
        notification.success({
          message: 'Connected to websocket broker',
        })
      })
    },

    // 📡 Subscribe ke topik
    subscribe(topic) {
      if (!this.client || !this.isConnected) {
        console.warn('Client not connected')
        return
      }

      this.client.subscribe(topic, {
        onSuccess: () => {
          console.log(`📡 Subscribed to ${topic}`)
          if (!this.subscribedTopics.includes(topic)) {
            this.subscribedTopics.push(topic)
          }
        },
        onFailure: err => {
          console.error('Failed subscribe:', err.errorMessage)
        },
      })
    },

    // 📤 Publish pesan
    publish(
      topic,
      message,
      qos = import.meta.env.VITE_MQTT_QOS || 0,
      retained = false,
    ) {
      if (!this.client || !this.isConnected) {
        console.warn('Client not connected')
        return false // Return false memberitahu caller kalau gagal
      }

      try {
        const buffer = JSON.stringify(message)
        const msg = new Paho.Message(buffer)

        // Safety check untuk QoS
        let validQos = Number(qos)
        if (isNaN(validQos) || validQos < 0 || validQos > 2) validQos = 0

        msg.qos = validQos
        msg.retained = retained
        msg.destinationName = topic
        this.client.send(msg)
        console.log(
          `📤 Publish message to [${topic}] (QoS ${validQos}): ${buffer}`,
        )
        return true // Return true jika terkirim
      } catch (e) {
        console.error('Publish Error:', e)
        return false
      }
    },

    // Wait for a specific MQTT response
    waitForResponse(predicate, timeout = 5000) {
      return new Promise((resolve, reject) => {
        const id = Math.random().toString(36).substr(2, 9)

        // Wrapper to resolve and clear timeout
        const successHandler = payload => {
          clearTimeout(timer)
          resolve(payload)
        }

        // Set timeout
        const timer = setTimeout(() => {
          this.responseListeners = this.responseListeners.filter(
            l => l.id !== id,
          )
          reject(new Error('Timeout waiting for device response'))
        }, timeout)

        // Add to listeners
        this.responseListeners.push({
          id,
          predicate,
          resolve: successHandler,
        })
      })
    },

    // 🔌 Disconnect
    disconnect() {
      if (this.client) {
        this.client.disconnect()
        this.client = null
        this.isConnected = false
        this.subscribedTopics = []
        this.responseListeners = []
        console.log('🔌 MQTT Disconnected')
      }
    },
  },
})
