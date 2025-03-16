/**
 * This module sets up an Express server with endpoints to interact with a Supabase database.
 * It includes CORS and JSON parsing middleware, and defines routes to get and filter trips data.
 *
 * @module API
 */

import fs from "fs";
import cors from "cors";
import express from "express";
import { supabase } from "./supabaseClient.ts";
import { PostgrestError } from "@supabase/supabase-js";

const app = express();
export const tableNameTrips = "trips";

//? We activate CORS and JSON parsing

app.use(cors());
app.use(express.json());

//? We define the port and host

/**
 * The port number on which the server will listen.
 * @type {number}
 */
export let port: number = 3001;
/**
 * The hostname for the server.
 *
 * @remarks
 * This variable is used to specify the hostname where the server is running.
 *
 * @type {string}
 *
 * @example
 * ```typescript
 * import { host } from './API';
 * console.log(host); // Output: "localhost"
 * ```
 */
export let host: string = "localhost";

//? We check if the Supabase client was created successfully, if not, we exit the process (program)
if (!supabase) {
  console.error("Supabase client not created successfully");
  process.exit(1);
}

/**
 * Represents the response structure for trips.
 *
 * @typedef {Object} ResponseTrips
 * @property {TripType[] | null} data - An array of TripType objects or null if no data is available.
 * @property {PostgrestError | null} error - An error object if an error occurred, or null if no error.
 */
type ResponseTrips = { data: TripType[] | null; error: PostgrestError | null };

/**
 * Checks if a trip contains a specific value in its destination, continent, travel type, or accommodation.
 *
 * @param {TripType} trip - The trip object to check.
 * @param {string} value - The value to search for in the trip's properties.
 * @returns {boolean} - Returns true if the value is found in any of the trip's properties, otherwise false.
 */
const boolIsInTrip = (trip: TripType, value: string): boolean => {
  return (
    trip.destination.toLowerCase().includes(value) ||
    trip.continent.toLowerCase().includes(value) ||
    trip.travelType.toLowerCase().includes(value) ||
    trip.accommodation.toLowerCase().includes(value)
  );
};

/**
 * GET /getTrips
 *
 * Retrieves all trips from the database.
 *
 * @param {Request} _ - The request object (not used).
 * @param {any} res - The response object.
 */
app.get("/getTrips", async (_: Request, res: any) => {
  const { data, error }: ResponseTrips = await supabase
    .from(tableNameTrips)
    .select("*");

  if (error) {
    res.status(500).json({ data: null, error: error.message });
  } else {
    res.status(200).json({ data, error: null });
  }
});

/**
 * POST /getTrips
 *
 * Retrieves trips from the database based on the provided filters in the request body.
 *
 * @param {express.Request} req - The request object containing the filters.
 * @param {any} res - The response object.
 */
app.post("/getTrips", async (req: express.Request, res: any) => {
  const body: ReqBodyType = await req.body;

  if (body.id) {
    const { data, error }: ResponseTrips = await supabase
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

  const filters: Filters[] = [
    "destination",
    "countryCode",
    "startDate",
    "endDate",
    "minBudget",
    "maxBudget",
    "travelType",
    "accommodation",
    "rating",
    "continent",
  ];
  let { data, error }: ResponseTrips = await supabase
    .from(tableNameTrips)
    .select("*");

  if (error || !data)
    return res.status(500).json({ data: null, error: error?.message });

  for (const filter of filters) {
    if (
      !body[filter] ||
      (["maxBudget", "minBudget"].includes(filter) &&
        Number(body[filter]) === -1)
    )
      continue;

    console.log(`Filtering by ${filter}:`, body[filter]);
    switch (filter) {
      case "destination":
        data = data.filter((trip: TripType) =>
          boolIsInTrip(trip, body[filter] as string)
        );
        break;
      case "startDate":
      case "endDate":
        data = data.filter((trip: TripType) => {
          const date = new Date(body[filter] as string);
          const tripDate = new Date(trip[filter]);
          return (
            tripDate.toISOString().split("T")[0] ===
            date.toISOString().split("T")[0]
          );
        });
        break;
      case "maxBudget":
        data = data.filter(
          (trip: TripType) => trip.budget <= Number(body[filter])
        );
        break;
      case "minBudget":
        console.log("Min budget:", body[filter]);
        data = data.filter(
          (trip: TripType) => trip.budget >= Number(body[filter])
        );
        break;
      default:
        data = data.filter(
          (trip: TripType) =>
            trip[filter]?.toString().toLowerCase() ===
            body[filter]?.toString().toLowerCase()
        );
        break;
    }
  }

  fs.writeFileSync("body.json", JSON.stringify(body, null, 2));

  if (data.length === 0) {
    data = [
      {
        id: 0,
        destination: "No trips found",
        countryCode: "",
        continent: "",
        startDate: "",
        endDate: "",
        budget: 0,
        travelType: "Otro",
        accommodation: "Otro",
        images: ["/assets/NoResults.png"],
        thingsToDo: [],
        coords: { lat: 0, lon: 0 },
        climate: "Templado",
        rating: 0,
        notes: "",
        createdAt: "",
        travelTips: {
          tipsClimate: {},
          tipsGeneral: [],
        },
        season: "Cualquiera",
      },
    ];
  }
  res
    .status(200)
    .setHeader("Content-Type", "application/json")
    .json({ data, error: null });
});

export default app;
