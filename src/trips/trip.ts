let html: HTMLHtmlElement;
let mainLoading: HTMLElement;
let mainLoaded: HTMLElement;
let tripData: TripType;
let iframeMap: HTMLElement | null;
let tripCardDiv: HTMLDivElement | null;
let imgShowed: string = "";

const makeRegex = (value: string): RegExp => {
  return new RegExp(`\\{\\{${value}\\}\\}`, "g");
};

document.addEventListener("DOMContentLoaded", () => {
  const urlParams = new URLSearchParams(window.location.search);
  const id = urlParams.get("id");

  html = document.querySelector("html") as HTMLHtmlElement;
  mainLoaded = document.getElementById("loaded") as HTMLElement;
  mainLoading = document.getElementById("loading") as HTMLElement;

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
const renderTrip = async (trip: TripType) => {
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
    }, 1000);
  }, 2000);
};

const renderError = () => {
  fetch("./Error.html")
    .then((response) => response.text())
    .then((data) => {
      html.innerHTML = data;
    })
    .catch((error) => {
      window.location.href = "/";
    });
};

const showImageLarge = (id: string) => {
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

const resizeIframe = () => {
  if (!tripCardDiv)
    tripCardDiv = document.getElementById("tripCard") as HTMLDivElement;
  if (!iframeMap) iframeMap = document.getElementById("iframeMap");

  if (!tripCardDiv || !iframeMap) return;

  let heightTripCard: number = tripCardDiv.offsetHeight;
  if (window.innerWidth < 768) heightTripCard = 600;
  iframeMap.style.height = `${heightTripCard}px`;
};

const removeImg = (id: string) => {
  const imageElement: HTMLImageElement = document.getElementById(
    id
  ) as HTMLImageElement;
  imageElement.remove();
};
