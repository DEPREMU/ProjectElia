import fs from "fs";
import { supabase } from "../dist/supabaseClient.js";
import { getSeason } from "./getSeason.js";
import { log } from "console";

const destination = JSON.parse(
  fs.readFileSync("./createData/destination.json", "utf8")
);

const budgets = [];

const travelType = [
  "Solo",
  "Familiar",
  "Negocios",
  "Aventura",
  "Romántico",
  "Otro",
];

const accommodation = ["Hotel", "Hostal", "Airbnb", "Camping", "Otro"];

const rating = [0, 1, 2, 3, 4, 5];

let endDates = [];

let startDates = [];

// Create randoms budgets
for (let i = 0; i < 200; i++) {
  const budget = Math.floor(Math.random() * 10000) + 1000;
  budgets.push(budget);
}

// Create random end dates
for (let i = 0; i < 200; i++) {
  const date = new Date();
  date.setDate(date.getDate() + Math.floor(Math.random() * 60));
  date.setHours(0, 0, 0, 0);
  endDates.push(date);
}

// Create random start dates
for (let i = 0; i < 200; i++) {
  const date = new Date();
  date.setDate(date.getDate() - Math.floor(Math.random() * 60));
  date.setHours(0, 0, 0, 0);
  startDates.push(date);
}

const getBudget = (travelType, budget = 0) => {
  switch (travelType) {
    case "Solo":
      return Math.floor(budget * 0.8);
    case "Family":
      return Math.floor(budget * 3);
    case "Business":
      return Math.floor(budget * 2);
    case "Adventure":
      return Math.floor(budget * 1.5);
    case "Romantic":
      return Math.floor(budget * 1.7);
    default:
      return budget;
  }
};

let tripsInserted =
  (await supabase
    .from("trips")
    .select("*")
    .then((data) => data.data.length)) || 0;

// Create random trips
for (let i = 0; i < 500; i++) {
  const destinationKeys = Object.keys(destination);
  const destinationKey =
    destinationKeys[Math.floor(Math.random() * destinationKeys.length)];
  const destinationValue = destination[destinationKey];
  const budget = budgets[Math.floor(Math.random() * budgets.length)];
  const travelTypeValue =
    travelType[Math.floor(Math.random() * travelType.length)];
  const newBudget = getBudget(travelTypeValue, budget);
  const accommodationValue =
    accommodation[Math.floor(Math.random() * accommodation.length)];
  const ratingValue = rating[Math.floor(Math.random() * rating.length)];
  const endDate = endDates[Math.floor(Math.random() * endDates.length)];

  const newStartDates = startDates.filter(
    (date) => date < endDate && date.getMonth() === endDate.getMonth()
  );
  const startDate =
    newStartDates[Math.floor(Math.random() * newStartDates.length)];
  const image = destination[destinationKey].images;
  const thingsToDoValue = destination[destinationKey].thingsToDo;
  const coords = {
    lat: destination[destinationKey].lat,
    lon: destination[destinationKey].lon,
  };
  const clima =
    destination[destinationKey].climate[
      Math.floor(Math.random() * destination[destinationKey].climate.length)
    ];
  const travelTips = destination[destinationKey].tips;

  if (!startDate || !endDate || startDate.getTime() >= endDate.getTime())
    continue;

  const season = getSeason(startDate, destination[destinationKey].lat);

  const trip = {
    destination: destinationKey,
    countryCode: destinationValue.code,
    continent: destinationValue.continent,
    startDate: startDate.toISOString(),
    endDate: endDate.toISOString(),
    budget: newBudget,
    travelType: travelTypeValue,
    accommodation: accommodationValue,
    images: image,
    coords,
    climate: clima,
    thingsToDo: thingsToDoValue,
    rating: ratingValue,
    travelTips,
    season,
  };

  const { error } = await supabase.from("trips").insert(trip);

  if (error) console.error("Error inserting trip:", error);
  else tripsInserted++;
}

console.log("Length table:", tripsInserted);
