"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { fetchAllPatients } from "@/services/patientService";
import { calculateAge } from "@/utils/calculateAge";
import { FaUser, FaUserTie, FaBirthdayCake, FaIdCard } from "react-icons/fa";

const PatientList = () => {
  const [patients, setPatients] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(""); // New state for category filter
  const router = useRouter();

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const response = await fetchAllPatients();
        setPatients(response);
      } catch (error) {
        console.error("Error fetching patients:", error);
      }
    };

    fetchPatients();
  }, []);

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
  };

  const handleRowClick = (id) => {
    router.push(`/patients/${id}`);
  };

  // Filter patients based on search query and selected category
  const filteredPatients = patients.filter((patient) => {
    const matchesSearchQuery = `${patient.firstName} ${patient.familyName}`
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory
      ? patient.category === selectedCategory
      : true; // If no category is selected, include all patients
    return matchesSearchQuery && matchesCategory;
  });

  return (
    <>
      <div className="container mx-auto">
        <h2 className="text-3xl font-bold text-center mt-40 mb-6">
          Liste des Patients
        </h2>
        <div className="flex justify-center mb-6 space-x-4">
          {/* Search Bar */}
          <label className="input input-bordered flex items-center gap-2 w-full max-w-md">
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearch}
              className="input grow"
              placeholder="Rechercher des patients..."
            />
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 16 16"
              fill="currentColor"
              className="h-4 w-4 opacity-70"
            >
              <path
                fillRule="evenodd"
                d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z"
                clipRule="evenodd"
              />
            </svg>
          </label>
          {/* Category Dropdown */}
          <select
            value={selectedCategory}
            onChange={handleCategoryChange}
            className="select select-bordered w-full max-w-xs"
          >
            <option value="">Toutes les catégories</option>
            <option value="o.c">o.c</option>
            <option value="protese">protese</option>
            <option value="odf">odf</option>
            <option value="para">para</option>
            <option value="pathq">pathq</option>
          </select>
        </div>
        <div className="overflow-x-auto rounded-lg shadow-lg mb-8">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <div className="flex items-center gap-2">
                    <FaIdCard className="text-gray-500" />
                    #
                  </div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <div className="flex items-center gap-2">
                    <FaUser className="text-gray-500" />
                    Prénom
                  </div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <div className="flex items-center gap-2">
                    <FaUserTie className="text-gray-500" />
                    Nom de Famille
                  </div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <div className="flex items-center gap-2">
                    <FaBirthdayCake className="text-gray-500" />
                    Âge
                  </div>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredPatients.map((patient, index) => (
                <tr
                  key={patient._id}
                  className="hover:bg-gray-50 cursor-pointer transition-colors duration-150"
                  onClick={() => handleRowClick(patient._id)}
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div className="flex items-center gap-2">
                      <FaIdCard className="text-gray-500" />
                      {index + 1}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div className="flex items-center gap-2">
                      <FaUser className="text-gray-500" />
                      {patient.firstName}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div className="flex items-center gap-2">
                      <FaUserTie className="text-gray-500" />
                      {patient.familyName}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div className="flex items-center gap-2">
                      <FaBirthdayCake className="text-gray-500" />
                      {calculateAge(patient.birthDate)}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default PatientList;