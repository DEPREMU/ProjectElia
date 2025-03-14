let skeletonMap: HTMLDivElement;

/**
 * Adjusts the height of the skeleton map to match the height of the trip card.
 * If the window width is less than 768 pixels, sets the height to 600 pixels.
 *
 * @remarks
 * This function assumes that `tripCardDiv` and `skeletonMap` are global variables
 * that may be initialized within the function if they are not already defined.
 *
 * @returns {void}
 */
const resizeIframeSkeleton = (): void => {
  if (!tripCardDiv)
    tripCardDiv = document.getElementById("tripCard") as HTMLDivElement;
  if (!skeletonMap)
    skeletonMap = document.getElementById("skeletonMap") as HTMLDivElement;
  let heightTripCard: number = tripCardDiv.offsetHeight;

  if (skeletonMap?.offsetHeight === heightTripCard) return;

  if (window.innerWidth < 768) heightTripCard = 600;

  skeletonMap.style.height = `${heightTripCard}px`;
};

document.addEventListener("DOMContentLoaded", () => {
  setTimeout(resizeIframeSkeleton, 500);

  window.addEventListener("resize", resizeIframeSkeleton);
});
