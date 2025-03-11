"use strict";
let startDate;
let countryCode;
let endDate;
let budgetMin;
let budgetMax;
let travelTypeSelect;
let accommodationSelect;
let rating;
let continent;
let label;
let input;
let filterContainer;
let navBar;
let btnHideFilterContainer;
document.addEventListener("DOMContentLoaded", () => {
    divCards = document.getElementById("cardsContainer loaded");
    cardsContainer = document.getElementById("cardsContainer loaded");
    body = document.querySelector("body");
    divLoading = document.getElementById("loading");
    divLoaded = document.getElementById("cardsContainer loaded");
    filterContainer = document.getElementById("filterContainer");
    btnHideFilterContainer = document.getElementById("btnHideFilterContainer");
    sendUserToStart();
    body.style.overflowY = "hidden";
    divLoaded.style.display = "none";
    listeners();
    loadData();
    showFilterContainer(false);
    handleFilterContainer();
});
const listeners = () => {
    input = document.getElementById("search");
    label = document.getElementById("labelSearch");
    countryCode = document.getElementById("countryCode");
    navBar = document.getElementById("navBar");
    startDate = document.getElementById("startDate");
    endDate = document.getElementById("endDate");
    budgetMin = document.getElementById("budgetMin");
    budgetMax = document.getElementById("budgetMax");
    travelTypeSelect = document.getElementById("travelTypeSelect");
    accommodationSelect = document.getElementById("accommodationSelect");
    rating = document.getElementById("rating");
    continent = document.getElementById("continent");
    btnHideFilterContainer.style.transition = `all 1s ease`;
    window.addEventListener("scroll", async () => await handleScroll());
    window.addEventListener("resize", async () => await handleFilterContainer());
    window.addEventListener("click", (e) => {
        if (filterContainer.contains(e.target))
            return;
        if (btnHideFilterContainer.contains(e.target))
            return;
        if (e.target === filterContainer)
            return;
        if (e.target === btnHideFilterContainer)
            return;
        showFilterContainer(false);
    });
    input?.addEventListener("focus", () => {
        label.classList.add("animatedFD");
    });
    input?.addEventListener("blur", () => {
        if (input.value)
            return;
        label.classList.remove("animatedFD");
        label.classList.add("animatedBW");
        setTimeout(() => {
            label.classList.remove("animatedBW");
        }, 500);
    });
    input?.addEventListener("keyup", async () => {
        const value = input.value;
        sendUserToStart();
        if (value.length >= 3)
            return filterData(value);
        if (value.length !== 0)
            return;
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
        else
            showFilterContainer(false);
    });
};
const filterData = async (search = null) => {
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
            rating: Number(rating.value) in [0, 1, 2, 3, 4, 5]
                ? Number(rating.value)
                : null,
            continent: continent.value ?? null,
        }),
    })
        .then((res) => res.json())
        .then((data) => !data.data ? [] : Array.isArray(data.data) ? data.data : [data.data]);
    currentPage = 1;
    firstTime = true;
    loadingData = true;
    await renderData(filteredData.slice(0, currentPage * itemsPerPage), true);
};
const handleFilterContainer = async () => {
    const heightNavBar = navBar.offsetHeight;
    if (window.innerWidth < 768)
        showFilterContainer(false);
    filterContainer.style.top = `${heightNavBar}px`;
    filterContainer.style.height = `calc(100% - ${heightNavBar}px)`;
    btnHideFilterContainer.style.display = "block";
};
const showFilterContainer = (show) => {
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
const isFiltering = () => {
    return (input?.value.length > 2 ||
        !!countryCode?.value ||
        !!startDate?.value ||
        !!endDate?.value ||
        !!budgetMin?.value ||
        !!budgetMax?.value ||
        !!travelTypeSelect?.value ||
        !!accommodationSelect?.value ||
        (rating?.value && Number(rating.value) > -1) ||
        !!continent?.value);
};
