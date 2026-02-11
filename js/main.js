// =========================
// 0) Image hearts background
// =========================
const heartsBg = document.getElementById("heartsBg");

function spawnHearts(count = 30) {
  if (!heartsBg) return;

  heartsBg.innerHTML = "";

  const w = window.innerWidth;
  const h = window.innerHeight;

  for (let i = 0; i < count; i++) {
    const heart = document.createElement("img");
    heart.src = "img/pink_heart.png";
    heart.className = "heartImg";
    heart.alt = "";
    heart.setAttribute("aria-hidden", "true");

    heart.style.left = Math.random() * w + "px";
    heart.style.top = Math.random() * h + "px";

    const size = 18 + Math.random() * 28;
    heart.style.width = size + "px";

    const duration = 6 + Math.random() * 10;
    heart.style.animationDuration = duration + "s";
    heart.style.animationDelay = Math.random() * 5 + "s";

    heartsBg.appendChild(heart);
  }
}

// Debounced resize — verhindert zu viele DOM-Operationen beim Resize
let resizeTimer;
window.addEventListener("resize", () => {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(() => spawnHearts(30), 150);
});

window.addEventListener("DOMContentLoaded", () => spawnHearts(30));


// =========================
// 1) Curtain: 4 images -> quadrants -> slide away
// =========================
const curtainImages = [
  "img/city.jpg",       // oben-links
  "img/lachen.png",     // oben-rechts
  "img/stadion.png",    // unten-links
  "img/normal.png"      // unten-rechts
];

const curtain = document.getElementById("curtain");
const grid = document.getElementById("curtainGrid");

function setQuadImage(selector, src) {
  const quad = grid?.querySelector(selector);
  const layer = quad?.querySelector(".img");
  if (!quad || !layer) return;

  const im = new Image();
  im.onload = () => {
    layer.style.backgroundImage = `url("${src}")`;
    quad.classList.add("show");
  };
  im.onerror = () => {
    quad.classList.add("show");
  };
  im.src = src;
}

function finishIntro() {
  curtain?.classList.add("done");
  document.body.classList.remove("intro");
  document.body.classList.add("ready");

  setTimeout(() => {
    if (curtain) curtain.style.display = "none";
  }, 400);
}

function runCurtainQuadrants() {
  if (!curtain || !grid) {
    document.body.classList.remove("intro");
    document.body.classList.add("ready");
    return;
  }

  const S = 3.0;        // Curtain-Geschwindigkeit (Bilder + Slide-Animation)
  const REVEAL = 3750;  // ms bis Content erscheint — unabhängig von S anpassen

  setTimeout(() => setQuadImage(".q1", curtainImages[0]), 120 * S);
  setTimeout(() => setQuadImage(".q2", curtainImages[1]), 280 * S);
  setTimeout(() => setQuadImage(".q3", curtainImages[2]), 440 * S);
  setTimeout(() => setQuadImage(".q4", curtainImages[3]), 600 * S);

  setTimeout(() => {
    curtain.classList.add("opening");
  }, 1050 * S);

  setTimeout(() => {
    finishIntro();
  }, REVEAL);
}

// FIX: DOMContentLoaded statt load — startet sofort, wartet nicht auf alle
// externen Ressourcen (Bilder, etc.). Curtain-Bilder werden ohnehin lazy geladen.
window.addEventListener("DOMContentLoaded", () => {
  runCurtainQuadrants();
});


// =========================
// 2) "Vielleicht" fullscreen overlay
// =========================
const btnMaybe = document.getElementById("btnMaybe");
const maybeOverlay = document.getElementById("maybeOverlay");

let overlayTimer;

function showMaybeOverlay() {
  if (!maybeOverlay) return;
  clearTimeout(overlayTimer);
  maybeOverlay.classList.add("active");
  maybeOverlay.setAttribute("aria-hidden", "false");

  overlayTimer = setTimeout(() => {
    hideMaybeOverlay();
  }, 2400);
}

function hideMaybeOverlay() {
  if (!maybeOverlay) return;
  maybeOverlay.classList.remove("active");
  maybeOverlay.setAttribute("aria-hidden", "true");
  clearTimeout(overlayTimer);
}

btnMaybe?.addEventListener("click", showMaybeOverlay);

// FIX: Klick auf Overlay selbst schließt es auch
maybeOverlay?.addEventListener("click", hideMaybeOverlay);


// =========================
// 3) "Nein" in its own zone (never covers other buttons)
// =========================
const btnNo = document.getElementById("btnNo");
const noZone = document.getElementById("noZone");

let noSlot = 0;
let isNoPlayMode = false;

function getNoSlots(zoneWidth, btnWidth) {
  const pad = 10;
  const maxX = Math.max(pad, zoneWidth - btnWidth - pad);

  return [
    pad,
    Math.max(pad, maxX * 0.33),
    Math.max(pad, maxX * 0.66),
    maxX
  ];
}

function jumpNo() {
  if (!btnNo || !noZone) return;

  const z = noZone.getBoundingClientRect();
  const b = btnNo.getBoundingClientRect();
  const xs = getNoSlots(z.width, b.width);

  if (!isNoPlayMode) {
    isNoPlayMode = true;
    btnNo.style.position = "absolute";
    btnNo.style.transform = "none";
  }

  // FIX: Slot wechselt immer zu einem anderen (kein Hängenbleiben am selben Platz)
  const prevSlot = noSlot;
  do {
    noSlot = Math.floor(Math.random() * xs.length);
  } while (noSlot === prevSlot && xs.length > 1);

  const y = Math.max(55, noZone.clientHeight * 0.68 - b.height / 2);

  btnNo.style.left = xs[noSlot] + "px";
  btnNo.style.top = y + "px";

  btnNo.classList.remove("shake");
  void btnNo.offsetWidth; // reflow erzwingen
  btnNo.classList.add("shake");
}

btnNo?.addEventListener("pointerdown", (e) => {
  e.preventDefault();
  jumpNo();
});

// FIX: Kein doppeltes Feuern — pointerdown + click würden jumpNo() 2x aufrufen.
// Click-Listener nur als Fallback für Nicht-Pointer-Geräte.
btnNo?.addEventListener("click", (e) => {
  if (e.pointerType !== undefined) return; // bereits via pointerdown behandelt
  e.preventDefault();
  jumpNo();
});