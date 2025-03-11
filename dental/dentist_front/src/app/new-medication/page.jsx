import AddMedicationForm from "@/components/AddMedicationForm";

const NewMedication = () => {
  return (
    <div className="container mx-auto mt-12">
      <h1 className="text-4xl mb-6 flex justify-center">Medications</h1>
      <AddMedicationForm />
    </div>
  );
};

export default NewMedication;
