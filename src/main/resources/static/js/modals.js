import { state, resetOrderState, setSelectedCustomer, setOrderedSpiders } from "./state.js";

/* ============================================================
   POMOCNICZE FUNKCJE DOM
============================================================ */

function show(el) {
    el.classList.remove("hidden");
    document.body.classList.add("modal-open");
}

function hide(el) {
    el.classList.add("hidden");
    document.body.classList.remove("modal-open");
}

/* ============================================================
   MODALE — OTWIERANIE / ZAMYKANIE
============================================================ */

export function openCustomerModal(html) {
    const modal = document.getElementById("customerModal");
    modal.innerHTML = html;
    show(modal);
}

export function closeCustomerModal() {
    hide(document.getElementById("customerModal"));
}

export function openSpiderModal(html) {
    const modal = document.getElementById("spiderModal");
    modal.innerHTML = html;
    show(modal);
}

export function closeSpiderModal() {
    hide(document.getElementById("spiderModal"));
}

export function openOrderModal(html) {
    const modal = document.getElementById("orderModal");
    modal.innerHTML = html;
    show(modal);
}

export function closeOrderModal() {
    hide(document.getElementById("orderModal"));
    resetOrderState();
}

export function openOrderDetailsModal(html) {
    const modal = document.getElementById("orderDetailsModal");
    modal.innerHTML = html;
    show(modal);
}

export function closeOrderDetailsModal() {
    hide(document.getElementById("orderDetailsModal"));
}

/* ============================================================
   GENEROWANIE MODALI
============================================================ */

/* ---------- MODAL KLIENTA ---------- */
export function renderCustomerModal(customer = null) {
    return `
        <div class="bg-white p-10 rounded-[3rem] max-w-lg w-full shadow-2xl border border-slate-100 fade-in">
            <h3 class="text-3xl font-black mb-8 text-slate-900 tracking-tight">
                ${customer ? "Edytuj klienta" : "Dodaj klienta"}
            </h3>

            <form id="customer-form">
                <input type="hidden" id="customer-id" value="${customer?.id || ""}">

                <div class="space-y-6">

                    ${renderInput("Imię", "customer-firstName", customer?.firstName)}
                    ${renderInput("Nazwisko", "customer-lastName", customer?.lastName)}
                    ${renderInput("Telefon", "customer-telephone", customer?.telephone)}
                    ${renderInput("E-mail", "customer-email", customer?.email)}
                    ${renderInput("Adres", "customer-address", customer?.address)}
                    ${renderInput("Paczkomat", "customer-parcelLocker", customer?.parcelLocker)}

                    <div class="flex gap-4 pt-4">
                        <button type="submit"
                                class="flex-1 bg-emerald-600 text-white p-5 rounded-2xl font-black hover:bg-emerald-500 transition shadow-lg shadow-emerald-100">
                            Zapisz
                        </button>

                        <button type="button" onclick="window.closeCustomerModal()"
                                class="flex-1 bg-slate-100 text-slate-500 p-5 rounded-2xl font-bold hover:bg-slate-200 transition">
                            Anuluj
                        </button>
                    </div>

                </div>
            </form>
        </div>
    `;
}

/* ---------- MODAL PAJĄKA ---------- */
export function renderSpiderModal(spider = null) {
    return `
        <div class="bg-white p-10 rounded-[3rem] max-w-lg w-full shadow-2xl border border-slate-100 fade-in">
            <h3 class="text-3xl font-black mb-8 text-slate-900 tracking-tight">
                ${spider ? "Edytuj pająka" : "Dodaj pająka"}
            </h3>

            <form id="spider-form">
                <input type="hidden" id="spider-id" value="${spider?.id || ""}">

                <div class="space-y-6">

                    ${renderInput("Rodzaj", "spider-typeName", spider?.typeName)}
                    ${renderInput("Gatunek", "spider-speciesName", spider?.speciesName)}

                    <div>
                        <label class="text-xs font-black text-slate-400 uppercase ml-1">Płeć</label>
                        <select id="spider-gender"
                                class="w-full bg-slate-50 border border-slate-200 p-5 rounded-2xl outline-none focus:border-emerald-500 font-semibold text-slate-700">
                            <option value="MALE" ${spider?.gender === "MALE" ? "selected" : ""}>MALE</option>
                            <option value="FEMALE" ${spider?.gender === "FEMALE" ? "selected" : ""}>FEMALE</option>
                            <option value="NS" ${spider?.gender === "NS" ? "selected" : ""}>NS</option>
                        </select>
                    </div>

                    ${renderInput("Ilość", "spider-quantity", spider?.quantity, "number")}
                    ${renderInput("Rozmiar", "spider-size", spider?.size)}
                    ${renderInput("Cena", "spider-price", spider?.price, "number")}

                    <div class="flex gap-4 pt-4">
                        <button type="submit"
                                class="flex-1 bg-emerald-600 text-white p-5 rounded-2xl font-black hover:bg-emerald-500 transition shadow-lg shadow-emerald-100">
                            Zapisz
                        </button>

                        <button type="button" onclick="window.closeSpiderModal()"
                                class="flex-1 bg-slate-100 text-slate-500 p-5 rounded-2xl font-bold hover:bg-slate-200 transition">
                            Anuluj
                        </button>
                    </div>

                </div>
            </form>
        </div>
    `;
}

/* ---------- MODAL SZCZEGÓŁÓW ZAMÓWIENIA ---------- */
export function renderOrderDetailsModal(orderHtml) {
    return `
        <div class="bg-white p-10 rounded-[3rem] max-w-4xl w-full shadow-2xl border border-slate-100 fade-in">
            ${orderHtml}
        </div>
    `;
}

/* ============================================================
   HELPER — INPUT BUILDER
============================================================ */

function renderInput(label, id, value = "", type = "text") {
    return `
        <div>
            <label class="text-xs font-black text-slate-400 uppercase ml-1">${label}</label>
            <input id="${id}" type="${type}" value="${value ?? ""}"
                   class="w-full bg-slate-50 border border-slate-200 p-5 rounded-2xl outline-none focus:border-emerald-500 font-semibold text-slate-700">
        </div>
    `;
}

/* ============================================================
   GLOBALNE FUNKCJE DLA HTML (window.*)
============================================================ */

window.closeCustomerModal = closeCustomerModal;
window.closeSpiderModal = closeSpiderModal;
window.closeOrderModal = closeOrderModal;
window.closeOrderDetailsModal = closeOrderDetailsModal;
