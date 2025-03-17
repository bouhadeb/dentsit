"use client";
import { useEffect, useState, useRef } from "react";
import { fetchAllPatients } from "@/services/patientService";
import { deleteAppointment, updateAppointmentStatus } from "@/services/appointmentService";
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';

const AppointmentList = () => {
  const [appointments, setAppointments] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedEvent, setSelectedEvent] = useState(null); // State to manage the selected event for editing
  const calendarRef = useRef(null); // Ref to access FullCalendar API

  useEffect(() => {
    const getAppointments = async () => {
      try {
        const patients = await fetchAllPatients(); // Fetch all patients
        const allAppointments = patients.flatMap(patient => {
          return patient.appointment.map(app => ({
            ...app,
            firstName: patient.firstName,
            familyName: patient.familyName,
            phoneNumber: patient.phone,
          }));
        });

        // Transform appointments into FullCalendar event format
        const calendarEvents = allAppointments.map(appointment => {
          const startTime = appointment.hour; // e.g., "10:30"
          const startDateTime = new Date(appointment.date).toISOString().split('T')[0] + 'T' + startTime; // e.g., "2025-02-12T10:30"

          // Format the time for display in the title (e.g., "10:30")
          const formattedTime = new Date(startDateTime).toLocaleTimeString('fr-FR', { 
            hour: '2-digit', 
            minute: '2-digit', 
            hour12: false 
          });

          return {
            id: appointment._id, // Add ID for event identification
            title: `${formattedTime} ${appointment.firstName} ${appointment.familyName}`, // Show patient name instead of description
            start: startDateTime, // Combine date and time (e.g., "2025-02-12T10:30")
            extendedProps: {
              status: appointment.status,
              description: appointment.description,
              firstName: appointment.firstName,
              familyName: appointment.familyName,
              phoneNumber: appointment.phoneNumber,
            },
            backgroundColor: getStatusColor(appointment.status), // Color based on status
            borderColor: getStatusBorderColor(appointment.status), // Border color based on status
            textColor: '#000000', // Black text for readability
          };
        });

        setAppointments(calendarEvents); // Set all appointments as calendar events
      } catch (error) {
        console.error("Error fetching appointments:", error);
      }
    };

    getAppointments();
  }, []);

  const handleDelete = async (appointmentId) => {
    try {
      await deleteAppointment(appointmentId); // Call the deleteAppointment function
      setAppointments((prevAppointments) => 
        prevAppointments.filter((appointment) => appointment.id !== appointmentId) // Update state by removing the deleted appointment
      );
      setSelectedEvent(null); // Close the dialog after deleting
    } catch (error) {
      console.error("Error deleting appointment:", error);
    }
  };  

  const handleStatusChange = async (appointmentId, newStatus) => {
    try {
      await updateAppointmentStatus(appointmentId, newStatus); // Call the updateAppointmentStatus function
      setAppointments((prevAppointments) =>
        prevAppointments.map((appointment) =>
          appointment.id === appointmentId
            ? {
                ...appointment,
                extendedProps: { ...appointment.extendedProps, status: newStatus },
                backgroundColor: getStatusColor(newStatus), // Update background color
                borderColor: getStatusBorderColor(newStatus), // Update border color
              }
            : appointment
        )
      );

      // Update the event in FullCalendar directly
      if (calendarRef.current) {
        const calendarApi = calendarRef.current.getApi();
        const event = calendarApi.getEventById(appointmentId);
        if (event) {
          event.setExtendedProp('status', newStatus);
          event.setProp('backgroundColor', getStatusColor(newStatus));
          event.setProp('borderColor', getStatusBorderColor(newStatus));
        }
      }

      setSelectedEvent(null); // Close the dialog after updating
    } catch (error) {
      console.error("Error updating appointment status:", error);
    }
  };  

  // Filter appointments based on search query and selected date
  const filteredAppointments = appointments
    .filter((appointment) =>
      `${appointment.extendedProps.firstName} ${appointment.extendedProps.familyName}`
        .toLowerCase()
        .includes(searchQuery.toLowerCase())
    )
    .filter((appointment) =>
      selectedDate
        ? new Date(appointment.start).toISOString().split("T")[0] === selectedDate
        : true
    );

  // Handle event click with a dialog for status editing
  const handleEventClick = (info) => {
    setSelectedEvent(info.event);
  };

  // Handle dialog close
  const handleCloseDialog = () => {
    setSelectedEvent(null);
  };

  return (
    <div className="container mx-auto mt-10 p-6">
      <h2 className="text-3xl font-bold text-center mb-6">
        Liste des Rendez-vous
      </h2>

      {/* Search and date input */}
      <div className="flex justify-center mb-6 space-x-4">
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="input input-bordered w-full max-w-xs"
        />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="input input-bordered w-full max-w-xs"
          placeholder="Rechercher des rendez-vous..."
        />
      </div>

      {/* Calendar View */}
      <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 max-w-full mx-auto">
        <FullCalendar
          ref={calendarRef} // Attach ref to access FullCalendar API
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView="timeGridDay" // Start with day view to show time slots
          events={filteredAppointments} // Use filtered appointments
          headerToolbar={{
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek,timeGridDay',
          }}
          height="1600px" // Same height as your AppointmentComponent
          contentHeight="auto" // Adjust content height within the fixed height
          width="100%" // Full width but constrained by max-w-full
          slotDuration="01:00:00" // Set time slots to every 1 hour
          slotLabelInterval="01:00" // Label time slots every 1 hour
          slotMinTime="00:00" // Start at midnight
          slotMaxTime="24:00" // End at midnight (24 hours)
          eventContent={renderEventContent} // Custom event rendering to match the image
          eventClick={handleEventClick} // Handle event clicks to open dialog
          editable={false} // Disable dragging for now (optional)
          selectable={true} // Allow selecting dates (optional)
          eventBackgroundColor="#4CAF50" // Will be overridden by getStatusColor
          eventBorderColor="#388E3C" // Will be overridden by getStatusBorderColor
          eventTextColor="#000000" // Black text for readability
          className="fullcalendar-container" // Custom class for Tailwind styling
        />
      </div>

      {/* Dialog for editing status */}
      {selectedEvent && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <h3 className="text-xl font-bold mb-4">Modifier le Rendez-vous</h3>
            <p><strong>Prénom:</strong> {selectedEvent.extendedProps.firstName}</p>
            <p><strong>Nom:</strong> {selectedEvent.extendedProps.familyName}</p>
            <p><strong>Numéro:</strong> {selectedEvent.extendedProps.phoneNumber}</p>
            <p><strong>Description:</strong> {selectedEvent.extendedProps.description}</p>
            <p><strong>Statut Actuel:</strong> {selectedEvent.extendedProps.status}</p>
            <p><strong>Date:</strong> {selectedEvent.start.toLocaleDateString('fr-FR')}</p>
            <p><strong>Heure:</strong> {selectedEvent.start.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit', hour12: false })}</p>
            <div className="mt-4">
              <select
                value={selectedEvent.extendedProps.status || "En Attente"}
                onChange={(e) => handleStatusChange(selectedEvent.id, e.target.value)}
                className="select select-bordered w-full max-w-xs mb-4"
              >
                <option value="En Attente">En Attente</option>
                <option value="Fait">Fait</option>
                <option value="Annulé">Annulé</option>
              </select>
              <button
                onClick={() => handleDelete(selectedEvent.id)}
                className="btn btn-outline btn-error"
              >
                Supprimer
              </button>
              <button
                onClick={handleCloseDialog}
                className="btn btn-outline ml-2"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Custom render for event content to match the image
function renderEventContent(eventInfo) {
  // Determine the current view
  const isWeekView = eventInfo.view.type === 'timeGridWeek';

  // Extract the time from the title (e.g., "10:30 John Doe" -> "10:30")
  const fullTitle = eventInfo.event.title;
  const timeOnly = fullTitle.split(' ')[0]; // Get the time part (first word, e.g., "10:30")

  // Use time only in week view, full title in other views
  const displayedTitle = isWeekView ? timeOnly : fullTitle;

  return (
    <div
      className="p-2 rounded-lg" // Increased padding for better readability
      style={{ 
        height: '100%', // Fill the entire height of the slot
        width: '100%', // Fill the entire width of the slot
        display: 'flex',
        alignItems: 'center', // Center vertically
        justifyContent: 'flex-start', // Align text to the left
        fontSize: '1rem', // Slightly larger font size for readability
        fontWeight: 'normal', // Normal weight to match the image
        overflow: 'hidden', // Hide overflow to prevent text from spilling
        textOverflow: 'ellipsis', // Add ellipsis if text is too long
        whiteSpace: 'nowrap', // Prevent text wrapping
      }}
    >
      <span>{displayedTitle}</span>
    </div>
  );
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

// Handle status change (defined globally to be used in handleEventClick)
async function handleStatusChange(appointmentId, newStatus) {
  try {
    await updateAppointmentStatus(appointmentId, newStatus); // Call the updateAppointmentStatus function
    setAppointments((prevAppointments) =>
      prevAppointments.map((appointment) =>
        appointment.id === appointmentId
          ? {
              ...appointment,
              extendedProps: { ...appointment.extendedProps, status: newStatus },
              backgroundColor: getStatusColor(newStatus), // Update background color
              borderColor: getStatusBorderColor(newStatus), // Update border color
            }
          : appointment
      )
    );
  } catch (error) {
    console.error("Error updating appointment status:", error);
  }
}

// Handle delete (defined globally to be used in handleEventClick)
async function handleDelete(appointmentId) {
  try {
    await deleteAppointment(appointmentId); // Call the deleteAppointment function
    setAppointments((prevAppointments) =>
      prevAppointments.filter((appointment) => appointment.id !== appointmentId)
    );
  } catch (error) {
    console.error("Error deleting appointment:", error);
  }
}

// Use a global variable to access setAppointments in handleEventClick
let setAppointments = () => {};

AppointmentList.setAppointments = (fn) => {
  setAppointments = fn;
};

export default AppointmentList;