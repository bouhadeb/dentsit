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
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-blue-600">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">Nom du Client</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">Montant</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">Date de Paiement</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {payments && payments.length > 0 ? (
                payments.map((payment, index) => (
                  <tr key={index} className={index % 2 === 0 ? 'bg-white hover:bg-gray-50' : 'bg-gray-50 hover:bg-gray-100'}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                            <span className="text-blue-600 font-semibold">
                              {payment.firstName.charAt(0)}
                            </span>
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {payment.firstName + " " + payment.familyName || "N/A"}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-3 py-1 inline-flex text-sm font-semibold rounded-full bg-green-100 text-green-800">
                        {payment.amount !== undefined
                          ? `${payment.amount.toFixed(2)} DA`
                          : "N/A"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex items-center">
                        <svg className="h-4 w-4 text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        {new Date(payment.paymentDate).toLocaleDateString('fr')}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td className="px-6 py-8 text-center text-sm text-gray-500" colSpan="3">
                    <div className="flex flex-col items-center">
                      <svg className="w-16 h-16 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      <p className="text-lg font-medium text-gray-500">Aucun paiement trouvé</p>
                      <p className="text-sm text-gray-400 mt-1">pour cette date ou ce client</p>
                    </div>
                  </td>
                </tr>
              )}
              <tr className="bg-blue-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-blue-900">Gains Totaux</td>
                <td className="px-6 py-4 whitespace-nowrap" colSpan="2">
                  <span className="px-4 py-2 inline-flex text-sm font-bold rounded-full bg-blue-100 text-blue-800">
                    {`${total} DA`}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default PaymentsList;
