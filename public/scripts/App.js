import fs from "fs";
import path from "path";
import { supabase } from "./supabaseClient.js";
import { fileURLToPath } from "url";
import app, { port, host } from "./API.js";
import express from "express";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
//? __dirname = F:\XAMPP\htdocs\ProjectElia\public\scripts
const publicPath = __dirname.split("\\").slice(0, -1).join("\\");
const pathFile = (file) => path.join(publicPath, file);
app.get("/", (_, res) => {
    let indexHTML = fs.readFileSync(pathFile("index.html"), "utf-8");
    const replacer = '<div class="cardsContainer" id="loading">';
    const card = ' <button class="card">\
        <div class="cardBody">\
        <div class="skeleton skeleton-img"></div>\
        <h2 class="skeleton skeleton-title"></h2>\
            <p class="skeleton skeleton-text"></p>\
            <div class="dates">\
              <div class="skeleton-dates">\
                <p class="skeleton skeleton-text-dates"></p>\
                <p class="skeleton skeleton-text-dates"></p>\
              </div>\
              <div class="skeleton-dates">\
                <p class="skeleton skeleton-text-dates"></p>\
                <p class="skeleton skeleton-text-dates"></p>\
              </div>\
            </div>\
          </div>\
          <div class="tripDetails">\
            <p class="skeleton skeleton-details"></p>\
            <p class="skeleton skeleton-details"></p>\
            <p class="skeleton skeleton-details"></p>\
            <p class="skeleton skeleton-details"></p>\
          </div>\
        </button>';
    let newContainer = replacer;
    for (let i = 1; i < 10; i++) {
        newContainer += card;
    }
    indexHTML = indexHTML.replace(replacer, newContainer);
    res.setHeader("Content-Type", "text/html");
    return res.status(200).send(indexHTML);
});
app.get("/trip", async (req, res) => {
    const { id } = req.query;
    if (!id) {
        const HTML404 = fs.readFileSync(pathFile("404.html"), "utf-8");
        res.setHeader("Content-Type", "text/html");
        return res.status(404).send(HTML404);
    }
    const { data: trip, error } = await supabase
        .from("trips")
        .select("*")
        .eq("id", id);
    if (error || !trip || trip.length === 0) {
        const HTML404 = fs.readFileSync(pathFile("404.html"), "utf-8");
        res.setHeader("Content-Type", "text/html");
        return res.status(404).send(HTML404);
    }
    const tripHTML = fs.readFileSync(pathFile("trips/index.html"), "utf-8");
    res.setHeader("Content-Type", "text/html");
    return res.status(200).send(tripHTML);
});
app.use(express.static(publicPath));
app.use((_, res) => {
    const HTML404 = fs.readFileSync(pathFile("404.html"), "utf-8");
    res.setHeader("Content-Type", "text/html");
    res.status(404).send(HTML404);
});
app.listen(port, host, () => {
    console.log(`Server is running on http://${host}:${port}`);
});
