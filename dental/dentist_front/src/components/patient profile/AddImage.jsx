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
      <div className="flex items-center justify-center min-h-screen">
        Loading...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center">
      {patient && (
        <>
          <h1 className="text-2xl mb-10">Radio de {patient.firstName} {patient.familyName}</h1>

          {patient.images && patient.images.length > 0 ? (
            <div className="w-full max-w-2xl">
              <Carousel showThumbs={false} showStatus={false} infiniteLoop>
                {patient.images.map((image, index) => (
                  <div key={index}>
                    <img
                      src={`http://localhost:3001/${image}`}
                      alt={`Image ${index + 1} of ${patient.firstName}`}
                      className="rounded-lg shadow-lg"
                    />
                  </div>
                ))}
              </Carousel>
            </div>
          ) : (
            <p>No images available for this patient</p>
          )}
        </>
      )}
    </div>
  );
};

export default AddImage;
