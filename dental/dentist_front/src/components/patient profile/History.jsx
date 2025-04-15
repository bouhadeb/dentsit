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
    <div className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">
            {`Saison ${history.length + 1}`}
          </h2>
          <p className="text-gray-600">Ajouter une nouvelle note</p>
        </div>

        {/* History Notes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {history.map((record, index) => (
            <div
              key={index}
              className="relative bg-white p-6 rounded-lg shadow-lg transform hover:scale-105 transition-transform duration-300"
              style={{
                background: `linear-gradient(135deg, ${getNoteColor(index)} 0%, ${getNoteColor(index)} 50%, white 50%, white 100%)`,
                borderTop: '4px solid ' + getNoteColor(index),
              }}
            >
              {/* Season Number Badge */}
              <div className="absolute -top-3 -left-3 bg-white rounded-full shadow-md p-2">
                <span className="text-lg font-bold text-gray-800">
                  {`S${index + 1}`}
                </span>
              </div>

              {/* Note Content */}
              <div className="mt-4">
                <p className="text-gray-700 text-lg">{record.description}</p>
              </div>

              {/* Delete Button */}
              <div className="absolute bottom-4 right-4">
                <button
                  onClick={() => handleDeleteHistory(record._id)}
                  className="btn btn-circle btn-outline btn-error btn-sm"
                  title="Supprimer la note"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Add New Note */}
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Écrivez votre nouvelle note ici..."
            className="textarea textarea-bordered w-full h-32 mb-4 text-lg"
          />
          <button 
            onClick={handleAddHistory} 
            className="btn btn-outline w-full"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            Ajouter une note
          </button>
        </div>
      </div>
    </div>
  );
};

// Helper function to get different colors for notes
const getNoteColor = (index) => {
  const colors = [
    '#FFE4E1', // Misty Rose
    '#E6E6FA', // Lavender
    '#F0FFF0', // Honeydew
    '#F0F8FF', // Alice Blue
    '#FFF0F5', // Lavender Blush
    '#F5F5F5', // White Smoke
  ];
  return colors[index % colors.length];
};

export default History;
