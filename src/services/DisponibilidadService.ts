const BASE_URL = import.meta.env.VITE_API_URL + '/disponibilidades'

interface DisponibilidadPayload {
  especialista_id: number
  dia: 'Lunes' | 'Martes' | 'Miércoles' | 'Jueves' | 'Viernes' | 'Sábado' | 'Domingo'
  hora_inicio: string // formato: 'HH:mm'
  hora_fin: string // formato: 'HH:mm'
}

export default {
  async list() {
    const res = await fetch(BASE_URL, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    })
    if (!res.ok) throw new Error('Error al listar disponibilidades')
    return await res.json()
  },

  async get(id: number) {
    const res = await fetch(`${BASE_URL}/${id}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    })
    if (!res.ok) throw new Error('Error al obtener disponibilidad')
    return await res.json()
  },

  async create(data: DisponibilidadPayload) {
    const res = await fetch(BASE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify(data),
    })
    if (!res.ok) {
      const error = await res.json()
      throw new Error(error.message || 'Error al crear disponibilidad')
    }
    return await res.json()
  },

  async update(id: number, data: Partial<DisponibilidadPayload>) {
    const res = await fetch(`${BASE_URL}/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify(data),
    })
    if (!res.ok) {
      const error = await res.json()
      throw new Error(error.message || 'Error al actualizar disponibilidad')
    }
    return await res.json()
  },

  async delete(id: number) {
    const res = await fetch(`${BASE_URL}/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    })
    if (!res.ok) throw new Error('Error al eliminar disponibilidad')
    return await res.json()
  },
}
