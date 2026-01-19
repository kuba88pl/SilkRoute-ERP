// js/customers.js

import { getCustomers, createCustomer } from "./api.js";
import { state, setCustomers } from "./state.js";
import { openCustomerModal } from "./modals.js";

/* ============================================================
   SEKCJA KLIENTÓW
============================================================ */

export async function loadCustomersSection() {
    const section = document.getElementById("customers-section");
    if (!section) return;

    section.innerHTML = `
        <div class="flex items-center justify-between mb-8">
            <div>
                <h2 class="text-3xl font-black tracking-tight text-slate-900">Klienci</h2>
                <p class="text-slate-500 mt-1">Zarządzaj bazą klientów.</p>
            </div>

            <button id="addCustomerBtn"
                class="px-6 py-3 rounded-2xl font-bold bg-emerald-600 text-white hover:bg-emerald-700 shadow-xl active:scale-95">
                Nowy klient
            </button>
        </div>

        <div class="glass-card rounded-[3rem] p-6">
            <div class="overflow-x-auto">
                <table class="w-full text-left table-fixed whitespace-nowrap border-collapse min-w-[700px]">
                    <thead>
                        <tr class="text-xs font-black text-slate-500 uppercase tracking-wider border-b border-slate-200">
                            <th class="py-3 w-48">Imię i nazwisko</th>
                            <th class="py-3 w-48">Email</th>
                            <th class="py-3 w-32">Telefon</th>
                            <th class="py-3 w-64">Adres</th>
                            <th class="py-3 w-40">Paczkomat</th>
                        </tr>
                    </thead>
                    <tbody id="customers-table" class="divide-y divide-slate-100"></tbody>
                </table>
            </div>
        </div>
    `;

    await loadCustomers();
    renderCustomersTable();
    attachCustomerEvents();
}

/* ============================================================
   ŁADOWANIE I RENDEROWANIE
============================================================ */

async function loadCustomers() {
    const data = await getCustomers();
    setCustomers(data.content || data);
}

function renderCustomersTable() {
    const tbody = document.getElementById("customers-table");
    if (!tbody) return;

    tbody.innerHTML = state.customers
        .map(
            (c) => `
        <tr>
            <td class="py-3">${c.firstName} ${c.lastName}</td>
            <td class="py-3">${c.email || "brak"}</td>
            <td class="py-3">${c.telephone || "brak"}</td>
            <td class="py-3">${c.address || "brak"}</td>
            <td class="py-3">${c.parcelLocker || "brak"}</td>
        </tr>
    `
        )
        .join("");
}

/* ============================================================
   EVENTY
============================================================ */

function attachCustomerEvents() {
    const btn = document.getElementById("addCustomerBtn");
    if (!btn) return;

    btn.onclick = () => {
        openCustomerModal(renderCustomerForm());
        attachCustomerFormEvents();
    };
}

/* ============================================================
   FORMULARZ DODAWANIA KLIENTA
============================================================ */

function renderCustomerForm() {
    return `
        <div class="bg-white p-10 rounded-[3rem] max-w-xl w-full shadow-2xl border border-slate-100 fade-in max-h-[90vh] overflow-y-auto">

            <h3 class="text-2xl font-black mb-6 text-slate-900 tracking-tight">Nowy klient</h3>

            <form id="customer-form" class="space-y-6">

                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label class="text-xs font-black text-slate-400 uppercase ml-1">Imię</label>
                        <input id="customer-firstName" type="text" required
                               class="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl outline-none focus:ring-2 focus:ring-emerald-400">
                    </div>

                    <div>
                        <label class="text-xs font-black text-slate-400 uppercase ml-1">Nazwisko</label>
                        <input id="customer-lastName" type="text" required
                               class="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl outline-none focus:ring-2 focus:ring-emerald-400">
                    </div>
                </div>

                <div>
                    <label class="text-xs font-black text-slate-400 uppercase ml-1">Email (opcjonalnie)</label>
                    <input id="customer-email" type="email"
                           class="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl outline-none focus:ring-2 focus:ring-emerald-400">
                </div>

                <div>
                    <label class="text-xs font-black text-slate-400 uppercase ml-1">Telefon (opcjonalnie)</label>
                    <input id="customer-telephone" type="text"
                           class="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl outline-none focus:ring-2 focus:ring-emerald-400">
                </div>

                <div>
                    <label class="text-xs font-black text-slate-400 uppercase ml-1">Adres (opcjonalnie)</label>
                    <textarea id="customer-address"
                              class="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl outline-none rounded-xl focus:ring-2 focus:ring-emerald-400"></textarea>
                </div>

                <div>
                    <label class="text-xs font-black text-slate-400 uppercase ml-1">Paczkomat (opcjonalnie)</label>
                    <input id="customer-parcelLocker" type="text"
                           placeholder="np. BBI01A"
                           class="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl outline-none focus:ring-2 focus:ring-emerald-400">
                </div>

                <div class="flex justify-end gap-4 pt-4">

                    <button type="button"
                            data-close-modal="customerModal"
                            class="px-6 py-3 rounded-2xl font-bold bg-slate-100 text-slate-500 hover:bg-slate-200 transition">
                        Anuluj
                    </button>

                    <button type="submit"
                            class="px-6 py-3 rounded-2xl font-bold bg-emerald-600 text-white hover:bg-emerald-700 transition shadow-xl active:scale-95">
                        Zapisz
                    </button>

                </div>

            </form>
        </div>
    `;
}

/* ============================================================
   OBSŁUGA FORMULARZA
============================================================ */

function attachCustomerFormEvents() {
    const form = document.getElementById("customer-form");
    if (!form) return;

    form.onsubmit = async (e) => {
        e.preventDefault();

        const payload = {
            firstName: document.getElementById("customer-firstName").value.trim(),
            lastName: document.getElementById("customer-lastName").value.trim(),
            email: document.getElementById("customer-email").value.trim() || null,
            telephone: document.getElementById("customer-telephone").value.trim() || null,
            address: document.getElementById("customer-address").value.trim() || null,
            parcelLocker: document.getElementById("customer-parcelLocker").value.trim() || null
        };

        if (!payload.firstName || !payload.lastName) {
            alert("Imię i nazwisko są wymagane");
            return;
        }

        try {
            await createCustomer(payload);
            document.querySelector("[data-close-modal='customerModal']").click();
            await loadCustomers();
            renderCustomersTable();
        } catch (e) {
            console.error("Błąd tworzenia klienta:", e);
            alert("Nie udało się dodać klienta");
        }
    };
}
