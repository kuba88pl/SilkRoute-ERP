// js/modals.js
export function openModal(id, contentHtml) {
    const modal = document.getElementById(id);
    if (!modal) return;

    const inner = modal.querySelector(".modal-inner");
    if (!inner) return;

    inner.innerHTML = contentHtml;

    modal.classList.remove("hidden");
    document.body.classList.add("modal-open");
}

export function closeModal(id) {
    const modal = document.getElementById(id);
    if (!modal) return;

    const inner = modal.querySelector(".modal-inner");
    if (inner) inner.innerHTML = "";

    modal.classList.add("hidden");
    document.body.classList.remove("modal-open");
}

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

export function bindBackdropClose() {
    document.addEventListener("click", (e) => {
        const backdrop = e.target.closest(".modal-backdrop");
        if (!backdrop) return;

        const modal = backdrop.parentElement;
        if (!modal) return;

        closeModal(modal.id);
    });
}

export function bindModalCloseButtons() {
    document.addEventListener("click", (e) => {
        const btn = e.target.closest("[data-close-modal]");
        if (!btn) return;

        const modalId = btn.getAttribute("data-close-modal");
        if (!modalId) return;

        closeModal(modalId);
    });
}
