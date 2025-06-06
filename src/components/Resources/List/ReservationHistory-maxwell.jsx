import { useState, useEffect } from 'react';
import { api } from '../../../config';

const ReservationHistory = () => {
  const [reservations, setReservations] = useState([]);
  const [filteredReservations, setFilteredReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchType, setSearchType] = useState('username');
  const [dateFilter, setDateFilter] = useState({
    startDate: '',
    endDate: ''
  });

  useEffect(() => {
    const fetchReservations = async () => {
      try {
        const response = await api.get('/api/reservation');
        setReservations(response.data);
        setFilteredReservations(response.data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchReservations();
  }, []);

  useEffect(() => {
    let results = reservations;

    // Filtre par texte
    if (searchTerm) {
      results = results.filter(reservation => {
        switch (searchType) {
          case 'username':
            return reservation.username.toLowerCase().includes(searchTerm.toLowerCase());
          case 'userId':
            return reservation.userId.toString().includes(searchTerm);
          case 'equipmentCode':
            return reservation.erdto?.some(equipment => 
              equipment.equipmentCode.toLowerCase().includes(searchTerm.toLowerCase())
            );
          case 'reservationId':
            return reservation.id.toString().includes(searchTerm);
          default:
            return true;
        }
      });
    }

    // Filtre par date
    if (dateFilter.startDate || dateFilter.endDate) {
      results = results.filter(reservation => {
        const reservationDate = new Date(reservation.startDate);
        const startDate = dateFilter.startDate ? new Date(dateFilter.startDate) : null;
        const endDate = dateFilter.endDate ? new Date(dateFilter.endDate) : null;

        return (
          (!startDate || reservationDate >= startDate) &&
          (!endDate || reservationDate <= endDate)
        );
      });
    }

    setFilteredReservations(results);
  }, [searchTerm, searchType, dateFilter, reservations]);

  const handleDateFilterChange = (e) => {
    const { name, value } = e.target;
    setDateFilter(prev => ({
      ...prev,
      [name]: value
    }));
  };

  if (loading) return <div className="text-center py-8">Chargement en cours...</div>;
  if (error) return <div className="text-center py-8 text-red-500">Erreur: {error}</div>;

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Historique des Réservations</h1>
      
      {/* Barre de recherche et filtres */}
      <div className="bg-white p-4 rounded-lg shadow-md mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Recherche texte */}
          <div>
            <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
              Recherche
            </label>
            <div className="flex">
              <input
                type="text"
                id="search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder={`Rechercher par ${searchType === 'username' ? 'nom utilisateur' : 
                           searchType === 'userId' ? 'ID utilisateur' : 
                           searchType === 'equipmentCode' ? 'code équipement' : 'ID réservation'}`}
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
                <option value="reservationId">ID réservation</option>
              </select>
            </div>
          </div>

          {/* Filtre par date - Début */}
          <div>
            <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-1">
              Date de début
            </label>
            <input
              type="date"
              id="startDate"
              name="startDate"
              value={dateFilter.startDate}
              onChange={handleDateFilterChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Filtre par date - Fin */}
          <div>
            <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-1">
              Date de fin
            </label>
            <input
              type="date"
              id="endDate"
              name="endDate"
              value={dateFilter.endDate}
              onChange={handleDateFilterChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      {filteredReservations.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          Aucune réservation ne correspond à vos critères de recherche.
        </div>
      ) : (
        <div className="space-y-6">
          {filteredReservations.map(reservation => (
            <div key={reservation.id} className="bg-white rounded-lg shadow-md p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div>
                  <h2 className="text-lg font-semibold">Réservation #{reservation.id}</h2>
                  <p className="text-sm text-gray-500">
                    <span className="font-medium">Utilisateur:</span> {reservation.username} (ID: {reservation.userId})
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">
                    <span className="font-medium">Date:</span> {new Date(reservation.startDate).toLocaleString()}
                  </p>
                </div>
              </div>

              {/* Équipements */}
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
                      {reservation.erdto?.map(equipment => (
                        <tr key={equipment.id}>
                          <td className="px-4 py-2 whitespace-nowrap text-sm font-medium text-gray-900">
                            {equipment.equipmentCode}
                          </td>
                          <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">
                            {equipment.equipmentType}
                          </td>
                          <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">
                            <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                              equipment.returnStatus === "NON_RETOURNE" ? "bg-yellow-100 text-yellow-800" :
                              equipment.returnStatus === "RETOURNE" ? "bg-green-100 text-green-800" :
                              "bg-red-100 text-red-800"
                            }`}>
                              {equipment.returnStatus === "NON_RETOURNE" ? "Non retourné" :
                               equipment.returnStatus === "RETOURNE" ? "Retourné" : "Cassé"}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Consommables */}
              {reservation.crdto?.length > 0 && (
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
                        {reservation.crdto.map(consumable => (
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
          ))}
        </div>
      )}
    </div>
  );
};

export default ReservationHistory;