import express, { Request } from "express";
import cors from "cors";
import { supabase } from "./supabaseClient.js";

type RatingType = 0 | 1 | 2 | 3 | 4 | 5;

type notAllowed = null | undefined;

type TripType = {
  id: number;
  destination: string;
  countryCode: string;
  startDate: Date;
  endDate: Date;
  budget: number;
  travelType: string;
  accomodation: string;
  rating: RatingType;
  continent: string;
  notes: string | notAllowed;
  image: string | notAllowed;
  createdAt: Date;
};

type ReqBodyType = {
  destination: string | notAllowed;
  countryCode: string | notAllowed;
  startDate: string | notAllowed;
  endDate: string | notAllowed;
  minBudget: number | notAllowed;
  maxBudget: number | notAllowed;
  travelType: string | notAllowed;
  accomodation: string | notAllowed;
  rating: RatingType | notAllowed;
  continent: string | notAllowed;
};

const app = express();
export const tableNameTrips = "trips";

app.use(cors());
app.use(express.json());

export let port = 3000;
export let host = "localhost";

const args = process.argv.slice(2);

const getArgValue = (flag: string) => {
  const index: number = args.indexOf(flag);
  return index !== -1 && args[index + 1] ? args[index + 1] : null;
};

if (args.length > 0) {
  const portArg: string | null = getArgValue("--port") || getArgValue("-p");
  const numPortArg: number = Number(portArg);
  if (numPortArg) port = numPortArg;
  else if (!numPortArg) {
    console.error("Invalid port number");
    process.exit(1);
  }

  const hostArg: string | null = getArgValue("--host") || getArgValue("-h");
  const regexIP: RegExp = /^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/;
  if (hostArg && regexIP.test(hostArg)) host = hostArg;
  else if (!regexIP.test(host)) {
    console.error("Invalid hostname");
    process.exit(1);
  }
}

if (!supabase) {
  console.error("Supabase client not created successfully");
  process.exit(1);
}

app.get("/getTrips", async (req, res) => {
  const { data, error }: { data: TripType[] | null; error: Error | null } =
    await supabase.from(tableNameTrips).select("*");

  if (error) {
    res.status(500).json({ data: null, error: error.message });
  } else {
    res.status(200).json({ data, error: null });
  }
});

app.post("/getTrips", async (req: Request, res: any) => {
  const body = await req.body;

  if (body.id) {
    const { data, error } = await supabase
      .from(tableNameTrips)
      .select("*")
      .eq("id", body.id);
    res.status(200).json({ data, error });
    return;
  }

  if (Object.keys(body).length === 0) {
    res.status(400).json({ data: null, error: "Invalid request body" });
    return;
  }
  const {
    destination,
    countryCode,
    startDate,
    endDate,
    minBudget,
    maxBudget,
    travelType,
    accomodation,
    rating,
    continent,
  }: ReqBodyType = await body;
  let { data, error } = await supabase.from(tableNameTrips).select("*");

  if (error || !data)
    return res.status(500).json({ data: null, error: error?.message });

  if (destination) {
    data = data.filter((trip: TripType) => trip.destination === destination);
  }
  if (countryCode) {
    data = data.filter((trip: TripType) => trip.countryCode === countryCode);
  }
  if (startDate) {
    data = data.filter((trip: TripType) => {
      const date = new Date(startDate);
      const tripDate = new Date(trip.startDate);
      return (
        tripDate.toISOString().split("T")[0] ===
        date.toISOString().split("T")[0]
      );
    });
  }
  if (endDate) {
    data = data.filter((trip: TripType) => {
      const date = new Date(endDate);
      const tripDate = new Date(trip.endDate);
      return (
        tripDate.toISOString().split("T")[0] ===
        date.toISOString().split("T")[0]
      );
    });
  }
  if (minBudget) {
    data = data.filter((trip: TripType) => trip.budget >= minBudget);
  }
  if (maxBudget) {
    data = data.filter((trip: TripType) => trip.budget <= maxBudget);
  }
  if (travelType) {
    data = data.filter((trip: TripType) => trip.travelType === travelType);
  }
  if (accomodation) {
    data = data.filter((trip: TripType) => trip.accomodation === accomodation);
  }
  if (rating) {
    data = data.filter((trip: TripType) => trip.rating === rating);
  }
  if (continent) {
    data = data.filter((trip: TripType) => trip.continent === continent);
  }
  res
    .status(200)
    .setHeader("Content-Type", "application/json")
    .json({ data, error: null });
});

export default app;
