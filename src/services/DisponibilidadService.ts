const API_URL = 'http://localhost:3333/disponibilidades'

// Obtener todas las disponibilidades activas
export const obtenerDisponibilidades = async () => {
  const res = await fetch(API_URL)
  if (!res.ok) throw new Error('Error al obtener disponibilidades')
  return await res.json()
}

// Obtener una disponibilidad por ID
export const obtenerDisponibilidad = async (id) => {
  const res = await fetch(`${API_URL}/${id}`)
  if (!res.ok) throw new Error('Error al obtener disponibilidad')
  return await res.json()
}

// Crear una disponibilidad
export const crearDisponibilidad = async (data) => {
  const res = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  if (!res.ok) throw new Error('Error al crear disponibilidad')
  return await res.json()
}

// Actualización completa (PUT)
export const reemplazarDisponibilidad = async (id, data) => {
  const res = await fetch(`${API_URL}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  if (!res.ok) throw new Error('Error al reemplazar disponibilidad')
  return await res.json()
}

// Actualización parcial (PATCH)
export const actualizarDisponibilidad = async (id, data) => {
  const res = await fetch(`${API_URL}/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  if (!res.ok) throw new Error('Error al actualizar disponibilidad')
  return await res.json()
}

// Eliminar (soft delete)
export const eliminarDisponibilidad = async (id) => {
  const res = await fetch(`${API_URL}/${id}`, {
    method: 'DELETE',
  })
  if (!res.ok) throw new Error('Error al eliminar disponibilidad')
}

// Eliminación permanente (force delete)
export const eliminarDisponibilidadPermanentemente = async (id) => {
  const res = await fetch(`${API_URL}/${id}/force`, {
    method: 'DELETE',
  })
  if (!res.ok) throw new Error('Error al eliminar disponibilidad permanentemente')
}
