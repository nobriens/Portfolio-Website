document.addEventListener("DOMContentLoaded", () => {
  const img = document.getElementById("ridewise-img");
  if (!img) return;

  const images = [
    "images/ridewise1.png",
    "images/ridewisehero.png",
    "images/ridewise5.png",
    "images/ridewise6.png"
  ];
  
  images.forEach(src => { // This was used to reduce the flicker between images
  const i = new Image();
  i.src = src;
});

  let index = 0;
  let intervalId = null;
  let startTimeout = null;

  function fadeToNextImage() {
    img.style.opacity = 0;

    setTimeout(() => {
      index = (index + 1) % images.length;
      img.src = images[index];
      img.style.opacity = 1;
    }, 500); // Fade duration
  }

  img.addEventListener("mouseenter", () => {
    startTimeout = setTimeout(() => {
      intervalId = setInterval(fadeToNextImage, 3000); // Loops every 2 seconds
    }, 200); // This is the delay before starting 
  });

  img.addEventListener("mouseleave", () => {
    clearInterval(intervalId);
    clearTimeout(startTimeout);

    intervalId = null;
    startTimeout = null;

    // Resets to first image
    index = 0;

    img.style.opacity = 0;
    setTimeout(() => {
      img.src = images[index];
      img.style.opacity = 1;
    }, 500);
  });
});
