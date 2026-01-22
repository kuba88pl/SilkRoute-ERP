// js/orders.js

/* ============================================================
   IMPORTY
============================================================ */

import {
    state,
    setOrders,
    setSelectedCustomer,
    setOrderedSpiders,
    updateOrderFilters,
    updateOrderPagination,
    resetOrderState
} from "./state.js";

import {
    getOrders,
    getOrder,
    getCustomers,
    getSpiders,
    createOrder,
    updateOrder,
    cancelOrder
} from "./api.js";

import {
    openOrderModal,
    openOrderDetailsModal
} from "./modals.js";

/* ============================================================
   MAPOWANIE STATUSÓW
============================================================ */

function mapOrderStatus(status) {
    switch (status) {
        case "NEW": return "Nowe";
        case "PENDING": return "Oczekujące";
        case "IN_PROGRESS": return "W trakcie";
        case "SHIPPED": return "Wysłane";
        case "COMPLETED": return "Zakończone";
        case "CANCELLED": return "Anulowane";
        default: return status;
    }
}

/* ============================================================
   SEKCJA ZAMÓWIEŃ
============================================================ */

export async function loadOrdersSection() {
    const section = document.getElementById("orders-section");
    if (!section) return;

    section.innerHTML = `
        <div class="flex items-center justify-between mb-8">
            <div>
                <h2 class="text-3xl font-black tracking-tight text-slate-900">Zamówienia</h2>
                <p class="text-slate-500 mt-1">Zarządzaj zamówieniami, wysyłką i statusem.</p>
            </div>

            <button id="addOrderBtn"
                class="px-6 py-3 rounded-2xl font-bold bg-emerald-600 text-white hover:bg-emerald-700 shadow-xl active:scale-95">
                Nowe zamówienie
            </button>
        </div>

        ${renderOrderFilters()}

        <div class="glass-card rounded-[3rem] p-6">
            <div class="overflow-x-auto">
                <table class="w-full text-left table-fixed whitespace-nowrap border-collapse min-w-[700px]">
                    <thead>
                        <tr class="text-xs font-black text-slate-500 uppercase tracking-wider border-b border-slate-200">
                            <th class="py-3 w-32">Data</th>
                            <th class="py-3 w-32">Cena</th>
                            <th class="py-3 w-32">Status</th>
                            <th class="py-3 w-48">Klient</th>
                            <th class="py-3 w-48 text-center">Akcje</th>
                        </tr>
                    </thead>
                    <tbody id="orders-table" class="divide-y divide-slate-100"></tbody>
                </table>
            </div>

            <div id="orders-pagination" class="flex justify-center mt-6"></div>
        </div>
    `;

    await loadOrders();
    renderOrderRows();
    renderOrderPagination();
    attachOrderEvents();
}

/* ============================================================
   ŁADOWANIE
============================================================ */

async function loadOrders() {
    const data = await getOrders();
    setOrders(data.content || data);
}

/* ============================================================
   FILTRY
============================================================ */

function renderOrderFilters() {
    const statuses = [
        ["all", "Wszystkie"],
        ["NEW", "Nowe"],
        ["PENDING", "Oczekujące"],
        ["IN_PROGRESS", "W trakcie"],
        ["SHIPPED", "Wysłane"],
        ["COMPLETED", "Zakończone"],
        ["CANCELLED", "Anulowane"]
    ];

    return `
        <div class="glass-card rounded-[3rem] p-8 mb-10">
            <h3 class="text-xs font-black text-slate-500 uppercase tracking-wider mb-6">Filtruj według statusu</h3>

            <div class="flex flex-wrap gap-3">
                ${statuses
        .map(
            ([value, label]) => `
                    <button data-status="${value}"
                        class="px-5 py-2 rounded-xl font-bold ${
                state.filters.orders.status === value
                    ? "bg-slate-900 text-white"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200"
            }">
                        ${label}
                    </button>
                `
        )
        .join("")}
            </div>
        </div>
    `;
}

function attachOrderFilterEvents() {
    document.querySelectorAll("[data-status]").forEach((btn) => {
        btn.onclick = () => {
            updateOrderFilters({ status: btn.dataset.status });
            updateOrderPagination({ page: 0 });
            loadOrdersSection();
        };
    });
}

/* ============================================================
   TABELA ZAMÓWIEŃ
============================================================ */

function getFilteredOrders() {
    const f = state.filters.orders;
    if (f.status === "all") return state.orders;
    return state.orders.filter((o) => o.status === f.status);
}

function renderOrderRows() {
    const table = document.getElementById("orders-table");
    if (!table) return;

    table.innerHTML = "";

    const orders = getFilteredOrders();
    const { page, size } = state.pagination.orders;

    const start = page * size;
    const end = start + size;

    orders.slice(start, end).forEach((o) => {
        const tr = document.createElement("tr");

        tr.innerHTML = `
            <td class="py-4">${o.date}</td>
            <td class="py-4">${o.price.toFixed(2)} PLN</td>
            <td class="py-4">${mapOrderStatus(o.status)}</td>
            <td class="py-4">${o.customer.firstName} ${o.customer.lastName}</td>

            <td class="py-4">
                <div class="flex justify-center gap-2">
                    <button class="order-btn bg-blue-100 text-blue-700" data-details="${o.id}">Szczegóły</button>
                    <button class="order-btn bg-yellow-100 text-yellow-700" data-edit="${o.id}">Edytuj</button>
                    ${
            o.status === "NEW"
                ? `<button class="order-btn bg-red-100 text-red-700" data-cancel="${o.id}">Anuluj</button>`
                : ""
        }
                </div>
            </td>
        `;

        table.appendChild(tr);
    });
}

/* ============================================================
   PAGINACJA
============================================================ */

function renderOrderPagination() {
    const container = document.getElementById("orders-pagination");
    if (!container) return;

    container.innerHTML = "";

    const orders = getFilteredOrders();
    const { page, size } = state.pagination.orders;

    const totalPages = Math.ceil(orders.length / size);
    if (totalPages <= 1) return;

    const createBtn = (p, label, disabled = false, active = false) => {
        const btn = document.createElement("button");
        btn.textContent = label;
        btn.className =
            "px-4 py-2 mx-1 rounded-xl font-bold " +
            (active ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-700 hover:bg-slate-200") +
            (disabled ? " opacity-40 cursor-not-allowed" : "");

        if (!disabled)
            btn.onclick = () => {
                updateOrderPagination({ page: p });
                loadOrdersSection();
            };

        return btn;
    };

    container.appendChild(createBtn(page - 1, "«", page === 0));

    for (let i = 0; i < totalPages; i++) {
        container.appendChild(createBtn(i, i + 1, false, i === page));
    }

    container.appendChild(createBtn(page + 1, "»", page === totalPages - 1));
}

/* ============================================================
   SZCZEGÓŁY ZAMÓWIENIA
============================================================ */

async function showOrderDetails(id) {
    const order = await getOrder(id);

    const html = `
        <div class="bg-white p-10 rounded-[3rem] max-w-5xl w-full shadow-2xl border border-slate-100 fade-in max-h-[90vh] overflow-y-auto">

            <h3 class="text-3xl font-black mb-8 text-slate-900 tracking-tight">Szczegóły zamówienia</h3>

            <p><strong>Data:</strong> ${order.date}</p>
            <p><strong>Status:</strong> ${mapOrderStatus(order.status)}</p>
            <p><strong>Cena:</strong> ${order.price.toFixed(2)} PLN</p>

            <hr class="my-6">

            <h4 class="text-xl font-black mb-2">Klient</h4>
            <p>${order.customer.firstName} ${order.customer.lastName}</p>
            <p>${order.customer.email}</p>
            <p>${order.customer.telephone}</p>
            <p>${order.customer.address}</p>
            <p>${order.customer.parcelLocker || "—"}</p>

            <hr class="my-6">

            <h4 class="text-xl font-black mb-2">Wysyłka</h4>
            <p><strong>Kurier:</strong> ${order.courierCompany || "—"}</p>
            <p><strong>Numer przesyłki:</strong> ${order.shipmentNumber || "—"}</p>

            <hr class="my-6">

            <h4 class="text-xl font-black mb-2">Pająki</h4>

            <table class="w-full text-left table-fixed whitespace-nowrap border-collapse min-w-[700px]">
                <thead>
                    <tr class="text-xs font-black text-slate-500 uppercase tracking-wider border-b border-slate-200">
                        <th class="py-3 w-32">Rodzaj</th>
                        <th class="py-3 w-40">Gatunek</th>
                        <th class="py-3 w-24">Płeć</th>
                        <th class="py-3 w-24">Rozmiar</th>
                        <th class="py-3 w-24">Ilość</th>
                        <th class="py-3 w-32">Cena</th>
                        <th class="py-3 w-32">Suma</th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-slate-100">
                    ${order.orderedSpiders
        .map(
            (os) => `
                        <tr>
                            <td class="py-3">${os.spider.typeName}</td>
                            <td class="py-3">${os.spider.speciesName}</td>
                            <td class="py-3">${os.spider.gender}</td>
                            <td class="py-3">${os.spider.size}</td>
                            <td class="py-3">${os.quantity}</td>
                            <td class="py-3">${os.spider.price.toFixed(2)} PLN</td>
                            <td class="py-3">${(os.quantity * os.spider.price).toFixed(2)} PLN</td>
                        </tr>
                    `
        )
        .join("")}
                </tbody>
            </table>

            <div class="flex justify-end mt-6">
                <h4 class="text-xl font-black">
                    Suma: <span class="text-emerald-600">${order.price.toFixed(2)}</span> PLN
                </h4>
            </div>

            <div class="flex justify-end gap-4 mt-10">
                <button type="button"
                        data-close-modal="orderDetailsModal"
                        class="px-6 py-3 rounded-2xl font-bold bg-slate-100 text-slate-500 hover:bg-slate-200">
                    Zamknij
                </button>
            </div>

        </div>
    `;

    openOrderDetailsModal(html);
}

/* ============================================================
   FORMULARZ ZAMÓWIENIA
============================================================ */

function renderOrderForm(order = null) {
    return `
        <div class="bg-white p-10 rounded-[3rem] max-w-5xl w-full shadow-2xl border border-slate-100 fade-in max-h-[90vh] overflow-y-auto">

            <h3 class="text-3xl font-black mb-8 text-slate-900 tracking-tight">
                ${order ? "Edytuj zamówienie" : "Nowe zamówienie"}
            </h3>

            <form id="order-form">

                <input type="hidden" id="order-id" value="${order?.id || ""}">

                <div class="space-y-12">

                    <!-- KLIENCI -->
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-10">

                        <div>
                            <h4 class="text-xl font-black mb-4">Wybierz klienta</h4>
                            <div class="max-h-[350px] overflow-y-auto pr-2">
                                <div id="order-customers"></div>
                            </div>
                        </div>

                        <div>
                            <h4 class="text-xl font-black mb-4">Szczegóły klienta</h4>
                            <div id="order-customer-details"
                                 class="glass-card rounded-[2rem] p-6 text-slate-700">
                                Wybierz klienta z listy po lewej.
                            </div>
                        </div>

                    </div>

                    <!-- PAJĄKI -->
                    <div class="space-y-6">

                        <h4 class="text-xl font-black mb-4">Pająki</h4>

                        <input id="order-spiders-filter"
                               type="text"
                               placeholder="Filtruj po gatunku..."
                               class="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl outline-none focus:ring-2 focus:ring-emerald-400">

                        <div class="max-h-[400px] overflow-y-auto pr-2">
                            <div id="order-spiders"></div>
                        </div>

                        <h4 class="text-xl font-black mt-10 mb-4">Koszyk</h4>
                        <div id="order-cart"></div>

                    </div>

                    <!-- CENA -->
                    <div class="mt-12">
                        <label class="text-xs font-black text-slate-400 uppercase ml-1">Cena końcowa (PLN)</label>

                        <div class="flex items-center gap-3">
                            <input id="order-final-price"
                                   type="number"
                                   step="0.01"
                                   value="0"
                                   readonly
                                   class="flex-1 bg-slate-50 border border-slate-200 p-4 rounded-2xl outline-none text-slate-700">

                            <button type="button"
                                    id="order-final-price-edit"
                                    class="px-4 py-2 rounded-xl bg-slate-200 text-slate-700 font-bold hover:bg-slate-300">
                                Edytuj
                            </button>
                        </div>
                    </div>

                    <!-- WYSYŁKA -->
                    <div class="mt-12 space-y-6">

                        <h4 class="text-xl font-black mb-4">Wysyłka</h4>

                        <div id="order-courier-section" class="space-y-2">
                            <label class="text-xs font-black text-slate-400 uppercase ml-1">Kurier</label>
                            <select id="order-courier-company"
                                    class="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl outline-none focus:ring-2 focus:ring-emerald-400">
                                <option value="">— wybierz kuriera —</option>
                                <option value="DPD">DPD</option>
                                <option value="INPOST">InPost</option>
                                <option value="POCZTEX">Pocztex</option>
                                <option value="UPS">UPS</option>
                                <option value="GLS">GLS</option>
                            </select>
                        </div>

                        <div id="order-tracking-section" class="space-y-2">
                            <label class="text-xs font-black text-slate-400 uppercase ml-1">Numer przesyłki</label>
                            <input id="order-shipment-number"
                                   type="text"
                                   placeholder="np. 1234567890"
                                   class="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl outline-none focus:ring-2 focus:ring-emerald-400">
                        </div>

                        <div class="space-y-2">
                            <label class="text-xs font-black text-slate-400 uppercase ml-1">Status zamówienia</label>
                            <select id="order-status"
                                    class="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl outline-none focus:ring-2 focus:ring-emerald-400">
                                <option value="NEW">Nowe</option>
                                <option value="PENDING">Oczekujące</option>
                                <option value="IN_PROGRESS">W trakcie</option>
                                <option value="SHIPPED">Wysłane</option>
                                <option value="COMPLETED">Zakończone</option>
                                <option value="CANCELLED">Anulowane</option>
                            </select>
                        </div>

                    </div>

                    <!-- PRZYCISKI -->
                    <div class="flex justify-end gap-4 mt-12">

                        <button type="button"
                                data-close-modal="orderModal"
                                class="px-6 py-3 rounded-2xl font-bold bg-slate-100 text-slate-500 hover:bg-slate-200 transition">
                            Anuluj
                        </button>

                                                <button type="submit"
                                class="px-6 py-3 rounded-2xl font-bold bg-emerald-600 text-white hover:bg-emerald-700 transition shadow-xl active:scale-95">
                            Zapisz zamówienie
                        </button>

                    </div>

                </div>

            </form>
        </div>
    `;
}
/* ============================================================
   KLIENCI W FORMULARZU
============================================================ */

async function loadOrderCustomers() {
    const data = await getCustomers();
    state.customers = data.content || data;
    renderOrderCustomers();
    renderOrderCustomerDetails();
}

function renderOrderCustomers() {
    const container = document.getElementById("order-customers");
    if (!container) return;

    const customers = state.customers;

    container.innerHTML = customers
        .map(
            (c) => `
        <button type="button"
                data-customer-id="${c.id}"
                class="w-full text-left mb-2 px-4 py-3 rounded-2xl border ${
                state.selectedCustomer && state.selectedCustomer.id === c.id
                    ? "border-slate-900 bg-slate-900 text-white"
                    : "border-slate-200 hover:border-slate-400 bg-white"
            }">
            <div class="font-bold">${c.firstName} ${c.lastName}</div>
            <div class="text-xs text-slate-500">${c.email}</div>
        </button>
    `
        )
        .join("");

    document.querySelectorAll("[data-customer-id]").forEach((btn) => {
        btn.onclick = () => {
            const id = btn.dataset.customerId;
            const customer = customers.find((c) => String(c.id) === String(id));
            setSelectedCustomer(customer);
            renderOrderCustomers();
            renderOrderCustomerDetails();
        };
    });
}

function renderOrderCustomerDetails() {
    const container = document.getElementById("order-customer-details");
    if (!container) return;

    const c = state.selectedCustomer;

    if (!c) {
        container.innerHTML = `
            <p class="text-slate-500">Wybierz klienta z listy po lewej.</p>
        `;
        return;
    }

    container.innerHTML = `
        <div class="space-y-2 text-sm">
            <div>
                <div class="text-xs font-black text-slate-400 uppercase">Imię i nazwisko</div>
                <div class="font-bold text-slate-800">${c.firstName} ${c.lastName}</div>
            </div>

            <div>
                <div class="text-xs font-black text-slate-400 uppercase">Email</div>
                <div>${c.email}</div>
            </div>

            <div>
                <div class="text-xs font-black text-slate-400 uppercase">Telefon</div>
                <div>${c.telephone}</div>
            </div>

            <div>
                <div class="text-xs font-black text-slate-400 uppercase">Adres</div>
                <div>${c.address}</div>
            </div>

            <div>
                <div class="text-xs font-black text-slate-400 uppercase">Paczkomat</div>
                <div>${c.parcelLocker || "—"}</div>
            </div>
        </div>
    `;
}
/* ============================================================
   PAJĄKI W FORMULARZU
============================================================ */

let availableSpidersCache = [];
let availableSpidersFilter = "";

async function loadOrderSpiders() {
    const data = await getSpiders();
    availableSpidersCache = (data.content || data).map((sp) => ({ ...sp }));

    renderFilteredSpiders();
    attachSpiderFilterEvent();
}

function attachSpiderFilterEvent() {
    const input = document.getElementById("order-spiders-filter");
    if (!input) return;

    input.oninput = () => {
        availableSpidersFilter = input.value.toLowerCase();
        renderFilteredSpiders();
    };
}

function getFilteredSpiders() {
    return availableSpidersCache.filter((sp) =>
        sp.speciesName.toLowerCase().includes(availableSpidersFilter)
    );
}

function renderFilteredSpiders() {
    const spiders = getFilteredSpiders();
    const container = document.getElementById("order-spiders");
    if (!container) return;

    container.innerHTML = `
        <div class="glass-card rounded-[2rem] p-4">
            <table class="w-full text-left table-fixed whitespace-nowrap">
                <thead>
                    <tr class="text-xs font-black text-slate-500 uppercase tracking-wider border-b border-slate-200">
                        <th class="py-3 w-32">Rodzaj</th>
                        <th class="py-3 w-40">Gatunek</th>
                        <th class="py-3 w-24">Płeć</th>
                        <th class="py-3 w-24">Rozmiar</th>
                        <th class="py-3 w-24">Stan</th>
                        <th class="py-3 w-32">Cena</th>
                        <th class="py-3 text-center w-40">Akcja</th>
                    </tr>
                </thead>

                <tbody>
                    ${spiders
        .map(
            (sp) => `
                        <tr class="hover:bg-slate-100" data-spider-row="${sp.id}">
                            <td class="py-3">${sp.typeName}</td>
                            <td class="py-3">${sp.speciesName}</td>
                            <td class="py-3">${sp.gender}</td>
                            <td class="py-3">${sp.size}</td>
                            <td class="py-3" data-spider-qty="${sp.id}">${sp.quantity}</td>
                            <td class="py-3">${sp.price.toFixed(2)} PLN</td>

                            <td class="py-3 text-center">
                                <div class="flex items-center gap-2 justify-center">

                                    <input type="number"
                                           min="1"
                                           max="${sp.quantity}"
                                           value="1"
                                           form="none"
                                           data-qty-input="${sp.id}"
                                           class="w-16 bg-slate-50 border border-slate-300 rounded-xl p-2 text-center outline-none focus:ring-2 focus:ring-emerald-400">

                                    <button type="button"
                                            data-add-spider="${sp.id}"
                                            class="px-4 py-2 rounded-xl font-bold ${
                sp.quantity > 0
                    ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-200"
                    : "bg-slate-200 text-slate-400 cursor-not-allowed"
            }"
                                            ${sp.quantity === 0 ? "disabled" : ""}>
                                        Dodaj
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

    attachSpiderSelectionEvents();
}

function attachSpiderSelectionEvents() {
    document.querySelectorAll("[data-add-spider]").forEach((btn) => {
        btn.onclick = () => {
            const id = btn.dataset.addSpider;
            const spider = availableSpidersCache.find((s) => String(s.id) === String(id));
            if (!spider) return;

            const qtyInput = document.querySelector(`[data-qty-input="${id}"]`);
            const qty = parseInt(qtyInput.value) || 1;

            if (qty > spider.quantity) {
                alert("Brak wystarczającej ilości w magazynie");
                return;
            }

            const existing = state.orderedSpiders.find(
                (os) => String(os.spider.id) === String(id)
            );

            if (existing) {
                existing.quantity += qty;
            } else {
                state.orderedSpiders.push({
                    spider: { ...spider },
                    quantity: qty
                });
            }

            spider.quantity -= qty;

            updateSpiderRowInTable(spider);
            renderOrderCart();
        };
    });
}
/* ============================================================
   KOSZYK
============================================================ */

function updateSpiderRowInTable(spider) {
    const qtyCell = document.querySelector(`[data-spider-qty="${spider.id}"]`);
    const addBtn = document.querySelector(`[data-add-spider="${spider.id}"]`);
    const qtyInput = document.querySelector(`[data-qty-input="${spider.id}"]`);

    if (!qtyCell || !addBtn || !qtyInput) return;

    qtyCell.textContent = spider.quantity;
    qtyInput.max = spider.quantity;

    if (spider.quantity === 0) {
        addBtn.disabled = true;
        addBtn.className =
            "px-4 py-2 rounded-xl font-bold bg-slate-200 text-slate-400 cursor-not-allowed";
    }
}

function renderOrderCart() {
    const cart = state.orderedSpiders;
    const container = document.getElementById("order-cart");
    if (!container) return;

    if (cart.length === 0) {
        container.innerHTML = `
            <div class="glass-card rounded-[2rem] p-6 text-slate-500 text-sm">
                Koszyk jest pusty. Dodaj pająki z listy powyżej.
            </div>
        `;
        updateFinalPriceField();
        return;
    }

    container.innerHTML = `
        <div class="glass-card rounded-[2rem] p-4">
            <table class="w-full text-left table-fixed whitespace-nowrap">
                <thead>
                    <tr class="text-xs font-black text-slate-500 uppercase tracking-wider border-b border-slate-200">
                        <th class="py-3 w-32">Rodzaj</th>
                        <th class="py-3 w-40">Gatunek</th>
                        <th class="py-3 w-24">Płeć</th>
                        <th class="py-3 w-24">Rozmiar</th>
                        <th class="py-3 w-24">Ilość</th>
                        <th class="py-3 w-32">Cena</th>
                        <th class="py-3 w-32">Suma</th>
                        <th class="py-3 text-center w-24">Usuń</th>
                    </tr>
                </thead>

                <tbody>
                    ${cart
        .map(
            (os) => `
                        <tr class="hover:bg-slate-100">
                            <td class="py-3">${os.spider.typeName}</td>
                            <td class="py-3">${os.spider.speciesName}</td>
                            <td class="py-3">${os.spider.gender}</td>
                            <td class="py-3">${os.spider.size}</td>
                            <td class="py-3">${os.quantity}</td>
                            <td class="py-3">${os.spider.price.toFixed(2)} PLN</td>
                            <td class="py-3">${(os.quantity * os.spider.price).toFixed(2)} PLN</td>

                            <td class="py-3 text-center">
                                <button type="button"
                                        data-remove-spider="${os.spider.id}"
                                        class="px-3 py-1 rounded-xl bg-red-100 text-red-700 font-bold hover:bg-red-200">
                                    X
                                </button>
                            </td>
                        </tr>
                    `
        )
        .join("")}
                </tbody>
            </table>
        </div>

        <div class="flex justify-end mt-6">
            <h4 class="text-xl font-black">
                Suma: <span class="text-emerald-600">${calculateOrderTotal().toFixed(
        2
    )}</span> PLN
            </h4>
        </div>
    `;

    attachRemoveSpiderEvents();
    updateFinalPriceField();
}

function attachRemoveSpiderEvents() {
    document.querySelectorAll("[data-remove-spider]").forEach((btn) => {
        btn.onclick = () => {
            const id = btn.dataset.removeSpider;

            const removed = state.orderedSpiders.find(
                (os) => String(os.spider.id) === String(id)
            );
            if (!removed) return;

            const spider = availableSpidersCache.find(
                (s) => String(s.id) === String(id)
            );
            if (spider) {
                spider.quantity += removed.quantity;
                updateSpiderRowInTable(spider);
            }

            const updated = state.orderedSpiders.filter(
                (os) => String(os.spider.id) !== String(id)
            );

            setOrderedSpiders(updated);
            renderOrderCart();
        };
    });
}

function calculateOrderTotal() {
    return state.orderedSpiders.reduce(
        (sum, os) => sum + os.quantity * os.spider.price,
        0
    );
}

function updateFinalPriceField() {
    const input = document.getElementById("order-final-price");
    if (!input) return;

    if (input.readOnly) {
        input.value = calculateOrderTotal().toFixed(2);
    }
}
/* ============================================================
   FORMULARZ — LOGIKA
============================================================ */

function attachOrderFormEvents() {
    const form = document.getElementById("order-form");
    if (!form) return;

    document.getElementById("order-final-price-edit").onclick = () => {
        const input = document.getElementById("order-final-price");

        if (input.readOnly) {
            input.readOnly = false;
            input.classList.remove("bg-slate-50");
            input.classList.add("bg-white", "border-emerald-400");
        } else {
            input.readOnly = true;
            input.classList.add("bg-slate-50");
            input.classList.remove("bg-white", "border-emerald-400");
            input.value = calculateOrderTotal().toFixed(2);
        }
    };

    form.onsubmit = async (e) => {
        e.preventDefault();

        const id = document.getElementById("order-id").value;
        const customer = state.selectedCustomer;
        const items = state.orderedSpiders;

        if (!customer) {
            alert("Wybierz klienta");
            return;
        }

        if (items.length === 0) {
            alert("Dodaj przynajmniej jednego pająka");
            return;
        }

        const finalPrice = parseFloat(
            document.getElementById("order-final-price").value
        );

        const courierCompany = document.getElementById("order-courier-company").value;
        const shipmentNumber = document.getElementById("order-shipment-number").value;
        const status = document.getElementById("order-status").value;

        // 🔥 POPRAWKA — backend używa SHIPPED
        if (status === "SHIPPED") {
            if (!courierCompany) {
                alert("Wybierz kuriera");
                return;
            }
            if (!shipmentNumber.trim()) {
                alert("Podaj numer przesyłki");
                return;
            }
        }

        const payload = {
            id: id || null,
            customerId: customer.id,
            price: finalPrice,
            courierCompany: courierCompany || null,
            shipmentNumber: shipmentNumber || null,
            status: status,
            orderedSpiders: items.map((os) => ({
                spiderId: os.spider.id,
                quantity: os.quantity
            }))
        };

        try {
            if (id) {
                await updateOrder(id, payload);
            } else {
                await createOrder(payload);
            }

            document.querySelector("[data-close-modal='orderModal']").click();
            resetOrderState();
            loadOrdersSection();
        } catch (e) {
            console.error("Błąd zapisu zamówienia:", e);
            alert("Nie udało się zapisać zamówienia");
        }
    };
}
/* ============================================================
   EDYCJA ZAMÓWIENIA
============================================================ */

async function editOrder(id) {
    try {
        const order = await getOrder(id);

        resetOrderState();

        setSelectedCustomer(order.customer);
        setOrderedSpiders(
            order.orderedSpiders.map((os) => ({
                spider: os.spider,
                quantity: os.quantity
            }))
        );

        openOrderModal(renderOrderForm(order));

        await new Promise((r) => setTimeout(r, 0));

        attachOrderFormEvents();

        renderOrderCustomers();
        renderOrderCustomerDetails();
        renderOrderCart();

        await loadOrderSpiders();
        await loadOrderCustomers();

        document.getElementById("order-final-price").value =
            order.price.toFixed(2);
        document.getElementById("order-status").value = order.status;

        document.getElementById("order-courier-company").value =
            order.courierCompany || "";
        document.getElementById("order-shipment-number").value =
            order.shipmentNumber || "";

    } catch (e) {
        console.error("Błąd edycji zamówienia:", e);
        alert("Nie udało się wczytać zamówienia");
    }
}
/* ============================================================
   ANULOWANIE ZAMÓWIENIA
============================================================ */

async function cancelOrderAction(id) {
    if (!confirm("Czy na pewno chcesz anulować to zamówienie?")) return;

    try {
        await cancelOrder(id);
        loadOrdersSection();
    } catch (e) {
        alert("Nie udało się anulować zamówienia");
    }
}
/* ============================================================
   EVENTY GŁÓWNE
============================================================ */

function attachOrderEvents() {
    const addBtn = document.getElementById("addOrderBtn");
    if (addBtn) {
        addBtn.onclick = async () => {
            resetOrderState();

            openOrderModal(renderOrderForm());

            await new Promise((r) => setTimeout(r, 0));

            attachOrderFormEvents();

            await loadOrderCustomers();
            await loadOrderSpiders();

            renderOrderCustomers();
            renderOrderCustomerDetails();
            renderOrderCart();
        };
    }

    document.querySelectorAll("[data-details]").forEach((btn) => {
        btn.onclick = () => showOrderDetails(btn.dataset.details);
    });

    document.querySelectorAll("[data-edit]").forEach((btn) => {
        btn.onclick = () => editOrder(btn.dataset.edit);
    });

    document.querySelectorAll("[data-cancel]").forEach((btn) => {
        btn.onclick = () => cancelOrderAction(btn.dataset.cancel);
    });

    attachOrderFilterEvents();
}

