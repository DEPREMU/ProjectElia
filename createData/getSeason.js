export const getSeason = (date, lat) => {
  // Obtener el mes de la fecha
  const month = date.getMonth() + 1; // Los meses en JavaScript van de 0 (enero) a 11 (diciembre)

  // Determinar el hemisferio con base en la latitud
  let hemisphere;
  if (lat > 0) {
    hemisphere = "northern"; // Hemisferio norte
  } else {
    hemisphere = "southern"; // Hemisferio sur
  }

  // Definir la temporada en función del hemisferio
  if (hemisphere === "northern") {
    if (month >= 3 && month <= 5) {
      return "Primavera";
    } else if (month >= 6 && month <= 8) {
      return "Verano";
    } else if (month >= 9 && month <= 11) {
      return "Otoño";
    } else {
      return "Invierno";
    }
  } else if (hemisphere === "southern") {
    if (month >= 9 && month <= 11) {
      return "Primavera";
    } else if (month >= 12 || month <= 2) {
      return "Verano";
    } else if (month >= 3 && month <= 5) {
      return "Otoño";
    } else {
      return "Invierno";
    }
  }
  return "Cualquiera";
};
