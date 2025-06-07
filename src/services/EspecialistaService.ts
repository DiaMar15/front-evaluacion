const BASE_URL = import.meta.env.VITE_API_URL + '/especialistas'

interface EspecialistaPayload {
  nombre: string
  especialidad: string
  telefono: string
  correo: string
  disponibilidades?: {
    dia: 'Lunes' | 'Martes' | 'Miércoles' | 'Jueves' | 'Viernes' | 'Sábado' | 'Domingo'
    hora_inicio: string
    hora_fin: string
  }[]
}

export default {
  async list() {
    const res = await fetch(BASE_URL, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    })
    if (!res.ok) throw new Error('Error al listar especialistas')
    return await res.json()
  },

  async get(id: number) {
    const res = await fetch(`${BASE_URL}/${id}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    })
    if (!res.ok) throw new Error('Error al obtener especialista')
    return await res.json()
  },

  async create(data: EspecialistaPayload) {
    const res = await fetch(BASE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify(data),
    })
    if (!res.ok) throw new Error('Error al crear especialista')
    return await res.json()
  },

  async update(id: number, data: Partial<EspecialistaPayload>) {
    const res = await fetch(`${BASE_URL}/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify(data),
    })
    if (!res.ok) throw new Error('Error al actualizar especialista')
    return await res.json()
  },

  async delete(id: number) {
    const res = await fetch(`${BASE_URL}/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    })
    if (!res.ok) throw new Error('Error al eliminar especialista')
    return await res.json()
  },
}
