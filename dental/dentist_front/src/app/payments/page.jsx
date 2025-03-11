"use client";
import { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { fr } from "date-fns/locale";
import { fetchPayments } from "@/services/paymentService";

const PaymentsList = () => {
  const [firstDate, setFirstDate] = useState(new Date());
  const [payments, setPayments] = useState([]);
  const [total, setTotal] = useState("");

  useEffect(() => {
    const loadPayments = async () => {
      try {
        const response = await fetchPayments({
          firstDate: firstDate.toISOString(),
        });
        setTotal(response.totalAmount);
        setPayments(response.entries);
      } catch (error) {
        console.error("Error fetching payments:", error);
        setPayments([]);
      }
    };

    loadPayments();
  }, [firstDate]);

  return (
    <div className="container mx-auto">
      <h2 className="text-3xl font-bold text-center mt-20 mb-6">
        Liste des Paiements
      </h2>

      <div className="mb-4 flex justify-center gap-4">
        <div>
          <label className="block mb-2 text-center">Date</label>
          <DatePicker
            selected={firstDate}
            onChange={(date) => setFirstDate(date)}
            local={fr}
            dateFormat="dd/MM/yyyy"
            className="input input-bordered w-full max-w-xs"
          />
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="table-auto w-full mb-20">
          <thead>
            <tr>
              <th className="px-4 py-2">Nom du Client</th>
              <th className="px-4 py-2">Montant</th>
              <th className="px-4 py-2">Date de Paiement</th>
            </tr>
          </thead>
          <tbody>
            {payments && payments.length > 0 ? (
              payments.map((payment, index) => (
                <tr key={index}>
                  <td className="border px-4 py-2">
                    {payment.firstName + " " + payment.familyName || "N/A"}
                  </td>
                  <td className="border px-4 py-2">
                    {payment.amount !== undefined
                      ? `${payment.amount.toFixed(2)} DA`
                      : "N/A"}
                  </td>
                  <td className="border px-4 py-2">
                    {new Date(payment.paymentDate).toLocaleDateString('fr')}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td className="border px-4 py-2" colSpan="3">
                  Aucun paiement trouvé pour cette date ou ce client
                </td>
              </tr>
            )}
            <tr>
              <td className="border px-4 py-2 font-bold">Gains Totaux</td>
              <td
                className="border px-4 py-2 font-bold"
                colSpan="2"
              >{`${total} DA`}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PaymentsList;
