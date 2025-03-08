"use strict";
const resizeIframeSkeleton = () => {
    const tripCardDiv = document.getElementById("tripCard");
    const skeletonMap = document.getElementById("skeletonMap");
    let heightTripCard = tripCardDiv.offsetHeight;
    if (skeletonMap.offsetHeight === heightTripCard)
        return;
    if (window.innerWidth < 768)
        heightTripCard = 600;
    skeletonMap.style.height = `${heightTripCard}px`;
};
document.addEventListener("DOMContentLoaded", () => {
    setTimeout(resizeIframeSkeleton, 500);
    window.addEventListener("resize", (e) => {
        resizeIframeSkeleton();
    });
});
