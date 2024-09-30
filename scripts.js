const container = document.querySelector(".container");
const containerCarrousel = container.querySelector(".container-carrousel");
const carrousel = container.querySelector(".carrousel");
const carrouselItems = carrousel.querySelectorAll(".carrousel-item");
const indicatorsContainer = document.querySelector(".carousel-indicators"); // Conteneur des points

let isMouseDown = false;
let currentMousePos = 0;
let lastMousePos = 0;
let lastMoveTo = 0;
let moveTo = 0;
const numItems = carrouselItems.length; // Nombre d'éléments

// Crée les points d'indicateur en bas
const createIndicators = () => {
    for (let i = 0; i < numItems; i++) {
        const indicator = document.createElement("div");
        if (i === 0) indicator.classList.add("active"); // Le premier élément est actif au départ
        indicator.dataset.index = i;
        indicator.addEventListener("click", () => goToIndex(i));
        indicatorsContainer.appendChild(indicator);
    }
};

// Met à jour l'état des points
const updateIndicators = index => {
    document.querySelectorAll(".carousel-indicators div").forEach((dot, i) => {
        dot.classList.toggle("active", i === index);
    });
};

// Aller à un index spécifique dans le carrousel
const goToIndex = index => {
    const degreesPerItem = 360 / numItems;
    moveTo = -degreesPerItem * index;
    updateIndicators(index);
};

// Fonction pour créer le carrousel
const createCarrousel = () => {
    const carrouselProps = onResize();
    const length = carrouselItems.length;
    const degrees = 360 / length;
    const gap = 20;
    const tz = distanceZ(carrouselProps.w, length, gap);

    const height = calculateHeight(tz);

    container.style.width = tz * 2 + gap * length + "px";
    container.style.height = height + "px";

    carrouselItems.forEach((item, i) => {
        const degreesByItem = degrees * i + "deg";
        item.style.setProperty("--rotatey", degreesByItem);
        item.style.setProperty("--tz", tz + "px");
    });
};

// Fonction de mise à jour du carrousel
const update = () => {
    lastMoveTo = lerp(moveTo, lastMoveTo, 0.05);
    carrousel.style.setProperty("--rotatey", lastMoveTo + "deg");

    const currentIndex = Math.round(-lastMoveTo / (360 / numItems)) % numItems;
    updateIndicators((currentIndex + numItems) % numItems); // pour éviter les valeurs négatives

    requestAnimationFrame(update);
};

// Initialisation des événements
const initEvents = () => {
    carrousel.addEventListener("mousedown", () => {
        isMouseDown = true;
        carrousel.style.cursor = "grabbing";
    });
    carrousel.addEventListener("mouseup", () => {
        isMouseDown = false;
        carrousel.style.cursor = "grab";
    });
    container.addEventListener("mouseleave", () => (isMouseDown = false));

    carrousel.addEventListener(
        "mousemove",
        e => isMouseDown && getPosX(e.clientX)
    );

    carrousel.addEventListener("touchstart", () => {
        isMouseDown = true;
        carrousel.style.cursor = "grabbing";
    });
    carrousel.addEventListener("touchend", () => {
        isMouseDown = false;
        carrousel.style.cursor = "grab";
    });
    container.addEventListener(
        "touchmove",
        e => isMouseDown && getPosX(e.touches[0].clientX)
    );

    window.addEventListener("resize", createCarrousel);

    update();
    createCarrousel();
    createIndicators(); // Création des points
};

initEvents();
