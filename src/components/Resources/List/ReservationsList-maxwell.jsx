import { useState, useEffect } from 'react';
import axios from 'axios';
import { api } from '../../../config';
import { useNavigate } from 'react-router-dom';

const ReservationsList = () => {
    const [reservations, setReservations] = useState([]);
    const [filteredReservations, setFilteredReservations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [editingId, setEditingId] = useState(null);
    const [modifiedReservations, setModifiedReservations] = useState({});
    const [searchTerm, setSearchTerm] = useState('');
    const [searchType, setSearchType] = useState('username');
    const navigate = useNavigate();
    useEffect(() => {
        const fetchReservations = async () => {
            try {
                const response = await api.get('/api/reservation');
                const initialFiltered = response.data.filter(reservation =>
                    reservation.erdto && reservation.erdto.some(equipment =>
                        equipment.returnStatus === "NON_RETOURNE"
                    )
                );
                setReservations(initialFiltered);
                setFilteredReservations(initialFiltered);
                setLoading(false);
            } catch (err) {
                setError(err.message);
                setLoading(false);
            }
        };

        fetchReservations();
    }, []);

    // Appliquer les filtres de recherche
    useEffect(() => {
        if (searchTerm === '') {
            setFilteredReservations(reservations);
        } else {
            const filtered = reservations.filter(reservation => {
                switch (searchType) {
                    case 'username':
                        return reservation.username.toLowerCase().includes(searchTerm.toLowerCase());
                    case 'userId':
                        return reservation.userId.toString().includes(searchTerm);
                    case 'equipmentCode':
                        return reservation.erdto.some(equipment =>
                            equipment.equipmentCode.toLowerCase().includes(searchTerm.toLowerCase())
                        );
                    default:
                        return true;
                }
            });
            setFilteredReservations(filtered);
        }
    }, [searchTerm, searchType, reservations]);

    const handleEdit = (reservationId) => {
        setEditingId(reservationId);
        const reservation = reservations.find(r => r.id === reservationId);
        setModifiedReservations({
            ...modifiedReservations,
            [reservationId]: { ...reservation }
        });
    };

    const handleStatusChange = (reservationId, equipmentId, newStatus) => {
        setModifiedReservations(prev => {
            const updated = { ...prev };
            const equipment = updated[reservationId].erdto.find(e => e.id === equipmentId);
            if (equipment) {
                equipment.returnStatus = newStatus;
            }
            return updated;
        });
    };

    const handleSave = async (reservationId) => {
        try {
            const modifiedReservation = modifiedReservations[reservationId];

            // Construction du corps pour l'API
            const erupdate = modifiedReservation.erdto.map(e => ({
                equipmentStatus: e.returnStatus,
                erid: e.id
            }));

            await api.put(`/api/reservation/${reservationId}`, { erupdate });

            setReservations(prev =>
                prev.map(res =>
                    res.id === reservationId ? modifiedReservation : res
                )
            );
            setEditingId(null);
            toast.success("Mise à jour réussie !");
        } catch (err) {
            console.error("Erreur lors de la mise à jour:", err);
            toast.error("Erreur lors de la mise à jour.");
        }
    };


    if (loading) return <div className="text-center py-8">Chargement en cours...</div>;
    if (error) return <div className="text-center py-8 text-red-500">Erreur: {error}</div>;

    return (
        <div className="max-w-6xl mx-auto p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Gestion des Réservations</h1>
                <button
                    onClick={() => navigate('/dashboard/reservation/create')}
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition flex items-center"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                    </svg>
                    Créer une réservation
                </button>
            </div>

            {/* Barre de recherche et filtres */}
            <div className="bg-white p-4 rounded-lg shadow-md mb-6">
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1">
                        <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
                            Rechercher
                        </label>
                        <div className="flex">
                            <input
                                type="text"
                                id="search"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder={`Rechercher par ${searchType === 'username' ? 'nom utilisateur' : searchType === 'userId' ? 'ID utilisateur' : 'code équipement'}`}
                                className="flex-1 px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <select
                                value={searchType}
                                onChange={(e) => setSearchType(e.target.value)}
                                className="px-3 py-2 border-t border-b border-r border-gray-300 rounded-r-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="username">Nom utilisateur</option>
                                <option value="userId">ID utilisateur</option>
                                <option value="equipmentCode">Code équipement</option>
                            </select>
                        </div>
                    </div>
                </div>
            </div>

            {filteredReservations.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                    {searchTerm ?
                        "Aucune réservation ne correspond à votre recherche." :
                        "Aucune réservation avec équipement non retourné trouvée."}
                </div>
            ) : (
                <div className="space-y-6">
                    {filteredReservations.map(reservation => {
                        const isEditing = editingId === reservation.id;
                        const currentReservation = isEditing
                            ? modifiedReservations[reservation.id]
                            : reservation;

                        return (
                            <div key={reservation.id} className="bg-white rounded-lg shadow-md p-6">
                                <div className="flex flex-col md:flex-row md:justify-between md:items-start mb-4">
                                    <div className="mb-4 md:mb-0">
                                        <h2 className="text-lg font-semibold">
                                            Réservation #{reservation.id}
                                        </h2>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
                                            <p className="text-sm text-gray-500">
                                                <span className="font-medium">Utilisateur:</span> {reservation.username} (ID: {reservation.userId})
                                            </p>
                                            <p className="text-sm text-gray-500">
                                                <span className="font-medium">Date:</span> {new Date(reservation.startDate).toLocaleString()}
                                            </p>
                                        </div>
                                    </div>
                                    {isEditing ? (
                                        <button
                                            onClick={() => handleSave(reservation.id)}
                                            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
                                        >
                                            Enregistrer
                                        </button>
                                    ) : (
                                        <button
                                            onClick={() => handleEdit(reservation.id)}
                                            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                                        >
                                            Modifier
                                        </button>
                                    )}
                                </div>

                                {/* Liste des équipements */}
                                <div className="mt-4">
                                    <h3 className="font-medium text-gray-700 mb-2">Équipements:</h3>
                                    <div className="overflow-x-auto">
                                        <table className="min-w-full divide-y divide-gray-200">
                                            <thead className="bg-gray-50">
                                                <tr>
                                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Code</th>
                                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
                                                </tr>
                                            </thead>
                                            <tbody className="bg-white divide-y divide-gray-200">
                                                {currentReservation.erdto
                                                    .filter(equipment => equipment.returnStatus === "NON_RETOURNE")
                                                    .map(equipment => (
                                                        <tr key={equipment.id}>
                                                            <td className="px-4 py-2 whitespace-nowrap text-sm font-medium text-gray-900">
                                                                {equipment.equipmentCode}
                                                            </td>
                                                            <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">
                                                                {equipment.equipmentType}
                                                            </td>
                                                            <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">
                                                                {isEditing ? (
                                                                    <select
                                                                        value={equipment.returnStatus}
                                                                        onChange={(e) => handleStatusChange(reservation.id, equipment.id, e.target.value)}
                                                                        className="px-3 py-1 border rounded"
                                                                    >
                                                                        <option value="NON_RETOURNE">Non retourné</option>
                                                                        <option value="RETOURNE">Retourné</option>
                                                                        <option value="CASSE">Cassé</option>
                                                                    </select>
                                                                ) : (
                                                                    <span className={`px-3 py-1 text-xs font-medium rounded-full ${equipment.returnStatus === "NON_RETOURNE" ? "bg-yellow-100 text-yellow-800" :
                                                                        equipment.returnStatus === "RETOURNE" ? "bg-green-100 text-green-800" :
                                                                            "bg-red-100 text-red-800"
                                                                        }`}>
                                                                        {equipment.returnStatus === "NON_RETOURNE" ? "À retourner" :
                                                                            equipment.returnStatus === "RETOURNE" ? "Retourné" : "En retard"}
                                                                    </span>
                                                                )}
                                                            </td>
                                                        </tr>
                                                    ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>

                                {/* Liste des consommables */}
                                {currentReservation.crdto && currentReservation.crdto.length > 0 && (
                                    <div className="mt-6">
                                        <h3 className="font-medium text-gray-700 mb-2">Consommables:</h3>
                                        <div className="overflow-x-auto">
                                            <table className="min-w-full divide-y divide-gray-200">
                                                <thead className="bg-gray-50">
                                                    <tr>
                                                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                                                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantité</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="bg-white divide-y divide-gray-200">
                                                    {currentReservation.crdto.map(consumable => (
                                                        <tr key={consumable.id}>
                                                            <td className="px-4 py-2 whitespace-nowrap text-sm font-medium text-gray-900">
                                                                {consumable.typeConsommable}
                                                            </td>
                                                            <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">
                                                                {consumable.quantity}
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default ReservationsList;