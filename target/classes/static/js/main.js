import { loadCustomers } from "./customers.js";
import { loadSpiders } from "./spiders.js";
import { loadOrders } from "./orders.js";

/* ============================================================
   NAWIGACJA MIĘDZY SEKCJAMI
============================================================ */

export function showSection(id) {
    const sections = [
        "customers-section",
        "spiders-section",
        "orders-section"
    ];

    const navButtons = [
        "nav-customers",
        "nav-spiders",
        "nav-orders"
    ];

    // Ukryj wszystkie sekcje
    sections.forEach(sec => {
        document.getElementById(sec).classList.add("hidden");
    });

    // Usuń aktywne klasy z przycisków
    navButtons.forEach(btn => {
        document.getElementById(btn).classList.remove("nav-btn-active");
    });

    // Pokaż wybraną sekcję
    document.getElementById(id).classList.remove("hidden");

    // Ustaw aktywny przycisk
    const navId = "nav-" + id.replace("-section", "");
    document.getElementById(navId).classList.add("nav-btn-active");

    // Załaduj dane sekcji
    if (id === "customers-section") loadCustomers();
    if (id === "spiders-section") loadSpiders();
    if (id === "orders-section") loadOrders();
}

/* ============================================================
   START APLIKACJI
============================================================ */

document.addEventListener("DOMContentLoaded", () => {
    showSection("customers-section");
});

/* ============================================================
   GLOBALNE FUNKCJE DLA HTML
============================================================ */

window.showSection = showSection;
