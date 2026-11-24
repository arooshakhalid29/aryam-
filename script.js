/* 3S ProDesk — interactions */
(() => {
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const WHATSAPP = "971565545073";
  const fmt = (n) => n.toLocaleString("en-US");

  /* Header shadow on scroll */
  const header = $(".header");
  const onScroll = () => header.classList.toggle("is-scrolled", window.scrollY > 10);
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* Mobile nav */
  const burger = $("#burger");
  const nav = $("#nav");
  const closeNav = () => {
    nav.classList.remove("is-open");
    burger.setAttribute("aria-expanded", "false");
    document.body.style.overflow = "";
  };
  burger.addEventListener("click", () => {
    const open = nav.classList.toggle("is-open");
    burger.setAttribute("aria-expanded", String(open));
    document.body.style.overflow = open ? "hidden" : "";
  });

  /* Services dropdown (click for touch / mobile) */
  const drop = $(".nav__item--drop");
  const dropBtn = $(".nav__item--drop > button");
  dropBtn.addEventListener("click", () => {
    const open = drop.classList.toggle("is-open");
    dropBtn.setAttribute("aria-expanded", String(open));
  });
  document.addEventListener("click", (e) => {
    if (!drop.contains(e.target)) {
      drop.classList.remove("is-open");
      dropBtn.setAttribute("aria-expanded", "false");
    }
  });

  /* Close mobile nav on link click */
  $$("#nav a").forEach((a) => a.addEventListener("click", () => {
    closeNav();
    drop.classList.remove("is-open");
  }));

  /* Service tabs */
  const tabs = $$(".tab");
  const activateTab = (name) => {
    tabs.forEach((t) => t.classList.toggle("is-active", t.dataset.target === name));
    $$(".panel").forEach((p) => p.classList.toggle("is-active", p.id === `panel-${name}`));
  };
  tabs.forEach((t) => t.addEventListener("click", () => activateTab(t.dataset.target)));
  $$("[data-tab]").forEach((a) => a.addEventListener("click", () => activateTab(a.dataset.tab)));

  /* PRO plan team-size toggle */
  $$(".seg__btn").forEach((btn) => btn.addEventListener("click", () => {
    $$(".seg__btn").forEach((b) => b.classList.toggle("is-active", b === btn));
    const i = Number(btn.dataset.size);
    $$(".js-price").forEach((el) => {
      const prices = el.dataset.prices.split(",").map(Number);
      el.classList.add("is-changing");
      setTimeout(() => {
        el.textContent = fmt(prices[i]);
        el.classList.remove("is-changing");
      }, 180);
    });
  }));

  /* Cost estimator (indicative dummy pricing) */
  const zone = $("#c-zone");
  const visas = $("#c-visas");
  const visasOut = $("#c-visas-out");
  const fast = $("#c-fast");
  const total = $("#c-total");
  const calcCta = $("#c-cta");

  const calc = () => {
    const opt = zone.selectedOptions[0];
    const base = Number(zone.value);
    const visaFee = opt.dataset.mainland ? 4500 : 3750;
    const nVisas = Number(visas.value);
    const office = Number($("input[name=office]:checked").value);
    const acts = Number($("input[name=acts]:checked").value);
    const sum = base + nVisas * visaFee + office + acts + (fast.checked ? 1000 : 0);
    const lo = Math.round(sum / 100) * 100;
    const hi = Math.round((sum * 1.1) / 100) * 100;
    visasOut.textContent = nVisas;
    total.textContent = `AED ${fmt(lo)} – ${fmt(hi)}`;

    const msg = `Hi, I'd like an exact quote: ${opt.textContent.trim()}, ${nVisas} visa(s), ` +
      `${$("input[name=office]:checked").nextElementSibling.textContent}, ` +
      `${$("input[name=acts]:checked").nextElementSibling.textContent} activities` +
      `${fast.checked ? ", VIP Fast Track" : ""}. Estimate shown: AED ${fmt(lo)}–${fmt(hi)}.`;
    calcCta.href = `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(msg)}`;
    calcCta.target = "_blank";
    calcCta.rel = "noopener";
  };
  $("#calc").addEventListener("input", calc);
  calc();

  /* Contact form → WhatsApp */
  $("#contact-form").addEventListener("submit", (e) => {
    e.preventDefault();
    const d = new FormData(e.target);
    const msg = `Hi, I'm ${d.get("name")} (${d.get("phone")}, ${d.get("email")}).\n` +
      `Interested in: ${d.get("service")}\n${d.get("message") || ""}`;
    window.open(`https://wa.me/${WHATSAPP}?text=${encodeURIComponent(msg)}`, "_blank", "noopener");
    e.target.reset();
  });

  /* Newsletter */
  $("#news-form").addEventListener("submit", (e) => {
    e.preventDefault();
    e.target.hidden = true;
    $("#news-ok").hidden = false;
  });

  /* Only one FAQ open at a time */
  $$(".acc details").forEach((d) => d.addEventListener("toggle", () => {
    if (d.open) $$(".acc details").forEach((o) => o !== d && (o.open = false));
  }));

  /* Reveal on scroll (staggered within each group) */
  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const siblings = $$(":scope > .reveal", el.parentElement);
      el.style.transitionDelay = `${Math.min(siblings.indexOf(el), 6) * 70}ms`;
      el.classList.add("is-in");
      io.unobserve(el);
    });
  }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
  $$(".reveal").forEach((el) => io.observe(el));
})();
