import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { api } from '../../../config';

const ConsumableTable = ({ consommables: initialConsommables }) => {
  // États
  const [consommables, setConsommables] = useState(initialConsommables);
  const [filterType, setFilterType] = useState('');
  const [filteredConsommables, setFilteredConsommables] = useState(initialConsommables);
  const [showModal, setShowModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selected, setSelected] = useState(null);
  const [newConsumable, setNewConsumable] = useState({ title: '', codePrefix: '' });

  // Synchronisation avec les props
  useEffect(() => {
    setConsommables(initialConsommables);
  }, [initialConsommables]);

  // Filtrage des consommables
  useEffect(() => {
    const filtered = consommables.filter(c =>
      c.type.toLowerCase().includes(filterType.toLowerCase())
    );
    setFilteredConsommables(filtered);
  }, [filterType, consommables]);

  // Gestion de l'édition
  const handleEditClick = (item) => {
    setSelected({ id: item.id, stock: item.stock });
    setShowModal(true);
  };

  const handleChange = (e) => {
    setSelected((prev) => ({
      ...prev,
      stock: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/api/consommables/${selected.id}`, {
        stock: parseInt(selected.stock),
      });
      
      // Mise à jour locale
      setConsommables(prev => prev.map(c => 
        c.id === selected.id 
          ? { ...c, stock: selected.stock } 
          : c
      ));
      
      toast.success("Stock mis à jour !");
      setShowModal(false);
    } catch (err) {
      toast.error("Erreur lors de la mise à jour.");
    }
  };

  // Gestion de l'ajout
  const handleAddConsumable = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post(`/api/resources/type`, {
        ...newConsumable,
        consommable: true,
      });
      
      // Mise à jour locale (ajoute le nouveau type avec stock à 0)
      const newItem = {
        id: response.data.id,
        type: newConsumable.title,
        stock: 0,
        codePrefix: newConsumable.codePrefix
      };
      
      setConsommables(prev => [...prev, newItem]);
      
      toast.success("Consommable ajouté !");
      setShowAddModal(false);
      setNewConsumable({ title: '', codePrefix: '' });
    } catch (err) {
      toast.error("Erreur lors de l'ajout du consommable.");
    }
  };

  return (
    <div className="relative">
      {/* Filtres et bouton ajouter */}
      <div className="flex flex-col md:flex-row gap-4 mb-4">
        <input
          type="text"
          placeholder="Filtrer par type"
          className="border px-3 py-2 rounded flex-grow max-w-md"
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
        />
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded md:ml-auto"
        >
          Ajouter un consommable
        </button>
      </div>

      {/* Tableau */}
      <table className="min-w-full border-collapse text-left">
        <thead>
          <tr className="bg-gray-100">
            <th className="border px-3 py-2">Nom</th>
            <th className="border px-3 py-2">Quantité</th>
            <th className="border px-3 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredConsommables.length === 0 ? (
            <tr>
              <td colSpan="3" className="text-center py-4">Aucun consommable trouvé.</td>
            </tr>
          ) : (
            filteredConsommables.map((res) => (
              <tr key={res.id} className="hover:bg-gray-50">
                <td className="border px-3 py-2">{res.type}</td>
                <td className="border px-3 py-2">{res.stock}</td>
                <td className="border px-3 py-2">
                  <button
                    onClick={() => handleEditClick(res)}
                    className="bg-yellow-400 hover:bg-yellow-500 text-white px-2 py-1 rounded text-sm"
                  >
                    Éditer
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* Modal édition de stock */}
      {showModal && selected && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white p-6 rounded-lg shadow-md w-80">
            <h2 className="text-lg font-semibold mb-4">Modifier le stock</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium">Quantité</label>
                <input
                  type="number"
                  min="0"
                  value={selected.stock}
                  onChange={handleChange}
                  className="w-full border px-2 py-1 rounded"
                  required
                />
              </div>
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="bg-gray-300 px-3 py-1 rounded hover:bg-gray-400"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                >
                  Sauvegarder
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal ajout consommable */}
      {showAddModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white p-6 rounded-lg shadow-md w-96">
            <h2 className="text-lg font-semibold mb-4">Ajouter un consommable</h2>
            <form onSubmit={handleAddConsumable} className="space-y-4">
              <div>
                <label className="block text-sm font-medium">Nom du consommable</label>
                <input
                  type="text"
                  required
                  value={newConsumable.title}
                  onChange={(e) =>
                    setNewConsumable({ ...newConsumable, title: e.target.value })
                  }
                  className="w-full border px-2 py-1 rounded"
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Préfixe du code</label>
                <input
                  type="text"
                  required
                  value={newConsumable.codePrefix}
                  onChange={(e) =>
                    setNewConsumable({ ...newConsumable, codePrefix: e.target.value })
                  }
                  className="w-full border px-2 py-1 rounded"
                />
              </div>
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="bg-gray-300 px-3 py-1 rounded hover:bg-gray-400"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                >
                  Ajouter
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ConsumableTable;