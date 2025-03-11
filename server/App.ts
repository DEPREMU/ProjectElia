import fs from "fs";
import path from "path";
import express from "express";
import { supabase } from "./supabaseClient.ts";
import { fileURLToPath } from "url";
import app, { port, host } from "./API.ts";
import { cardSkeletonLoading } from "./constants.ts";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
//? __dirname = F:\XAMPP\htdocs\ProjectElia\server
const publicPath = path.join(__dirname, "..", "public");

const makeRegex = (value: string): RegExp => {
  return new RegExp(`\\{\\{${value}\\}\\}`, "g");
};

const pathFile = (file: string) => path.join(publicPath, file);

app.get("/", (_: express.Request, res: any) => {
  let indexHTML = fs.readFileSync(pathFile("index.html"), "utf-8");

  let cards: string[] = [];
  for (let i = 1; i < 10; i++) {
    cards.push(cardSkeletonLoading);
  }
  const cardsHTML = cards.join("");
  indexHTML = indexHTML.replace(makeRegex("cardsSkeletonLoading"), cardsHTML);

  res.setHeader("Content-Type", "text/html");
  return res.status(200).send(indexHTML);
});

app.get("/trip", async (req: any, res: any) => {
  res.setHeader("Content-Type", "text/html");

  const { id } = req.query;
  if (!id) {
    const HTML404 = fs.readFileSync(pathFile("404.html"), "utf-8");
    return res.status(404).send(HTML404);
  }

  const { data: trip, error } = await supabase
    .from("trips")
    .select("*")
    .eq("id", id);

  if (error || !trip || trip.length === 0) {
    const HTML404 = fs.readFileSync(pathFile("404.html"), "utf-8");
    return res.status(404).send(HTML404);
  }

  const tripHTML = fs.readFileSync(pathFile("trips/index.html"), "utf-8");
  return res.status(200).send(tripHTML);
});

const staticFileFilter = (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  const allowedPaths = ["/css", "/assets", "/scripts", "/trips"];
  const requestPath = req.path;

  const isAllowed = allowedPaths.some((allowedPath) =>
    requestPath.startsWith(allowedPath)
  );

  if (isAllowed) return next();

  res.status(403).send("Access to this resource is forbidden.");
};

app.use(staticFileFilter); // Usa el middleware personalizado

app.use(express.static(publicPath));

app.use((_: any, res: express.Response) => {
  const HTML404 = fs.readFileSync(pathFile("404.html"), "utf-8");
  res.status(404).send(HTML404);
});

app.listen(port, host, () => {
  console.log(`\n\nServer is running on http://${host}:${port}`);
});
