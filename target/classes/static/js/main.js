/* ============================================================
   IMPORTY MODUŁÓW
============================================================ */
import { bindModalCloseButtons } from "./modals.js";
import { loadCustomersSection } from "./customers.js";
import { loadSpidersSection } from "./spiders.js";
import { loadOrdersSection } from "./orders.js";
import { initBreedingModule } from "./breeding/breedingInit.js";
import { login } from "./api.js";
import { authState } from "./state.js";

/* ============================================================
   LOGOWANIE
============================================================ */
export function initLogin() {
    const panel = document.getElementById("login-panel");
    const btn = document.getElementById("login-btn");

    // Strona nie ma panelu logowania → pomijamy
    if (!panel || !btn) return;

    // Jeśli token istnieje → chowamy panel logowania
    if (authState.token) {
        panel.style.display = "none";
        return;
    }

    btn.addEventListener("click", async () => {
        const username = document.getElementById("username").value;
        const password = document.getElementById("password").value;

        try {
            await login(username, password);
            panel.style.display = "none";
        } catch (e) {
            document.getElementById("login-error").innerText = e.message;
        }
    });
}

/* ============================================================
   PRZEŁĄCZANIE SEKCJI
============================================================ */
function showSection(id) {
    document.querySelectorAll("section").forEach((s) => s.classList.add("hidden"));
    const section = document.getElementById(id);
    if (section) section.classList.remove("hidden");
}

// Wystawiamy globalnie dla onclick w HTML
window.showSection = showSection;

/* ============================================================
   NAWIGACJA
============================================================ */
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
    console.log("MAIN LOADED");

    bindModalCloseButtons();
    attachNavigation();
    initLogin();

    // Jeśli jesteśmy na breeding.html → uruchamiamy moduł rozmnożeń
    if (document.getElementById("breeding-root")) {
        initBreedingModule();
        return; // nie ładujemy sekcji sprzedaży
    }

    // Domyślna sekcja dla sales.html
    showSection("customers-section");
    loadCustomersSection();
});
