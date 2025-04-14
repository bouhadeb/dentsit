"use client";

import { useState, useEffect } from "react";
import { createMed, fetchMeds } from "@/services/medicationService";
import { FaPills } from "react-icons/fa";

const AddMedicationForm = () => {
  const [name, setName] = useState("");
  const [medications, setMedications] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadMedications();
  }, []);

  const loadMedications = async () => {
    try {
      const meds = await fetchMeds();
      setMedications(meds);
    } catch (error) {
      console.error("Erreur lors du chargement des médicaments:", error);
      setError("Erreur lors du chargement des médicaments");
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await createMed({ name });
      if (response.status === 201) {
        setName("");
        await loadMedications(); // Wait for the medications to be reloaded
      } else {
        setError(`Échec de l'ajout du médicament. Code d'état: ${response.status}`);
      }
    } catch (error) {
      console.error("Erreur lors de l'ajout des médicaments:", error);
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto p-4 flex flex-col items-center">
      <h2 className="text-2xl text-center mb-4 pt-10 pb-10">
        Ajouter des médicaments
      </h2>
      <form
        onSubmit={handleSubmit}
        className="w-full flex items-center flex-col"
      >
        <input
          type="text"
          name="name"
          onChange={(e) => setName(e.target.value)}
          required
          value={name}
          placeholder="Nom du médicament"
          className="input input-bordered w-4/5 mb-4"
          disabled={isLoading}
        />
        <button 
          type="submit" 
          className="btn btn-outline w-4/5"
          disabled={isLoading}
        >
          {isLoading ? (
            <span className="loading loading-spinner loading-sm"></span>
          ) : (
            "Soumettre"
          )}
        </button>
        {error && (
          <div className="mt-4 p-4 bg-red-100 text-red-700 rounded-lg">
            {error}
          </div>
        )}
      </form>

      <div className="w-full mt-8">
        <h3 className="text-xl text-center mb-10">Liste des Médicaments</h3>
        {medications.length > 0 ? (
          <div className="overflow-x-auto rounded-lg shadow-lg mb-8">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <div className="flex items-center gap-2">
                      <FaPills className="text-gray-500" />
                      Nom du Médicament
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {medications.map((med) => (
                  <tr key={med._id} className="hover:bg-gray-50 transition-colors duration-150">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {med.name}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-center text-gray-500">Aucun médicament ajouté pour le moment.</p>
        )}
      </div>
    </div>
  );
};

export default AddMedicationForm;

