import React from 'react'

const UsageHistoryView = ({ history, loading, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-11/12 sm:w-3/4 md:w-1/2 p-6 relative max-h-[80vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-600 hover:text-gray-900"
        >
          ✖
        </button>

        <h2 className="text-xl font-medium mb-4">Historique d’utilisation</h2>

        {loading ? (
          <p>Chargement de l’historique…</p>
        ) : (
          <table className="min-w-full border-collapse text-left">
            <thead>
              <tr className="bg-gray-100">
                <th className="border px-3 py-2">Date</th>
                <th className="border px-3 py-2">Utilisateur</th>
                <th className="border px-3 py-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {history.map((entry, idx) => (
                <tr key={idx} className="hover:bg-gray-50">
                  <td className="border px-3 py-2">{entry.date}</td>
                  <td className="border px-3 py-2">{entry.utilisateur}</td>
                  <td className="border px-3 py-2">{entry.action}</td>
                </tr>
              ))}
              {history.length === 0 && (
                <tr>
                  <td colSpan="3" className="text-center py-4">
                    Aucune entrée historique.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}

export default UsageHistoryView
