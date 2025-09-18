<template>
<main class="min-h-screen p-6" style="font-family: system-ui, -apple-system, Segoe UI, Roboto, Arial">
<h1 style="font-size: 28px; font-weight: 800; margin-bottom: 12px">CRUD de Items</h1>


<section style="display:grid; gap:12px; grid-template-columns: 1fr 2fr; align-items:start;">
<form @submit.prevent="onSubmit" style="display:grid; gap:8px; padding:16px; border:1px solid #e5e7eb; border-radius:12px;">
<label>
<div>Nombre</div>
<input v-model="form.nombre" required placeholder="Nombre" style="width:100%; padding:8px; border:1px solid #d1d5db; border-radius:8px" />
</label>
<label>
<div>Descripción</div>
<textarea v-model="form.descripcion" placeholder="Descripción" rows="4" style="width:100%; padding:8px; border:1px solid #d1d5db; border-radius:8px"></textarea>
</label>
<label>
<div>Precio</div>
<input type="number" step="0.01" v-model.number="form.precio" placeholder="0" style="width:100%; padding:8px; border:1px solid #d1d5db; border-radius:8px" />
</label>


<div style="display:flex; gap:8px;">
<button type="submit" style="padding:8px 12px; border-radius:8px; background:#111827; color:white; border:none; cursor:pointer">
{{ editId ? 'Guardar cambios' : 'Crear' }}
</button>
<button v-if="editId" type="button" @click="resetForm" style="padding:8px 12px; border-radius:8px; background:#e5e7eb; border:1px solid #d1d5db; cursor:pointer">
Cancelar
</button>
</div>
</form>


<section>
<header style="display:flex; align-items:center; justify-content:space-between; margin-bottom:8px;">
<h2 style="font-size:20px; font-weight:700">Listado</h2>
<button @click="store.fetchItems" style="padding:8px 12px; border-radius:8px; border:1px solid #d1d5db; background:white; cursor:pointer">Refrescar</button>
</header>


<div v-if="store.loading">Cargando...</div>
<div v-else-if="store.error" style="color:#b91c1c">{{ store.error }}</div>
<ul v-else style="display:grid; gap:8px; list-style:none; padding:0; margin:0;">
<li v-for="it in store.items" :key="it.id" style="border:1px solid #e5e7eb; border-radius:12px; padding:12px; display:flex; gap:12px; justify-content:space-between; align-items:start;">
<div>
<div style="font-weight:700">{{ it.nombre }} <small style="opacity:.6">#{{ it.id }}</small></div>
<div style="opacity:.8; margin:4px 0">{{ it.descripcion || '—' }}</div>
<div style="font-weight:600">$ {{ Number(it.precio).toFixed(2) }}</div>
</div>
<div style="display:flex; gap:8px;">
<button @click="startEdit(it)" style="padding:6px 10px; border-radius:8px; border:1px solid #d1d5db; background:white; cursor:pointer">Editar</button>
<button @click="onDelete(it.id)" style="padding:6px 10px; border-radius:8px; background:#dc2626; color:white; border:none; cursor:pointer">Eliminar</button>
</div>
</li>
</ul>
</section>
</section>
</main>
</template>


<script setup>
import { reactive, ref, onMounted } from 'vue'
import { useItemsStore } from './stores/items'

const store = useItemsStore()
const form = reactive({ nombre: '', descripcion: '', precio: 0 })
const editId = ref(null)

onMounted(() => store.fetchItems())

function resetForm() {
  form.nombre = ''
  form.descripcion = ''
  form.precio = 0
  editId.value = null
}

async function onSubmit() {
  const payload = {
    nombre: form.nombre,
    descripcion: form.descripcion,
    // Asegura número
    precio: Number(form.precio ?? 0),
  }
  try {
    if (editId.value !== null) {
      await store.updateItem(editId.value, payload)
    } else {
      await store.createItem(payload)
    }
    resetForm()
  } catch (e) {
    alert('No se pudo guardar. Abre la consola (F12) → Console & Network.')
  }
}

function startEdit(it) {
  editId.value = Number(it.id)
  form.nombre = it.nombre ?? ''
  form.descripcion = it.descripcion ?? ''
  form.precio = Number(it.precio ?? 0)
}

async function onDelete(id) {
  if (confirm('¿Eliminar este item?')) {
    await store.deleteItem(id)
  }
}
</script>
<style>
:root { color-scheme: light dark; }
</style>