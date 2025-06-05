import React from 'react'

const ResourceFormView = ({
  isEditMode,
  nom,
  setNom,
  type,
  setType,
  etat,
  setEtat,
  disponibilite,
  setDisponibilite,
  loading,
  onSubmit,
  onClose,
}) => {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-11/12 sm:w-3/4 md:w-1/2 lg:w-1/3 p-6 relative">
         <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-600 hover:text-gray-900"
        >
          ✖
        </button>

        <h2 className="text-xl font-medium mb-4">
          {isEditMode
            ? 'Éditer la ressource'
            : 'Ajouter une nouvelle ressource'}
        </h2>

        <form onSubmit={onSubmit} className="space-y-4">

          <div>
            <label className="block mb-1 font-semibold">Nom :</label>
            <input
              type="text"
              value={nom}
              onChange={(e) => setNom(e.target.value)}
              required
              className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-300"
            />
          </div>

          <div>
            <label className="block mb-1 font-semibold">Type :</label>
            <input
              type="text"
              value={type}
              onChange={(e) => setType(e.target.value)}
              placeholder="Ex. Vidéo projecteur, Tableau, Craie…"
              required
              className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-300"
            />
          </div>

          <div>
            <label className="block mb-1 font-semibold">État :</label>
            <select
              value={etat}
              onChange={(e) => setEtat(e.target.value)}
              className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-300"
            >
              <option value="Disponible">Disponible</option>
              <option value="En cours d’utilisation">
                En cours d’utilisation
              </option>
              <option value="En maintenance">En maintenance</option>
            </select>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="disponibilite"
              checked={disponibilite}
              onChange={(e) => setDisponibilite(e.target.checked)}
              className="mr-2 h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <label htmlFor="disponibilite" className="font-medium">
              Est disponible ?
            </label>
          </div>


          <div className="flex justify-end gap-3 mt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border rounded hover:bg-gray-100 transition duration-150"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded transition duration-150 disabled:opacity-50"
              disabled={loading}
            >
              {loading
                ? 'Enregistrement…'
                : isEditMode
                ? 'Mettre à jour'
                : 'Créer'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default ResourceFormView
