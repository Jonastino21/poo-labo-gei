import React from 'react'
import ResourceFormContainer from '../Form/ResourceFormContainer-maxwell'
import UsageHistory from '../UsageHistory/UsageHistoryContainer-maxwell'

const ResourceListView = ({
  resources,
  loading,
  filterType,
  filterEtat,
  onFilterTypeChange,
  onFilterEtatChange,
  openForm,
  handleDelete,
  filteredResources,
  showForm,
  editingResource,
  closeForm,
  showHistoryFor,
  openHistory,
  closeHistory,
}) => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">
        Gestion des ressources pédagogiques
      </h1>

      <div className="flex flex-wrap items-center gap-3 mb-6">
        <input
          type="text"
          placeholder="Filtrer par type..."
          value={filterType}
          onChange={(e) => onFilterTypeChange(e.target.value)}
          className="border px-2 py-1 rounded focus:outline-none focus:ring-2 focus:ring-blue-300"
        />

        <select
          value={filterEtat}
          onChange={(e) => onFilterEtatChange(e.target.value)}
          className="border px-2 py-1 rounded focus:outline-none focus:ring-2 focus:ring-blue-300"
        >
          <option value="">Tous états</option>
          <option value="Disponible">Disponible</option>
          <option value="En cours d’utilisation">En cours d’utilisation</option>
          <option value="En maintenance">En maintenance</option>
        </select>

        <button
          onClick={() => openForm(null)}
          className="ml-auto bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded transition duration-150"
        >
          + Nouvelle ressource
        </button>
      </div>

      {loading ? (
        <p>Chargement…</p>
      ) : (
        <table className="min-w-full border-collapse text-left">
          <thead>
            <tr className="bg-gray-100">
              <th className="border px-3 py-2">Nom</th>
              <th className="border px-3 py-2">Type</th>
              <th className="border px-3 py-2">État</th>
              <th className="border px-3 py-2">Disponibilité</th>
              <th className="border px-3 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredResources.map((res) => (
              <tr key={res.id} className="hover:bg-gray-50">
                <td className="border px-3 py-2">{res.nom}</td>
                <td className="border px-3 py-2">{res.type}</td>
                <td className="border px-3 py-2">{res.etat}</td>
                <td className="border px-3 py-2">
                  {res.disponibilite ? (
                    <span className="text-green-600 font-medium">✔️</span>
                  ) : (
                    <span className="text-red-600 font-medium">✖️</span>
                  )}
                </td>
                <td className="border px-3 py-2 space-x-2">
                  <button
                    onClick={() => openForm(res)}
                    className="text-sm bg-yellow-400 hover:bg-yellow-500 text-white px-2 py-1 rounded transition duration-150"
                  >
                    Éditer
                  </button>
                  <button
                    onClick={() => handleDelete(res.id)}
                    className="text-sm bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded transition duration-150"
                  >
                    Supprimer
                  </button>
                  <button
                    onClick={() => openHistory(res.id)}
                    className="text-sm bg-indigo-500 hover:bg-indigo-600 text-white px-2 py-1 rounded transition duration-150"
                  >
                    Historique
                  </button>
                </td>
              </tr>
            ))}

            {filteredResources.length === 0 && (
              <tr>
                <td colSpan="5" className="text-center py-4">
                  Aucune ressource trouvée.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}
           
      {showForm && (
        <ResourceFormContainer
          resource={editingResource}
          onClose={closeForm}
        />
      )}

      {showHistoryFor && (
        <UsageHistory
          resourceId={showHistoryFor}
          onClose={closeHistory}
        />
      )}
    </div>
  )
}

export default ResourceListView
