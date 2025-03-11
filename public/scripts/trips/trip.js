"use strict";
let html;
let mainLoading;
let mainLoaded;
let tripData;
let iframeMap;
let tripCardDiv;
let imgShowed = "";
const makeRegex = (value) => {
    return new RegExp(`\\{\\{${value}\\}\\}`, "g");
};
document.addEventListener("DOMContentLoaded", () => {
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get("id");
    html = document.querySelector("html");
    mainLoaded = document.getElementById("loaded");
    mainLoading = document.getElementById("loading");
    fetch(`/getTrips`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ id }),
    })
        .then((res) => res.json())
        .then((data) => {
        if (data.error || !data.data)
            return renderError();
        if (!data.data)
            return;
        tripData = data.data[0];
        renderTrip(data.data[0]);
    })
        .catch((error) => {
        console.error(error);
    });
    setTimeout(resizeIframe, 4000);
    window.addEventListener("resize", (e) => {
        resizeIframe();
    });
});
const renderTrip = async (trip) => {
    let htmlTrip = await fetch("trips/trip.html")
        .then((res) => res.text())
        .catch(() => renderError());
    if (!htmlTrip)
        return;
    // Reemplazar valores básicos
    const replacements = {
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
        tipsClimate: trip.travelTips.tipsClimate[trip.climate] ||
            "No hay consejos específicos.",
        tipsGeneral: trip.travelTips.tipsGeneral
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
    const newImages = trip.images.filter((image) => image !== replacements.mainImage);
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
const showImageLarge = (id) => {
    const mainImage = document.getElementById("mainImage");
    const newImage = document.getElementById(id);
    const srcMainImage = mainImage.src;
    const srcNewImage = newImage.src;
    mainImage.src = srcNewImage;
    newImage.src = srcMainImage;
    setTimeout(resizeIframe, 1000);
};
const resizeIframe = () => {
    if (!tripCardDiv)
        tripCardDiv = document.getElementById("tripCard");
    if (!iframeMap)
        iframeMap = document.getElementById("iframeMap");
    if (!tripCardDiv || !iframeMap)
        return;
    let heightTripCard = tripCardDiv.offsetHeight;
    if (window.innerWidth < 768)
        heightTripCard = 600;
    iframeMap.style.height = `${heightTripCard}px`;
};
const removeImg = (id) => {
    const imageElement = document.getElementById(id);
    imageElement.remove();
};
