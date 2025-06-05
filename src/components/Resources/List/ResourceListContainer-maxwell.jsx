import React, { useState, useEffect } from 'react'
import { fetchResources, deleteResource } from '../../../api/ressources-maxwell'
import ResourceListView from './RessourceListView-maxwell'

const ResourceListContainer = () => {
  const [resources, setResources]               = useState([])
  const [loading, setLoading]                   = useState(true)
  const [filterType, setFilterType]             = useState('')
  const [filterEtat, setFilterEtat]             = useState('')
  const [showForm, setShowForm]                 = useState(false)
  const [editingResource, setEditingResource]   = useState(null)
  const [showHistoryFor, setShowHistoryFor]     = useState(null)

  const loadResources = async () => {
    setLoading(true)
    try {
      const data = await fetchResources()
      setResources(data)
    } catch (err) {
      console.error('Erreur récupération ressources :', err)
    }
    setLoading(false)
  }

  useEffect(() => {
    loadResources()
  }, [])

  const handleDelete = async (id) => {
    if (!window.confirm('Confirmer la suppression de cette ressource ?')) return
    try {
      await deleteResource(id)
      loadResources()
    } catch (err) {
      console.error('Erreur suppression :', err)
    }
  }

  const openForm = (resource = null) => {
    setEditingResource(resource)
    setShowForm(true)
  }

  const closeForm = () => {
    setEditingResource(null)
    setShowForm(false)
    loadResources()
  }

  const openHistory = (id) => {
    setShowHistoryFor(id)
  }

  const closeHistory = () => {
    setShowHistoryFor(null)
  }

  const filteredResources = resources.filter((r) => {
    const okType = filterType
      ? r.type.toLowerCase().includes(filterType.toLowerCase())
      : true
    const okEtat = filterEtat ? r.etat === filterEtat : true
    return okType && okEtat
  })

  return (
    <ResourceListView
      resources={resources}
      loading={loading}
      filterType={filterType}
      filterEtat={filterEtat}
      onFilterTypeChange={setFilterType}
      onFilterEtatChange={setFilterEtat}
      openForm={openForm}
      handleDelete={handleDelete}
      filteredResources={filteredResources}
      showForm={showForm}
      editingResource={editingResource}
      closeForm={closeForm}
      showHistoryFor={showHistoryFor}
      openHistory={openHistory}
      closeHistory={closeHistory}
    />
  )
}

export default ResourceListContainer
