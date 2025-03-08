const resizeIframeSkeleton = () => {
  const tripCardDiv: HTMLDivElement = document.getElementById(
    "tripCard"
  ) as HTMLDivElement;
  const skeletonMap: HTMLDivElement = document.getElementById(
    "skeletonMap"
  ) as HTMLDivElement;
  let heightTripCard: number = tripCardDiv.offsetHeight;

  if (skeletonMap.offsetHeight === heightTripCard) return;

  if (window.innerWidth < 768) heightTripCard = 600;

  skeletonMap.style.height = `${heightTripCard}px`;
};

document.addEventListener("DOMContentLoaded", () => {
  setTimeout(resizeIframeSkeleton, 500);

  window.addEventListener("resize", (e: UIEvent) => {
    resizeIframeSkeleton();
  });
});
