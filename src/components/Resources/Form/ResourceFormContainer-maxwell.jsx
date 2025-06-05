import React, { useState, useEffect } from 'react'
import { createResource, updateResource } from '../../../api/ressources-maxwell'
import ResourceFormView from './RessourceFormView-maxwell'

const ResourceFormContainer = ({ resource, onClose }) => {

  const isEditMode = resource !== null

  const [nom, setNom] = useState('')
  const [type, setType] = useState('')
  const [etat, setEtat] = useState('Disponible')
  const [disponibilite, setDisponibilite] = useState(true)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (isEditMode) {
      setNom(resource.nom || '')
      setType(resource.type || '')
      setEtat(resource.etat || 'Disponible')
      setDisponibilite(resource.disponibilite ?? true)
    } else {
      setNom('')
      setType('')
      setEtat('Disponible')
      setDisponibilite(true)
    }
  }, [resource, isEditMode])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    const payload = { nom, type, etat, disponibilite }

    try {
      if (isEditMode) {
        await updateResource(resource.id, payload)
      } else {
        await createResource(payload)
      }
      onClose() 
    } catch (err) {
      console.error('Erreur sauvegarde ressource :', err)
      alert('Une erreur est survenue. Vérifie la console.')
    }

    setLoading(false)
  }

  return (
    <ResourceFormView
      isEditMode={isEditMode}
      nom={nom}
      setNom={setNom}
      type={type}
      setType={setType}
      etat={etat}
      setEtat={setEtat}
      disponibilite={disponibilite}
      setDisponibilite={setDisponibilite}
      loading={loading}
      onSubmit={handleSubmit}
      onClose={onClose}
    />
  )
}

export default ResourceFormContainer
