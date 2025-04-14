'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FaUser, FaUserTie, FaBirthdayCake, FaMapMarkerAlt, FaPhone, FaFileAlt, FaTag } from "react-icons/fa";
import Succ from '@/components/Succ';
import History from '@/components/patient profile/History';
import Prescription from '@/components/patient profile/Prescription';
import Payment from '@/components/patient profile/Payment';
import AddImage from '@/components/patient profile/AddImage';
import AppointmentComponent from '@/components/patient profile/AppointmentComponent';
import { deletePatient, fetchPatient, updatePatient } from '@/services/patientService';
import { calculateAge } from '@/utils/calculateAge';

const PatientProfile = ({ params }) => {
  const { id } = params;
  const [patient, setPatient] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [updatedPatient, setUpdatedPatient] = useState(null);
  const [updatedImage, setUpdatedImage] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const router = useRouter();
  const [bottomComponent, setBottomComponent] = useState('history');

  useEffect(() => {
    const fetchPatientData = async () => {
      try {
        const response = await fetchPatient(id);
        setPatient(response);
        setUpdatedPatient(response);
      } catch (error) {
        console.error('Error fetching patient data:', error);
      }
    };

    if (id) {
      fetchPatientData();
    }
  }, [id]);

  const handleUpdate = async () => {
    const formData = new FormData();

    // Add all the fields from updatedPatient to the form data
    for (const key in updatedPatient) {
      formData.append(key, updatedPatient[key]);
    }

    // Check if there's a new image to upload
    if (updatedImage) {
      formData.append('image', updatedImage); // Append the new image if one was selected
    }

    try {
      const response = await updatePatient(id, formData); // Call the API to update patient
      setIsEditing(false);
      setUpdatedImage(null); // Clear the image input
      setPatient(response); // Update the patient data in the frontend state
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
      }, 3000);
    } catch (error) {
      console.error('Error updating patient:', error.response ? error.response : error.message);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUpdatedPatient({ ...updatedPatient, [name]: value });
  };

  const handleFileChange = (e) => {
    setUpdatedImage(e.target.files[0]);
  };

  const handleDelete = async () => {
    try {
      await deletePatient(id);
      alert('Patient supprimé avec succès');
      router.push('/patients');
    } catch (error) {
      console.error('Error deleting patient:', error);
    }
  };

  const showEditForm = () => {
    setIsEditing(true);
    setBottomComponent(null);
  };

  if (!patient) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        Chargement...
      </div>
    );
  }

  return (
    <>
      <div className="flex">
        <div className="flex flex-col flex-grow justify-center items-center p-8">
          <h2 className="text-3xl font-bold text-center mt-10 mb-14">
            Profil du Patient
          </h2>
          <div className="w-full">
            <div className="bg-white p-8 rounded-lg shadow-md mb-6 border border-gray-200">
              {/* Patient Information Box - Larger and More Prominent */}
              {isEditing ? (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label
                        htmlFor="status"
                        className="block text-lg font-semibold text-gray-700 mb-2"
                      >
                        Statut
                      </label>
                      <select
                        name="status"
                        id="status"
                        value={updatedPatient.status || ""}
                        className="select select-bordered w-full text-lg p-3"
                        onChange={handleChange}
                      >
                        <option value="">-- Sélectionnez un statut --</option>
                        <option value="Mr.">Mr.</option>
                        <option value="Mrs.">Mrs.</option>
                        <option value="Ms.">Ms.</option>
                        <option value="Dr.">Dr.</option>
                      </select>
                    </div>
                    <div>
                      <label
                        htmlFor="firstName"
                        className="block text-lg font-semibold text-gray-700 mb-2"
                      >
                        Nom
                      </label>
                      <input
                        type="text"
                        name="firstName"
                        id="firstName"
                        value={updatedPatient.firstName}
                        className="input input-bordered w-full text-lg p-3"
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label
                        htmlFor="familyName"
                        className="block text-lg font-semibold text-gray-700 mb-2"
                      >
                        Prénom
                      </label>
                      <input
                        type="text"
                        name="familyName"
                        id="familyName"
                        value={updatedPatient.familyName}
                        onChange={handleChange}
                        className="input input-bordered w-full text-lg p-3"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="birthDate"
                        className="block text-lg font-semibold text-gray-700 mb-2"
                      >
                        Date de Naissance
                      </label>
                      <input
                        type="date"
                        name="birthDate"
                        id="birthDate"
                        value={
                          updatedPatient.birthDate
                            ? new Date(updatedPatient.birthDate).toISOString().split('T')[0]
                            : ''
                        }
                        onChange={handleChange}
                        className="input input-bordered w-full text-lg p-3"
                      />
                    </div>
                  </div>
                  <div>
                    <label
                      htmlFor="address"
                      className="block text-lg font-semibold text-gray-700 mb-2"
                    >
                      Adresse
                    </label>
                    <input
                      type="text"
                      name="address"
                      id="address"
                      value={updatedPatient.address || ""}
                      onChange={handleChange}
                      className="input input-bordered w-full text-lg p-3"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="phone"
                      className="block text-lg font-semibold text-gray-700 mb-2"
                    >
                      Téléphone
                    </label>
                    <input
                      type="text"
                      name="phone"
                      id="phone"
                      value={updatedPatient.phone}
                      onChange={handleChange}
                      className="input input-bordered w-full text-lg p-3"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="description"
                      className="block text-lg font-semibold text-gray-700 mb-2"
                    >
                      Description
                    </label>
                    <textarea
                      name="description"
                      id="description"
                      value={updatedPatient.description}
                      onChange={handleChange}
                      className="textarea textarea-bordered w-full text-lg p-4 h-32"
                    />
                  </div>
                  {/* New Category Dropdown for Editing */}
                  <div>
                    <label
                      htmlFor="category"
                      className="block text-lg font-semibold text-gray-700 mb-2"
                    >
                      Catégorie
                    </label>
                    <select
                      name="category"
                      id="category"
                      value={updatedPatient.category || ""}
                      onChange={handleChange}
                      className="select select-bordered w-full text-lg p-3"
                    >
                      <option value="">-- Sélectionnez une catégorie --</option>
                      <option value="o.c">o.c</option>
                      <option value="protese">protese</option>
                      <option value="odf">odf</option>
                      <option value="para">para</option>
                      <option value="pathq">pathq</option>
                    </select>
                  </div>
                  <div>
                    <label
                      htmlFor="file-input"
                      className="block text-lg font-semibold text-gray-700 mb-2"
                    >
                      Image IRM
                    </label>
                    <input
                      type="file"
                      name="image"
                      id="file-input"
                      onChange={handleFileChange}
                      className="file-input w-full max-w-xs text-lg"
                    />
                    {updatedImage && (
                      <span className="block mt-2 text-lg text-gray-600">
                        {updatedImage.name}
                      </span>
                    )}
                  </div>
                  <div className="flex space-x-4">
                    <button onClick={handleUpdate} className="btn btn-outline text-lg py-2 px-4">
                      Enregistrer
                    </button>
                    <button
                      onClick={() => setIsEditing(false)}
                      className="btn btn-outline btn-error text-lg py-2 px-4"
                    >
                      Annuler
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 ml-60">
                    <div className="flex flex-col gap-6">
                      <p className="text-2xl font-bold text-gray-800 flex items-center">
                        <FaUserTie className="mr-3 text-gray-500" />
                        <span className="text-gray-500">Prénom:</span>{" "}
                        {patient.status ? `${patient.status} ` : ""}
                        {patient.firstName}
                      </p>
                      <p className="text-2xl font-bold text-gray-800 flex items-center">
                        <FaUser className="mr-3 text-gray-500" />
                        <span className="text-gray-500">Nom de Famille:</span>{" "}
                        {patient.familyName}
                      </p>
                      <p className="text-2xl font-bold text-gray-800 flex items-center">
                        <FaBirthdayCake className="mr-3 text-gray-500" />
                        <span className="text-gray-500">Âge:</span>{" "}
                        {calculateAge(patient.birthDate)}
                      </p>
                    </div>
                    <div className="flex flex-col gap-6">
                      <p className="text-2xl font-bold text-gray-800 flex items-center">
                        <FaMapMarkerAlt className="mr-3 text-gray-500" />
                        <span className="text-gray-500">Adresse:</span>{" "}
                        {patient.address || "Non spécifié"}
                      </p>
                      <p className="text-2xl font-bold text-gray-800 flex items-center">
                        <FaPhone className="mr-3 text-gray-500" />
                        <span className="text-gray-500">Téléphone:</span>{" "}
                        {patient.phone}
                      </p>
                      <p className="text-2xl font-bold text-gray-800 flex items-center">
                        <FaFileAlt className="mr-3 text-gray-500" />
                        <span className="text-gray-500">Description:</span>{" "}
                        <span className="text-red-600">{patient.description}</span>
                      </p>
                      <p className="text-2xl font-bold text-gray-800 flex items-center">
                        <FaTag className="mr-3 text-gray-500" />
                        <span className="text-gray-500">Catégorie:</span>{" "}
                        {patient.category || "Non spécifié"}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Navigation and Sub-Components Box */}
            <div className="bg-white p-6 rounded-lg shadow-md mt-6 border border-gray-200">
              <div className="flex justify-center mb-4">
                <ul className="menu menu-vertical lg:menu-horizontal bg-base-100 rounded-box">
                  <li className="z-50">
                    <details className="dropdown">
                      <summary className="btn btn-ghost btn-sm rounded-btn">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-5 h-5 stroke-current">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
                        </svg>
                        Patient
                      </summary>
                      <ul className="p-2 shadow menu dropdown-content z-[1] bg-base-100 rounded-box w-52">
                        <li onClick={showEditForm}>
                          <a className="hover:bg-primary hover:text-white">Modifier</a>
                        </li>
                        <li onClick={handleDelete}>
                          <a className="hover:bg-error hover:text-white">Supprimer</a>
                        </li>
                      </ul>
                    </details>
                  </li>
                  <li>
                    <button 
                      onClick={() => setBottomComponent('history')}
                      className={`btn btn-ghost btn-sm ${bottomComponent === 'history' ? 'btn-active' : ''}`}
                    >
                      Historique
                    </button>
                  </li>
                  <li>
                    <button 
                      onClick={() => setBottomComponent('prescription')}
                      className={`btn btn-ghost btn-sm ${bottomComponent === 'prescription' ? 'btn-active' : ''}`}
                    >
                      Prescription
                    </button>
                  </li>
                  <li>
                    <button 
                      onClick={() => setBottomComponent('payment')}
                      className={`btn btn-ghost btn-sm ${bottomComponent === 'payment' ? 'btn-active' : ''}`}
                    >
                      Paiement
                    </button>
                  </li>
                  <li>
                    <button 
                      onClick={() => setBottomComponent('radio_image')}
                      className={`btn btn-ghost btn-sm ${bottomComponent === 'radio_image' ? 'btn-active' : ''}`}
                    >
                      Image
                    </button>
                  </li>
                  <li>
                    <button 
                      onClick={() => setBottomComponent('AppointmentComponent')}
                      className={`btn btn-ghost btn-sm ${bottomComponent === 'AppointmentComponent' ? 'btn-active' : ''}`}
                    >
                      Rendez-vous
                    </button>
                  </li>
                </ul>
              </div>
              <div>
                {bottomComponent === 'history' && <History id={id} />}
                {bottomComponent === 'prescription' && <Prescription id={id} />}
                {bottomComponent === 'payment' && <Payment id={id} />}
                {bottomComponent === 'radio_image' && <AddImage id={id} />}
                {bottomComponent === 'AppointmentComponent' && <AppointmentComponent id={id} />}
                {console.log(id)}
              </div>
            </div>
          </div>
        </div>
      </div>
      {showSuccess && (
        <div className="flex absolute w-full flex-col items-end pr-10 bottom-5">
          <Succ />
        </div>
      )}
    </>
  );
};

export default PatientProfile;