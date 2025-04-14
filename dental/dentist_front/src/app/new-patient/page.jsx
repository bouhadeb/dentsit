"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createPatient } from "@/services/patientService";
import { 
  FaUserTie, 
  FaUser, 
  FaBirthdayCake, 
  FaMapMarkerAlt, 
  FaPhone, 
  FaFileAlt, 
  FaTag, 
  FaImage 
} from "react-icons/fa";

const Form = () => {
  const [formData, setFormData] = useState({
    status: "", // Existing field for status
    firstName: "",
    familyName: "",
    birthDate: "",
    address: "",
    phone: "",
    description: "",
    images: [],
    category: "", // New field for category
  });

  const router = useRouter();

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Handle multiple file inputs
    if (e.target.type === "file") {
      const files = Array.from(e.target.files);
      setFormData({ ...formData, images: files });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createPatient(formData);
      router.push("/patients");
    } catch (error) {
      console.error("Error registering patient:", error);
    }
  };

  return (
    <div className="flex justify-center pt-20 min-h-screen mb-20">
      <form className="ml-10 w-1/3" onSubmit={handleSubmit}>
        <h1 className="text-3xl">Enregistrer un Patient</h1>
        
        <label className="form-control w-full">
          <div className="label">
            <span className="label-text mt-5 flex items-center gap-2">
              <FaUserTie /> Statut
            </span>
          </div>
          <select
            name="status"
            className="select select-bordered w-full"
            onChange={handleChange}
            required
          >
            <option value="">Sélectionnez le statut</option>
            <option value="M.">M.</option>
            <option value="Mme">Mme</option>
            <option value="Mlle">Mlle</option>
            <option value="Dr">Dr.</option>
          </select>
        </label>

        <label className="form-control w-full">
          <div className="label">
            <span className="label-text mt-5 flex items-center gap-2">
              <FaUser /> Nom
            </span>
          </div>
          <input
            type="text"
            name="firstName"
            placeholder="Entrez le prénom"
            className="input input-bordered w-full"
            onChange={handleChange}
            required
          />
        </label>
        <label className="form-control w-full">
          <div className="label">
            <span className="label-text mt-5 flex items-center gap-2">
              <FaUser /> Prénom
            </span>
          </div>
          <input
            type="text"
            name="familyName"
            placeholder="Entrez le nom de famille"
            className="input input-bordered w-full"
            onChange={handleChange}
            required
          />
        </label>
        <label className="form-control w-full">
          <div className="label">
            <span className="label-text mt-5 flex items-center gap-2">
              <FaBirthdayCake /> Date de Naissance (JJ/MM/AAAA)
            </span>
          </div>
          <input
            type="text"
            name="birthDate"
            placeholder="JJ/MM/AAAA"
            className="input input-bordered w-full"
            onChange={(e) => {
              const value = e.target.value;
              // Format the input as DD/MM/YYYY
              if (value.length === 2 || value.length === 5) {
                e.target.value = value + '/';
              }
              // Only allow numbers and forward slashes
              if (/^[0-9/]*$/.test(value)) {
                handleChange(e);
              }
            }}
            maxLength="10"
            required
          />
        </label>
        <label className="form-control w-full">
          <div className="label">
            <span className="label-text mt-5 flex items-center gap-2">
              <FaMapMarkerAlt /> Adresse
            </span>
          </div>
          <input
            type="text"
            name="address"
            placeholder="Entrez l'adresse"
            className="input input-bordered w-full"
            onChange={handleChange}
          />
        </label>
        <label className="form-control w-full">
          <div className="label">
            <span className="label-text mt-5 flex items-center gap-2">
              <FaPhone /> Numéro de Téléphone
            </span>
          </div>
          <input
            type="text"
            name="phone"
            placeholder="Entrez le numéro de téléphone"
            className="input input-bordered w-full"
            onChange={handleChange}
            required
          />
        </label>
        <label className="form-control w-full">
          <div className="label">
            <span className="label-text mt-5 flex items-center gap-2">
              <FaFileAlt /> Description du Patient
            </span>
          </div>
          <textarea
            name="description"
            placeholder="Entrez la description"
            className="textarea textarea-bordered w-full"
            onChange={handleChange}
            required
          />
        </label>
        
        <label className="form-control w-full">
          <div className="label">
            <span className="label-text mt-5 flex items-center gap-2">
              <FaTag /> Catégorie
            </span>
          </div>
          <select
            name="category"
            className="select select-bordered w-full"
            onChange={handleChange}
            required
          >
            <option value="">Sélectionnez la catégorie</option>
            <option value="o.c">o.c</option>
            <option value="protese">protese</option>
            <option value="odf">odf</option>
            <option value="para">para</option>
            <option value="pathq">pathq</option>
          </select>
        </label>

        <label className="form-control w-full">
          <div className="label">
            <span className="label-text mt-5 flex items-center gap-2">
              <FaImage /> Télécharger les images IRM (jusqu'à 5)
            </span>
          </div>
          <input
            type="file"
            name="images"
            multiple
            className="file-input file-input-bordered w-full"
            onChange={handleChange}
          />
        </label>

        <button type="submit" className="btn btn-outline w-full mt-10">
          Enregistrer
        </button>
      </form>
    </div>
  );
};

export default Form;