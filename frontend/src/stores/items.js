import { defineStore } from 'pinia'
import axios from 'axios'

// usa la URL completa mientras pruebas, o vuelve a '/api' si ya te funciona el proxy
const api = axios.create({ baseURL: 'http://127.0.0.1:8000/api' })

export const useItemsStore = defineStore('items', {
  state: () => ({
    items: [],
    loading: false,
    error: null,
  }),
  actions: {
    async fetchItems() {
      this.loading = true
      this.error = null
      try {
        const { data } = await api.get('/items/')
        this.items = data
      } catch (e) {
        console.error('fetchItems error:', e?.response || e)
        this.error = `Error cargando items: ${e?.response?.status || ''}`
      } finally {
        this.loading = false
      }
    },

    async createItem(payload) {
      try {
        const { data } = await api.post('/items/', payload)
        // metemos al inicio
        this.items.unshift(data)
        return data
      } catch (e) {
        console.error('createItem error:', e?.response || e)
        throw e
      }
    },

    async updateItem(id, payload) {
      try {
        const nid = Number(id)
        // Usa PATCH mejor que PUT
        const { data } = await api.patch(`/items/${nid}/`, payload)
        // Reemplaza en memoria (cuidando tipos)
        const i = this.items.findIndex(it => Number(it.id) === nid)
        if (i !== -1) {
          // asignación para mantener reactividad
          this.items[i] = { ...this.items[i], ...data }
        } else {
          // si no lo encontró, fuerza un refetch
          await this.fetchItems()
        }
        return data
      } catch (e) {
        console.error('updateItem error:', e?.response || e)
        throw e
      }
    },

    async deleteItem(id) {
      try {
        const nid = Number(id)
        await api.delete(`/items/${nid}/`)
        this.items = this.items.filter(it => Number(it.id) !== nid)
      } catch (e) {
        console.error('deleteItem error:', e?.response || e)
        throw e
      }
    },
  },
})