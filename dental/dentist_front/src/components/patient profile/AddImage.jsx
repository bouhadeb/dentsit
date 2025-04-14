"use client";
import { useState, useEffect } from "react";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css"; // Import the carousel CSS
import api from "@/services/api";

const AddImage = ({ id }) => {
  const [patient, setPatient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPatientData = async () => {
      try {
        const response = await api.get(`/patient/${id}`);
        setPatient(response.data);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setError("Error fetching patient data");
        setLoading(false);
      }
    };

    if (id) {
      fetchPatientData();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-600">Loading patient images...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="bg-red-50 p-4 rounded-lg border border-red-200">
          <p className="text-red-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center p-6 bg-white rounded-lg shadow-sm">
      {patient && (
        <>
          <h1 className="text-3xl font-semibold mb-8 text-gray-800">
            Radio de {patient.firstName} {patient.familyName}
          </h1>

          {patient.images && patient.images.length > 0 ? (
            <div className="w-full max-w-3xl">
              <Carousel 
                showThumbs={false} 
                showStatus={false} 
                infiniteLoop
                autoPlay
                interval={5000}
                transitionTime={500}
                className="rounded-xl overflow-hidden shadow-lg"
              >
                {patient.images.map((image, index) => (
                  <div key={index} className="relative">
                    <img
                      src={`http://localhost:3001/${image}`}
                      alt={`Image ${index + 1} of ${patient.firstName}`}
                      className="rounded-lg object-contain h-[500px] w-full"
                    />
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/50 to-transparent p-4">
                      <p className="text-white text-sm">Image {index + 1} of {patient.images.length}</p>
                    </div>
                  </div>
                ))}
              </Carousel>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-4 p-8 bg-gray-50 rounded-lg">
              <p className="text-gray-600 text-lg">No images available for this patient</p>
              <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
                Add New Image
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default AddImage;
