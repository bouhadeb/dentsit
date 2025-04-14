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

                <div className="overflow-x-auto mb-4 rounded-lg shadow">
                  <table className="min-w-full">
                    <thead className="bg-blue-600">
                      <tr>
                        <th className="px-6 py-4 text-left text-sm font-medium text-white uppercase">Date de Paiement</th>
                        <th className="px-6 py-4 text-left text-sm font-medium text-white uppercase">Montant</th>
                        <th className="px-6 py-4 text-left text-sm font-medium text-white uppercase">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white">
                      {paymentInfo.entry && paymentInfo.entry.length > 0 ? (
                        paymentInfo.entry.map((entry, index) => (
                          <tr key={entry._id || index} className={`${index % 2 === 0 ? 'bg-white' : 'bg-blue-50'} hover:bg-blue-100 transition-colors`}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                              {new Date(entry.paymentDate).toLocaleDateString("fr-FR")}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                              <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
                                {`${entry.amount} DA`}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                              <button
                                onClick={() => handlereceipt(entry._id)}
                                className="px-3 py-1 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded transition-colors"
                              >
                                Reçu
                              </button>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td className="px-6 py-4 text-sm text-gray-500 text-center bg-white" colSpan="3">
                            Aucun paiement trouvé
                          </td>
                        </tr>
                      )}
                      <tr className="bg-blue-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">Coût Total</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-blue-600" colSpan="2">
                          {`${paymentInfo.totalCost} DA`}
                        </td>
                      </tr>
                      <tr className="bg-blue-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">Reste à Payer</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-blue-600" colSpan="2">
                          {`${paymentInfo.remaining} DA`}
                        </td>
                      </tr>
                    </tbody>
                  </table>

                  <div className="mt-4 px-6 py-4 bg-white border-t">
                    <input
                      type="number"
                      placeholder="Montant du Paiement"
                      value={paymentInputs[paymentIndex] || ""}
                      onChange={(e) =>
                        handlePaymentInputChange(paymentIndex, Number(e.target.value))
                      }
                      className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 mr-2"
                    />
                    <button
                      onClick={() => handleAddPaymentEntry(paymentIndex)}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
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
