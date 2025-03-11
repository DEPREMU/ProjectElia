import fs from "fs";
import cors from "cors";
import express from "express";
import { supabase } from "./supabaseClient.ts";

const app = express();
export const tableNameTrips = "trips";

app.use(cors());
app.use(express.json());

export let port = 3000;
export let host = "localhost";

if (!supabase) {
  console.error("Supabase client not created successfully");
  process.exit(1);
}

const boolIsInTrip = (trip: TripType, value: string) => {
  return (
    trip.destination.toLowerCase().includes(value) ||
    trip.continent.toLowerCase().includes(value) ||
    trip.travelType.toLowerCase().includes(value) ||
    trip.accommodation.toLowerCase().includes(value)
  );
};

app.get("/getTrips", async (_: Request, res: any) => {
  const { data, error }: { data: TripType[] | null; error: Error | null } =
    await supabase.from(tableNameTrips).select("*");

  if (error) {
    res.status(500).json({ data: null, error: error.message });
  } else {
    res.status(200).json({ data, error: null });
  }
});

app.post("/getTrips", async (req: express.Request, res: any) => {
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
    accommodation,
    rating,
    continent,
  }: ReqBodyType = await body;
  let { data, error } = await supabase.from(tableNameTrips).select("*");

  if (error || !data)
    return res.status(500).json({ data: null, error: error?.message });

  if (destination) {
    console.log("Filtering by destination:", destination);
    data = data.filter((trip: TripType) => boolIsInTrip(trip, destination));
  }
  if (countryCode) {
    console.log("Filtering by country code:", countryCode);
    data = data.filter((trip: TripType) => trip.countryCode === countryCode);
  }
  if (startDate) {
    console.log("Filtering by start date:", startDate);
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
    console.log("Filtering by end date:", endDate);
    data = data.filter((trip: TripType) => {
      const date = new Date(endDate);
      const tripDate = new Date(trip.endDate);
      return (
        tripDate.toISOString().split("T")[0] ===
        date.toISOString().split("T")[0]
      );
    });
  }
  if (minBudget && minBudget > 0) {
    console.log("Filtering by min budget:", minBudget);
    data = data.filter((trip: TripType) => trip.budget >= minBudget);
  }
  if (maxBudget && maxBudget > 0) {
    console.log("Filtering by max budget:", maxBudget);
    data = data.filter((trip: TripType) => trip.budget <= maxBudget);
  }
  if (travelType) {
    console.log("Filtering by travel type:", travelType);
    data = data.filter((trip: TripType) => trip.travelType === travelType);
  }
  if (rating || rating === 0) {
    console.log("Filtering by rating:", rating);
    data = data.filter((trip: TripType) => trip.rating === rating);
  }
  if (accommodation) {
    console.log("Filtering by accommodation:", accommodation);
    data = data.filter(
      (trip: TripType) => trip.accommodation === accommodation
    );
  }
  if (continent) {
    console.log("Filtering by continent:", continent);
    data = data.filter((trip: TripType) => trip.continent === continent);
  }

  fs.writeFileSync("body.json", JSON.stringify(body, null, 2));

  res
    .status(200)
    .setHeader("Content-Type", "application/json")
    .json({ data, error: null });
});

export default app;
