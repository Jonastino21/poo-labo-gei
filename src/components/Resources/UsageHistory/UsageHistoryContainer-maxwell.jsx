import React, { useState, useEffect } from 'react'
import { fetchUsageHistory } from '../../../api/ressources-maxwell'
import UsageHistoryView from './UsageHistoryView-maxwell'

const UsageHistoryContainer = ({ resourceId, onClose }) => {
  const [history, setHistory] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadHistory = async () => {
      setLoading(true)
      try {
        const data = await fetchUsageHistory(resourceId)
        setHistory(data)
      } catch (err) {
        console.error('Erreur récupération historique :', err)
      }
      setLoading(false)
    }

    if (resourceId !== null) {
      loadHistory()
    }
  }, [resourceId])

  return (
    <UsageHistoryView
      history={history}
      loading={loading}
      onClose={onClose}
    />
  )
}

export default UsageHistoryContainer
