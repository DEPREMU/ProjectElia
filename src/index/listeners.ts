let startDate: HTMLInputElement;
let countryCode: HTMLInputElement;
let endDate: HTMLInputElement;
let budgetMin: HTMLInputElement;
let budgetMax: HTMLInputElement;
let travelTypeSelect: HTMLSelectElement;
let accommodationSelect: HTMLSelectElement;
let rating: HTMLSelectElement;
let continent: HTMLInputElement;
let label: HTMLLabelElement;
let input: HTMLInputElement;
let filterContainer: HTMLDivElement;
let navBar: HTMLElement;
let btnHideFilterContainer: HTMLButtonElement;

document.addEventListener("DOMContentLoaded", () => {
  divCards = document.getElementById("cardsContainer loaded") as HTMLDivElement;
  cardsContainer = document.getElementById(
    "cardsContainer loaded"
  ) as HTMLDivElement;
  body = document.querySelector("body") as HTMLBodyElement;
  divLoading = document.getElementById("loading") as HTMLDivElement;
  divLoaded = document.getElementById(
    "cardsContainer loaded"
  ) as HTMLDivElement;
  filterContainer = document.getElementById(
    "filterContainer"
  ) as HTMLDivElement;
  btnHideFilterContainer = document.getElementById(
    "btnHideFilterContainer"
  ) as HTMLButtonElement;

  sendUserToStart();

  body.style.overflowY = "hidden";
  divLoaded.style.display = "none";

  listeners();

  loadData();

  showFilterContainer(false);
  handleFilterContainer();
});

/**
 * Initializes event listeners for various elements on the page.
 *
 * - Sets up input elements for search, country code, date range, budget, travel type, accommodation, rating, and continent.
 * - Adds scroll and resize event listeners to handle UI adjustments.
 * - Adds click event listener to hide the filter container when clicking outside of it.
 * - Adds focus and blur event listeners to the search input to handle label animations.
 * - Adds keyup event listener to the search input to filter data based on the input value.
 * - Adds change event listeners to various input elements to trigger data filtering.
 * - Adds click event listener to the filter container toggle button to show or hide the filter container.
 */
const listeners = (): void => {
  input = document.getElementById("search") as HTMLInputElement;
  label = document.getElementById("labelSearch") as HTMLLabelElement;
  countryCode = document.getElementById("countryCode") as HTMLInputElement;
  navBar = document.getElementById("navBar") as HTMLElement;
  startDate = document.getElementById("startDate") as HTMLInputElement;
  endDate = document.getElementById("endDate") as HTMLInputElement;
  budgetMin = document.getElementById("budgetMin") as HTMLInputElement;
  budgetMax = document.getElementById("budgetMax") as HTMLInputElement;
  travelTypeSelect = document.getElementById(
    "travelTypeSelect"
  ) as HTMLSelectElement;
  accommodationSelect = document.getElementById(
    "accommodationSelect"
  ) as HTMLSelectElement;
  rating = document.getElementById("rating") as HTMLSelectElement;
  continent = document.getElementById("continent") as HTMLInputElement;

  btnHideFilterContainer.style.transition = `all 1s ease`;

  window.addEventListener("scroll", async () => await handleScroll());

  window.addEventListener("resize", async () => await handleFilterContainer());

  window.addEventListener("click", (e: MouseEvent) => {
    if (filterContainer.contains(e.target as Node)) return;
    if (btnHideFilterContainer.contains(e.target as Node)) return;
    if (e.target === filterContainer) return;
    if (e.target === btnHideFilterContainer) return;

    showFilterContainer(false);
  });

  input?.addEventListener("focus", () => {
    label.classList.add("animatedFD");
  });

  input?.addEventListener("blur", () => {
    if (input.value) return;

    label.classList.remove("animatedFD");
    label.classList.add("animatedBW");
    setTimeout(() => {
      label.classList.remove("animatedBW");
    }, 500);
  });

  input?.addEventListener("keyup", async () => {
    const value = input.value;
    sendUserToStart();
    if (value.length >= 3) return filterData(value);
    if (value.length !== 0) return;

    currentPage = 1;
    firstTime = true;
    const newArr = isFiltering()
      ? filteredData
      : arrData.slice(0, currentPage * itemsPerPage);
    await renderData(newArr, true);
  });

  countryCode?.addEventListener("change", () => {
    sendUserToStart();
    filterData();
  });

  startDate?.addEventListener("change", () => {
    sendUserToStart();
    filterData();
  });

  endDate?.addEventListener("change", () => {
    sendUserToStart();
    filterData();
  });

  budgetMin?.addEventListener("change", () => {
    sendUserToStart();
    filterData();
  });

  budgetMax?.addEventListener("change", () => {
    sendUserToStart();
    filterData();
  });

  travelTypeSelect?.addEventListener("change", () => {
    sendUserToStart();
    filterData();
  });

  accommodationSelect?.addEventListener("change", () => {
    sendUserToStart();
    filterData();
  });

  rating?.addEventListener("change", () => {
    sendUserToStart();
    filterData();
  });

  continent?.addEventListener("change", () => {
    sendUserToStart();
    filterData();
  });

  btnHideFilterContainer?.addEventListener("click", () => {
    if (filterContainer.classList.contains("hideFilterContainer"))
      showFilterContainer(true);
    else showFilterContainer(false);
  });
};

/**
 * Filters data based on the provided search criteria and updates the UI with the filtered results.
 *
 * @param {string | null} [search=null] - The search term to filter the data. If null, the value from the input field is used.
 * @returns {Promise<void>} - A promise that resolves when the data has been filtered and rendered.
 *
 * The function sends a POST request to the "/getTrips" endpoint with the following parameters:
 * - `destination`: The search term or input value.
 * - `countryCode`: The selected country code or null.
 * - `startDate`: The selected start date or null.
 * - `endDate`: The selected end date or null.
 * - `minBudget`: The minimum budget or -1 if not specified.
 * - `maxBudget`: The maximum budget or -1 if not specified.
 * - `travelType`: The selected travel type or null.
 * - `accommodation`: The selected accommodation type or null.
 * - `rating`: The selected rating (0-5) or null if not within the range.
 * - `continent`: The selected continent or null.
 *
 * The response is expected to be in JSON format and contain a `data` field which is an array or a single object.
 * The filtered data is then sliced based on the current page and items per page, and rendered to the UI.
 */
const filterData = async (search: string | null = null): Promise<void> => {
  filteredData = await fetch("/getTrips", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      destination: search ?? input.value,
      countryCode: countryCode.value ?? null,
      startDate: startDate.value ?? null,
      endDate: endDate.value ?? null,
      minBudget: Number(budgetMin.value) || -1,
      maxBudget: Number(budgetMax.value) || -1,
      travelType: travelTypeSelect.value ?? null,
      accommodation: accommodationSelect.value ?? null,
      rating:
        Number(rating.value) in [0, 1, 2, 3, 4, 5]
          ? Number(rating.value)
          : null,
      continent: continent.value ?? null,
    }),
  })
    .then((res) => res.json())
    .then((data: ResponseJSON) =>
      !data.data ? [] : Array.isArray(data.data) ? data.data : [data.data]
    );

  currentPage = 1;
  firstTime = true;
  loadingData = true;
  await renderData(filteredData.slice(0, currentPage * itemsPerPage), true);
};

/**
 * Handles the display and positioning of the filter container.
 *
 * This function adjusts the top position and height of the filter container
 * based on the height of the navigation bar. It also ensures that the filter
 * container is hidden on smaller screens (width less than 768px) and displays
 * the button to hide the filter container.
 *
 * @returns {Promise<void>} A promise that resolves when the function completes.
 */
const handleFilterContainer = async (): Promise<void> => {
  const heightNavBar = navBar.offsetHeight;
  if (window.innerWidth < 768) showFilterContainer(false);

  filterContainer.style.top = `${heightNavBar}px`;
  filterContainer.style.height = `calc(100% - ${heightNavBar}px)`;
  btnHideFilterContainer.style.display = "block";
};

/**
 * Toggles the visibility of the filter container and updates the button's rotation.
 *
 * @param show - A boolean indicating whether to show or hide the filter container.
 *               If true, the filter container is shown and the button is rotated to 180 degrees.
 *               If false, the filter container is hidden and the button is rotated to 0 degrees.
 */
const showFilterContainer = (show: boolean): void => {
  const width = btnHideFilterContainer?.offsetWidth;
  if (show) {
    btnHideFilterContainer.style.left = `-${width}px`;
    filterContainer?.classList.remove("hideFilterContainer");
    filterContainer?.classList.add("showFilterContainer");
    return;
  }
  btnHideFilterContainer.style.left = `0px`;
  setTimeout(()=>{
    btnHideFilterContainer.style.display = "block";
  },1000)
  filterContainer?.classList.add("hideFilterContainer");
  filterContainer?.classList.remove("showFilterContainer");
};

/**
 * Determines if any of the filtering criteria are set.
 *
 * @returns {boolean} - Returns `true` if any of the following conditions are met:
 * - The input value length is greater than 2.
 * - The country code is set.
 * - The start date is set.
 * - The end date is set.
 * - The minimum budget is set.
 * - The maximum budget is set.
 * - The travel type is selected.
 * - The accommodation type is selected.
 * - The rating is set and greater than -1.
 * - The continent is set.
 */
const isFiltering = (): boolean => {
  return (
    input?.value.length > 2 ||
    !!countryCode?.value ||
    !!startDate?.value ||
    !!endDate?.value ||
    !!budgetMin?.value ||
    !!budgetMax?.value ||
    !!travelTypeSelect?.value ||
    !!accommodationSelect?.value ||
    (rating?.value && Number(rating.value) > -1) ||
    !!continent?.value
  );
};
