// ============================================================
// IMPORTY
// ============================================================

import {
    getCustomers,
    getCustomer,
    createCustomer,
    updateCustomer,
    deleteCustomer
} from "./api.js";

import {
    state,
    setCustomers
} from "./state.js";

import {
    openCustomerModal
} from "./modals.js";


// ============================================================
// GŁÓWNA SEKCJA — LISTA KLIENTÓW
// ============================================================

export async function loadCustomersSection() {
    const section = document.getElementById("customers-section");
    if (!section) return;

    section.innerHTML = `
        <div class="flex items-center justify-between mb-8">
            <div>
                <h2 class="text-3xl font-black tracking-tight text-slate-900">Klienci</h2>
                <p class="text-slate-500 mt-1">Zarządzaj listą klientów.</p>
            </div>

            <button id="addCustomerBtn"
                class="px-6 py-3 rounded-2xl font-bold bg-emerald-600 text-white hover:bg-emerald-700 shadow-xl active:scale-95">
                Dodaj klienta
            </button>
        </div>

        <div id="customers-filters"></div>
        <div id="customers-table"></div>
    `;

    await loadCustomers();
    renderCustomersFilters();
    renderCustomersTable();
    attachCustomerEvents();
}


// ============================================================
// POBIERANIE KLIENTÓW + SORTOWANIE
// ============================================================

async function loadCustomers() {
    const data = await getCustomers();
    const list = data.content || data;

    // Sortowanie alfabetyczne po nazwisku → imieniu
    list.sort((a, b) =>
        (a.lastName || "").localeCompare(b.lastName || "", "pl", { sensitivity: "base" }) ||
        (a.firstName || "").localeCompare(b.firstName || "", "pl", { sensitivity: "base" })
    );

    setCustomers(list);
}


// ============================================================
// FILTRY
// ============================================================

function renderCustomersFilters() {
    const container = document.getElementById("customers-filters");
    if (!container) return;

    container.innerHTML = `
        <div class="glass-card rounded-[2rem] p-4 mb-6 flex gap-4 items-center">
            <label class="text-sm font-semibold text-slate-600">Szukaj:</label>

            <input id="customers-filter-search" type="text"
                class="bg-slate-50 border border-slate-200 p-2 rounded-xl w-64"
                placeholder="Imię, nazwisko, email...">
        </div>
    `;

    document.getElementById("customers-filter-search").oninput = (e) => {
        state.filters.customers.search = e.target.value.toLowerCase();
        renderCustomersTable();
    };
}


// ============================================================
// TABELA
// ============================================================

function renderCustomersTable() {
    const container = document.getElementById("customers-table");
    if (!container) return;

    const search = state.filters.customers.search;
    let customers = state.customers;

    if (search) {
        customers = customers.filter(
            (c) =>
                (c.firstName || "").toLowerCase().includes(search) ||
                (c.lastName || "").toLowerCase().includes(search) ||
                (c.email || "").toLowerCase().includes(search)
        );
    }

    if (customers.length === 0) {
        container.innerHTML = `
            <div class="glass-card rounded-[2rem] p-6 text-slate-500 text-sm">
                Brak klientów do wyświetlenia.
            </div>
        `;
        return;
    }

    container.innerHTML = `
        <div class="glass-card rounded-[2rem] p-6 overflow-x-auto">
            <table class="w-full text-left table-fixed whitespace-nowrap">
                <thead>
                    <tr class="text-xs font-black text-slate-500 uppercase tracking-wider border-b border-slate-200">
                        <th class="py-3 w-40">Nazwisko</th>
                        <th class="py-3 w-40">Imię</th>
                        <th class="py-3 w-64">Email</th>
                        <th class="py-3 w-32">Telefon</th>
                        <th class="py-3 w-64">Adres</th>
                        <th class="py-3 w-40">Paczkomat</th>
                        <th class="py-3 w-32 text-center">Akcje</th>
                    </tr>
                </thead>

                <tbody>
                    ${customers
        .map(
            (c) => `
                        <tr class="hover:bg-slate-100">
                            <td class="py-3">${c.lastName || ""}</td>
                            <td class="py-3">${c.firstName || ""}</td>
                            <td class="py-3">${c.email || ""}</td>
                            <td class="py-3">${c.telephone || ""}</td>
                            <td class="py-3">${c.address || ""}</td>
                            <td class="py-3">${c.parcelLocker || "brak"}</td>

                            <td class="py-3 text-center">
                                <div class="flex justify-center gap-2">
                                    <button data-edit-customer="${c.id}"
                                        class="px-3 py-1 rounded-xl bg-yellow-100 text-yellow-700 font-bold hover:bg-yellow-200">
                                        Edytuj
                                    </button>

                                    <button data-delete-customer="${c.id}"
                                        class="px-3 py-1 rounded-xl bg-red-100 text-red-700 font-bold hover:bg-red-200">
                                        Usuń
                                    </button>
                                </div>
                            </td>
                        </tr>
                    `
        )
        .join("")}
                </tbody>
            </table>
        </div>
    `;

    attachCustomerRowEvents();
}


// ============================================================
// EVENTY
// ============================================================

function attachCustomerRowEvents() {
    document.querySelectorAll("[data-edit-customer]").forEach((btn) => {
        btn.onclick = async () => {
            const id = btn.dataset.editCustomer;
            const customer = await getCustomer(id);
            openCustomerModal(renderCustomerForm(customer));
            attachCustomerFormEvents(customer);
        };
    });

    document.querySelectorAll("[data-delete-customer]").forEach((btn) => {
        btn.onclick = async () => {
            const id = btn.dataset.deleteCustomer;

            if (!confirm("Czy na pewno chcesz usunąć tego klienta?")) return;

            try {
                await deleteCustomer(id);
                await loadCustomers();
                renderCustomersTable();
            } catch (e) {
                console.error("Błąd usuwania klienta:", e);
                alert("Nie udało się usunąć klienta");
            }
        };
    });
}


// ============================================================
// FORMULARZ
// ============================================================

export function renderCustomerForm(customer = null) {
    return `
        <div class="bg-white p-10 rounded-[3rem] max-w-3xl w-full shadow-2xl border border-slate-100">

            <h3 class="text-2xl font-black mb-6 text-slate-900 tracking-tight">
                ${customer ? "Edytuj klienta" : "Dodaj klienta"}
            </h3>

            <form id="customer-form" class="grid grid-cols-2 gap-6">

                <input type="hidden" id="customer-id" value="${customer?.id || ""}">

                <div>
                    <label class="block text-sm font-semibold text-slate-600 mb-1">Imię</label>
                    <input id="customer-firstName" type="text"
                        class="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl"
                        value="${customer?.firstName || ""}" required>
                </div>

                <div>
                    <label class="block text-sm font-semibold text-slate-600 mb-1">Nazwisko</label>
                    <input id="customer-lastName" type="text"
                        class="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl"
                        value="${customer?.lastName || ""}" required>
                </div>

                <div class="col-span-2">
                    <label class="block text-sm font-semibold text-slate-600 mb-1">Email (opcjonalnie)</label>
                    <input id="customer-email" type="email"
                        class="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl"
                        value="${customer?.email || ""}">
                </div>

                <div>
                    <label class="block text-sm font-semibold text-slate-600 mb-1">Telefon (opcjonalnie)</label>
                    <input id="customer-telephone" type="text"
                        class="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl"
                        value="${customer?.telephone || ""}">
                </div>

                <div>
                    <label class="block text-sm font-semibold text-slate-600 mb-1">Paczkomat (opcjonalnie)</label>
                    <input id="customer-parcelLocker" type="text"
                        class="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl"
                        value="${customer?.parcelLocker || ""}">
                </div>

                <div class="col-span-2">
                    <label class="block text-sm font-semibold text-slate-600 mb-1">Adres (opcjonalnie)</label>
                    <input id="customer-address" type="text"
                        class="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl"
                        value="${customer?.address || ""}">
                </div>

                <div class="col-span-2 flex justify-end gap-4 pt-4">
                    <button type="button" data-close-modal="customerModal"
                        class="px-6 py-3 rounded-2xl bg-slate-100 text-slate-500">
                        Anuluj
                    </button>

                    <button type="submit"
                        class="px-6 py-3 rounded-2xl bg-emerald-600 text-white font-bold">
                        Zapisz
                    </button>
                </div>

            </form>
        </div>
    `;
}


// ============================================================
// LOGIKA FORMULARZA
// ============================================================

export function attachCustomerFormEvents(existingCustomer = null) {
    const form = document.getElementById("customer-form");
    if (!form) return;

    form.onsubmit = async (e) => {
        e.preventDefault();

        const id = document.getElementById("customer-id").value;
        const firstName = document.getElementById("customer-firstName").value.trim();
        const lastName = document.getElementById("customer-lastName").value.trim();
        const email = document.getElementById("customer-email").value.trim();
        const telephone = document.getElementById("customer-telephone").value.trim();
        const parcelLocker = document.getElementById("customer-parcelLocker").value.trim();
        const address = document.getElementById("customer-address").value.trim();

        // Jedyna walidacja: imię + nazwisko
        if (!firstName || !lastName) {
            alert("Imię i nazwisko są wymagane.");
            return;
        }

        const payload = {
            id: id || null,
            firstName,
            lastName,
            email,
            telephone,
            address,
            parcelLocker
        };

        try {
            if (id) {
                await updateCustomer(id, payload);
            } else {
                await createCustomer(payload);
            }

            document.querySelector("[data-close-modal='customerModal']").click();
            await loadCustomers();
            renderCustomersTable();

        } catch (e) {
            console.error("Błąd zapisu klienta:", e);
            alert("Nie udało się zapisać klienta");
        }
    };
}


// ============================================================
// GŁÓWNE EVENTY
// ============================================================

function attachCustomerEvents() {
    const addBtn = document.getElementById("addCustomerBtn");
    if (addBtn) {
        addBtn.onclick = () => {
            openCustomerModal(renderCustomerForm());
            attachCustomerFormEvents();
        };
    }
}

document.addEventListener("click", (e) => {
    const closeBtn = e.target.closest("[data-close-modal='customerModal']");
    if (!closeBtn) return;
});
