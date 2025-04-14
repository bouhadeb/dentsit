'use client';
import { useEffect, useState } from 'react';
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Tooltip, Legend, ArcElement, PointElement, LineElement } from 'chart.js';
import { Bar, Pie, Line } from 'react-chartjs-2';
import { UserGroupIcon, CurrencyDollarIcon, UserIcon, BanknotesIcon } from '@heroicons/react/24/outline';

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend, ArcElement, PointElement, LineElement);

const TableauDeBord = () => {
  const [data, setData] = useState({
    patientsCeMois: 0,
    revenusMensuels: 0,
    totalPatients: 0,
    revenusTotaux: 0,
  });
  const [statusBreakdown, setStatusBreakdown] = useState({}); // État pour la décomposition des statuts
  const [revenueData, setRevenueData] = useState({ labels: [], data: [] }); // État pour les revenus des 12 derniers mois
  const [ageDistribution, setAgeDistribution] = useState({}); // New state for age distribution
  const [genderDistribution, setGenderDistribution] = useState({}); // New state for gender distribution
  const [categoryDistribution, setCategoryDistribution] = useState({}); // New state for category distribution
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

          // Fetch age distribution data
          const ageDistributionRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/patient/age-distribution`, {
            headers: { 'Authorization': `Bearer ${localStorage.getItem('token') || ''}` },
          });
          if (!ageDistributionRes.ok) {
            const errorText = await ageDistributionRes.text();
            throw new Error(`Échec de la récupération de la distribution d'âge : ${ageDistributionRes.status} - ${errorText}`);
          }
          const ageDistributionData = await ageDistributionRes.json();
          setAgeDistribution(ageDistributionData);

          // Fetch gender distribution data
          const genderDistributionRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/patient/gender-distribution`, {
            headers: { 'Authorization': `Bearer ${localStorage.getItem('token') || ''}` },
          });
          if (!genderDistributionRes.ok) {
            const errorText = await genderDistributionRes.text();
            throw new Error(`Échec de la récupération de la distribution des genres : ${genderDistributionRes.status} - ${errorText}`);
          }
          const genderDistributionData = await genderDistributionRes.json();
          setGenderDistribution(genderDistributionData);

          // Fetch category distribution data
          const categoryDistributionRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/patient/category-distribution`, {
            headers: { 'Authorization': `Bearer ${localStorage.getItem('token') || ''}` },
          });
          if (!categoryDistributionRes.ok) {
            const errorText = await categoryDistributionRes.text();
            throw new Error(`Échec de la récupération de la distribution des catégories : ${categoryDistributionRes.status} - ${errorText}`);
          }
          const categoryDistributionData = await categoryDistributionRes.json();
          setCategoryDistribution(categoryDistributionData);

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

  // Configuration des données du graphique pour les revenus des 12 derniers mois
  const chartData = {
    labels: revenueData.labels,
    datasets: [{
      label: 'Revenus Mensuels',
      data: revenueData.data,
      borderColor: 'rgba(249, 115, 22, 1)', // Orange-500
      backgroundColor: 'rgba(249, 115, 22, 0.1)',
      tension: 0.4,
      fill: true,
      pointBackgroundColor: 'rgba(249, 115, 22, 1)',
      pointBorderColor: '#fff',
      pointBorderWidth: 2,
      pointRadius: 4,
      pointHoverRadius: 6,
    }],
  };

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
        color: '#374151',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Revenus (DZD)',
          color: '#374151',
        },
        ticks: {
          color: '#374151',
        },
        grid: {
          color: 'rgba(0, 0, 0, 0.1)',
        },
      },
      x: {
        title: {
          display: true,
          text: 'Mois/Année',
          color: '#374151',
        },
        ticks: {
          color: '#374151',
        },
        grid: {
          color: 'rgba(0, 0, 0, 0.1)',
        },
      },
    },
  };

  // Configuration des données du graphique pour la distribution d'âge
  const ageChartData = {
    labels: Object.keys(ageDistribution),
    datasets: [{
      label: 'Nombre de Patients',
      data: Object.values(ageDistribution),
      backgroundColor: [
        'rgba(59, 130, 246, 0.2)', // Bleu
        'rgba(34, 197, 94, 0.2)',  // Vert
        'rgba(147, 51, 234, 0.2)', // Violet
        'rgba(234, 179, 8, 0.2)',  // Jaune
        'rgba(220, 38, 38, 0.2)',  // Rouge
      ],
      borderColor: [
        'rgb(59, 134, 246)',
        'rgba(34, 197, 94, 1)',
        'rgba(147, 51, 234, 1)',
        'rgba(234, 179, 8, 1)',
        'rgba(220, 38, 38, 1)',
      ],
      borderWidth: 1,
    }],
  };

  const ageChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Distribution des Âges des Patients',
        font: {
          size: 16,
          weight: 'bold',
        },
        color: '#374151',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Nombre de Patients',
          color: '#374151',
        },
        ticks: {
          color: '#374151',
        },
      },
      x: {
        title: {
          display: true,
          text: 'Tranche d\'Âge',
          color: '#374151',
        },
        ticks: {
          color: '#374151',
        },
      },
    },
  };

  // Configuration des données du graphique pour la distribution des genres
  const genderChartData = {
    labels: Object.keys(genderDistribution),
    datasets: [{
      label: 'Nombre de Patients',
      data: Object.values(genderDistribution),
      backgroundColor: [
        'rgba(59, 130, 246, 0.2)', // Bleu pour Homme
        'rgba(236, 72, 153, 0.2)', // Rose pour Femme
        'rgba(156, 163, 175, 0.2)', // Gris pour Autre
      ],
      borderColor: [
        'rgba(59, 130, 246, 1)',
        'rgba(236, 72, 153, 1)',
        'rgba(156, 163, 175, 1)',
      ],
      borderWidth: 1,
    }],
  };

  const genderChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Distribution des Genres des Patients',
        font: {
          size: 16,
          weight: 'bold',
        },
        color: '#374151',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Nombre de Patients',
          color: '#374151',
        },
        ticks: {
          color: '#374151',
        },
      },
      x: {
        title: {
          display: true,
          text: 'Genre',
          color: '#374151',
        },
        ticks: {
          color: '#374151',
        },
      },
    },
  };

  // Configuration des données du graphique pour la distribution des catégories
  const categoryChartData = {
    labels: Object.keys(categoryDistribution),
    datasets: [{
      data: Object.values(categoryDistribution),
      backgroundColor: [
        'rgba(59, 130, 246, 0.8)',   // Bleu
        'rgba(34, 197, 94, 0.8)',    // Vert
        'rgba(147, 51, 234, 0.8)',   // Violet
        'rgba(234, 179, 8, 0.8)',    // Jaune
        'rgba(220, 38, 38, 0.8)',    // Rouge
        'rgba(249, 115, 22, 0.8)',   // Orange
        'rgba(168, 85, 247, 0.8)',   // Violet
        'rgba(14, 165, 233, 0.8)',   // Ciel
      ],
      borderColor: [
        'rgba(59, 130, 246, 1)',
        'rgba(34, 197, 94, 1)',
        'rgba(147, 51, 234, 1)',
        'rgba(234, 179, 8, 1)',
        'rgba(220, 38, 38, 1)',
        'rgba(249, 115, 22, 1)',
        'rgba(168, 85, 247, 1)',
        'rgba(14, 165, 233, 1)',
      ],
      borderWidth: 1,
    }],
  };

  const categoryChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'right',
        labels: {
          padding: 20,
          font: {
            size: 12
          }
        }
      },
      title: {
        display: true,
        text: 'Distribution des Catégories de Patients',
        font: {
          size: 16,
          weight: 'bold',
        },
        color: '#374151',
      },
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Tableau de Bord</h1>
          <p className="text-gray-600">Aperçu complet de votre cabinet dentaire</p>
        </div>

        {/* Stats Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 border-l-4 border-blue-500">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-700">Patients Ce Mois</h2>
              <UserGroupIcon className="h-8 w-8 text-blue-500" />
            </div>
            <p className="text-3xl font-bold text-blue-600 mt-2">{data.patientsCeMois}</p>
            <p className="text-sm text-gray-500 mt-2">+12% vs mois dernier</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 border-l-4 border-green-500">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-700">Revenus Mensuels</h2>
              <CurrencyDollarIcon className="h-8 w-8 text-green-500" />
            </div>
            <p className="text-3xl font-bold text-green-600 mt-2">{data.revenusMensuels.toFixed(2)} DZD</p>
            <p className="text-sm text-gray-500 mt-2">+8% vs mois dernier</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 border-l-4 border-purple-500">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-700">Total Patients</h2>
              <UserIcon className="h-8 w-8 text-purple-500" />
            </div>
            <p className="text-3xl font-bold text-purple-600 mt-2">{data.totalPatients}</p>
            <p className="text-sm text-gray-500 mt-2">Patients actifs</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 border-l-4 border-yellow-500">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-700">Revenus Totaux</h2>
              <BanknotesIcon className="h-8 w-8 text-yellow-500" />
            </div>
            <p className="text-3xl font-bold text-yellow-600 mt-2">{data.revenusTotaux.toFixed(2)} DZD</p>
            <p className="text-sm text-gray-500 mt-2">Depuis l'ouverture</p>
          </div>
        </div>

        {/* Status Breakdown Card */}
        <div className="bg-white p-6 rounded-xl shadow-lg mb-8">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">Statut des Rendez-vous (Ce Mois)</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {Object.entries(statusBreakdown).map(([statut, compte]) => (
              <div key={statut} className="bg-gray-50 p-4 rounded-lg shadow-inner hover:shadow-md transition-shadow duration-300">
                <p className={`text-lg font-medium ${getCouleurStatut(statut)}`}>{statut}</p>
                <p className="text-2xl font-bold text-gray-900">{compte || 0}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Revenue Chart */}
          <div className="bg-white p-8 rounded-2xl shadow-lg">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">Revenus des 12 Derniers Mois</h2>
            <div className="h-96">
              <Line data={chartData} options={chartOptions} />
            </div>
          </div>

          {/* Age Distribution Chart */}
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">Distribution des Âges</h2>
            <div className="h-80">
              <Bar data={ageChartData} options={ageChartOptions} />
            </div>
          </div>

          {/* Gender Distribution Chart */}
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">Distribution des Genres</h2>
            <div className="h-80">
              <Bar data={genderChartData} options={genderChartOptions} />
            </div>
          </div>

          {/* Category Distribution Chart */}
          <div className="bg-white p-8 rounded-2xl shadow-lg">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">Distribution des Catégories</h2>
            <div className="h-96 flex items-center justify-center">
              <Pie data={categoryChartData} options={categoryChartOptions} />
            </div>
          </div>
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