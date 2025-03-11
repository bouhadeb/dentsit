import Link from "next/link";

export default function Home() {
  return (
    <>
      <div className="flex justify-center pt-10">
        <h1 className="text-3xl">
          Bienvenue sur l&apos;application de la clinique dentaire
        </h1>
      </div>
      <div className="grid grid-cols-3 gap-10 justify-items-center mt-20 mb-20 w-4/5 m-auto">
        <div className="card bg-red-100 w-96 shadow-xl">
          <figure className="flex justify-center items-center h-64">
            <img
              src="reg_p.png"
              alt="Enregistrer un patient"
              className="object-contain h-full pt-5"
            />
          </figure>
          <div className="card-body">
            <h2 className="card-title justify-center">
              Enregistrer un patient
            </h2>
            <div className="card-actions justify-center pt-5">
              <Link href="/new-patient" className="btn btn-outline">
                Cliquez ici
              </Link>
            </div>
          </div>
        </div>

        <div className="card bg-green-100 w-96 shadow-xl">
          <figure className="flex justify-center items-center h-64">
            <img
              src="P_list.png"
              alt="Liste des patients"
              className="object-contain h-full pt-5"
            />
          </figure>
          <div className="card-body">
            <h2 className="card-title justify-center">Liste des patients</h2>
            <div className="card-actions justify-center pt-5">
              <Link href="/patients" className="btn btn-outline">
                Cliquez ici
              </Link>
            </div>
          </div>
        </div>

        <div className="card bg-blue-100 w-96 shadow-xl">
          <figure className="flex justify-center items-center h-64">
            <img
              src="dash.png"
              alt="Liste des patients"
              className="object-contain h-full pt-5"
            />
          </figure>
          <div className="card-body">
            <h2 className="card-title justify-center">Tableau de Bord</h2>
            <div className="card-actions justify-center pt-5">
              <Link href="/dash" className="btn btn-outline">
                Cliquez ici
              </Link>
            </div>
          </div>
        </div>

        <div className="card bg-orange-100 w-96 shadow-xl">
          <figure className="flex justify-center items-center h-64">
            <img
              src="medicine.png"
              alt="Nouvelle fonctionnalité 2"
              className="object-contain h-full pt-5"
            />
          </figure>
          <div className="card-body">
            <h2 className="card-title justify-center">
              Ajouter des médicaments
            </h2>
            <div className="card-actions justify-center pt-5">
              <Link href="/new-medication" className="btn btn-outline">
                Cliquez ici
              </Link>
            </div>
          </div>
        </div>
        <div className="card bg-yellow-100 w-96 shadow-xl">
          <figure className="flex justify-center items-center h-64">
            <img
              src="app.png"
              alt="Liste des rendez-vous"
              className="object-contain h-full pt-5"
            />
          </figure>
          <div className="card-body">
            <h2 className="card-title justify-center">Liste des rendez-vous</h2>
            <div className="card-actions justify-center pt-5">
              <Link href="/appointments" className="btn btn-outline">
                Cliquez ici
              </Link>
            </div>
          </div>
        </div>
        <div className="card bg-purple-100 w-96 shadow-xl">
          <figure className="flex justify-center items-center h-64">
            <img
              src="payment.png"
              alt="Nouvelle fonctionnalité 1"
              className="object-contain h-full pt-5"
            />
          </figure>
          <div className="card-body">
            <h2 className="card-title justify-center">Liste de paiement</h2>
            <div className="card-actions justify-center pt-5">
              <Link href="/payments" className="btn btn-outline">
                Cliquez ici
              </Link>
            </div>
          </div>
        </div>
      </div>
      
    </>
  );
}
