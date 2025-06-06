import React, { useEffect, useState } from 'react'
import EquipmentTable from './EquipmentList-maxwell'
import ConsumableTable from './CunsomableList-maxwell'
import { api } from '../../../config'

const ResourceListContainer = () => {
  const [resources, setResources] = useState({ equipements: [], consommables: [] })
  const [viewMode, setViewMode] = useState('equipements')

  useEffect(() => {
    const fetchEquipements = async () => {
      try {
        const res = await api.get('/api/equipments')
        console.log(res.data);
        setResources(prev => ({ ...prev, equipements: res.data }))
      } catch (error) {
        console.error('Erreur lors du chargement des équipements:', error)
      }
    }

    const fetchConsommables = async () => {
      try {
        const res = await api.get('/api/consommables')
        setResources(prev => ({ ...prev, consommables: res.data }))
      } catch (error) {
        console.error('Erreur lors du chargement des consommables:', error)
      }
    }

    fetchEquipements()
    fetchConsommables()
  }, [])


  const openForm = (item) => {
    const handleEditEquipement = async ({ id, status, localisation }) => {
      await api.put(`/api/equipements/${id}`, { status, localisation });
    };
    handleEditEquipement();
  }

  const openHistory = (id) => {
    console.log('Historique de:', id)
    // afficher l'historique ici
  }

  return (
    <div className="p-4">

      <div className="flex gap-2 mb-4">
        <button
          onClick={() => setViewMode('equipements')}
          className={`px-4 py-2 rounded ${viewMode === 'equipements' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
        >
          Équipements
        </button>
        <button
          onClick={() => setViewMode('consommables')}
          className={`px-4 py-2 rounded ${viewMode === 'consommables' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
        >
          Consommables
        </button>
      </div>

      
      {viewMode === 'equipements' ? (
        <EquipmentTable
          equipements={resources.equipements}
          onEdit={openForm}
          onHistory={openHistory}
        />
      ) : (
        <ConsumableTable
          consommables={resources.consommables}
          onEdit={openForm}
        />
      )}
    </div>
  )
}

export default ResourceListContainer
