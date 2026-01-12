import { defineStore } from 'pinia'

export const useVoiceStore = defineStore('voice', {
  state: () => ({
    visible: false,
    voiceSetting: {
      rate: 1,
      pitch: 1,
      selectedVoice: '', // simpan string nama voice
    },
    voices: [], // array option { label, value: string name, voice: SpeechSynthesisVoice }
    isSpeaking: false,
  }),
  persist: {
    pick: ['voiceSetting'],
  },
  actions: {
    async initVoices() {
      const synth = window.speechSynthesis

      const loadVoices = () => {
        return new Promise(resolve => {
          const voices = synth.getVoices()
          if (voices.length) {
            this.formatVoices(voices)
            if (!this.voiceSetting.selectedVoice) this.setDefaultVoice()
            resolve()
          } else {
            synth.onvoiceschanged = () => {
              this.formatVoices(synth.getVoices())
              if (!this.voiceSetting.selectedVoice) this.setDefaultVoice()
              resolve()
            }
          }
        })
      }

      await loadVoices()
    },

    formatVoices(voiceList) {
      const allowedLangs = ['en-US', 'id-ID', 'ja-JP']
      this.voices = voiceList
        .filter(v => allowedLangs.includes(v.lang))
        .map(v => ({
          label: `${v.name} (${v.lang})`,
          value: `${v.name} (${v.lang})`, // simpan nama voice
          voice: v, // simpan object untuk lookup nanti
        }))
    },

    setDefaultVoice() {
      const defaultVoiceOption = this.voices.find(
        v => v.value === 'Microsoft Zira - English (United States) (en-US)',
      )
      this.voiceSetting.selectedVoice =
        defaultVoiceOption?.value || this.voices[0]?.value || ''
    },

    setVoiceSetting(setting) {
      this.voiceSetting = { ...this.voiceSetting, ...setting }
    },

    speak(text) {
      if (!text || typeof text !== 'string') return

      const synth = window.speechSynthesis
      if (synth.speaking) synth.cancel()

      const utterance = new SpeechSynthesisUtterance(text)
      utterance.rate = this.voiceSetting.rate
      utterance.pitch = this.voiceSetting.pitch

      // cari voice object berdasarkan nama (string)
      const selected = this.voices.find(
        v => v.value === this.voiceSetting.selectedVoice,
      )
      utterance.voice = selected?.voice || null

      this.isSpeaking = true

      utterance.onend = () => (this.isSpeaking = false)
      utterance.onerror = e => {
        console.error('Speech error:', e)
        this.isSpeaking = false
      }

      synth.speak(utterance)
    },
  },
})
