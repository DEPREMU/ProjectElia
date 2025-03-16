let starsContainer: HTMLDivElement;
let stars: NodeListOf<HTMLDivElement>;
let numStars = 5;
let width: number;
let height: number;

const random = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min + 1) + min);
};

document.addEventListener("DOMContentLoaded", () => {
  starsContainer = document.getElementById("stars-container") as HTMLDivElement;
  stars = document.querySelectorAll(".star");
  width = starsContainer?.offsetWidth || 1200;
  height = starsContainer?.offsetHeight || 800;

  console.log(width, height);

  animateStars();
  setInterval(() => {
    animateStars();
  }, 2000 * numStars);
});

const animateStars = () => {
  stars.forEach((star) => {
    star.style.transition = `none`;
    star.style.opacity = "0";

    star.style.left = `${random(50, width - 50)}px`;
    star.style.top = `${random(50, height / 2.5)}px`;
  });

  for (let i = 0; i < numStars; i++) {
    setTimeout(() => {
      stars[i].style.opacity = "1";
      stars[i].style.transition = `all 2s ease, opacity 0.5s ease`;

      stars[i].style.left = `${random(0, width)}px`;
      stars[i].style.top = `${height + 100}px`;
    }, 2100 * i);
  }
};
