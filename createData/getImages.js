import puppeteer from "puppeteer";
import fs from "fs";
import { log } from "console";

const destination = JSON.parse(fs.readFileSync("destination.json", "utf8"));

let browser;
let page;

try {
  browser = await puppeteer.launch({ headless: false }); // Cambia a false para ver el navegador
  page = await browser.newPage();
} catch (error) {
  console.error("Error launching browser:", error);
  process.exit(1);
}

const getImages = async (page, search) => {
  try {
    const link = `https://www.google.com/search?q=${search}&tbm=isch`;
    await page.goto(link);
    const pageHTML = await page.content();
    const images = pageHTML.match(/https:\/\/[^"]+\.jpg/g);
    return images;
  } catch (error) {
    console.error("Error getting images:", error);
    return [];
  }
};

const scrapeImages = async () => {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();

  const images = {};

  for (const city of Object.keys(destination)) {
    const search = `${city.replace(" ", "+")}+city`;
    console.log(`🔍 Searching images for: ${city}`);

    images[city] = await getImages(page, search);

    // Delay between searches to avoid bot detection
    await new Promise((resolve) => setTimeout(resolve, 3000));
  }

  // Save images to file
  fs.writeFileSync("images.json", JSON.stringify(images, null, 2), "utf8");

  await browser.close();
  console.log("✅ Scraping completed!");
};

scrapeImages();
