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

  body.style.overflowY = "hidden";
  divLoaded.style.display = "none";

  listeners();

  loadData();

  showFilterContainer(false);
  handleFilterContainer();

  window.addEventListener("scroll", async () => await handleScroll());

  window.addEventListener("resize", async () => await handleFilterContainer());
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
  filterContainer = document.getElementById(
    "filterContainer"
  ) as HTMLDivElement;
  btnHideFilterContainer = document.getElementById(
    "btnHideFilterContainer"
  ) as HTMLButtonElement;

  btnHideFilterContainer.style.transition = `all 1s ease`;

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
    if (value.length === 0) {
      currentPage = 1;
      firstTime = true;
      const newArr = Array.isArray(arrData)
        ? arrData.slice(0, currentPage * itemsPerPage)
        : [arrData];
      await renderData(newArr, true);
      return;
    }
    if (value.length < 3) return;
    search(value);
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

const filterData = async () => {
  filteredData = (
    searchData.length > 0
      ? searchData
      : Array.isArray(arrData)
      ? arrData
      : [arrData]
  ).filter((item) => boolFiltering(item));

  currentPage = 1;
  firstTime = true;
  loadingData = true;
  await renderData(filteredData.slice(0, currentPage * itemsPerPage), true);
};

const boolFiltering = (item: TripType) => {
  const startDateVal = startDate.value ? new Date(startDate.value) : null;
  const endDateVal = endDate.value ? new Date(endDate.value) : null;
  const itemStartDate = new Date(item.startDate);
  const itemEndDate = new Date(item.endDate);

  const budgetMinVal = budgetMin.value ? parseFloat(budgetMin.value) : null;
  const budgetMaxVal = budgetMax.value ? parseFloat(budgetMax.value) : null;
  const ratingVal = rating.value ? parseInt(rating.value) : null;

  const matchesStrict =
    (countryCode.value ? item.countryCode === countryCode.value : true) &&
    (startDateVal ? itemStartDate >= startDateVal : true) &&
    (endDateVal ? itemEndDate <= endDateVal : true) &&
    (budgetMinVal ? item.budget >= budgetMinVal : true) &&
    (budgetMaxVal ? item.budget <= budgetMaxVal : true) &&
    (travelTypeSelect.value
      ? item.travelType === travelTypeSelect.value
      : true) &&
    (accommodationSelect.value
      ? item.accommodation === accommodationSelect.value
      : true) &&
    (ratingVal ? item.rating === ratingVal : true) &&
    (continent.value ? item.continent === continent.value : true);

  return matchesStrict;
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
    showBtnHideFilterContainer(false);
    return;
  }
  btnHideFilterContainer.classList.add("rotate0deg");
  btnHideFilterContainer.classList.remove("rotate180deg");
  filterContainer?.classList.add("hideFilterContainer");
  filterContainer?.classList.remove("showFilterContainer");
  showBtnHideFilterContainer(true);
};

const showBtnHideFilterContainer = (hiddenFilter: boolean) => {
  const heightFilterContainer =
    filterContainer.offsetHeight + filterContainer.offsetTop;
  const widthFilterContainer = filterContainer.offsetWidth;

  btnHideFilterContainer.style.top = (heightFilterContainer - 20) / 2 + `px`;
  btnHideFilterContainer.style.left = `${
    hiddenFilter ? "-5" : widthFilterContainer - 20
  }px`;
  let timer: NodeJS.Timeout;
  if (hiddenFilter && btnHideFilterContainer.offsetLeft !== -5)
    timer = setTimeout(() => showBtnHideFilterContainer(true), 1);
  else if (
    !hiddenFilter &&
    btnHideFilterContainer.offsetLeft !== widthFilterContainer
  )
    timer = setTimeout(() => showBtnHideFilterContainer(false), 1);

  return () => clearTimeout(timer);
};
