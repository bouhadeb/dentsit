'use client';
import { useEffect, useState } from 'react';
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const TableauDeBord = () => {
  const [data, setData] = useState({
    patientsCeMois: 0,
    revenusMensuels: 0,
    totalPatients: 0,
    revenusTotaux: 0,
  });
  const [statusBreakdown, setStatusBreakdown] = useState({}); // État pour la décomposition des statuts
  const [revenueData, setRevenueData] = useState({ labels: [], data: [] }); // État pour les revenus des 12 derniers mois
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false); // État pour l'authentification
  const [password, setPassword] = useState(''); // État pour le mot de passe saisi
  const [passwordError, setPasswordError] = useState(''); // État pour les erreurs de mot de passe

  // Mot de passe fixe pour le développement (à remplacer par une solution sécurisée en production)
  const CORRECT_PASSWORD = process.env.NEXT_PUBLIC_DASHBOARD_PASSWORD || 'dentist123'; // Utilisation d'une variable d'environnement

  useEffect(() => {
    if (isAuthenticated) {
      const fetchData = async () => {
        setLoading(true);
        setError(null);

        try {
          // Récupérer le nombre de rendez-vous (patients) ce mois-ci depuis l'arrière-plan
          const appointmentsRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/appointments/this-month`, {
            headers: { 'Authorization': `Bearer ${localStorage.getItem('token') || ''}` }, // Ajout d'un en-tête d'authentification (facultatif)
          });
          console.log('Réponse Rendez-vous :', appointmentsRes);
          if (!appointmentsRes.ok) {
            const errorText = await appointmentsRes.text();
            throw new Error(`Échec de la récupération des rendez-vous : ${appointmentsRes.status} - ${errorText}`);
          }
          const appointmentsData = await appointmentsRes.json();
          console.log('Données Rendez-vous :', appointmentsData);
          const patientsCeMois = appointmentsData.count || 0;

          // Récupérer les revenus mensuels depuis l'arrière-plan
          const monthlyRevenueRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/patient/monthly-revenue`, {
            headers: { 'Authorization': `Bearer ${localStorage.getItem('token') || ''}` },
          });
          console.log('Réponse Revenus Mensuels :', monthlyRevenueRes);
          if (!monthlyRevenueRes.ok) {
            const errorText = await monthlyRevenueRes.text();
            throw new Error(`Échec de la récupération des revenus mensuels : ${monthlyRevenueRes.status} - ${errorText}`);
          }
          const monthlyRevenueData = await monthlyRevenueRes.json();
          console.log('Données Revenus Mensuels :', monthlyRevenueData);
          const revenusMensuels = monthlyRevenueData.totalRevenue || 0;

          // Récupérer les revenus totaux depuis l'arrière-plan
          const allTimeRevenueRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/patient/all-time-revenue`, {
            headers: { 'Authorization': `Bearer ${localStorage.getItem('token') || ''}` },
          });
          console.log('Réponse Revenus Totaux :', allTimeRevenueRes);
          if (!allTimeRevenueRes.ok) {
            const errorText = await allTimeRevenueRes.text();
            throw new Error(`Échec de la récupération des revenus totaux : ${allTimeRevenueRes.status} - ${errorText}`);
          }
          const allTimeRevenueData = await allTimeRevenueRes.json();
          console.log('Données Revenus Totaux :', allTimeRevenueData);
          const revenusTotaux = allTimeRevenueData.totalRevenue || 0;

          // Récupérer le total des patients depuis l'arrière-plan
          const totalPatientsRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/patient/total-patients`, {
            headers: { 'Authorization': `Bearer ${localStorage.getItem('token') || ''}` },
          });
          console.log('Réponse Total Patients :', totalPatientsRes);
          if (!totalPatientsRes.ok) {
            const errorText = await totalPatientsRes.text();
            throw new Error(`Échec de la récupération du total des patients : ${totalPatientsRes.status} - ${errorText}`);
          }
          const totalPatientsData = await totalPatientsRes.json();
          console.log('Données Total Patients :', totalPatientsData);
          const totalPatients = totalPatientsData.totalPatients || 0;

          // Récupérer la décomposition des statuts des rendez-vous pour ce mois
          const statusRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/appointments/status-breakdown`, {
            headers: { 'Authorization': `Bearer ${localStorage.getItem('token') || ''}` },
          });
          console.log('Réponse Décomposition Statuts :', statusRes);
          if (!statusRes.ok) {
            const errorText = await statusRes.text();
            throw new Error(`Échec de la récupération de la décomposition des statuts : ${statusRes.status} - ${errorText}`);
          }
          const statusData = await statusRes.json();
          console.log('Données Décomposition Statuts :', statusData);
          setStatusBreakdown(statusData || {});

          // Récupérer les revenus des 12 derniers mois
          const revenueRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/patient/last-12-months-revenue`, {
            headers: { 'Authorization': `Bearer ${localStorage.getItem('token') || ''}` },
          });
          console.log('Réponse Revenus 12 Derniers Mois :', revenueRes);
          if (!revenueRes.ok) {
            const errorText = await revenueRes.text();
            throw new Error(`Échec de la récupération des revenus des 12 derniers mois : ${revenueRes.status} - ${errorText}`);
          }
          const revenueData = await revenueRes.json();
          console.log('Données Revenus 12 Derniers Mois :', revenueData);
          setRevenueData(revenueData || { labels: [], data: [] });

          setData({
            patientsCeMois,
            revenusMensuels,
            totalPatients,
            revenusTotaux,
          });
        } catch (err) {
          console.error('Détails de l\'erreur de récupération :', err);
          setError(err.message);
        } finally {
          setLoading(false);
        }
      };

      fetchData();
    }
  }, [isAuthenticated]);

  // Gérer la soumission du mot de passe
  const handleLogin = (e) => {
    e.preventDefault();
    if (password === CORRECT_PASSWORD) {
      setIsAuthenticated(true);
      setPasswordError('');
      localStorage.setItem('token', 'dummy-token'); // Stocker un token fictif pour les en-têtes (facultatif)
    } else {
      setPasswordError('Mot de passe incorrect. Veuillez réessayer.');
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-md transform transition-all duration-300 hover:shadow-3xl">
          <h1 className="text-4xl font-bold text-gray-800 mb-16 text-center animate-pulse-once">Tableau de Bord</h1>
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label htmlFor="password" className="block text-gray-700 mb-5 font-semibold mb-2">Mot de Passe</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 placeholder-gray-400"
                placeholder="Entrez le mot de passe"
                autoComplete="current-password"
              />
            </div>
            {passwordError && (
              <p className="text-red-600 text-sm font-medium animate-bounce">{passwordError}</p>
            )}
            <button
              type="submit"
              className="w-full btn btn-outline"
            >
              Se Connecter
            </button>
          </form>
          <p className="text-gray-500 text-center mt-4 text-sm">
            Mot de passe oublié ? Contactez Nous.
          </p>
        </div>
      </div>
    );
  }

  // Configuration des données du graphique pour les revenus des 12 derniers mois avec des couleurs différentes
  const chartData = {
    labels: revenueData.labels, // ex. : ["2/2024", "3/2024", ..., "2/2025"]
    datasets: [{
      label: 'Revenus Mensuels',
      data: revenueData.data, // ex. : [500, 700, ..., 1000]
      backgroundColor: generateMonthColors(revenueData.labels.length), // Couleurs dynamiques pour chaque barre
      borderColor: generateMonthColors(revenueData.labels.length).map(color => color.replace('0.2', '1')), // Couleurs de bordure solides
      borderWidth: 1,
    }],
  };

  // Options du graphique pour une meilleure lisibilité
  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Revenus des 12 Derniers Mois',
        font: {
          size: 16,
          weight: 'bold',
        },
        color: '#374151', // Gris-700
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Revenus (DZD)',
          color: '#374151', // Gris-700
        },
        ticks: {
          color: '#374151', // Gris-700
        },
      },
      x: {
        title: {
          display: true,
          text: 'Mois/Année',
          color: '#374151', // Gris-700
        },
        ticks: {
          color: '#374151', // Gris-700
        },
      },
    },
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">Tableau de Bord</h1>
      <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
          <h2 className="text-xl font-semibold text-gray-700 mb-2">Patients Ce Mois</h2>
          <p className="text-3xl font-bold text-blue-600">{data.patientsCeMois}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
          <h2 className="text-xl font-semibold text-gray-700 mb-2">Revenus Mensuels</h2>
          <p className="text-3xl font-bold text-green-600">{data.revenusMensuels.toFixed(2)} DZD</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
          <h2 className="text-xl font-semibold text-gray-700 mb-2">Total Patients</h2>
          <p className="text-3xl font-bold text-purple-600">{data.totalPatients}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
          <h2 className="text-xl font-semibold text-gray-700 mb-2">Revenus Totaux</h2>
          <p className="text-3xl font-bold text-yellow-600">{data.revenusTotaux.toFixed(2)} DZD</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 col-span-1 md:col-span-2 lg:col-span-3">
          <h2 className="text-xl font-semibold text-gray-700 mb-2">Décomposition des Statuts des Rendez-vous (Ce Mois)</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {Object.entries(statusBreakdown).map(([statut, compte]) => (
              <div key={statut} className="bg-gray-50 p-4 rounded-lg shadow-inner">
                <p className={`text-lg font-medium ${getCouleurStatut(statut)}`}>{statut}</p>
                <p className="text-2xl font-bold text-gray-900">{compte || 0}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="max-w-4xl mx-auto mt-6">
        <h2 className="text-xl font-semibold text-gray-700 mb-4 text-center">Revenus des 12 Derniers Mois</h2>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <Bar data={chartData} options={chartOptions} />
        </div>
      </div>
    </div>
  );
};

// Fonction d'aide pour déterminer la couleur du statut
const getCouleurStatut = (statut) => {
  switch (statut) {
    case 'Annulé':
      return 'text-red-600';
    case 'En Attente':
      return 'text-yellow-600';
    case 'Fait':
      return 'text-green-600';
    default:
      return 'text-gray-800';
  }
};

// Fonction d'aide pour générer des couleurs différentes pour chaque mois
const generateMonthColors = (count) => {
  const colors = [
    'rgba(59, 130, 246, 0.2)', // Bleu (Tailwind blue-600 avec opacité)
    'rgba(34, 197, 94, 0.2)',  // Vert (Tailwind green-600 avec opacité)
    'rgba(147, 51, 234, 0.2)', // Violet (Tailwind purple-600 avec opacité)
    'rgba(234, 179, 8, 0.2)',  // Jaune (Tailwind yellow-600 avec opacité)
    'rgba(220, 38, 38, 0.2)',  // Rouge (Tailwind red-600 avec opacité)
    'rgba(250, 204, 21, 0.2)', // Ambre (Tailwind amber-600 avec opacité)
    'rgba(14, 165, 233, 0.2)', // Ciel (Tailwind sky-600 avec opacité)
    'rgba(168, 85, 247, 0.2)', // Violet (Tailwind violet-600 avec opacité)
    'rgba(22, 163, 74, 0.2)',  // Émeraude (Tailwind emerald-600 avec opacité)
    'rgba(245, 158, 11, 0.2)', // Orange (Tailwind orange-600 avec opacité)
    'rgba(99, 102, 241, 0.2)', // Indigo (Tailwind indigo-600 avec opacité)
    'rgba(253, 186, 116, 0.2)',// Pêche (Tailwind orange-300 avec opacité pour variété)
  ];

  // Cycle à travers les couleurs si plus de mois que de couleurs
  return Array.from({ length: count }, (_, i) => colors[i % colors.length]);
};

export default TableauDeBord;