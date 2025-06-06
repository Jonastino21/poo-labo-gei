import { useState, useEffect } from 'react';
import axios from 'axios';
import { api } from '../../../config';
import { toast } from 'react-toastify';

const ReservationForm = () => {
    const [formData, setFormData] = useState({
        userId: 0,
        equipmentIds: [],
        localisation: '',
        consommables: []
    });

    const [equipments, setEquipments] = useState([]);
    const [consumables, setConsumables] = useState([]);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Récupérer les données
    useEffect(() => {
        const fetchData = async () => {
            try {
                const [equipResponse, consumResponse, usersResponse] = await Promise.all([
                    api.get('/api/equipments'),
                    api.get('/api/consommables'),
                    api.get('/auth')
                ]);

                const availableEquipments = equipResponse.data.filter(eq => eq.available);
                setEquipments(availableEquipments);
                setConsumables(consumResponse.data);
                setUsers(usersResponse.data);
                setLoading(false);
            } catch (err) {
                setError(err.message);
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const equipmentsByType = equipments.reduce((acc, equipment) => {
        if (!acc[equipment.type]) {
            acc[equipment.type] = [];
        }
        acc[equipment.type].push(equipment);
        return acc;
    }, {});

    const handleEquipmentChange = (equipmentId) => {
        setFormData(prev => {
            if (prev.equipmentIds.includes(equipmentId)) {
                return {
                    ...prev,
                    equipmentIds: prev.equipmentIds.filter(id => id !== equipmentId)
                };
            } else {
                return {
                    ...prev,
                    equipmentIds: [...prev.equipmentIds, equipmentId]
                };
            }
        });
    };

    const handleConsumableChange = (consumableId, quantity) => {
        setFormData(prev => {
            const existingIndex = prev.consommables.findIndex(c => c.id === consumableId);

            if (existingIndex >= 0) {
                if (quantity === 0) {
                    return {
                        ...prev,
                        consommables: prev.consommables.filter(c => c.id !== consumableId)
                    };
                } else {
                    const updated = [...prev.consommables];
                    updated[existingIndex] = { id: consumableId, quantity };
                    return { ...prev, consommables: updated };
                }
            } else if (quantity > 0) {
                return {
                    ...prev,
                    consommables: [...prev.consommables, { id: consumableId, quantity }]
                };
            }

            return prev;
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await api.post('/api/reservation', formData);
            toast.success('Réservation effectuée avec succès !');
            console.log('Réservation créée:', response.data);

        } catch (err) {
            toast.error('Erreur lors de la réservation : ' + (err.response?.data?.message || err.message));
            console.error('Erreur lors de la réservation:', err);
        }
    };


    if (loading) return <div>Chargement en cours...</div>;
    if (error) return <div>Erreur: {error}</div>;

    return (
        <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
            <h1 className="text-2xl font-bold mb-6 text-gray-800">Réservation de Matériel</h1>

            <form onSubmit={handleSubmit}>
                {/* Sélection de l'utilisateur */}
                <div className="mb-6">
                    <label htmlFor="userId" className="block text-sm font-medium text-gray-700 mb-2">
                        Utilisateur
                    </label>
                    <select
                        id="userId"
                        value={formData.userId}
                        onChange={(e) => setFormData({ ...formData, userId: parseInt(e.target.value) })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    >
                        <option value="">-- Sélectionner un utilisateur --</option>
                        {users.map(user => (
                            <option key={user.id} value={user.id}>
                                {user.username}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Champ Localisation */}
                <div className="mb-6">
                    <label htmlFor="localisation" className="block text-sm font-medium text-gray-700 mb-2">
                        Localisation
                    </label>
                    <input
                        type="text"
                        id="localisation"
                        value={formData.localisation}
                        onChange={(e) => setFormData({ ...formData, localisation: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    />
                </div>

                {/* Équipements par type */}
                <div className="mb-6">
                    <h2 className="text-lg font-semibold text-gray-800 mb-3">Équipements Disponibles</h2>
                    {Object.entries(equipmentsByType).map(([type, equipmentsOfType]) => (
                        <div key={type} className="mb-4">
                            <h3 className="font-medium text-gray-700 mb-2">{type}</h3>
                            <div className="space-y-2 pl-4">
                                {equipmentsOfType.map(equipment => (
                                    <div key={equipment.id} className="flex items-center">
                                        <input
                                            type="checkbox"
                                            id={`equipment-${equipment.id}`}
                                            checked={formData.equipmentIds.includes(equipment.id)}
                                            onChange={() => handleEquipmentChange(equipment.id)}
                                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                        />
                                        <label htmlFor={`equipment-${equipment.id}`} className="ml-2 text-sm text-gray-700">
                                            {equipment.code} - {equipment.localisation}
                                            {equipment.model && ` (${equipment.model})`}
                                        </label>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Consommables */}
                <div className="mb-6">
                    <h2 className="text-lg font-semibold text-gray-800 mb-3">Consommables</h2>
                    <div className="space-y-4">
                        {consumables
                            .filter(c => c.stock > 0)
                            .map(consumable => (
                                <div key={consumable.id} className="flex items-center justify-between">
                                    <div className="flex items-center">
                                        <input
                                            type="checkbox"
                                            id={`consumable-${consumable.id}`}
                                            checked={formData.consommables.some(c => c.id === consumable.id && c.quantity > 0)}
                                            onChange={(e) => handleConsumableChange(
                                                consumable.id,
                                                e.target.checked ? 1 : 0
                                            )}
                                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                        />
                                        <label htmlFor={`consumable-${consumable.id}`} className="ml-2 text-sm text-gray-700">
                                            {consumable.type} (Stock: {consumable.stock})
                                        </label>
                                    </div>
                                    {formData.consommables.some(c => c.id === consumable.id) && (
                                        <div className="flex items-center ml-4">
                                            <label htmlFor={`quantity-${consumable.id}`} className="mr-2 text-sm text-gray-700">
                                                Quantité:
                                            </label>
                                            <input
                                                type="number"
                                                id={`quantity-${consumable.id}`}
                                                min="1"
                                                max={consumable.stock}
                                                value={formData.consommables.find(c => c.id === consumable.id)?.quantity || 0}
                                                onChange={(e) => handleConsumableChange(
                                                    consumable.id,
                                                    Math.min(parseInt(e.target.value) || 0, consumable.stock)
                                                )}
                                                className="w-20 px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                                            />
                                        </div>
                                    )}
                                </div>
                            ))}
                    </div>
                </div>


                {/* Bouton */}
                <div className="mt-8">
                    <button
                        type="submit"
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-150"
                    >
                        Valider la réservation
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ReservationForm;
