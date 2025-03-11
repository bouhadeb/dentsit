"use client";
import { useState, useEffect } from "react";
import {
  addHistory,
  deleteHistory,
  fetchHistory,
} from "@/services/patientService";

const History = ({ id }) => {
  const [history, setHistory] = useState([]);
  const [description, setDescription] = useState("");

  const loadHistory = async () => {
    if (!id) return;
    try {
      const response = await fetchHistory(id);
      setHistory(response);
    } catch (error) {
      console.error("Error fetching history data:", error);
    }
  };

  useEffect(() => {
    loadHistory();
  }, [id]);

  const handleAddHistory = async () => {
    if (!id) {
      console.error("Patient ID is undefined");
      return;
    }

    try {
      await addHistory({ id, description });
      loadHistory();
      setDescription("");
      return;
    } catch (error) {
      console.error("Error adding history:", error);
    }
  };

  const handleDeleteHistory = async (historyId) => {
    if (!id || !historyId) {
      console.error("Patient ID or History ID is undefined");
      return;
    }

    try {
      await deleteHistory({ id, historyId });
      loadHistory();
      return;
    } catch (error) {
      console.error("Error deleting history:", error);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center p-8">
      {/* Display the next season number */}
      <h2 className="text-3xl text-center mb-2">
        {`Saison ${history.length + 1}`}
      </h2>
      <h2 className="text-2xl text-center mb-10">Ajouter une nouvelle histoire</h2>
      <div className="p-6 w-full max-w-2xl">
        <ul className="space-y-4 mb-6">
          {history.map((record, index) => (
            <li
              key={index}
              className="p-4 border-2 rounded-lg flex flex-col"
            >
              {/* Display "S1", "S2", etc. above each record */}
              <span className="text-lg font-semibold mb-2">
                {`S${index + 1}`}
              </span>
              <div className="flex justify-between items-center">
                <span>{record.description}</span>
                <button
                  onClick={() => handleDeleteHistory(record._id)}
                  className="btn btn-outline btn-error w-20"
                >
                  Supprimer
                </button>
              </div>
            </li>
          ))}
        </ul>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Ajouter un nouvel historique"
          className="textarea textarea-bordered w-full mb-4"
        />
        <button onClick={handleAddHistory} className="btn btn-outline w-full">
          Ajouter un historique
        </button>
      </div>
    </div>
  );
};

export default History;
