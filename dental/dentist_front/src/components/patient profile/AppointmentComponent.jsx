"use client";
import React, { useState, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import axios from 'axios';
import { addAppointment, fetchPatient } from '@/services/patientService'; // Ensure this path is correct

const AppointmentComponent = ({ id }) => {
  const [appointments, setAppointments] = useState([]);
  const [newAppointment, setNewAppointment] = useState({ date: "", hour: "", description: "", status: "En Attente" });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const response = await fetchPatient(id);
        const patientAppointments = response.appointment || [];

        // Transform appointments into FullCalendar event format
        const calendarEvents = patientAppointments.map(appointment => {
          const startTime = appointment.hour; // e.g., "10:30"
          const startDateTime = new Date(appointment.date).toISOString().split('T')[0] + 'T' + startTime; // e.g., "2025-02-12T10:30"

          // Format the time for display in the title (e.g., "10:30")
          const formattedTime = new Date(startDateTime).toLocaleTimeString('fr-FR', { 
            hour: '2-digit', 
            minute: '2-digit', 
            hour12: false 
          });

          // Use patient name instead of description (assuming patient name is in response)
          const patientName = `${response.firstName} ${response.familyName}`; // Adjust if the structure differs

          return {
            id: appointment._id || Math.random().toString(36).substr(2, 9), // Add ID (temporary if _id is missing)
            title: `${formattedTime} ${patientName}`, // Show patient name instead of description
            start: startDateTime, // Combine date and time (e.g., "2025-02-12T10:30")
            extendedProps: {
              status: appointment.status,
              description: appointment.description,
            },
            backgroundColor: getStatusColor(appointment.status), // Color based on status
            borderColor: getStatusBorderColor(appointment.status), // Border color based on status
            textColor: '#000000', // Black text for readability
          };
        });

        setAppointments(calendarEvents);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching appointments:', error);
        setError('Erreur lors du chargement des rendez-vous.');
        setLoading(false);
      }
    };

    if (id) {
      fetchAppointments();
    }
  }, [id]);

  const handleAddAppointment = async () => {
    if (!newAppointment.date || !newAppointment.hour || !newAppointment.description) {
      alert("Veuillez remplir tous les champs.");
      return;
    }

    try {
      await addAppointment(id, newAppointment);
      setNewAppointment({ date: "", hour: "", description: "", status: "En Attente" });
      const updatedData = await fetchPatient(id);
      setAppointments(prevAppointments => {
        const newCalendarEvents = updatedData.appointment.map(appointment => {
          const startTime = appointment.hour;
          const startDateTime = new Date(appointment.date).toISOString().split('T')[0] + 'T' + startTime;
          const formattedTime = new Date(startDateTime).toLocaleTimeString('fr-FR', { 
            hour: '2-digit', 
            minute: '2-digit', 
            hour12: false 
          });

          // Use patient name instead of description (assuming patient name is in updatedData)
          const patientName = `${updatedData.firstName} ${updatedData.familyName}`; // Adjust if the structure differs

          return {
            id: appointment._id || Math.random().toString(36).substr(2, 9), // Add ID (temporary if _id is missing)
            title: `${formattedTime} ${patientName}`,
            start: startDateTime,
            extendedProps: {
              status: appointment.status,
              description: appointment.description,
            },
            backgroundColor: getStatusColor(appointment.status),
            borderColor: getStatusBorderColor(appointment.status),
            textColor: '#000000',
          };
        });
        return newCalendarEvents;
      });
    } catch (error) {
      console.error("Error adding appointment:", error);
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Chargement...</div>;
  }

  if (error) {
    return <div className="text-red-600 text-center p-4">{error}</div>;
  }

  return (
    <div className="container mx-auto mt-10 p-6">
      <h2 className="text-3xl font-bold text-center mb-10">Rendez-vous du Patient</h2>

      {/* Form to Add New Appointment */}
      <div className="mb-8 bg-white p-6 rounded-lg shadow-md border border-gray-200">
        <h3 className="text-xl font-bold mb-4">Ajouter un Nouveau Rendez-vous</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2">Date:</label>
            <input
              type="date"
              value={newAppointment.date}
              onChange={(e) => setNewAppointment({ ...newAppointment, date: e.target.value })}
              className="border p-3 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2">Heure:</label>
            <input
              type="time"
              value={newAppointment.hour}
              onChange={(e) => setNewAppointment({ ...newAppointment, hour: e.target.value })}
              className="border p-3 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="mb-4 md:col-span-2">
            <label className="block text-gray-700 font-medium mb-2">Description:</label>
            <textarea
              value={newAppointment.description}
              onChange={(e) => setNewAppointment({ ...newAppointment, description: e.target.value })}
              className="border p-3 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 h-24"
            />
          </div>
        </div>
        <button
          onClick={handleAddAppointment}
          className="btn btn-outline mt-4 w-full md:w-auto px-6 py-2"
        >
          Ajouter Rendez-vous
        </button>
      </div>

      {/* Calendar View - Longer and Wider Size with 30-Minute Slots */}
      <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 max-w-full mx-auto">
        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView="timeGridDay" // Start with day view to show time slots (like Google Calendar)
          events={appointments}
          headerToolbar={{
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek,timeGridDay',
          }}
          height="1600px" // Maintain the current height
          contentHeight="auto" // Adjust content height within the fixed height
          width="100%" // Full width but constrained by max-w-full
          slotDuration="01:00:00" // Set time slots to every 1 hour (as per your code)
          slotLabelInterval="01:00" // Label time slots every 1 hour
          slotMinTime="00:00" // Start at midnight
          slotMaxTime="24:00" // End at midnight (24 hours)
          eventContent={renderEventContent} // Custom event rendering to match the image
          eventClick={handleEventClick} // Handle event clicks
          editable={false} // Disable dragging for now (optional)
          selectable={true} // Allow selecting dates (optional)
          eventBackgroundColor="#4CAF50" // Will be overridden by getStatusColor
          eventBorderColor="#388E3C" // Will be overridden by getStatusBorderColor
          eventTextColor="#000000" // Black text for readability
          className="fullcalendar-container" // Custom class for Tailwind styling
        />
      </div>
    </div>
  );
};

// Custom render for event content to match the image
function renderEventContent(eventInfo) {
  return (
    <div
      className="p-1 rounded-lg" // Smaller padding to match the compact look in the image
      style={{ 
        height: '100%', // Fill the entire height of the slot
        width: '100%', // Fill the entire width of the slot
        display: 'flex',
        alignItems: 'center', // Center vertically
        justifyContent: 'flex-start', // Align text to the left
        fontSize: '0.9rem', // Smaller font size to match the image
        fontWeight: 'normal', // Normal weight to match the image
      }}
    >
      <span>{eventInfo.event.title}</span>
    </div>
  );
}

// Handle clicking on an event
function handleEventClick(info) {
  alert(`Détails du rendez-vous:\n\nDescription: ${info.event.extendedProps.description}\nStatut: ${info.event.extendedProps.status}\nDate: ${info.event.start.toLocaleDateString('fr-FR')}\nHeure: ${info.event.start.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit', hour12: false })}`);
}

// Helper function to get background color based on status
function getStatusColor(status) {
  switch (status) {
    case 'En Attente':
      return '#FFC107'; // Yellow for En Attente
    case 'Fait':
      return '#4CAF50'; // Green for Fait
    case 'Annulé':
      return '#F44336'; // Red for Annulé
    default:
      return '#757575'; // Gray for unknown status
  }
}

// Helper function to get border color based on status
function getStatusBorderColor(status) {
  switch (status) {
    case 'En Attente':
      return '#FFA000'; // Darker yellow
    case 'Fait':
      return '#388E3C'; // Darker green
    case 'Annulé':
      return '#D32F2F'; // Darker red
    default:
      return '#616161'; // Darker gray
  }
}

export default AppointmentComponent;