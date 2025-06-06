import React, { useState } from 'react'
import { api } from '../../../config'

const AddResourceTypeForm = () => {
  const [formData, setFormData] = useState({
    title: '',
    codePrefix: '',
    consommable: false,
  })

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await api.post('/api/resources/type', formData)
      alert('Type de ressource ajouté avec succès')
      setFormData({ title: '', codePrefix: '', consommable: false })
    } catch (error) {
      console.error(error)
      alert("Échec de l'ajout du type de ressource")
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 bg-white p-6 rounded-xl shadow-md border border-gray-200"
    >
      <div>
        <label className="block text-sm font-medium text-gray-700">Nom du type</label>
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          required
          className="mt-1 w-full rounded-md border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Ex : Craie"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Préfixe du code</label>
        <input
          type="text"
          name="codePrefix"
          value={formData.codePrefix}
          onChange={handleChange}
          required
          className="mt-1 w-full rounded-md border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Ex : CR"
        />
      </div>

      <div className="flex items-center">
        <input
          type="checkbox"
          name="consommable"
          checked={formData.consommable}
          onChange={handleChange}
          id="consommable"
          className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
        />
        <label htmlFor="consommable" className="ml-2 text-sm text-gray-700">
          C'est un consommable
        </label>
      </div>

      <button
        type="submit"
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md transition"
      >
        Ajouter
      </button>
    </form>
  )
}

export default AddResourceTypeForm
