import Link from "next/link";

export default function Home() {
  return (
    <div className="relative min-h-screen">
      {/* Modern Geometric Background */}
      <div className="absolute top-[0px] inset-x-0 bottom-0 bg-gradient-to-br from-blue-50 via-cyan-50 to-blue-100 -z-10 overflow-hidden">
        {/* Large Circle */}
        <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-blue-200 opacity-20"></div>
        <div className="absolute bottom-1/4 right-1/3 w-96 h-96 rounded-full bg-blue-200 opacity-20"></div>
        {/* Medium Circle */}
        <div className="absolute top-1/4 -left-20 w-64 h-64 rounded-full bg-cyan-200 opacity-20"></div>
        <div className="absolute bottom-20 left-1/3 w-64 h-64 rounded-full bg-cyan-200 opacity-20"></div>
        {/* Small Circle */}
        <div className="absolute bottom-20 right-1/4 w-32 h-32 rounded-full bg-blue-300 opacity-20"></div>
        <div className="absolute top-1/3 right-1/4 w-32 h-32 rounded-full bg-blue-300 opacity-20"></div>
        
        {/* Diagonal Lines */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-full h-full">
            <div className="absolute top-0 left-0 w-[200vw] h-px bg-blue-300 transform -rotate-45 origin-left"></div>
            <div className="absolute top-0 left-0 w-[200vw] h-px bg-blue-300 transform -rotate-30 origin-left"></div>
            <div className="absolute top-0 left-0 w-[200vw] h-px bg-blue-300 transform -rotate-15 origin-left"></div>
            <div className="absolute top-0 left-0 w-[200vw] h-px bg-blue-300 transform rotate-15 origin-left"></div>
            <div className="absolute top-0 left-0 w-[200vw] h-px bg-blue-300 transform rotate-30 origin-left"></div>
            <div className="absolute top-0 left-0 w-[200vw] h-px bg-blue-300 transform rotate-45 origin-left"></div>
          </div>
        </div>

        {/* Dots Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-full h-full">
            <div className="absolute top-1/4 left-1/4 w-2 h-2 rounded-full bg-blue-400"></div>
            <div className="absolute top-1/3 left-1/3 w-2 h-2 rounded-full bg-blue-400"></div>
            <div className="absolute top-1/2 left-1/2 w-2 h-2 rounded-full bg-blue-400"></div>
            <div className="absolute top-2/3 left-2/3 w-2 h-2 rounded-full bg-blue-400"></div>
            <div className="absolute top-3/4 left-3/4 w-2 h-2 rounded-full bg-blue-400"></div>
            <div className="absolute bottom-1/4 right-1/4 w-2 h-2 rounded-full bg-blue-400"></div>
            <div className="absolute bottom-1/3 right-1/3 w-2 h-2 rounded-full bg-blue-400"></div>
            <div className="absolute bottom-1/2 right-1/2 w-2 h-2 rounded-full bg-blue-400"></div>
          </div>
        </div>
      </div>

      <div className="relative min-h-[60vh] overflow-hidden flex items-center justify-center">
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

      <div className="text-center mb-20">
        <h2 className="text-3xl font-bold text-gray-800 mb-8">
          Naviguer dans l&apos;application
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center mt-8 pb-20 w-4/5 m-auto">
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
    </div>
  );
}
