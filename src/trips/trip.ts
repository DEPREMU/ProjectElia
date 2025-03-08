let html: HTMLHtmlElement;
let mainLoading: HTMLElement;
let mainLoaded: HTMLElement;
let imgShowed: string = "";

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

      if (Array.isArray(data.data)) {
        if (data.data.length === 1) return renderTrip(data.data[0]);
        else return renderError();
      }

      if (data.data) return renderTrip(data.data);
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
  htmlTrip = htmlTrip
    .replace(/{{destination}}/g, trip.destination)
    .replace(/{{countryCode}}/g, trip.countryCode)
    .replace(/{{continent}}/g, trip.continent)
    .replace(/{{climate}}/g, trip.climate)
    .replace(/{{season}}/g, trip.season)
    .replace(/{{travelType}}/g, trip.travelType)
    .replace(/{{accommodation}}/g, trip.accommodation)
    .replace(/{{rating}}/g, trip.rating.toString())
    .replace(/{{budget}}/g, `$${trip.budget.toFixed(2)}`)
    .replace(/{{lat}}/g, trip.coords.lat.toString())
    .replace(/{{lon}}/g, trip.coords.lon.toString());

  // Formatear fechas
  htmlTrip = htmlTrip.replace(
    /{{startDate}}/g,
    new Date(trip.startDate).toDateString()
  );
  htmlTrip = htmlTrip.replace(
    /{{endDate}}/g,
    new Date(trip.endDate).toDateString()
  );

  // Obtener imagen principal válida
  const mainImage = await getValidImage(trip.images);
  htmlTrip = htmlTrip.replace(/{{mainImage}}/g, mainImage);

  // Clima y consejos
  htmlTrip = htmlTrip.replace(
    /{{tipsClimate}}/g,
    trip.travelTips.tipsClimate[trip.climate] || "No hay consejos específicos."
  );

  html.title = trip.destination;

  const tipsGeneralList = trip.travelTips.tipsGeneral
    .map((tip) => (tip ? `<li>${tip}</li>` : ""))
    .join("");

  htmlTrip = htmlTrip.replace(
    /{{tipsGeneral}}/g,
    tipsGeneralList || "No hay consejos generales."
  );

  // Lista de cosas por hacer
  const thingsToDoList = trip.thingsToDo
    .map((activity) => `<li>${activity}</li>`)
    .join("");
  htmlTrip = htmlTrip.replace(/{{thingsToDo}}/g, thingsToDoList);

  // Generar carrusel de imágenes
  const newImages = trip.images.filter((image) => image !== mainImage);
  const carruselImages = newImages
    .map((image, index) => {
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
    .join("");

  htmlTrip = htmlTrip.replace(/{{carruselImages}}/g, carruselImages);

  // Agregar opiniones
  htmlTrip = htmlTrip.replace(
    /{{opinions}}/g,
    trip.notes || "Sin opiniones disponibles."
  );

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
  const tripCardDiv: HTMLDivElement = document.getElementById(
    "tripCard"
  ) as HTMLDivElement;
  const iframeMap: HTMLDivElement = document.getElementById(
    "iframeMap"
  ) as HTMLDivElement;

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
