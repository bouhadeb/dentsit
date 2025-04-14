import AddMedicationForm from "@/components/AddMedicationForm";

const NewMedication = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Ajouter un Nouveau Médicament</h1>
          <p className="text-lg text-gray-600">Entrez les détails du nouveau médicament ci-dessous</p>
        </div>
        <div className="bg-white shadow-lg rounded-lg p-8">
          <AddMedicationForm />
        </div>
      </div>
    </div>
  );
};

export default NewMedication;
