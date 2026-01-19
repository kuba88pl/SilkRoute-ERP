import { getCustomers, createCustomer, updateCustomer, deleteCustomer } from "./api.js";
import { state, setCustomers } from "./state.js";
import { openCustomerModal } from "./modals.js";

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

        <!-- FILTRY -->
        <div class="glass-card rounded-[2rem] p-6 mb-6">
            <div class="grid grid-cols-1 md:grid-cols-5 gap-4">

                <input id="filter-name" type="text" placeholder="Filtr: imię / nazwisko"
                    class="bg-slate-50 border border-slate-200 p-3 rounded-xl">

                <input id="filter-email" type="text" placeholder="Filtr: email"
                    class="bg-slate-50 border border-slate-200 p-3 rounded-xl">

                <input id="filter-phone" type="text" placeholder="Filtr: telefon"
                    class="bg-slate-50 border border-slate-200 p-3 rounded-xl">

                <input id="filter-address" type="text" placeholder="Filtr: adres"
                    class="bg-slate-50 border border-slate-200 p-3 rounded-xl">

                <input id="filter-parcel" type="text" placeholder="Filtr: paczkomat"
                    class="bg-slate-50 border border-slate-200 p-3 rounded-xl">

            </div>
        </div>

        <!-- TABELA BEZ SCROLLA -->
        <div class="glass-card rounded-[3rem] p-6">

            <table class="w-full max-w-none text-left table-fixed whitespace-nowrap border-collapse">
                <thead>
                    <tr class="text-xs font-black text-slate-500 uppercase tracking-wider border-b border-slate-200">
                        <th class="py-3 w-56">Imię i nazwisko</th>
                        <th class="py-3 w-72">Email</th>
                        <th class="py-3 w-48">Telefon</th>
                        <th class="py-3 w-[420px]">Adres</th>
                        <th class="py-3 w-48">Paczkomat</th>
                        <th class="py-3 w-40 text-center">Akcje</th>
                    </tr>
                </thead>
                <tbody id="customers-table" class="divide-y divide-slate-100"></tbody>
            </table>

        </div>
    `;

    await loadCustomers();
    renderCustomersTable();
    attachCustomerEvents();
    attachFilters();
}

async function loadCustomers() {
    const data = await getCustomers();
    setCustomers(data.content || data);
}

function getFilteredCustomers() {
    const name = document.getElementById("filter-name").value.toLowerCase();
    const email = document.getElementById("filter-email").value.toLowerCase();
    const phone = document.getElementById("filter-phone").value.toLowerCase();
    const address = document.getElementById("filter-address").value.toLowerCase();
    const parcel = document.getElementById("filter-parcel").value.toLowerCase();

    return state.customers.filter((c) => {
        return (
            (`${c.firstName} ${c.lastName}`.toLowerCase().includes(name)) &&
            ((c.email || "").toLowerCase().includes(email)) &&
            ((c.telephone || "").toLowerCase().includes(phone)) &&
            ((c.address || "").toLowerCase().includes(address)) &&
            ((c.parcelLocker || "").toLowerCase().includes(parcel))
        );
    });
}

function renderCustomersTable() {
    const tbody = document.getElementById("customers-table");
    if (!tbody) return;

    const customers = getFilteredCustomers();

    tbody.innerHTML = customers
        .map(
            (c) => `
        <tr>
            <td class="py-3">${c.firstName} ${c.lastName}</td>
            <td class="py-3">${c.email || "brak"}</td>
            <td class="py-3">${c.telephone || "brak"}</td>
            <td class="py-3">${c.address || "brak"}</td>
            <td class="py-3">${c.parcelLocker || "brak"}</td>
            <td class="py-3">
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
        .join("");
}

function attachFilters() {
    const inputs = [
        "filter-name",
        "filter-email",
        "filter-phone",
        "filter-address",
        "filter-parcel"
    ];

    inputs.forEach((id) => {
        document.getElementById(id).addEventListener("input", () => {
            renderCustomersTable();
            attachCustomerEvents();
        });
    });
}

function attachCustomerEvents() {
    const btn = document.getElementById("addCustomerBtn");
    if (btn) {
        btn.onclick = () => {
            openCustomerModal(renderCustomerForm());
            attachCustomerFormEvents();
        };
    }

    document.querySelectorAll("[data-edit-customer]").forEach((btn) => {
        btn.onclick = () => {
            const id = btn.dataset.editCustomer;
            const customer = state.customers.find((c) => String(c.id) === String(id));
            if (!customer) return;

            openCustomerModal(renderCustomerForm(customer));
            attachCustomerFormEvents(customer);
        };
    });

    document.querySelectorAll("[data-delete-customer]").forEach((btn) => {
        btn.onclick = async () => {
            const id = btn.dataset.deleteCustomer;
            const customer = state.customers.find((c) => String(c.id) === String(id));
            if (!customer) return;

            if (!confirm(`Usunąć klienta: ${customer.firstName} ${customer.lastName}?`)) return;

            await deleteCustomer(id);
            await loadCustomers();
            renderCustomersTable();
            attachCustomerEvents();
        };
    });
}

function renderCustomerForm(customer = null) {
    return `
        <div class="bg-white p-10 rounded-[3rem] max-w-xl w-full shadow-2xl border border-slate-100 fade-in max-h-[90vh] overflow-y-auto">

            <h3 class="text-2xl font-black mb-6 text-slate-900 tracking-tight">
                ${customer ? "Edytuj klienta" : "Nowy klient"}
            </h3>

            <form id="customer-form" class="space-y-6">

                <input type="hidden" id="customer-id" value="${customer?.id || ""}">

                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">

                    <div>
                        <label for="customer-firstName" class="block text-sm font-semibold text-slate-600 mb-1">
                            Imię
                        </label>
                        <input id="customer-firstName" type="text" required
                               value="${customer?.firstName || ""}"
                               class="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl">
                    </div>

                    <div>
                        <label for="customer-lastName" class="block text-sm font-semibold text-slate-600 mb-1">
                            Nazwisko
                        </label>
                        <input id="customer-lastName" type="text" required
                               value="${customer?.lastName || ""}"
                               class="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl">
                    </div>

                </div>

                <div>
                    <label for="customer-email" class="block text-sm font-semibold text-slate-600 mb-1">
                        Email
                    </label>
                    <input id="customer-email" type="email"
                           value="${customer?.email || ""}"
                           class="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl">
                </div>

                <div>
                    <label for="customer-telephone" class="block text-sm font-semibold text-slate-600 mb-1">
                        Telefon
                    </label>
                    <input id="customer-telephone" type="text"
                           value="${customer?.telephone || ""}"
                           class="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl">
                </div>

                <div>
                    <label for="customer-address" class="block text-sm font-semibold text-slate-600 mb-1">
                        Adres
                    </label>
                    <textarea id="customer-address"
                              class="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl">${customer?.address || ""}</textarea>
                </div>

                <div>
                    <label for="customer-parcelLocker" class="block text-sm font-semibold text-slate-600 mb-1">
                        Paczkomat
                    </label>
                    <input id="customer-parcelLocker" type="text"
                           value="${customer?.parcelLocker || ""}"
                           class="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl">
                </div>

                <div class="flex justify-end gap-4 pt-4">
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

function attachCustomerFormEvents(existingCustomer = null) {
    const form = document.getElementById("customer-form");
    if (!form) return;

    form.onsubmit = async (e) => {
        e.preventDefault();

        const id = document.getElementById("customer-id").value || null;

        const payload = {
            firstName: document.getElementById("customer-firstName").value.trim(),
            lastName: document.getElementById("customer-lastName").value.trim(),
            email: document.getElementById("customer-email").value.trim() || null,
            telephone: document.getElementById("customer-telephone").value.trim() || null,
            address: document.getElementById("customer-address").value.trim() || null,
            parcelLocker: document.getElementById("customer-parcelLocker").value.trim() || null
        };

        if (id) {
            await updateCustomer(id, payload);
        } else {
            await createCustomer(payload);
        }

        document.querySelector("[data-close-modal='customerModal']").click();
        await loadCustomers();
        renderCustomersTable();
        attachCustomerEvents();
    };
}
