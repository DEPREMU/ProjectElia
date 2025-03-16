let html: HTMLHtmlElement;
let mainLoading: HTMLElement;
let mainLoaded: HTMLElement;
let tripData: TripType;
let iframeMap: HTMLElement | null;
let tripCardDiv: HTMLDivElement | null;
let imgShowed: string = "";

/**
 * Creates a regular expression to match a specific pattern.
 *
 * The pattern is defined as `{{value}}`, where `value` is the input string.
 * The resulting regular expression will match all occurrences of this pattern
 * in a given string.
 *
 * @param value - The string to be used within the pattern.
 * @returns A global regular expression that matches the pattern `{{value}}`.
 */
const makeRegex = (value: string): RegExp => {
  return new RegExp(`\\{\\{${value}\\}\\}`, "g");
};

document.addEventListener("DOMContentLoaded", () => {
  const urlParams = new URLSearchParams(window.location.search);
  const id = urlParams.get("id");

  html = document.querySelector("html") as HTMLHtmlElement;
  mainLoaded = document.getElementById("loaded") as HTMLElement;
  mainLoading = document.getElementById("loading") as HTMLElement;
  tripCardDiv = document.getElementById("tripCard") as HTMLDivElement;
  iframeMap = document.getElementById("iframeMap") as HTMLElement;

  fetch(`/getTrips`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ id }),
  })
    .then((res) => res.json())
    .then((data: ResponseJSON) => {
      if (data.error || !data.data) return renderError();

      if (!data.data) return;
      tripData = data.data[0];
      renderTrip(data.data[0]);
    })
    .catch((error) => {
      console.error(error);
    });
  setTimeout(resizeIframe, 4000);

  window.addEventListener("resize", (e: UIEvent) => {
    resizeIframe();
  });
});

/**
 * Renders the trip details by fetching the trip HTML template, replacing placeholders with trip data,
 * and updating the DOM with the rendered HTML.
 *
 * @param {TripType} trip - The trip data to be rendered.
 * @returns {Promise<void>} A promise that resolves when the trip details have been rendered.
 *
 * @async
 * @function
 *
 * @description
 * This function performs the following steps:
 * 1. Fetches the trip HTML template.
 * 2. Replaces placeholders in the template with actual trip data.
 * 3. Generates a carousel of images for the trip.
 * 4. Updates the document title and favicon.
 * 5. Handles loading and transition effects for the main content.
 *
 * @example
 * const trip = {
 *   destination: "Paris",
 *   countryCode: "FR",
 *   continent: "Europe",
 *   climate: "Temperate",
 *   season: "Spring",
 *   travelType: "Leisure",
 *   accommodation: "Hotel",
 *   rating: 4.5,
 *   budget: 1200.00,
 *   coords: { lat: 48.8566, lon: 2.3522 },
 *   startDate: "2023-04-01",
 *   endDate: "2023-04-10",
 *   images: ["image1.jpg", "image2.jpg"],
 *   travelTips: {
 *     tipsClimate: { Temperate: "Pack light jackets." },
 *     tipsGeneral: ["Visit the Eiffel Tower.", "Try local cuisine."]
 *   },
 *   thingsToDo: ["Sightseeing", "Museum visits"],
 *   notes: "Great trip overall!"
 * };
 *
 * renderTrip(trip);
 */
const renderTrip = async (trip: TripType): Promise<void> => {
  let htmlTrip = await fetch("trips/trip.html")
    .then((res) => res.text())
    .catch(() => renderError());

  if (!htmlTrip) return;

  // Reemplazar valores básicos
  const replacements: { [key: string]: any } = {
    destination: trip.destination,
    countryCode: trip.countryCode,
    continent: trip.continent,
    climate: trip.climate,
    season: trip.season,
    travelType: trip.travelType,
    accommodation: trip.accommodation,
    rating: trip.rating.toString(),
    budget: `$${trip.budget.toFixed(2)}`,
    lat: trip.coords.lat.toString(),
    lon: trip.coords.lon.toString(),
    startDate: new Date(trip.startDate).toDateString(),
    endDate: new Date(trip.endDate).toDateString(),
    mainImage: (await getValidImage(trip.images)) || trip.images[0],
    tipsClimate:
      trip.travelTips.tipsClimate[trip.climate] ||
      "No hay consejos específicos.",
    tipsGeneral:
      trip.travelTips.tipsGeneral
        .map((tip) => (tip ? `<li>${tip}</li>` : ""))
        .join("") || "No hay consejos generales.",
    thingsToDo: trip.thingsToDo
      .map((activity) => `<li>${activity}</li>`)
      .join(""),
    opinions: trip.notes || "Sin opiniones disponibles.",
  };

  for (const key in replacements) {
    htmlTrip = htmlTrip.replace(makeRegex(key), replacements[key]);
  }

  // Generar carrusel de imágenes
  const newImages = trip.images.filter(
    (image: string) => image !== replacements.mainImage
  );
  const carruselImages = newImages
    .map((image: string, index: number) => {
      const idImg = `imageCarrusel${index + 1}`;
      const idBtn = `btn${index + 1}`;
      return `
        <button
            id="${idBtn}"  
            onclick="showImageLarge('${idImg}')"
        >
          <img
            id="${idImg}" 
            src="${image}" 
            alt="${trip.destination}_${index + 1}" 
            class="tripImageCarrusel"
            onerror = "removeImg('${idBtn}')" 
            loading="${index > 5 ? "lazy" : "eager"}"
          />
        </button>
      `;
    })
    .filter(Boolean)
    .join("");

  htmlTrip = htmlTrip.replace(makeRegex("carruselImages"), carruselImages);

  document.title = `${trip.destination} - ${trip.budget}`;
  const link = document.createElement("link");
  link.rel = "icon";
  link.href = replacements.mainImage;
  link.style.borderRadius = "50%";
  document.head.appendChild(link);

  mainLoading.classList.add("posAbsolute");
  mainLoading.classList.add("z-10");

  mainLoaded.innerHTML = htmlTrip;
  mainLoaded.classList.add("z-0");
  mainLoaded.classList.remove("posAbsolute");
  setTimeout(() => {
    mainLoading.classList.add("fadeOut");
    setTimeout(() => {
      mainLoading.remove();
      tripCardDiv = document.getElementById("tripCard") as HTMLDivElement;
      iframeMap = document.getElementById("iframeMap") as HTMLElement;
    }, 1000);
  }, 2000);
};

/**
 * Fetches the Error.html file and sets its content to the innerHTML of the `html` element.
 * If an error occurs during the fetch, it redirects the user to the home page.
 *
 * @function
 * @name renderError
 */
const renderError = (): void => {
  fetch("./Error.html")
    .then((response) => response.text())
    .then((data) => {
      html.innerHTML = data;
    })
    .catch((error) => {
      window.location.href = "/";
    });
};

/**
 * Swaps the source of the main image with the source of a new image identified by the given ID.
 * After swapping the images, it triggers the `resizeIframe` function after a delay of 1 second.
 *
 * @param id - The ID of the new image element to swap with the main image.
 */
const showImageLarge = (id: string): void => {
  const mainImage: HTMLImageElement = document.getElementById(
    "mainImage"
  ) as HTMLImageElement;
  const newImage: HTMLImageElement = document.getElementById(
    id
  ) as HTMLImageElement;

  const srcMainImage: string = mainImage.src;
  const srcNewImage: string = newImage.src;

  mainImage.src = srcNewImage;
  newImage.src = srcMainImage;
  setTimeout(resizeIframe, 1000);
};

/**
 * Adjusts the height of an iframe element to match the height of a trip card element.
 * If the window width is less than 768 pixels, the height of the trip card is set to 600 pixels.
 *
 * The function first checks if the `tripCardDiv` and `iframeMap` elements are already defined.
 * If not, it attempts to retrieve them from the DOM using their respective IDs.
 * If either element is not found, the function exits early.
 *
 * The height of the `tripCardDiv` element is then used to set the height of the `iframeMap` element.
 *
 * @remarks
 * This function assumes that the `tripCardDiv` and `iframeMap` elements exist in the DOM
 * and have the IDs "tripCard" and "iframeMap", respectively.
 */
const resizeIframe = (): void => {
  if (!tripCardDiv || !iframeMap) return;

  let heightTripCard: number = tripCardDiv.offsetHeight || 800;
  if (window.innerWidth < 768) heightTripCard = 600;
  iframeMap.style.height = `${heightTripCard}px`;
};

/**
 * Removes an image element from the DOM based on the provided ID.
 *
 * @param id - The ID of the image element to be removed.
 */
const removeImg = (id: string): void => {
  const imageElement: HTMLImageElement = document.getElementById(
    id
  ) as HTMLImageElement;
  imageElement.remove();
};
