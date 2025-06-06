import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { api } from '../../../config';

const EquipmentTable = ({ equipements: initialEquipements }) => {
    // États
    const [equipements, setEquipements] = useState(initialEquipements);
    const [filterCode, setFilterCode] = useState('');
    const [filterType, setFilterType] = useState('');
    const [filteredEquipements, setFilteredEquipements] = useState(initialEquipements);
    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedEquipement, setSelectedEquipement] = useState(null);
    const [showAddModal, setShowAddModal] = useState(false);
    const [equipmentTypes, setEquipmentTypes] = useState([]);
    const [newEquipement, setNewEquipement] = useState({
        code: '',
        localisation: '',
        typeId: '',
        newType: {
            title: '',
            codePrefix: '',
            consommable: false,
        },
        isNewType: false,
    });

    // Synchronise les équipements lorsque les props changent
    useEffect(() => {
        setEquipements(initialEquipements);
    }, [initialEquipements]);

    // Filtrage des équipements
    useEffect(() => {
        const filtered = equipements.filter(e =>
            e.code.toLowerCase().includes(filterCode.toLowerCase()) &&
            e.type.toLowerCase().includes(filterType.toLowerCase())
        );
        setFilteredEquipements(filtered);
    }, [filterCode, filterType, equipements]);

    // Chargement des types d'équipement
    useEffect(() => {
        const loadEquipmentTypes = async () => {
            try {
                const res = await api.get('/api/resources/type');
                setEquipmentTypes(res.data.filter(t => !t.consommable));
            } catch (err) {
                toast.error("Erreur lors du chargement des types");
            }
        };
        loadEquipmentTypes();
    }, []);

    // Gestion de l'édition
    const handleEditSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.put(`/api/equipments/${selectedEquipement.id}`, {
                status: selectedEquipement.status,
                localisation: selectedEquipement.localisation,
            });

            // Mise à jour locale
            setEquipements(prev => prev.map(eq =>
                eq.id === selectedEquipement.id
                    ? { ...eq, ...selectedEquipement }
                    : eq
            ));

            toast.success("Équipement mis à jour !");
            setShowEditModal(false);
        } catch (err) {
            toast.error("Erreur lors de la mise à jour.");
        }
    };

    // Gestion de l'ajout
    const handleAddSubmit = async (e) => {
        e.preventDefault();
        try {
            let typeId = newEquipement.typeId;
            let typeTitle = '';

            // Ajout du type s'il est nouveau
            if (newEquipement.isNewType) {
                const res = await api.post('/api/resources/type', newEquipement.newType);
                typeId = res.data.id;
                typeTitle = res.data.title;
            } else {
                const type = equipmentTypes.find(t => t.id === typeId);
                typeTitle = type?.title || '';
            }

            const res = await api.post('/api/equipments', {
                code: newEquipement.code,
                localisation: newEquipement.localisation,
                typeId: typeId,
            });

            // Ajout local du nouvel équipement
            const newEq = {
                ...res.data,
                type: typeTitle,
            };
            setEquipements(prev => [...prev, newEq]);

            toast.success('Équipement ajouté avec succès !');
            setShowAddModal(false);
            setNewEquipement({
                code: '',
                localisation: '',
                typeId: '',
                newType: {
                    title: '',
                    codePrefix: '',
                    consommable: false,
                },
                isNewType: false,
            });
        } catch (err) {
            toast.error("Erreur lors de l'ajout.");
        }
    };

  


    const handleEditChange = (e) => {
        const { name, value } = e.target;
        setSelectedEquipement((prev) => ({ ...prev, [name]: value }));
    };


    const handleEditClick = (equipement) => {
        setSelectedEquipement({
            id: equipement.id,
            localisation: equipement.localisation,
            status: equipement.status,
        });
        setShowEditModal(true);
    };


    // Chargement des types d’équipement
    useEffect(() => {
        api.get('/api/resources/type').then(res => {
            setEquipmentTypes(res.data.filter((t) => !t.consommable));
        });
    }, []);

    // Filtrage
    useEffect(() => {
        setFilteredEquipements(
            equipements.filter(e =>
                e.code.toLowerCase().includes(filterCode.toLowerCase()) &&
                e.type.toLowerCase().includes(filterType.toLowerCase())
            )
        );
    }, [filterCode, filterType, equipements]);

    const handleAddChange = (e) => {
        const { name, value, type, checked } = e.target;
        if (name.startsWith('newType.')) {
            const key = name.split('.')[1];
            setNewEquipement(prev => ({
                ...prev,
                newType: {
                    ...prev.newType,
                    [key]: type === 'checkbox' ? checked : value
                }
            }));
        } else {
            setNewEquipement(prev => ({
                ...prev,
                [name]: value
            }));
        }
    };


    return (
        <div>
            {/* Filtres et bouton d'ajout */}
            <div className="mb-4 flex gap-4">
                <input
                    type="text"
                    placeholder="Filtrer par code"
                    className="border px-2 py-1 rounded"
                    value={filterCode}
                    onChange={(e) => setFilterCode(e.target.value)}
                />
                <input
                    type="text"
                    placeholder="Filtrer par type"
                    className="border px-2 py-1 rounded"
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value)}
                />
                <button
                    className="ml-auto bg-green-500 text-white px-3 py-1 rounded"
                    onClick={() => setShowAddModal(true)}
                >
                    + Ajouter
                </button>
            </div>

            {/* Tableau */}
            <table className="min-w-full border-collapse text-left">
                <thead>
                    <tr className="bg-gray-100">
                        <th className="border px-3 py-2">Code</th>
                        <th className="border px-3 py-2">Type</th>
                        <th className="border px-3 py-2">Localisation</th>
                        <th className="border px-3 py-2">Statut</th>
                        <th className="border px-3 py-2">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredEquipements.length === 0 ? (
                        <tr>
                            <td colSpan="5" className="text-center py-4">Aucun équipement trouvé.</td>
                        </tr>
                    ) : (
                        filteredEquipements.map((eq) => (
                            <tr key={eq.id} className="hover:bg-gray-50">
                                <td className="border px-3 py-2">{eq.code}</td>
                                <td className="border px-3 py-2">{eq.type}</td>
                                <td className="border px-3 py-2">{eq.localisation}</td>
                                <td className="border px-3 py-2">{eq.status}</td>
                                <td className="border px-3 py-2">
                                    <button
                                        onClick={() => handleEditClick(eq)}
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

            {/* Modals (identique à votre code original) */}
            {showEditModal && selectedEquipement && (
                <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-[400px]">
                        <h2 className="text-lg font-bold mb-4">Modifier l’équipement</h2>
                        <form onSubmit={handleEditSubmit} className="space-y-3">
                            <input
                                name="localisation"
                                value={selectedEquipement.localisation}
                                onChange={handleEditChange}
                                placeholder="Localisation"
                                className="w-full border px-2 py-1 rounded"
                            />

                            <select
                                name="status"
                                value={selectedEquipement.status}
                                onChange={handleEditChange}
                                className="w-full border px-2 py-1 rounded"
                            >
                                <option value="">-- Statut --</option>
                                <option value="DISPONIBLE">Disponible</option>
                                <option value="INCONNU">En maintenance</option>
                                <option value="EN_REPARATION">Hors service</option>
                            </select>

                            <div className="flex justify-end gap-2 pt-2">
                                <button type="button" onClick={() => setShowEditModal(false)} className="px-3 py-1 bg-gray-300 rounded hover:bg-gray-400">Annuler</button>
                                <button type="submit" className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700">Sauvegarder</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
            {showAddModal && (
                <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-[400px]">
                        <h2 className="text-lg font-bold mb-4">Ajouter un équipement</h2>
                        <form onSubmit={handleAddSubmit} className="space-y-3">
                            <input name="code" value={newEquipement.code} onChange={handleAddChange} placeholder="Code" className="w-full border px-2 py-1 rounded" />
                            <input name="localisation" value={newEquipement.localisation} onChange={handleAddChange} placeholder="Localisation" className="w-full border px-2 py-1 rounded" />

                            {/* Choix ou ajout du type */}
                            <select name="typeId" value={newEquipement.typeId} onChange={handleAddChange} className="w-full border px-2 py-1 rounded" disabled={newEquipement.isNewType}>
                                <option value="">-- Choisir un type --</option>
                                {equipmentTypes.map(t => (
                                    <option key={t.id} value={t.id}>{t.title}</option>
                                ))}
                            </select>

                            <div className="flex items-center">
                                <input
                                    type="checkbox"
                                    name="isNewType"
                                    checked={newEquipement.isNewType}
                                    onChange={(e) => setNewEquipement(prev => ({ ...prev, isNewType: e.target.checked }))}
                                    className="mr-2"
                                />
                                <label>Ajouter un nouveau type</label>
                            </div>

                            {newEquipement.isNewType && (
                                <div className="space-y-2 border p-2 rounded bg-gray-50">
                                    <input name="newType.title" value={newEquipement.newType.title} onChange={handleAddChange} placeholder="Titre du type" className="w-full border px-2 py-1 rounded" />
                                    <input name="newType.codePrefix" value={newEquipement.newType.codePrefix} onChange={handleAddChange} placeholder="Préfixe code" className="w-full border px-2 py-1 rounded" />
                                </div>
                            )}

                            <div className="flex justify-end gap-2 pt-2">
                                <button type="button" onClick={() => setShowAddModal(false)} className="px-3 py-1 bg-gray-300 rounded hover:bg-gray-400">Annuler</button>
                                <button type="submit" className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700">Ajouter</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default EquipmentTable;