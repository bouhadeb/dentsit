'use client'
import React, { useState, useEffect, forwardRef, } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import axios from "axios";
import { calculateAge } from "@/utils/calculateAge";


const PrescriptionForm = forwardRef(({ patientId }, ref) => {
  const [date, setDate] = useState(new Date());
  const [showPrescription, setShowPrescription] = useState(false);
  const [prescription, setPrescription] = useState({
    doctorName: "",
    patientName: "",
    lastname: "",
    birthdate: "",
    date: "",
    medications: [{
      name: "",
      type: "",
      dosage: "",
      boites: "",
    }],
  });

  const [medicationsList, setMedicationsList] = useState([]);

  // Fetch patient data
  useEffect(() => {
    const fetchPatientData = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/api/patient/${patientId}`
        );
        console.log('Patient Data Response:', response.data); // Log the full response
        const patientData = response.data;
        setPrescription((prevPrescription) => ({
          ...prevPrescription,
          patientName: patientData.firstName,
          lastname: patientData.familyName,
          birthDate: patientData.birthDate, // Log this value specifically
        }));
      } catch (error) {
        console.error("Error fetching patient data:", error);
      }
    };
  
    if (patientId) {
      fetchPatientData();
    }
  }, [patientId]);
  // Fetch medications
  useEffect(() => {
    const fetchMedications = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/api/medications`
        );
        setMedicationsList(response.data);
      } catch (error) {
        console.error("Error fetching medications:", error);
      }
    };

    fetchMedications();
  }, []);

  const handleChange = (e, index) => {
    const { name, value } = e.target;
    setPrescription((prevPrescription) => {
      const newMedications = [...prevPrescription.medications];
      newMedications[index][name] = value;
      return { ...prevPrescription, medications: newMedications };
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setShowPrescription(true); // Show prescription after form submission
  };

  const addMedication = () => {
    setPrescription((prevPrescription) => ({
      ...prevPrescription,
      medications: [
        ...prevPrescription.medications,
        {
          name: "",
          type: "",
          dosage: "",
          boites: "",
        },
      ],
    }));
  };

  const removeMedication = (index) => {
    setPrescription((prevPrescription) => ({
      ...prevPrescription,
      medications: prevPrescription.medications.filter((_, i) => i !== index),
    }));
  };

  return (
    <div className="flex justify-center items-center py-10 bg-gray-50 min-h-screen">
      {!showPrescription ? (
        // Form Section
        <div className="w-[1200px] p-8 bg-white rounded-xl shadow-lg">
          <h2 className="text-4xl mb-10 text-center font-bold text-gray-800">
            Ajouter des détails sur les médicaments
          </h2>
          <form onSubmit={handleSubmit} className="space-y-8">
            {prescription.medications.map((_, index) => (
              <div key={index} className="grid grid-cols-4 gap-6 items-end bg-gray-50 p-4 rounded-lg relative">
                {index > 0 && (
                  <button
                    type="button"
                    onClick={() => removeMedication(index)}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600 transition-colors"
                  >
                    ×
                  </button>
                )}
                <div>
                  <label className="block mb-2 font-medium text-gray-700">
                    Medication {index + 1}
                  </label>
                  <select
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                    name="name"
                    value={prescription.medications[index].name || ""}
                    onChange={(e) => handleChange(e, index)}
                  >
                    <option disabled value="">
                      Choisir un médicament
                    </option>
                    {medicationsList.map((med) => (
                      <option key={med._id} value={med.name}>
                        {med.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block mb-2 font-medium text-gray-700">
                    Type
                  </label>
                  <select
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                    name="type"
                    value={prescription.medications[index].type || ""}
                    onChange={(e) => handleChange(e, index)}
                  >
                    <option disabled value="">
                      Choisir un type
                    </option>
                    <option value="Aerosol">Aerosol</option>
                    <option value="Ampoulebuvable">Ampoulebuvable</option>
                    <option value="Ampouleinjectable">Ampouleinjectable</option>
                    <option value="Baton">Baton</option>
                    <option value="Collyre">Collyre</option>
                    <option value="Cp">Cp</option>
                    <option value="Cpefferv">Cpefferv</option>
                    <option value="Cporodispersible">Cporodispersible</option>
                    <option value="Creme">Creme</option>
                    <option value="Gazmedical">Gazmedical</option>
                    <option value="Gel">Gel</option>
                    <option value="Gelule">Gelule</option>
                    <option value="Granules">Granules</option>
                    <option value="Gouttes">Gouttes</option>
                    <option value="Implant">Implant</option>
                    <option value="Inhalateur">Inhalateur</option>
                    <option value="Lyophilisat">Lyophilisat</option>
                    <option value="Ovule">Ovule</option>
                    <option value="Pastille">Pastille</option>
                    <option value="Patchtransdermique">
                      Patchtransdermique
                    </option>
                    <option value="Pilule">Pilule</option>
                    <option value="Plv">Plv</option>
                    <option value="Pommade">Pommade</option>
                    <option value="Poudre">Poudre</option>
                    <option value="Pate">Pate</option>
                    <option value="Sachet">Sachet</option>
                    <option value="Seringuepreremplie">
                      Seringuepreremplie
                    </option>
                    <option value="Sirop">Sirop</option>
                    <option value="Solutionbuvable">Solutionbuvable</option>
                    <option value="Solutioninjectable">
                      Solutioninjectable
                    </option>
                    <option value="Suppositoire">Suppositoire</option>
                    <option value="Suspensionbuvable">Suspensionbuvable</option>
                    <option value="Timbre">Timbre</option>
                  </select>
                </div>

                <div>
                  <label className="block mb-2 font-medium text-gray-700">
                    Dosage
                  </label>
                  <select
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                    name="dosage"
                    value={prescription.medications[index].dosage || ""}
                    onChange={(e) => handleChange(e, index)}
                  >
                    <option disabled value="">
                      Combien de fois par jour
                    </option>
                    <option value="1 dose par jour">1 dose par jour</option>
                    <option value="2 dose par jour">2 dose par jour</option>
                    <option value="3 dose par jour">3 dose par jour</option>
                    <option value="4 dose par jour">4 dose par jour</option>
                    <option value="5 dose par jour">5 dose par jour</option>
                  </select>
                </div>

                <div>
                  <label className="block mb-2 font-medium text-gray-700">
                    Quantité des boites
                  </label>
                  <select
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                    name="boites"
                    value={prescription.medications[index].boites || ""}
                    onChange={(e) => handleChange(e, index)}
                  >
                    <option disabled value="">
                      Combien de boites
                    </option>
                    <option value="1 boites">1 boites</option>
                    <option value="2 boites">2 boites</option>
                    <option value="3 boites">3 boites</option>
                    <option value="4 boites">4 boites</option>
                    <option value="5 boites">5 boites</option>
                  </select>
                </div>
              </div>
            ))}
            <div className="flex gap-4">
              <button 
                type="button"
                onClick={addMedication}
                className="flex-1 py-4 px-6 btn btn-outline gap-2"
              >
                Ajouter un médicament
              </button>
              <button 
                type="submit" 
                className="flex-1 py-4 px-6 btn btn-outline"
              >
                Soumettre
              </button>
            </div>
          </form>
        </div>
      ) : (
        // Prescription Display Section
        <div
          ref={ref}
          className="relative w-[595px] h-[842px] shadow-2xl rounded-lg overflow-hidden"
          style={{
            backgroundImage: "url(/pp.png)",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <input
            type="text"
            name="patientName"
            value={prescription.patientName}
            readOnly
            className="absolute top-[232px] left-[120px] w-[100px] bg-transparent border-none outline-none text-black font-semibold text-lg"
          />
          <input
            type="text"
            name="lastname"
            value={prescription.lastname}
            readOnly
            className="absolute top-[232px] left-[330px] w-[100px] bg-transparent border-none outline-none text-black font-semibold text-lg"
          />
          <input
            type="text"
            name="age"
            value={calculateAge(prescription.birthDate)}
            readOnly
            className="absolute top-[232px] left-[530px] w-[50px] bg-transparent border-none outline-none text-black font-semibold text-lg"
          />
          <DatePicker
            selected={date}
            onChange={(date) => setDate(date)}
            className="input absolute top-[175px] left-[430px] w-[130px] bg-transparent border-none outline-none text-black font-semibold text-lg"
          />
          <div>
            <div className="absolute top-[330px] left-[50px] w-[190px] h-[430px] text-black font-semibold">
              {prescription.medications.map((medication, index) => (
                <div key={index} className="mb-4">
                  <input
                    type="text"
                    value={medication.name}
                    readOnly
                    className="bg-transparent border-none outline-none w-full text-lg"
                  />
                  {medication.boites && (
                    <input
                      type="text"
                      value={medication.boites}
                      readOnly
                      className="bg-transparent border-none outline-none w-full text-sm text-black"
                    />
                  )}
                </div>
              ))}
            </div>
            <div className="absolute top-[330px] left-[220px] w-[150px] h-[430px] text-black font-semibold">
              {prescription.medications.map((medication, index) => (
                <div key={index} className="mb-4">
                  <input
                    type="text"
                    value={medication.type}
                    readOnly
                    className="bg-transparent border-none outline-none w-full text-lg"
                  />
                </div>
              ))}
            </div>
            <div className="absolute top-[330px] left-[380px] w-[125px] h-[430px] text-black font-semibold">
              {prescription.medications.map((medication, index) => (
                <div key={index} className="mb-4">
                  <input
                    type="text"
                    value={medication.dosage}
                    readOnly
                    className="bg-transparent border-none outline-none w-full text-lg"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
});
PrescriptionForm.displayName = "PrescriptionForm";

export default PrescriptionForm;
