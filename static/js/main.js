// ID-Forcing project page — small interactive behaviors
// 1. Mobile nav toggle
// 2. Copy-to-clipboard for the BibTeX block

document.addEventListener("DOMContentLoaded", () => {
  // --- Mobile nav toggle ---
  const navToggle = document.getElementById("navToggle");
  const navLinks = document.querySelector(".topnav-links");
  if (navToggle && navLinks) {
    navToggle.addEventListener("click", () => {
      navLinks.classList.toggle("open");
    });
    navLinks.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => navLinks.classList.remove("open"));
    });
  }

  // --- Comparisons controls: Play All / Pause All / 2x Speed (whole section, no auto-sync) ---
  const comparisonsSection = document.getElementById("comparisons");
  if (comparisonsSection) {
    const playBtn = comparisonsSection.querySelector(".ctrl-play-all");
    const pauseBtn = comparisonsSection.querySelector(".ctrl-pause-all");
    const speedBtn = comparisonsSection.querySelector(".ctrl-speed");
    const comparisonVideos = () => Array.from(comparisonsSection.querySelectorAll("video"));

    if (playBtn) {
      playBtn.addEventListener("click", () => {
        comparisonVideos().forEach((v) => v.play().catch(() => {}));
      });
    }
    if (pauseBtn) {
      pauseBtn.addEventListener("click", () => {
        comparisonVideos().forEach((v) => v.pause());
      });
    }
    if (speedBtn) {
      speedBtn.addEventListener("click", () => {
        const isFast = speedBtn.dataset.speed !== "2";
        const rate = isFast ? 2 : 1;
        speedBtn.dataset.speed = String(rate);
        speedBtn.classList.toggle("active", isFast);
        speedBtn.innerHTML = isFast
          ? '<i class="fa-solid fa-forward"></i> 1&times; Speed'
          : '<i class="fa-solid fa-forward"></i> 2&times; Speed';
        comparisonVideos().forEach((v) => { v.playbackRate = rate; });
      });
    }
  }

  // --- Gallery controls: Play All / Pause All / 2x Speed (applies to the currently visible set) ---
  const galleryPlayAll = document.getElementById("galleryPlayAll");
  const galleryPauseAll = document.getElementById("galleryPauseAll");
  const gallerySpeedToggle = document.getElementById("gallerySpeedToggle");

  function activeGalleryVideos() {
    const activePage = document.querySelector("#gallery .gallery-page.active");
    const scope = activePage || document.getElementById("gallery");
    return Array.from(scope.querySelectorAll("video"));
  }

  if (galleryPlayAll) {
    galleryPlayAll.addEventListener("click", () => {
      activeGalleryVideos().forEach((v) => v.play().catch(() => {}));
    });
  }
  if (galleryPauseAll) {
    galleryPauseAll.addEventListener("click", () => {
      activeGalleryVideos().forEach((v) => v.pause());
    });
  }
  if (gallerySpeedToggle) {
    gallerySpeedToggle.addEventListener("click", () => {
      const isFast = gallerySpeedToggle.dataset.speed !== "2";
      const rate = isFast ? 2 : 1;
      gallerySpeedToggle.dataset.speed = String(rate);
      gallerySpeedToggle.classList.toggle("active", isFast);
      gallerySpeedToggle.innerHTML = isFast
        ? '<i class="fa-solid fa-forward"></i> 1&times; Speed'
        : '<i class="fa-solid fa-forward"></i> 2&times; Speed';
      document.querySelectorAll("#gallery video").forEach((v) => { v.playbackRate = rate; });
    });
  }

  // --- Gallery pager (slide the whole set of videos sideways on arrow click) ---
  document.querySelectorAll(".gallery-pager").forEach((pager) => {
    const track = pager.querySelector(".gallery-track");
    const pages = Array.from(pager.querySelectorAll(".gallery-page"));
    const prevBtn = pager.querySelector(".carousel-prev");
    const nextBtn = pager.querySelector(".carousel-next");
    const next = pager.nextElementSibling;
    const dotsWrap = next && next.classList.contains("gallery-dots") ? next : null;
    const dots = dotsWrap ? Array.from(dotsWrap.querySelectorAll(".gallery-dot")) : [];
    if (!track || pages.length < 2) return;

    let current = pages.findIndex((p) => p.classList.contains("active"));
    if (current < 0) current = 0;

    const show = (index) => {
      // Pause any playing videos on the page sliding out of view.
      pages[current].querySelectorAll("video").forEach((v) => v.pause());
      current = (index + pages.length) % pages.length;
      track.style.transform = `translateX(-${current * 100}%)`;
      pages.forEach((p, i) => p.classList.toggle("active", i === current));
      dots.forEach((d, i) => d.classList.toggle("active", i === current));
    };

    prevBtn.addEventListener("click", () => show(current - 1));
    nextBtn.addEventListener("click", () => show(current + 1));
    dots.forEach((d, i) => d.addEventListener("click", () => show(i)));
  });

  // --- Copy BibTeX ---
  const copyBtn = document.getElementById("copyBibtex");
  const bibtexCode = document.getElementById("bibtexCode");
  if (copyBtn && bibtexCode) {
    copyBtn.addEventListener("click", async () => {
      try {
        await navigator.clipboard.writeText(bibtexCode.textContent.trim());
        copyBtn.classList.add("copied");
        copyBtn.innerHTML = '<i class="fa-solid fa-check"></i> Copied';
        setTimeout(() => {
          copyBtn.classList.remove("copied");
          copyBtn.innerHTML = '<i class="fa-regular fa-copy"></i> Copy';
        }, 1600);
      } catch (err) {
        // Clipboard API unavailable (e.g. non-HTTPS local file); fail silently.
      }
    });
  }
});
