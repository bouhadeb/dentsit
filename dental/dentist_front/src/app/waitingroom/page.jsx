"use client";
import { useEffect, useState } from "react";
import {
  fetchAllPatients,
  fetchWaitingRoomPatients,
  addWaitingRoomEntry,
  updateWaitingRoomEntry,
} from "@/services/patientService";

const WaitingRoom = () => {
  const [patients, setPatients] = useState([]);
  const [waitingRoomPatients, setWaitingRoomPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState("");
  const [description, setDescription] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0] // Default to today
  );

  useEffect(() => {
    const fetchData = async () => {
      try {
        const allPatients = await fetchAllPatients();
        console.log("Patients récupérés :", allPatients);
        const waitingPatients = await fetchWaitingRoomPatients();
        setPatients(allPatients);
        setWaitingRoomPatients(waitingPatients);
        setError(null);
      } catch (error) {
        console.error("Erreur lors de la récupération des données :", error);
        setError("Échec du chargement des patients en salle d'attente. Veuillez réessayer plus tard.");
      }
    };
    fetchData();
  }, []);

  const handleAddEntry = async (e) => {
    e.preventDefault();
    console.log("Soumission :", { selectedPatient, description });
    if (!selectedPatient || !description) {
      alert("Veuillez sélectionner un patient et entrer une description.");
      return;
    }
    try {
      const updatedPatient = await addWaitingRoomEntry(selectedPatient, description);
      console.log("Patient mis à jour depuis l'API :", updatedPatient);
      setWaitingRoomPatients((prev) => {
        const updatedPatients = prev.map((p) =>
          p._id === updatedPatient._id ? updatedPatient : p
        );
        if (!updatedPatients.some((p) => p._id === updatedPatient._id)) {
          updatedPatients.push(updatedPatient);
        }
        return updatedPatients;
      });
      setPatients((prev) =>
        prev.map((p) => (p._id === updatedPatient._id ? updatedPatient : p))
      );
      setSelectedPatient("");
      setDescription("");
      setShowForm(false);
      setError(null);
    } catch (error) {
      console.error("Erreur lors de l'ajout de l'entrée :", error);
      setError("Échec de l'ajout de l'entrée en salle d'attente. Veuillez réessayer.");
    }
  };

  const handleStatusChange = async (patientId, entryId, status, appointmentId) => {
    try {
      const completed = status === "completed" ? true : false;
      const cancelled = status === "cancelled" ? true : false;
      const updatedPatient = await updateWaitingRoomEntry(
        patientId,
        entryId,
        completed,
        cancelled,
        appointmentId
      );
      setWaitingRoomPatients((prev) =>
        prev.map((p) => (p._id === updatedPatient._id ? updatedPatient : p))
      );
      setPatients((prev) =>
        prev.map((p) => (p._id === updatedPatient._id ? updatedPatient : p))
      );
    } catch (error) {
      console.error("Erreur lors de la mise à jour du statut :", error);
      setError("Échec de la mise à jour du statut de l'entrée. Veuillez réessayer.");
    }
  };

  const filteredPatients = waitingRoomPatients.filter((patient) =>
    `${patient.firstName} ${patient.familyName}`
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
  );

  const dateFilteredPatients = filteredPatients.filter((patient) => {
    const selectedDateObj = new Date(selectedDate);
    selectedDateObj.setHours(0, 0, 0, 0);

    if (patient.appointment && patient.appointment.length > 0) {
      const appointmentDate = new Date(patient.appointment[0].date);
      appointmentDate.setHours(0, 0, 0, 0);
      return appointmentDate.getTime() === selectedDateObj.getTime();
    }

    return patient.waitingRoom.some((entry) => {
      const visitDate = new Date(entry.visitDate);
      visitDate.setHours(0, 0, 0, 0);
      return visitDate.getTime() === selectedDateObj.getTime();
    });
  });

  const sortedPatients = [...dateFilteredPatients].sort((a, b) => {
    const aHasAppointment = a.appointment && a.appointment.length > 0;
    const bHasAppointment = b.appointment && b.appointment.length > 0;

    if (aHasAppointment && bHasAppointment) {
      const aAppTime = new Date(a.appointment[0].date + " " + a.appointment[0].hour);
      const bAppTime = new Date(b.appointment[0].date + " " + b.appointment[0].hour);
      return aAppTime - bAppTime;
    } else if (aHasAppointment) {
      return -1;
    } else if (bHasAppointment) {
      return 1;
    } else {
      const aCheckIn = a.waitingRoom[0]?.checkInTime || new Date();
      const bCheckIn = b.waitingRoom[0]?.checkInTime || new Date();
      return new Date(aCheckIn) - new Date(bCheckIn);
    }
  });

  const waitingCount = sortedPatients.reduce(
    (count, p) => count + p.waitingRoom.filter((e) => !e.completed && !e.cancelled).length,
    0
  );
  const completedCount = sortedPatients.reduce(
    (count, p) => count + p.waitingRoom.filter((e) => e.completed).length,
    0
  );
  const cancelledCount = sortedPatients.reduce(
    (count, p) => count + p.waitingRoom.filter((e) => e.cancelled).length,
    0
  );

  if (error) {
    return (
      <div className="container mx-auto p-6">
        <div className="alert alert-error">
          <span>{error}</span>
          <button
            className="btn btn-sm btn-outline ml-4"
            onClick={() => setError(null)}
          >
            Fermer
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="bg-gray-300 text-gray p-4 rounded-t-lg flex justify-between items-center shadow-md">
        <div className="flex items-center space-x-4">
          <h2 className="text-3xl">Salle d'Attente</h2>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input input-bordered text-black w-64"
            placeholder="Rechercher..."
          />
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="input input-bordered text-black w-40"
          />
          <button
            className="btn btn-ghost text-gray"
            onClick={() => setShowForm(!showForm)}
          >
            {showForm ? "Annuler" : "+ Ajouter"}
          </button>
        </div>
      </div>

      {showForm && (
        <div className="bg-white p-6 rounded-lg shadow-md mb-6 border border-gray-200">
          <h3 className="text-xl font-semibold mb-4">Ajouter une Visite</h3>
          <form onSubmit={handleAddEntry} className="flex flex-col space-y-4">
            <div className="flex space-x-4">
              <select
                value={selectedPatient}
                onChange={(e) => setSelectedPatient(e.target.value)}
                className="select select-bordered w-full max-w-xs"
              >
                <option value="">Sélectionnez un patient</option>
                {patients.map((patient) => (
                  <option key={patient._id} value={patient._id}>
                    {patient.firstName} {patient.familyName}
                  </option>
                ))}
              </select>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="input input-bordered w-full max-w-md"
                placeholder="Description de la visite (ex: Consultation rapide)"
              />
            </div>
            <button type="submit" className="btn btn-outline w-full max-w-xs">
              Ajouter
            </button>
          </form>
        </div>
      )}

      <div className="bg-white p-6 rounded-b-lg shadow-md">
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-yellow-200 p-4 rounded text-center">
            <h3 className="text-lg font-semibold">En Attente</h3>
            <p className="text-2xl">{waitingCount}</p>
          </div>
          <div className="bg-green-200 p-4 rounded text-center">
            <h3 className="text-lg font-semibold">Terminé</h3>
            <p className="text-2xl">{completedCount}</p>
          </div>
          <div className="bg-red-200 p-4 rounded text-center">
            <h3 className="text-lg font-semibold">Annulé</h3>
            <p className="text-2xl">{cancelledCount}</p>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="table-auto w-full">
            <thead>
              <tr className="bg-orange-200">
                <th className="px-4 py-2">Nom</th>
                <th className="px-4 py-2">Téléphone</th>
                <th className="px-4 py-2">Heure du Rendez-vous</th>
                <th className="px-4 py-2">Heure d'Enregistrement</th>
                <th className="px-4 py-2">Changement de Statut</th>
              </tr>
            </thead>
            <tbody>
              {sortedPatients.flatMap((patient) =>
                patient.waitingRoom
                  .filter((entry) => {
                    const visitDate = new Date(entry.visitDate);
                    visitDate.setHours(0, 0, 0, 0);
                    const selectedDateObj = new Date(selectedDate);
                    selectedDateObj.setHours(0, 0, 0, 0);
                    return visitDate.getTime() === selectedDateObj.getTime();
                  })
                  .map((entry) => {
                    const appointment = patient.appointment?.find((app) => {
                      const appDate = new Date(app.date);
                      appDate.setHours(0, 0, 0, 0);
                      const visitDate = new Date(entry.visitDate);
                      visitDate.setHours(0, 0, 0, 0);
                      return appDate.getTime() === visitDate.getTime();
                    });
                    const appointmentId = appointment?._id || null;

                    return (
                      <tr key={`${patient._id}-${entry._id}`}>
                        <td className="border px-4 py-2">
                          {patient.firstName} {patient.familyName}
                        </td>
                        <td className="border px-4 py-2">{patient.phone}</td>
                        <td className="border px-4 py-2">
                          {patient.appointment && patient.appointment.length > 0
                            ? patient.appointment[0].hour || "N/A"
                            : "Arrivée spontanée"}
                        </td>
                        <td className="border px-4 py-2">
                          {new Date(entry.checkInTime).toLocaleTimeString("fr-FR", {
                            hour: "2-digit",
                            minute: "2-digit",
                            hour12: false,
                          })}
                        </td>
                        <td className="border px-4 py-2">
                          <select
                            value={
                              entry.completed
                                ? "completed"
                                : entry.cancelled
                                ? "cancelled"
                                : "waiting"
                            }
                            onChange={(e) =>
                              handleStatusChange(patient._id, entry._id, e.target.value, appointmentId)
                            }
                            className="select select-bordered select-sm"
                          >
                            <option value="waiting">En attente</option>
                            <option value="completed">Terminé</option>
                            <option value="cancelled">Annulé</option>
                          </select>
                        </td>
                      </tr>
                    );
                  })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default WaitingRoom;