// js/main.js

import { bindModalCloseButtons } from "./modals.js";
import { loadCustomersSection } from "./customers.js";
import { loadSpidersSection } from "./spiders.js";
import { loadOrdersSection } from "./orders.js";

/* ============================================================
   PRZEŁĄCZANIE SEKCJI
============================================================ */

function showSection(id) {
    document.querySelectorAll("section").forEach((s) => s.classList.add("hidden"));
    const section = document.getElementById(id);
    if (section) section.classList.remove("hidden");
}

function attachNavigation() {
    const nav = {
        customers: "customers-section",
        spiders: "spiders-section",
        orders: "orders-section"
    };

    Object.entries(nav).forEach(([btnId, sectionId]) => {
        const btn = document.getElementById(`nav-${btnId}`);
        if (!btn) return;

        btn.onclick = () => {
            showSection(sectionId);

            if (sectionId === "customers-section") loadCustomersSection();
            if (sectionId === "spiders-section") loadSpidersSection();
            if (sectionId === "orders-section") loadOrdersSection();
        };
    });
}

/* ============================================================
   INICJALIZACJA APLIKACJI
============================================================ */

document.addEventListener("DOMContentLoaded", () => {
    bindModalCloseButtons();     // aktywacja systemu zamykania modali
    attachNavigation();          // aktywacja menu

    showSection("customers-section");
    loadCustomersSection();
});
