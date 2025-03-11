"use client";
import { useRef } from "react";
import { useReactToPrint } from "react-to-print";
import PrescriptionForm from "@/components/PrescriptionForm";


const Prescription = ({ id }) => {
  const componentRef = useRef();

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  return (
    <div className="container mx-auto">
      <h2 className="text-4xl text-center pt-10">Ordonnance</h2>
      <div className="flex justify-center">
        <PrescriptionForm ref={componentRef} patientId={id} />
      </div>
      <div className="flex justify-center mb-4">
        <button className="btn btn-outline" onClick={handlePrint}>
          Imprimer
        </button>
      </div>
    </div>
  );
};

export default Prescription;