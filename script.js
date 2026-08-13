// =========================================================
// Sol na Piscina — interatividade do site
// =========================================================

(function () {
  "use strict";

  /* ---------- Menu mobile ---------- */
  const menuToggle = document.getElementById("menu-toggle");
  const mainNav = document.getElementById("main-nav");

  if (menuToggle && mainNav) {
    menuToggle.addEventListener("click", function () {
      const isOpen = mainNav.classList.toggle("open");
      menuToggle.setAttribute("aria-expanded", String(isOpen));
    });

    mainNav.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        mainNav.classList.remove("open");
        menuToggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  /* ---------- Alto contraste ---------- */
  const contrastToggle = document.getElementById("contrast-toggle");
  if (contrastToggle) {
    const stored = localStorage.getItem("sp-high-contrast") === "true";
    if (stored) {
      document.body.classList.add("high-contrast");
      contrastToggle.setAttribute("aria-pressed", "true");
    }
    contrastToggle.addEventListener("click", function () {
      const active = document.body.classList.toggle("high-contrast");
      contrastToggle.setAttribute("aria-pressed", String(active));
      localStorage.setItem("sp-high-contrast", String(active));
    });
  }

  /* ---------- Texto grande ---------- */
  const textSizeToggle = document.getElementById("text-size-toggle");
  if (textSizeToggle) {
    const stored = localStorage.getItem("sp-text-large") === "true";
    if (stored) {
      document.body.classList.add("text-large");
      textSizeToggle.setAttribute("aria-pressed", "true");
    }
    textSizeToggle.addEventListener("click", function () {
      const active = document.body.classList.toggle("text-large");
      textSizeToggle.setAttribute("aria-pressed", String(active));
      localStorage.setItem("sp-text-large", String(active));
    });
  }

  /* ---------- Disco de Newton interativo ---------- */
  const spinBtn = document.getElementById("spin-disc-btn");
  const disc = document.getElementById("newton-disc");
  const discHint = document.getElementById("disc-hint-text");
  let discSpinning = false;

  if (spinBtn && disc) {
    spinBtn.addEventListener("click", function () {
      if (discSpinning) return;
      discSpinning = true;
      disc.classList.add("spinning");
      discHint.textContent = "Girando... observe as cores se misturarem";

      window.setTimeout(function () {
        disc.classList.add("blended");
        discHint.textContent = "As sete cores viraram branco — luz somada";
      }, 900);

      window.setTimeout(function () {
        disc.classList.remove("spinning", "blended");
        discHint.textContent = "Toque para girar novamente";
        discSpinning = false;
      }, 3200);
    });
  }

  /* ---------- Simulador de aquecimento solar ---------- */
  const irradiancia = document.getElementById("irradiancia");
  const area = document.getElementById("area");
  const tempo = document.getElementById("tempo");
  const volume = document.getElementById("volume");
  const calcBtn = document.getElementById("sim-calc");

  const irradianciaOut = document.getElementById("irradiancia-out");
  const areaOut = document.getElementById("area-out");
  const tempoOut = document.getElementById("tempo-out");
  const volumeOut = document.getElementById("volume-out");

  const resultNumber = document.getElementById("result-number");
  const resultBar = document.getElementById("result-bar");
  const resultNote = document.getElementById("result-note");

  function syncOutputs() {
    if (!irradiancia) return;
    irradianciaOut.textContent = irradiancia.value + " W/m²";
    areaOut.textContent = area.value + " m²";
    tempoOut.textContent = tempo.value + " h";
    volumeOut.textContent = volume.value + " m³";
  }

  function calcular() {
    if (!irradiancia) return;

    const I = parseFloat(irradiancia.value);      // W/m²
    const A = parseFloat(area.value);              // m²
    const t = parseFloat(tempo.value) * 3600;      // horas -> segundos
    const V = parseFloat(volume.value);            // m³
    const alphaInput = document.querySelector('input[name="superficie"]:checked');
    const alpha = alphaInput ? parseFloat(alphaInput.value) : 0.95;

    // Modelo educativo simplificado:
    // Q = I * A * alpha * t  (energia absorvida, em Joules)
    // m = V * 1000 (kg de água, densidade ~1000 kg/m3)
    // c = 4186 J/(kg.°C) (calor específico da água)
    // deltaT = Q / (m * c)
    const Q = I * A * alpha * t;
    const massa = V * 1000;
    const c = 4186;
    let deltaT = Q / (massa * c);

    // limite realista de exibição para fins didáticos
    const deltaTShown = Math.min(deltaT, 25);

    resultNumber.textContent = deltaTShown.toFixed(1);
    const pct = Math.min((deltaTShown / 25) * 100, 100);
    resultBar.style.width = pct + "%";

    let nota;
    if (alpha >= 0.9) {
      nota = "Superfície escura: quase toda a luz vira calor, como no Disco de Newton parado no preto.";
    } else if (alpha >= 0.5) {
      nota = "Superfície metálica: parte da luz é refletida antes de virar calor.";
    } else {
      nota = "Superfície branca: a maior parte da luz é refletida, como as cores somadas do Disco de Newton.";
    }
    resultNote.textContent = nota;
  }

  [irradiancia, area, tempo, volume].forEach(function (input) {
    if (input) input.addEventListener("input", syncOutputs);
  });

  if (calcBtn) {
    calcBtn.addEventListener("click", calcular);
  }

  syncOutputs();
})();
