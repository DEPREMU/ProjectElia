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

const getDataEq = async (dict: TypeGetDataEq) => {
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

const loadData = async () => {
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

const handleScroll = async () => {
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

const getValidImage = async (images: string[]): Promise<string> => {
  for (const image of images) {
    try {
      const response = (await fetch(image).catch(() => null)) as Response;
      if (response.ok && response.status === 200) return image;
    } catch (error) {}
  }
  return "https://images.pexels.com/photos/1133505/pexels-photo-1133505.jpeg?cs=srgb&dl=pexels-jplenio-1133505.jpg&fm=jpg"; // Fallback image
};

const renderData = async (
  data: TripType[] | [],
  clearContainer: boolean = false
) => {
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

const skeletonLoading = () => {
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

const sendUserToStart = async () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
};

const resetFilters = () => {
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

const addCardsLoading = async () => {
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

const handleFirstTime = async () => {
  divLoaded.style.display = "none";
  divLoading.style.display = "flex";
  body.style.overflowY = "hidden";
};

const removeCardsLoading = (cardsLoading: any) => {
  cardsLoading.cardLoading1.classList.add("fadeOut");
  cardsLoading.cardLoading2.classList.add("fadeOut");
  cardsLoading.cardLoading3.classList.add("fadeOut");
  setTimeout(() => {
    cardsContainer.removeChild(cardsLoading.cardLoading1);
    cardsContainer.removeChild(cardsLoading.cardLoading2);
    cardsContainer.removeChild(cardsLoading.cardLoading3);
  }, 500);
};
