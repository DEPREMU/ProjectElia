/**
 * Sets up and starts an Express server.
 *
 * Imports necessary modules and initializes the Express app.
 * Defines routes and middleware for handling requests and serving static files.
 *
 * @module App
 */

import fs from "fs";
import path from "path";
import express from "express";
import { supabase } from "./supabaseClient.ts";
import { fileURLToPath } from "url";
import app, { port, host } from "./API.ts";
import { cardSkeletonLoading } from "./constants.ts";

/**
 * Gets the filename and directory name of the current module.
 *
 * @constant
 * @type {string}
 */
const __filename: string = fileURLToPath(import.meta.url);

/**
 * Gets the directory name of the current module.
 *
 * @constant
 * @type {string}
 */
const __dirname: string = path.dirname(__filename);

/**
 * Path to the public directory.
 *
 * @constant
 * @type {string}
 */
const publicPath: string = path.join(__dirname, "..", "public");

/**
 * Creates a regular expression to match a specific value within double curly braces.
 *
 * @param {string} value - The value to be matched within double curly braces.
 * @returns {RegExp} - The generated regular expression.
 */
const makeRegex = (value: string): RegExp => {
  return new RegExp(`\\{\\{${value}\\}\\}`, "g");
};

/**
 * Joins the public path with the specified file name.
 *
 * @param {string} file - The file name to be joined with the public path.
 * @returns {string} - The full path to the specified file.
 */
const pathFile = (file: string): string => path.join(publicPath, file);

/**
 * Handles GET requests to the root URL ("/").
 *
 * Reads the index.html file, replaces placeholders with actual content, and sends the response.
 *
 * @param {express.Request} _ - The request object (not used).
 * @param {express.Response} res - The response object.
 * @returns {express.Response} - The response object with the rendered HTML.
 */
app.get("/", (_: express.Request, res: any) => {
  let indexHTML: string = fs.readFileSync(pathFile("index.html"), "utf-8");

  let cards: string[] = [];
  for (let i = 1; i < 10; i++) {
    cards.push(cardSkeletonLoading);
  }
  const cardsHTML = cards.join("");
  indexHTML = indexHTML.replace(makeRegex("cardsSkeletonLoading"), cardsHTML);

  res.setHeader("Content-Type", "text/html");
  return res.status(200).send(indexHTML);
});

/**
 * Handles GET requests to the "/trip" URL.
 *
 * Retrieves trip data from the database based on the provided query parameter "id".
 * Sends the trip HTML page if the trip is found, otherwise sends a 404 page.
 *
 * @param {express.Request} req - The request object.
 * @param {express.Response} res - The response object.
 * @returns {Promise<express.Response>} - The response object with the rendered HTML.
 */
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

/**
 * Middleware to filter requests for static files.
 *
 * Allows access to specific paths and denies access to others.
 *
 * @param {express.Request} req - The request object.
 * @param {express.Response} res - The response object.
 * @param {express.NextFunction} next - The next middleware function.
 */
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

/**
 * Use the custom middleware
*/
app.use(staticFileFilter);

/**
 * Serves static files from the public directory.
 */
app.use(express.static(publicPath));

/**
 * Handles all other requests and sends a 404 page.
 *
 * @param {express.Request} _ - The request object (not used).
 * @param {express.Response} res - The response object.
 */
app.use((_: any, res: express.Response) => {
  const HTML404 = fs.readFileSync(pathFile("404.html"), "utf-8");
  res.status(404).send(HTML404);
});

/**
 * Starts the Express server and listens on the specified port and host.
 *
 * @param {number} port - The port number to listen on.
 * @param {string} host - The host name to listen on.
 */
app.listen(port, host, () => {
  console.log(`\n\nServer is running on http://${host}:${port}`);
});
