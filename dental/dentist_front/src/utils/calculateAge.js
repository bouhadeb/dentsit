export const calculateAge = (birthDate) => {
  const bday = new Date(birthDate);
  const today = new Date();
  let ageInYears = today.getFullYear() - bday.getFullYear();
  const monthDiff = today.getMonth() - bday.getMonth();
  const dayDiff = today.getDate() - bday.getDate();

  if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
    ageInYears--;
  }

  const ageInMonths =
    (today.getFullYear() - bday.getFullYear()) * 12 +
    (today.getMonth() - bday.getMonth());

  if (ageInYears < 1) {
    return `${ageInMonths} mois`;
  }

  return `${ageInYears} ans`;
};
