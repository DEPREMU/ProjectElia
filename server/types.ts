type RatingType = 0 | 1 | 2 | 3 | 4 | 5;

type notAllowed = null | undefined | "";

type ReqBodyType = {
  destination: string | notAllowed;
  countryCode: string | notAllowed;
  startDate: string | notAllowed;
  endDate: string | notAllowed;
  minBudget: number | notAllowed;
  maxBudget: number | notAllowed;
  travelType: string | notAllowed;
  accommodation: string | notAllowed;
  rating: RatingType | notAllowed;
  continent: string | notAllowed;
};

type TripType = {
  id: number;
  destination: string;
  countryCode: string;
  continent: string;
  startDate: string;
  endDate: string;
  budget: number;
  travelType:
    | "Solo"
    | "Familiar"
    | "Negocios"
    | "Aventura"
    | "Romántico"
    | "Otro";
  accommodation: "Hotel" | "Hostal" | "Airbnb" | "Camping" | "Otro";
  images: string[];
  thingsToDo: string[];
  coords: { lat: number; lon: number };
  climate:
    | "Tropical"
    | "Seco"
    | "Templado"
    | "Continental"
    | "Polar"
    | "Mediterráneo"
    | "Árido"
    | "Húmedo Subtropical"
    | "Oceánico"
    | "Subártico"
    | "Tundra"
    | "Montaña";
  rating: number;
  notes?: string;
  createdAt: string;
  travelTips: {
    tipsClimate: { [key: string]: string };
    tipsGeneral: string[];
  };
  season: "Invierno" | "Primavera" | "Verano" | "Otoño" | "Cualquiera";
};
