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

const listeners = () => {
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

const filterData = async (search: string | null = null) => {
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

const handleFilterContainer = async () => {
  const heightNavBar = navBar.offsetHeight;
  if (window.innerWidth < 768) showFilterContainer(false);

  filterContainer.style.top = `${heightNavBar}px`;
  filterContainer.style.height = `calc(100% - ${heightNavBar}px)`;
  btnHideFilterContainer.style.display = "block";
};

const showFilterContainer = (show: boolean) => {
  if (show) {
    filterContainer?.classList.remove("hideFilterContainer");
    filterContainer?.classList.add("showFilterContainer");
    btnHideFilterContainer.classList.remove("rotate0deg");
    btnHideFilterContainer.classList.add("rotate180deg");
    return;
  }
  btnHideFilterContainer.classList.add("rotate0deg");
  btnHideFilterContainer.classList.remove("rotate180deg");
  filterContainer?.classList.add("hideFilterContainer");
  filterContainer?.classList.remove("showFilterContainer");
};

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
