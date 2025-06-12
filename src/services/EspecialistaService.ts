const API_URL = 'http://localhost:3333/especialistas'

async function obtenerEspecialistas() {
  const res = await fetch(API_URL)
  if (!res.ok) {
    const error = await res.json()
    console.error('Error al obtener especialistas:', error)
    throw new Error(`Error ${res.status}: ${res.statusText}`)
  }
  return await res.json()
}

async function crearEspecialista(data) {
  const res = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })

  if (!res.ok) {
    const error = await res.json()
    console.error('Error al crear especialista:', error)
    throw new Error(`Error ${res.status}: ${res.statusText}`)
  }

  return await res.json()
}

async function actualizarEspecialista(id, data) {
  const res = await fetch(`${API_URL}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })

  if (!res.ok) {
    const error = await res.json()
    console.error('Error al actualizar especialista:', error)
    throw new Error(`Error ${res.status}: ${res.statusText}`)
  }

  return await res.json()
}

async function actualizarEspecialistaParcial(id, data) {
  const res = await fetch(`${API_URL}/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })

  if (!res.ok) {
    const error = await res.json()
    console.error('Error al actualizar parcialmente especialista:', error)
    throw new Error(`Error ${res.status}: ${res.statusText}`)
  }

  return await res.json()
}

async function eliminarEspecialistaPermanentemente(id) {
  const res = await fetch(`${API_URL}/${id}`, { method: 'DELETE' })

  if (!res.ok) {
    const error = await res.json()
    console.error('Error al eliminar especialista:', error)
    throw new Error(`Error ${res.status}: ${res.statusText}`)
  }

  return await res.json()
}

export default {
  obtenerEspecialistas,
  crearEspecialista,
  actualizarEspecialista,
  actualizarEspecialistaParcial,
  eliminarEspecialistaPermanentemente,
}
