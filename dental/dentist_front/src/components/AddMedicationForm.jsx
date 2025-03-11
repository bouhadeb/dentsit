"use client";

import { useState, useEffect } from "react";
import { createMed, fetchMeds } from "@/services/medicationService";

const AddMedicationForm = () => {
  const [name, setName] = useState("");
  const [medications, setMedications] = useState([]); 

  useEffect(() => {
    loadMedications();
  }, []);

  const loadMedications = async () => {
    try {
      const meds = await fetchMeds();
      setMedications(meds);
    } catch (error) {
      console.error("Error loading medications:", error);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await createMed({ name });
      if (response.status === 201) {
        setName("");
        loadMedications();
      } else {
        alert(`Failed to add medication. Status code: ${response.status}`);
      }
    } catch (error) {
      console.error("Error adding medications:", error);
      alert(error.message);
    }
  };

  return (
    <div className="max-w-lg mx-auto p-4 flex flex-col items-center ">
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
        />
        <button type="submit" className="btn btn-outline w-4/5">
          Soumettre
        </button>
      </form>

      <div className="w-full mt-8">
        <h3 className="text-xl text-center mb-10">Liste des Médicaments</h3>
        {medications.length > 0 ? (
          <table className="table-auto w-full border">
            <thead>
              <tr>
                <th className="px-4 py-2 border">Nom du Médicament</th>
              </tr>
            </thead>
            <tbody>
              {medications.map((med) => (
                <tr key={med._id}>
                  <td className="border px-4 py-2">{med.name}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-center">Aucun médicament ajouté pour le moment.</p>
        )}
      </div>
    </div>
  );
};

export default AddMedicationForm;

