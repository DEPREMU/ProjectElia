/**
 * # Represents the type of rating for a trip.
 */
type RatingType = 0 | 1 | 2 | 3 | 4 | 5;

/**
 * # Represents a value that is not allowed.
 */
type notAllowed = null | undefined | "";

/**
 * ## Represents the body of a request for trip details.
 *
 * @property {string | null | undefined | ""} destination - The destination of the trip.
 * @property {string | null | undefined | ""} countryCode - The ISO country code of the destination.
 * @property {string | null | undefined | ""} startDate - The start date of the trip in ISO format.
 * @property {string | null | undefined | ""} endDate - The end date of the trip in ISO format.
 * @property {number | null | undefined | ""} minBudget - The minimum budget for the trip.
 * @property {number | null | undefined | ""} maxBudget - The maximum budget for the trip.
 * @property {string | null | undefined | ""} travelType - The type of travel.
 * @property {string | null | undefined | ""} accommodation - The type of accommodation.
 * @property {0 | 1 | 2 | 3 | 4 | 5 | null | undefined | ""} rating - The rating of the trip.
 * @property {string | null | undefined | ""} continent - The continent of the destination.
 */
type ReqBodyType = {
  id?: number | string | notAllowed;
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

type Filters =
  | "destination"
  | "countryCode"
  | "startDate"
  | "endDate"
  | "minBudget"
  | "maxBudget"
  | "travelType"
  | "accommodation"
  | "rating"
  | "continent";

/**
 * Represents a trip with various details such as destination, dates, budget, and more.
 *
 * @property {number} id - Unique identifier for the trip.
 * @property {string} destination - Name of the destination.
 * @property {string} countryCode - ISO country code of the destination.
 * @property {string} continent - Continent of the destination.
 * @property {string} startDate - Start date of the trip in ISO format.
 * @property {string} endDate - End date of the trip in ISO format.
 * @property {number} budget - Budget allocated for the trip.
 * @property {"Solo" | "Familiar" | "Negocios" | "Aventura" | "Romántico" | "Otro"} travelType - Type of travel.
 * @property {"Hotel" | "Hostal" | "Airbnb" | "Camping" | "Otro"} accommodation - Type of accommodation.
 * @property {string[]} images - Array of image URLs related to the trip.
 * @property {string[]} thingsToDo - Array of activities or things to do during the trip.
 * @property {{ lat: number; lon: number }} coords - Coordinates of the destination.
 * @property {"Tropical" | "Seco" | "Templado" | "Continental" | "Polar" | "Mediterráneo" | "Árido" | "Húmedo Subtropical" | "Oceánico" | "Subártico" | "Tundra" | "Montaña"} climate - Climate type of the destination.
 * @property {number} rating - Rating of the trip.
 * @property {string} [notes] - Optional notes about the trip.
 * @property {string} createdAt - Date when the trip was created in ISO format.
 * @property {{ tipsClimate: { [key: string]: string }; tipsGeneral: string[] }} travelTips - Travel tips including climate-specific and general tips.
 * @property {"Invierno" | "Primavera" | "Verano" | "Otoño" | "Cualquiera"} season - Preferred season for the trip.
 */
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
