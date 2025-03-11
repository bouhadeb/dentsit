"use client";

import { useEffect, useState, useRef } from "react";
import { useReactToPrint } from "react-to-print";
import {
  addPayment,
  addPaymentEntry,
  fetchPatientPayment,
} from "@/services/paymentService";
import { fetchPatient } from "@/services/patientService";
import DatePicker from "react-datepicker";
import { fr } from "date-fns/locale";
import "react-datepicker/dist/react-datepicker.css";
import { calculateAge } from "@/utils/calculateAge";

const Payment = ({ id }) => {
  const [paymentDataArray, setPaymentDataArray] = useState([]);
  const [newTotalCost, setNewTotalCost] = useState("");
  const [paymentInputs, setPaymentInputs] = useState({});
  const [showReceipt, setShowReceipt] = useState(false);
  const [selectedEntryId, setSelectedEntryId] = useState(null);
  const [prescription, setPrescription] = useState({
    patientName: "",
    lastname: "",
    birthDate: "",
    date: "",
    amount: "",
    payment_date: "",
  });

  const componentRef = useRef();

  const fetchPaymentData = async () => {
    if (id) {
      try {
        const response = await fetchPatientPayment(id);
        setPaymentDataArray(response);
      } catch (error) {
        console.error("Error fetching payment data:", error);
      }
    }
  };

  useEffect(() => {
    fetchPaymentData();
  }, [id]);

  const handleAddPayment = async () => {
    if (newTotalCost <= 0) {
      alert("Please enter valid values for total cost.");
      return;
    }

    try {
      await addPayment({
        id,
        amount: newTotalCost,
      });

      setNewTotalCost("");
      fetchPaymentData();
    } catch (error) {
      console.error("Error adding payment:", error);
    }
  };

  const handleAddPaymentEntry = async (paymentIndex) => {
    const paymentAmount = paymentInputs[paymentIndex] || "";
    const paymentDate = new Date();

    if (paymentAmount <= 0) {
      alert("Please enter a valid payment amount.");
      return;
    }
    try {
      await addPaymentEntry({
        id,
        splitPaymentId: paymentDataArray[paymentIndex]._id,
        amount: paymentAmount,
        paymentDate: paymentDate.toISOString(),
      });

      setPaymentInputs({ ...paymentInputs, [paymentIndex]: "" });
      fetchPaymentData();
    } catch (error) {
      console.error("Error adding payment to entry:", error);
    }
  };

  const handlePaymentInputChange = (index, value) => {
    setPaymentInputs({ ...paymentInputs, [index]: value });
  };

  const handlereceipt = async (entryId) => {
    setSelectedEntryId(entryId);
    setShowReceipt(true);
  
    // Fetch patient data for receipt
    try {
      const patientData = await fetchPatient(id);
  
      // Find the specific entry by entryId and get its amount and payment date
      const selectedEntry = paymentDataArray
        .flatMap((payment) => payment.entry)
        .find((entry) => entry._id === entryId);
  
      setPrescription((prevPrescription) => ({
        ...prevPrescription,
        patientName: patientData.firstName,
        lastname: patientData.familyName,
        birthDate: patientData.birthDate,
        amount: selectedEntry ? `${selectedEntry.amount} DA` : "",
        payment_date: selectedEntry
          ? new Date(selectedEntry.paymentDate).toLocaleDateString("fr-FR")
          : "", // Set payment date from the entry
      }));
    } catch (error) {
      console.error("Error fetching patient data:", error);
    }
  };
  
  
  

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  return (
    <div className="container mx-auto mt-10">
      {showReceipt ? (
        <div className="flex flex-col justify-center items-center py-10">
        <div
          ref={componentRef}
          className="relative w-[595px] h-[842px] bg-red-500"
          style={{
            backgroundImage: "url(/pp_receipt.png)",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <h1 className="text-xl text-black font-bold absolute top-[300px] left-[200px]">
            REÇU D&apos;HONORAIRES
          </h1>
          <h1 className="text-black absolute top-[350px] left-[30px] w-[550px] text-lg leading-relaxed">
            Je, soussigné(e) <span className="font-semibold">Dr. Frihi Maher</span>, atteste avoir reçu de 
            <span className="font-semibold">{prescription.patient} {prescription.patientName} {prescription.lastname} </span>
            la somme de <span className="font-semibold">{prescription.amount} </span>
            pour des soins effectués le <span className="font-semibold">{prescription.payment_date}</span>.
          </h1>

          <input
            type="text"
            name="patientName"
            value={prescription.patientName}
            readOnly
            className="absolute top-[232px] left-[120px] w-[100px] bg-transparent border-none outline-none text-black font-semibold"
          />
          <input
            type="text"
            name="lastname"
            value={prescription.lastname}
            readOnly
            className="absolute top-[232px] left-[330px] w-[100px] bg-transparent border-none outline-none text-black font-semibold"
          />
          <input
            type="text"
            name="age"
            value={calculateAge(prescription.birthDate)}
            readOnly
            className="absolute top-[232px] left-[530px] w-[50px] bg-transparent border-none outline-none text-black font-semibold"
          />
          <DatePicker
            selected={new Date()}
            locale={fr}
            dateFormat="dd/MM/yyyy"
            className="input absolute top-[175px] left-[430px] w-[130px] bg-transparent border-none outline-none text-black font-semibold"
          />
        </div>
        <div className="flex justify-center mt-4">
          <button className="btn btn-outline" onClick={handlePrint}>
            Imprimer
          </button>
        </div>
      </div>      
      ) : (
        <>
          <h2 className="text-3xl font-bold text-center mb-10">
            Liste des Paiements
          </h2>

          <div className="flex justify-center mb-8">
            <div>
              <input
                type="number"
                placeholder="Nouveau Coût Total"
                value={newTotalCost}
                onChange={(e) => setNewTotalCost(Number(e.target.value))}
                className="border p-2 mr-2"
              />
              <button onClick={handleAddPayment} className="btn btn-outline">
                Ajouter un Nouveau Paiement
              </button>
            </div>
          </div>

          {paymentDataArray.length > 0 ? (
            paymentDataArray.map((paymentInfo, paymentIndex) => (
              <div key={paymentInfo._id} className="mb-8">
                <h3 className="text-2xl font-bold text-center mb-4">
                  Paiement {paymentIndex + 1}
                </h3>

                <div className="overflow-x-auto mb-4">
                  <table className="table-auto w-full border-collapse border border-gray-300">
                    <thead>
                      <tr>
                        <th className="border px-4 py-2">Date de Paiement</th>
                        <th className="border px-4 py-2">Montant</th>
                        <th className="border px-4 py-2">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {paymentInfo.entry && paymentInfo.entry.length > 0 ? (
                        paymentInfo.entry.map((entry, index) => (
                          <tr key={entry._id || index}>
                            <td className="border px-4 py-2">
                              {new Date(entry.paymentDate).toLocaleDateString("fr-FR")}
                            </td>
                            <td className="border px-4 py-2">{`${entry.amount} DA`}</td>
                            <td className="border px-4 py-2 text-center">
                              <button
                                onClick={() => handlereceipt(entry._id)}
                                className="btn btn-small btn-outline"
                              >
                                Reçu
                              </button>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td className="border px-4 py-2" colSpan="3">
                            Aucun paiement trouvé
                          </td>
                        </tr>
                      )}
                      <tr>
                        <td className="border px-4 py-2 font-bold">Coût Total</td>
                        <td className="border px-4 py-2 font-bold" colSpan="2">{`${paymentInfo.totalCost} DA`}</td>
                      </tr>
                      <tr>
                        <td className="border px-4 py-2 font-bold">Reste à Payer</td>
                        <td className="border px-4 py-2 font-bold" colSpan="2">{`${paymentInfo.remaining} DA`}</td>
                      </tr>
                    </tbody>
                  </table>

                  <div className="mt-4">
                    <input
                      type="number"
                      placeholder="Montant du Paiement"
                      value={paymentInputs[paymentIndex] || ""}
                      onChange={(e) =>
                        handlePaymentInputChange(paymentIndex, Number(e.target.value))
                      }
                      className="border p-2 mr-2"
                    />
                    <button
                      onClick={() => handleAddPaymentEntry(paymentIndex)}
                      className="btn btn-outline"
                    >
                      Ajouter Paiement
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center">Aucun paiement trouvé.</p>
          )}
        </>
      )}
    </div>
  );
};

export default Payment;
