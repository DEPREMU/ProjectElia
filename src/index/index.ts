const mainRoute = "http://localhost:3000";
let currentPage = 1;
let itemsPerPage = 12;
let arrData: TripType[] | [] = [];
let filteredData: TripType[] | [] = [];
let body: HTMLBodyElement;
let divCards: HTMLDivElement;
let loadingData = false;
let cardsContainer: HTMLDivElement;
let firstTime = true;
let divLoading: HTMLDivElement;
let divLoaded: HTMLDivElement;
let innerHTMLSkeletonLoading: string = "";

/**
 * Fetches data from the server and renders it.
 *
 * @param {TypeGetDataEq} dict - The data to be sent in the request body.
 * @returns {Promise<void>} A promise that resolves when the data has been fetched and rendered.
 */
const getDataEq = async (dict: TypeGetDataEq): Promise<void> => {
  const res: Response = await fetch(`${mainRoute}/getTrips`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(dict),
  });
  const data: ResponseJSON = await res.json();
  await renderData(data.data || arrData || []);
};

/**
 * Asynchronously loads trip data from the server and renders it.
 *
 * This function performs the following steps:
 * 1. Fetches trip data from the "/getTrips" endpoint.
 * 2. Processes the response and updates the `arrData` array with the fetched data.
 * 3. Calls the `renderData` function to display the fetched data.
 * 4. Logs any errors that occur during the fetch operation to the console.
 *
 * @returns {Promise<void>} A promise that resolves when the data has been loaded and rendered.
 */
const loadData = async (): Promise<void> => {
  await fetch("/getTrips")
    .then((res) => res.json())
    .then((data: ResponseJSON) => {
      arrData = data.data || [];
    })
    .catch((error) => {
      console.error(error);
    });
  await renderData(arrData);
};

/**
 * Handles the scroll event to load more data when the user scrolls near the bottom of the page.
 *
 * This function checks several conditions before loading more data:
 * - If data is currently being loaded (`loadingData`) or if it's the first time loading (`firstTime`), it returns early.
 * - If there is no data in `arrData`, it returns early.
 * - It calculates the height of the container (`divCards`) and determines if the user is on a mobile device.
 * - It checks if the user has scrolled near the bottom of the container, considering different thresholds for mobile and desktop.
 * - It ensures there is more data to load based on the current page and items per page.
 *
 * If all conditions are met, it increments the current page, slices the appropriate data, and calls `renderData` to display the new data.
 *
 * @returns {Promise<void>} A promise that resolves when the data has been rendered.
 */
const handleScroll = async (): Promise<void> => {
  if (loadingData || firstTime) return;
  if (arrData.length === 0) return;

  const heightDiv = divCards.offsetHeight;
  const isMobile = window.innerWidth < 768;
  const scrollPosition = window.innerHeight + window.scrollY;

  if (scrollPosition < heightDiv - (isMobile ? 450 : 300)) return;
  if (arrData.length <= currentPage * itemsPerPage) return;
  loadingData = true;

  currentPage++;
  const data = (
    isFiltering() && filteredData.length !== 0 ? filteredData : arrData
  ).slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  await renderData(data);
};

/**
 * Asynchronously checks a list of image URLs and returns the first valid image URL.
 * A valid image URL is determined by a successful HTTP response with status 200.
 * If no valid image URL is found, a fallback image URL is returned.
 *
 * @param {string[]} images - An array of image URLs to be validated.
 * @returns {Promise<string>} - A promise that resolves to the first valid image URL or a fallback image URL.
 */
const getValidImage = async (images: string[]): Promise<string> => {
  for (const image of images) {
    try {
      const response = (await fetch(image).catch(() => null)) as Response;
      if (response.ok && response.status === 200) return image;
    } catch (error) {}
  }
  return "https://images.pexels.com/photos/1133505/pexels-photo-1133505.jpeg?cs=srgb&dl=pexels-jplenio-1133505.jpg&fm=jpg"; // Fallback image
};

/**
 * Renders trip data into the DOM.
 *
 * @param {TripType[] | []} data - An array of trip data to be rendered.
 * @param {boolean} [clearContainer=false] - A flag indicating whether to clear the container before rendering new data.
 * @returns {Promise<void>} A promise that resolves when the data has been rendered.
 *
 * @remarks
 * This function handles the rendering of trip data into a container element. It supports clearing the container before rendering new data and handles the first-time loading state. Each trip is rendered as a button element with various details such as destination, dates, budget, travel type, accommodation, and rating.
 *
 * @example
 * ```typescript
 * const trips: TripType[] = [
 *   {
 *     id: 1,
 *     destination: "Paris",
 *     continent: "Europe",
 *     startDate: "2023-01-01",
 *     endDate: "2023-01-10",
 *     budget: 1000,
 *     travelType: "Leisure",
 *     accommodation: "Hotel",
 *     rating: 4.5,
 *     images: ["paris.jpg"]
 *   }
 * ];
 * await renderData(trips, true);
 * ```
 */
const renderData = async (
  data: TripType[] | [],
  clearContainer: boolean = false
): Promise<void> => {
  loadingData = true;

  if (firstTime) await handleFirstTime();

  if (clearContainer) cardsContainer.innerHTML = "";

  let cardsLoading;
  if (data.length > 0) cardsLoading = await addCardsLoading();

  const fragment = document.createDocumentFragment();

  await Promise.all(
    data.map(async (trip, index) => {
      if (index >= currentPage * itemsPerPage) return;
      const button: HTMLButtonElement = document.createElement("button");
      button.classList.add("card");
      let image = await getValidImage(trip.images);
      button.onclick = () => {
        window.location.href = `/trip?id=${trip.id}`;
      };

      button.innerHTML = `
          <div class="cardBody">
            <img
              src="${image}"
              class="imgCard"
              alt="${trip.destination}"
            />
            <h2 class="H2Destination">${trip.destination}</h2>
            <p class="pContinent">${trip.continent}</p>
            <div class="dates">
              <p class="pStartDate">
                <span class="label">Fecha de inicio: </span>
                <span class="value">${new Date(
                  trip.startDate || ""
                ).toDateString()}</span>
              </p>
              <p class="pEndDate">
                <span class="label">Fecha de fin: </span>
                <span class="value">${new Date(
                  trip.endDate || ""
                ).toDateString()}</span>
              </p>
            </div>
          </div>
          <div class="tripDetails">
            <p class="pBudget">
              <span class="label">Presupuesto: </span>
              <span class="value">$${trip.budget}</span>
            </p>
            <p class="pTripType">
              <span class="label">Tipo de viaje: </span>
              <span class="value">${trip.travelType}</span>
            </p>
            <p class="pAccommodation">
              <span class="label">Alojamiento: </span>
              <span class="value">${trip.accommodation}</span>
            </p>
            <p class="pRating">
              <span class="label">Calificación: </span>
              <span class="value">${trip.rating}/5</span>
            </p>
          </div>
    `;

      fragment.appendChild(button);
    })
  );

  if (data.length > 0) removeCardsLoading(cardsLoading);

  cardsContainer.appendChild(fragment);

  loadingData = false;
  if (firstTime) skeletonLoading();
};

/**
 * Handles the skeleton loading animation and transitions.
 *
 * This function performs the following steps:
 * 1. Sets `firstTime` to `false`.
 * 2. Adds the "z-10" class to `divLoading`.
 * 3. After a delay of 1 second, adds the "fadeOut" class to `divLoading`.
 * 4. After an additional delay of 0.5 seconds:
 *    - Sets the body's `overflowY` style to "scroll".
 *    - Displays `divLoaded` by setting its `display` style to "flex".
 *    - Hides `divLoading` by setting its `display` style to "none".
 *    - Removes the "fadeOut" class from `divLoading`.
 */
const skeletonLoading = (): void => {
  firstTime = false;

  divLoading.classList.add("z-10");

  setTimeout(() => {
    divLoading.classList.add("fadeOut");
    setTimeout(() => {
      body.style.overflowY = "scroll";
      divLoaded.style.display = "flex";
      divLoading.style.display = "none";
      divLoading.classList.remove("fadeOut");
    }, 500);
  }, 1000);
};

/**
 * Asynchronously scrolls the window to the top of the page with a smooth behavior.
 *
 * @returns {Promise<void>} A promise that resolves when the scrolling is complete.
 */
const sendUserToStart = async (): Promise<void> => {
  window.scrollTo({ top: 0, behavior: "smooth" });
};

/**
 * Resets all the filters to their default values and re-renders the data.
 *
 * This function performs the following actions:
 * - Sets the current page to 1.
 * - Clears the filtered data array.
 * - Resets the values of various filter inputs to their default states.
 * - Calls the `renderData` function to update the displayed data.
 */
const resetFilters = (): void => {
  currentPage = 1;
  filteredData = [];

  countryCode.value = "";
  startDate.value = "";
  endDate.value = "";
  budgetMin.value = "";
  budgetMax.value = "";
  travelTypeSelect.value = "";
  accommodationSelect.value = "";
  rating.value = "-1";
  continent.value = "";
  renderData(arrData, true);
};

/**
 * Asynchronously creates and appends three loading card elements to the `cardsContainer`.
 * Each card contains skeleton elements to indicate loading state.
 *
 * @returns {Promise<{ cardLoading1: HTMLDivElement, cardLoading2: HTMLDivElement, cardLoading3: HTMLDivElement }>}
 * An object containing the three created loading card elements.
 */
const addCardsLoading = async (): Promise<{
  cardLoading1: HTMLDivElement;
  cardLoading2: HTMLDivElement;
  cardLoading3: HTMLDivElement;
}> => {
  const cardLoading1 = document.createElement("div");
  const card =
    ' <button class="card">\
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
  cardLoading1.classList.add("card");
  cardLoading1.innerHTML = card;

  const cardLoading2 = cardLoading1.cloneNode(true) as HTMLDivElement;
  const cardLoading3 = cardLoading1.cloneNode(true) as HTMLDivElement;
  cardsContainer.appendChild(cardLoading1);
  cardsContainer.appendChild(cardLoading2);
  cardsContainer.appendChild(cardLoading3);
  return { cardLoading1, cardLoading2, cardLoading3 };
};

/**
 * Handles the initial loading state of the application.
 *
 * This function performs the following actions:
 * - Hides the `divLoaded` element by setting its display style to "none".
 * - Displays the `divLoading` element by setting its display style to "flex".
 * - Disables vertical scrolling on the body by setting its overflowY style to "hidden".
 *
 * @returns {Promise<void>} A promise that resolves when the function completes.
 */
const handleFirstTime = async (): Promise<void> => {
  divLoaded.style.display = "none";
  divLoading.style.display = "flex";
  body.style.overflowY = "hidden";
};

/**
 * Removes loading cards with a fade-out effect.
 *
 * This function adds a "fadeOut" class to each of the loading cards
 * and then removes them from the DOM after a delay of 500 milliseconds.
 *
 * @param {any} cardsLoading - An object containing the loading card elements.
 * Each card element should be accessible via a key in the format `cardLoading1`, `cardLoading2`, etc.
 */
const removeCardsLoading = (cardsLoading: any): void => {
  for (let i = 1; i <= 3; i++) {
    cardsLoading[`cardLoading${i}`]?.classList?.add("fadeOut");
  }
  setTimeout(() => {
    for (let i = 1; i <= 3; i++) {
      cardsContainer.removeChild(cardsLoading[`cardLoading${i}`]);
    }
  }, 500);
};
