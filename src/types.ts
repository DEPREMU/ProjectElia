type RatingType = 0 | 1 | 2 | 3 | 4 | 5;

type notAllowed = null | undefined;

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

type TravelDestination = {
  code: string;
  continent: string;
  lat: number;
  lon: number;
  thingsToDo: string[];
  images: string[];
  tips: {
    tipsClimate: { [key: string]: string };
    tipsGeneral: string[];
  };
  climate: string[];
};

type ResponseJSON = {
  data: TripType[] | TripType | null;
  error: string | null;
};

type TypeGetDataEq = {
  id?: number;
  destination?: string;
  countryCode?: string;
  startDate?: Date;
  endDate?: Date;
  budget?: number;
  travelType?: string;
  accomodation?: string;
  rating?: RatingType;
  continent?: string;
};
