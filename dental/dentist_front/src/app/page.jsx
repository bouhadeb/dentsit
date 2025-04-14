import Link from "next/link";

export default function Home() {
  return (
    <>
      <div className="relative min-h-[60vh] overflow-hidden flex items-center justify-center">
        {/* Wave Pattern Background */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-50 to-cyan-50">
          <svg
            className="absolute w-full h-full opacity-20"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 1440 320"
          >
            <path
              fill="#3b82f6"
              fillOpacity="0.2"
              d="M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,122.7C672,117,768,139,864,149.3C960,160,1056,160,1152,138.7C1248,117,1344,75,1392,53.3L1440,32L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
            ></path>
            <path
              fill="#06b6d4"
              fillOpacity="0.2"
              d="M0,192L48,197.3C96,203,192,213,288,229.3C384,245,480,267,576,250.7C672,235,768,181,864,181.3C960,181,1056,235,1152,234.7C1248,235,1344,181,1392,154.7L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
            ></path>
          </svg>
        </div>

        {/* Hero Content */}
        <div className="relative z-10 w-full">
          <div className="max-w-3xl mx-auto text-center px-4">
            <h1 className="text-5xl font-bold text-gray-800 mb-6">
              Bienvenue à la Clinique Dentaire
            </h1>
            <p className="text-xl text-gray-600">
              Votre santé dentaire est notre priorité. Découvrez nos services de pointe et prenez rendez-vous facilement.
            </p>
          </div>
        </div>
      </div>

      <div className="text-center mt-16">
        <h2 className="text-3xl font-bold text-gray-800 mb-8">
          Naviguer dans l&apos;application
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center mt-8 mb-20 w-4/5 m-auto">
        <div className="card bg-red-100 w-96 shadow-xl hover:shadow-2xl transition-all duration-300">
          <figure className="flex justify-center items-center h-64 p-4">
            <img
              src="reg_p.png"
              alt="Enregistrer un patient"
              className="object-contain h-full transition-transform duration-300 hover:scale-105"
            />
          </figure>
          <div className="card-body items-center text-center p-4">
            <h2 className="card-title text-2xl font-semibold mb-2">
              Enregistrer un patient
            </h2>
            <div className="card-actions mt-4">
              <Link href="/new-patient" className="btn btn-outline btn-wide">
                Cliquez ici
              </Link>
            </div>
          </div>
        </div>

        <div className="card bg-green-100 w-96 shadow-xl hover:shadow-2xl transition-all duration-300">
          <figure className="flex justify-center items-center h-64 p-4">
            <img
              src="P_list.png"
              alt="Liste des patients"
              className="object-contain h-full transition-transform duration-300 hover:scale-105"
            />
          </figure>
          <div className="card-body items-center text-center p-4">
            <h2 className="card-title text-2xl font-semibold mb-2">Liste des patients</h2>
            <div className="card-actions mt-4">
              <Link href="/patients" className="btn btn-outline btn-wide">
                Cliquez ici
              </Link>
            </div>
          </div>
        </div>

        <div className="card bg-blue-100 w-96 shadow-xl hover:shadow-2xl transition-all duration-300">
          <figure className="flex justify-center items-center h-64 p-4">
            <img
              src="dash.png"
              alt="Liste des patients"
              className="object-contain h-full transition-transform duration-300 hover:scale-105"
            />
          </figure>
          <div className="card-body items-center text-center p-4">
            <h2 className="card-title text-2xl font-semibold mb-2">Tableau de Bord</h2>
            <div className="card-actions mt-4">
              <Link href="/dash" className="btn btn-outline btn-wide">
                Cliquez ici
              </Link>
            </div>
          </div>
        </div>

        <div className="card bg-orange-100 w-96 shadow-xl hover:shadow-2xl transition-all duration-300">
          <figure className="flex justify-center items-center h-64 p-4">
            <img
              src="medicine.png"
              alt="Nouvelle fonctionnalité 2"
              className="object-contain h-full transition-transform duration-300 hover:scale-105"
            />
          </figure>
          <div className="card-body items-center text-center p-4">
            <h2 className="card-title text-2xl font-semibold mb-2">
              Ajouter des médicaments
            </h2>
            <div className="card-actions mt-4">
              <Link href="/new-medication" className="btn btn-outline btn-wide">
                Cliquez ici
              </Link>
            </div>
          </div>
        </div>

        <div className="card bg-yellow-100 w-96 shadow-xl hover:shadow-2xl transition-all duration-300">
          <figure className="flex justify-center items-center h-64 p-4">
            <img
              src="app.png"
              alt="Liste des rendez-vous"
              className="object-contain h-full transition-transform duration-300 hover:scale-105"
            />
          </figure>
          <div className="card-body items-center text-center p-4">
            <h2 className="card-title text-2xl font-semibold mb-2">Liste des rendez-vous</h2>
            <div className="card-actions mt-4">
              <Link href="/appointments" className="btn btn-outline btn-wide">
                Cliquez ici
              </Link>
            </div>
          </div>
        </div>

        <div className="card bg-purple-100 w-96 shadow-xl hover:shadow-2xl transition-all duration-300">
          <figure className="flex justify-center items-center h-64 p-4">
            <img
              src="payment.png"
              alt="Nouvelle fonctionnalité 1"
              className="object-contain h-full transition-transform duration-300 hover:scale-105"
            />
          </figure>
          <div className="card-body items-center text-center p-4">
            <h2 className="card-title text-2xl font-semibold mb-2">Liste de paiement</h2>
            <div className="card-actions mt-4">
              <Link href="/payments" className="btn btn-outline btn-wide">
                Cliquez ici
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
