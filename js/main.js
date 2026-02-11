// =========================
// 0) Image hearts background
// =========================
const heartsBg = document.getElementById("heartsBg");

function spawnHearts(count = 30){
  if (!heartsBg) return;

  heartsBg.innerHTML = "";

  const w = window.innerWidth;
  const h = window.innerHeight;

  for (let i = 0; i < count; i++){
    const heart = document.createElement("img");
    heart.src = "img/pink_heart.png";
    heart.className = "heartImg";
    heart.alt = "";
    heart.setAttribute("aria-hidden", "true");

    // random position
    heart.style.left = (Math.random() * w) + "px";
    heart.style.top  = (Math.random() * h) + "px";

    // random size
    const size = 18 + Math.random() * 28; // 18px–46px
    heart.style.width = size + "px";

    // random animation speed
    const duration = 6 + Math.random() * 10; // 6–16s
    heart.style.animationDuration = duration + "s";

    // random delay
    heart.style.animationDelay = (Math.random() * 5) + "s";

    heartsBg.appendChild(heart);
  }
}

window.addEventListener("load", () => spawnHearts(30));
window.addEventListener("resize", () => spawnHearts(30));


// =========================
// 1) Curtain: 4 images -> quadrants -> slide away
// =========================
const curtainImages = [
  "img/city.jpg",       // top-left
  "img/lachen.png",     // top-right
  "img/stadion.png",    // bottom-left
  "img/normal.png"      // bottom-right
];

const curtain = document.getElementById("curtain");
const grid = document.getElementById("curtainGrid");

function setQuadImage(selector, src){
  const quad = grid.querySelector(selector);
  const layer = quad?.querySelector(".img");
  if (!quad || !layer) return;

  // load image first so it doesn't "flash" broken
  const im = new Image();
  im.onload = () => {
    layer.style.backgroundImage = `url("${src}")`;
    quad.classList.add("show");
  };
  im.onerror = () => {
    // If an image fails, still show the quadrant (blank) so animation continues
    quad.classList.add("show");
  };
  im.src = src;
}

function runCurtainQuadrants(){
  if (!curtain || !grid) return;

  const S = 1.6; // <-- höher = langsamer (z.B. 1.3, 1.6, 2.0)

  setTimeout(() => setQuadImage(".q1", curtainImages[0]), 120 * S);
  setTimeout(() => setQuadImage(".q2", curtainImages[1]), 320 * S);
  setTimeout(() => setQuadImage(".q3", curtainImages[2]), 520 * S);
  setTimeout(() => setQuadImage(".q4", curtainImages[3]), 720 * S);

  setTimeout(() => {
    curtain.classList.add("opening");
  }, 1300 * S);

  setTimeout(() => {
    curtain.classList.add("done");
  }, 2200 * S);
}

document.body.classList.remove("intro");
document.body.classList.add("ready");



window.addEventListener("load", () => {
  // If you want to disable curtain quickly:
  // curtain?.classList.add("done"); return;

  runCurtainQuadrants();
});




// =========================
// 2) "Vielleicht" fullscreen overlay
// =========================
const btnMaybe = document.getElementById("btnMaybe");
const maybeOverlay = document.getElementById("maybeOverlay");

let overlayTimer;

function showMaybeOverlay(){
  if (!maybeOverlay) return;

  clearTimeout(overlayTimer);

  maybeOverlay.classList.add("active");
  maybeOverlay.setAttribute("aria-hidden", "false");

  overlayTimer = setTimeout(() => {
    maybeOverlay.classList.remove("active");
    maybeOverlay.setAttribute("aria-hidden", "true");
  }, 2400);
}

if (btnMaybe) {
  btnMaybe.addEventListener("click", showMaybeOverlay);
}


// =========================
// 3) "Nein" in its own zone (never covers other buttons)
//     + stays where it jumps (no sinking)
// =========================
const btnNo = document.getElementById("btnNo");
const noZone = document.getElementById("noZone");

let noSlot = 0;
let isNoPlayMode = false;

function getNoSlots(zoneWidth, btnWidth){
  const pad = 10;
  const maxX = Math.max(pad, zoneWidth - btnWidth - pad);

  return [
    pad,
    Math.max(pad, maxX * 0.33),
    Math.max(pad, maxX * 0.66),
    maxX
  ];
}

function jumpNo(){
  if (!btnNo || !noZone) return;

  const z = noZone.getBoundingClientRect();
  const b = btnNo.getBoundingClientRect();
  const xs = getNoSlots(z.width, b.width);

  // first click: switch to JS-controlled placement (no CSS transform)
  if (!isNoPlayMode){
    isNoPlayMode = true;
    btnNo.style.position = "absolute";
    btnNo.style.transform = "none"; // IMPORTANT so it doesn't "sink" after animation
  }

  noSlot = (noSlot + 1) % xs.length;

  // pick a stable Y inside the zone (lower area)
  const y = Math.max(55, (noZone.clientHeight * 0.68) - (b.height / 2));

  // set BOTH left + top so it stays exactly where it jumps
  btnNo.style.left = xs[noSlot] + "px";
  btnNo.style.top  = y + "px";

  // disagree shake (doesn't change final position)
  btnNo.classList.remove("shake");
  void btnNo.offsetWidth;
  btnNo.classList.add("shake");
}

if (btnNo){
  btnNo.addEventListener("pointerdown", (e) => {
    e.preventDefault();
    jumpNo();
  });
  btnNo.addEventListener("click", (e) => {
    e.preventDefault();
    jumpNo();
  });
}
