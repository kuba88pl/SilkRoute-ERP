// js/modals.js

/* ============================================================
   PODSTAWOWE FUNKCJE OTWIERANIA I ZAMYKANIA MODALI
============================================================ */

export function openModal(id, contentHtml) {
    const modal = document.getElementById(id);
    if (!modal) {
        console.error("Modal not found:", id);
        return;
    }

    modal.innerHTML = contentHtml;
    modal.classList.remove("hidden");
    document.body.classList.add("modal-open");
}

export function closeModal(id) {
    const modal = document.getElementById(id);
    if (!modal) return;

    modal.classList.add("hidden");
    modal.innerHTML = "";
    document.body.classList.remove("modal-open");
}

/* ============================================================
   SPECYFICZNE MODALE
============================================================ */

export function openCustomerModal(html) {
    openModal("customerModal", html);
}

export function closeCustomerModal() {
    closeModal("customerModal");
}

export function openSpiderModal(html) {
    openModal("spiderModal", html);
}

export function closeSpiderModal() {
    closeModal("spiderModal");
}

export function openOrderModal(html) {
    openModal("orderModal", html);
}

export function closeOrderModal() {
    closeModal("orderModal");
}

export function openOrderDetailsModal(html) {
    openModal("orderDetailsModal", html);
}

export function closeOrderDetailsModal() {
    closeModal("orderDetailsModal");
}

/* ============================================================
   GLOBALNY SYSTEM ZAMYKANIA MODALI
   (obsługuje wszystkie przyciski z data-close-modal="id")
============================================================ */

export function bindModalCloseButtons() {
    document.addEventListener("click", (e) => {
        const btn = e.target.closest("[data-close-modal]");
        if (!btn) return;

        const modalId = btn.getAttribute("data-close-modal");
        if (!modalId) return;

        closeModal(modalId);
    });
}
