import {api} from "./api.js";
import {
    state,
    setOrders,
    setSelectedCustomer,
    setOrderedSpiders,
    updateFilters,
    updatePagination,
    resetOrderState
} from "./state.js";

import {
    openOrderModal,
    openOrderDetailsModal,
    renderOrderDetailsModal,
    renderCustomerModal,
    renderSpiderModal
} from "./modals.js";

/* ============================================================
   ŁADOWANIE ZAMÓWIEŃ
============================================================ */

export async function loadOrders(page = 0) {
    updatePagination("orders", {page});

    try {
        const data = await api.getOrders();
        setOrders(data.content);
        renderOrdersSection();
    } catch (e) {
        console.error("Błąd ładowania zamówień:", e);
    }
}

/* ============================================================
   RENDEROWANIE SEKCJI ZAMÓWIEŃ
============================================================ */

function renderOrdersSection() {
    const section = document.getElementById("orders-section");

    section.innerHTML = `
        <div class="glass-card rounded-[3rem] p-10 mb-10 flex justify-between items-center">
            <h2 class="text-3xl font-[800] text-slate-900 tracking-tight">Zamówienia</h2>

            <button id="addOrderBtn"
                class="px-6 py-3 rounded-2xl font-bold bg-slate-900 text-white hover:bg-emerald-600 transition shadow-xl active:scale-95">
                Dodaj zamówienie
            </button>
        </div>

        ${renderOrderFilters()}

        <div class="glass-card rounded-[3rem] p-8 overflow-hidden">
            <table class="w-full text-left table-fixed whitespace-nowrap border-collapse">
                <thead>
                    <tr class="text-xs font-black text-slate-500 uppercase tracking-wider border-b border-slate-200">
                        <th class="py-4 w-32">Data</th>
                        <th class="py-4 w-32">Cena</th>
                        <th class="py-4 w-32">Status</th>
                        <th class="py-4 w-48">Klient</th>
                        <th class="py-4 text-center w-40">Akcje</th>
                    </tr>
                </thead>

                <tbody id="orders-table" class="divide-y divide-slate-100"></tbody>
            </table>
        </div>

        <div id="orders-pagination" class="flex justify-center mt-8"></div>
    `;

    renderOrderRows();
    renderOrderPagination();
    attachOrderEvents();
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
                ${statuses.map(([value, label]) => `
                    <button data-status="${value}"
                        class="px-5 py-2 rounded-xl font-bold ${
        state.filters.orders.status === value
            ? "bg-slate-900 text-white"
            : "bg-slate-100 text-slate-700 hover:bg-slate-200"
    }">
                        ${label}
                    </button>
                `).join("")}
            </div>
        </div>
    `;
}

function attachOrderFilterEvents() {
    document.querySelectorAll("[data-status]").forEach(btn => {
        btn.onclick = () => {
            updateFilters("orders", {status: btn.dataset.status});
            renderOrdersSection();
        };
    });
}

/* ============================================================
   RENDEROWANIE WIERSZY
============================================================ */

function getFilteredOrders() {
    const f = state.filters.orders;

    if (f.status === "all") return state.orders;

    return state.orders.filter(o => o.status === f.status);
}

function renderOrderRows() {
    const table = document.getElementById("orders-table");
    table.innerHTML = "";

    const orders = getFilteredOrders();
    const {page, size} = state.pagination.orders;

    const start = page * size;
    const end = start + size;

    orders.slice(start, end).forEach(o => {
        const tr = document.createElement("tr");

        tr.innerHTML = `
            <td class="py-4">${o.date}</td>
            <td class="py-4">${o.price.toFixed(2)} PLN</td>
            <td class="py-4">${o.status}</td>
            <td class="py-4">${o.customer.firstName} ${o.customer.lastName}</td>

            <td class="py-4 text-center">
                <button data-details="${o.id}"
                    class="px-4 py-2 rounded-xl bg-blue-100 text-blue-700 font-bold hover:bg-blue-200">
                    Szczegóły
                </button>

                <button data-edit="${o.id}"
                    class="px-4 py-2 rounded-xl bg-yellow-100 text-yellow-700 font-bold hover:bg-yellow-200 ml-2">
                    Edytuj
                </button>

                ${o.status === "NEW" ? `
                    <button data-cancel="${o.id}"
                        class="px-4 py-2 rounded-xl bg-red-100 text-red-700 font-bold hover:bg-red-200 ml-2">
                        Anuluj
                    </button>
                ` : ""}
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
    container.innerHTML = "";

    const orders = getFilteredOrders();
    const {page, size} = state.pagination.orders;

    const totalPages = Math.ceil(orders.length / size);
    if (totalPages <= 1) return;

    const createBtn = (p, label, disabled = false, active = false) => {
        const btn = document.createElement("button");
        btn.textContent = label;
        btn.className =
            "px-4 py-2 mx-1 rounded-xl font-bold " +
            (active ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-700 hover:bg-slate-200") +
            (disabled ? " opacity-40 cursor-not-allowed" : "");

        if (!disabled) btn.onclick = () => {
            updatePagination("orders", {page: p});
            renderOrdersSection();
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
   EVENTY
============================================================ */

function attachOrderEvents() {
    attachOrderFilterEvents();

    document.getElementById("addOrderBtn").onclick = () => {
        openOrderModal(renderOrderForm());
        initOrderForm();
    };

    document.querySelectorAll("[data-details]").forEach(btn => {
        btn.onclick = () => showOrderDetails(btn.dataset.details);
    });

    document.querySelectorAll("[data-edit]").forEach(btn => {
        btn.onclick = () => editOrder(btn.dataset.edit);
    });

    document.querySelectorAll("[data-cancel]").forEach(btn => {
        btn.onclick = () => cancelOrder(btn.dataset.cancel);
    });
}

/* ============================================================
   SZCZEGÓŁY ZAMÓWIENIA
============================================================ */

async function showOrderDetails(id) {
    try {
        const order = await api.getOrder(id);

        const html = `
            <h3 class="text-3xl font-black mb-8 text-slate-900 tracking-tight">Szczegóły zamówienia</h3>

            <p><strong>Data:</strong> ${order.date}</p>
            <p><strong>Status:</strong> ${order.status}</p>
            <p><strong>Cena:</strong> ${order.price.toFixed(2)} PLN</p>

            <hr class="my-6">

            <h4 class="text-xl font-black mb-2">Klient</h4>
            <p>${order.customer.firstName} ${order.customer.lastName}</p>
            <p>${order.customer.email}</p>
            <p>${order.customer.telephone}</p>
            <p>${order.customer.address}</p>
            <p>${order.customer.parcelLocker || "—"}</p>

            <hr class="my-6">

            <h4 class="text-xl font-black mb-2">Pająki</h4>

            <table class="w-full text-left table-fixed whitespace-nowrap border-collapse">
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
                    ${order.orderedSpiders.map(os => `
                        <tr>
                            <td class="py-3">${os.spider.typeName}</td>
                            <td class="py-3">${os.spider.speciesName}</td>
                            <td class="py-3">${os.spider.gender}</td>
                            <td class="py-3">${os.spider.size}</td>
                            <td class="py-3">${os.quantity}</td>
                            <td class="py-3">${os.spider.price.toFixed(2)} PLN</td>
                            <td class="py-3">${(os.quantity * os.spider.price).toFixed(2)} PLN</td>
                        </tr>
                    `).join("")}
                </tbody>
            </table>

            <div class="flex justify-end mt-6">
                <h4 class="text-xl font-black">
                    Suma: <span class="text-emerald-600">${order.price.toFixed(2)}</span> PLN
                </h4>
            </div>

            <div class="flex justify-end gap-4 mt-10">
                <button onclick="window.closeOrderDetailsModal()"
                    class="px-6 py-3 rounded-2xl font-bold bg-slate-100 text-slate-500 hover:bg-slate-200 transition">
                    Zamknij
                </button>
            </div>
        `;

        openOrderDetailsModal(renderOrderDetailsModal(html));

    } catch (e) {
        alert("Błąd wyświetlania szczegółów zamówienia");
    }
}

/* ============================================================
   TWORZENIE / EDYCJA ZAMÓWIENIA
============================================================ */

function renderOrderForm(order = null) {
    return `
        <div class="bg-white p-10 rounded-[3rem] max-w-5xl w-full shadow-2xl border border-slate-100 fade-in">

            <h3 class="text-3xl font-black mb-8 text-slate-900 tracking-tight">
                ${order ? "Edytuj zamówienie" : "Nowe zamówienie"}
            </h3>

            <form id="order-form">
                <input type="hidden" id="order-id" value="${order?.id || ""}">

                <div class="space-y-12">

                    <!-- WYBÓR KLIENTA -->
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-10">
                        <div>
                            <h4 class="text-xl font-black mb-4">Wybierz klienta</h4>
                            <div id="order-customers"></div>
                        </div>

                        <div>
                            <h4 class="text-xl font-black mb-4">Szczegóły klienta</h4>
                            <div id="order-customer-details"
                                 class="glass-card rounded-[2rem] p-6 text-slate-700">
                                Wybierz klienta z listy po lewej.
                            </div>
                        </div>
                    </div>

                    <!-- WYBÓR PAJĄKÓW -->
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-10">
                        <div>
                            <h4 class="text-xl font-black mb-4">Pająki dostępne</h4>
                            <div id="order-spiders"></div>
                        </div>

                        <div>
                            <h4 class="text-xl font-black mb-4">Pająki w zamówieniu</h4>
                            <div id="order-cart"></div>
                        </div>
                    </div>

                    <!-- DANE ZAMÓWIENIA -->
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-10">
                        <div>
                            <label class="text-xs font-black text-slate-400 uppercase ml-1">Status</label>
                            <select id="order-status"
                                    class="w-full bg-slate-50 border border-slate-200 p-4 rounded-2xl outline-none">
                                <option value="NEW">NOWE</option>
                                <option value="PENDING">OCZEKUJĄCE</option>
                                <option value="IN_PROGRESS">W TRAKCIE</option>
                                <option value="SHIPPED">WYSŁANE</option>
                                <option value="COMPLETED">ZAKOŃCZONE</option>
                                <option value="CANCELLED">ANULOWANE</option>
                            </select>
                        </div>

                        <div>
                            <label class="text-xs font-black text-slate-400 uppercase ml-1">Firma kurierska</label>
                            <select id="order-courierCompany"
                                    class="w-full bg-slate-50 border border-slate-200 p-4 rounded-2xl outline-none">
                                <option value="DPD">DPD</option>
                                <option value="INPOST">INPOST</option>
                                <option value="POCZTEX">POCZTEX</option>
                                <option value="UPS">UPS</option>
                                <option value="GLS">GLS</option>
                            </select>
                        </div>

                        <div>
                            <label class="text-xs font-black text-slate-400 uppercase ml-1">Numer przesyłki</label>
                            <input id="order-shipmentNumber"
                                   class="w-full bg-slate-50 border border-slate-200 p-4 rounded-2xl outline-none">
                        </div>

                        <div class="flex items-center gap-3 mt-6">
                            <input id="order-selfCollection" type="checkbox"
                                   class="w-5 h-5 rounded border-slate-300 text-emerald-600">
                            <label class="font-semibold">Odbiór osobisty</label>
                        </div>
                    </div>

                    <!-- PRZYCISKI -->
                    <div class="flex gap-4 pt-4">
                        <button type="submit"
                                class="flex-1 bg-emerald-600 text-white p-5 rounded-2xl font-black hover:bg-emerald-500 transition">
                            Zapisz zamówienie
                        </button>

                        <button type="button" onclick="window.closeOrderModal()"
                                class="flex-1 bg-slate-100 text-slate-500 p-5 rounded-2xl font-bold hover:bg-slate-200 transition">
                            Anuluj
                        </button>
                    </div>

                </div>
            </form>
        </div>
    `;
}

/* ============================================================
   INICJALIZACJA FORMULARZA ZAMÓWIENIA
============================================================ */

async function initOrderForm() {
    resetOrderState();

    await loadOrderCustomers();
    await loadOrderSpiders();

    attachOrderFormEvents();
}

/* ============================================================
   WYBÓR KLIENTA
============================================================ */

async function loadOrderCustomers() {
    const data = await api.getAllCustomers();

    const html = `
        <div class="glass-card rounded-[2rem] p-4">
            <table class="w-full text-left table-fixed whitespace-nowrap">
                <thead>
                    <tr class="text-xs font-black text-slate-500 uppercase tracking-wider border-b border-slate-200">
                        <th class="py-3 w-32">Imię</th>
                        <th class="py-3 w-40">Nazwisko</th>
                        <th class="py-3 text-center w-32">Akcja</th>
                    </tr>
                </thead>
                <tbody>
                    ${data.content
        .map(
            (c) => `
                        <tr class="hover:bg-slate-100">
                            <td class="py-3">${c.firstName}</td>
                            <td class="py-3">${c.lastName}</td>
                            <td class="py-3 text-center">
                                <button data-select-customer="${c.id}"
                                    class="px-4 py-2 rounded-xl bg-emerald-100 text-emerald-700 font-bold hover:bg-emerald-200">
                                    Wybierz
                                </button>
                            </td>
                        </tr>
                    `
        )
        .join("")}
                </tbody>
            </table>
        </div>
    `;

    document.getElementById("order-customers").innerHTML = html;

    attachCustomerSelectionEvents(data.content);
}
function attachCustomerSelectionEvents(customers) {
    document.querySelectorAll("[data-select-customer]").forEach((btn) => {
        btn.onclick = () => {
            const id = btn.dataset.selectCustomer;
            const customer = customers.find((c) => c.id === id);

            setSelectedCustomer(customer);

            document.getElementById("order-customer-details").innerHTML = `
                <p><strong>Imię:</strong> ${customer.firstName}</p>
                <p><strong>Nazwisko:</strong> ${customer.lastName}</p>
                <p><strong>Email:</strong> ${customer.email}</p>
                <p><strong>Telefon:</strong> ${customer.telephone}</p>
                <p><strong>Adres:</strong> ${customer.address}</p>
                <p><strong>Paczkomat:</strong> ${customer.parcelLocker || "—"}</p>
            `;
        };
    });
}
async function loadOrderSpiders() {
    const data = await api.getSpiders();

    const html = `
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
                        <th class="py-3 text-center w-32">Akcja</th>
                    </tr>
                </thead>
                <tbody>
                    ${data.content
        .map(
            (sp) => `
                        <tr class="hover:bg-slate-100">
                            <td class="py-3">${sp.typeName}</td>
                            <td class="py-3">${sp.speciesName}</td>
                            <td class="py-3">${sp.gender}</td>
                            <td class="py-3">${sp.size}</td>
                            <td class="py-3">${sp.quantity}</td>
                            <td class="py-3">${sp.price.toFixed(2)} PLN</td>

                            <td class="py-3 text-center">
                                <button data-add-spider="${sp.id}"
                                    class="px-4 py-2 rounded-xl bg-emerald-100 text-emerald-700 font-bold hover:bg-emerald-200">
                                    Dodaj
                                </button>
                            </td>
                        </tr>
                    `
        )
        .join("")}
                </tbody>
            </table>
        </div>
    `;

    document.getElementById("order-spiders").innerHTML = html;

    attachSpiderSelectionEvents(data.content);
}
function attachSpiderSelectionEvents(spiders) {
    document.querySelectorAll("[data-add-spider]").forEach((btn) => {
        btn.onclick = () => {
            const id = btn.dataset.addSpider;
            const spider = spiders.find((s) => s.id === id);

            const existing = state.orderedSpiders.find((os) => os.spider.id === id);

            if (existing) {
                existing.quantity += 1;
            } else {
                state.orderedSpiders.push({
                    spider,
                    quantity: 1
                });
            }

            setOrderedSpiders(state.orderedSpiders);
            renderOrderCart();
        };
    });
}
function renderOrderCart() {
    const cart = state.orderedSpiders;

    if (!cart.length) {
        document.getElementById("order-cart").innerHTML = `
            <div class="glass-card rounded-[2rem] p-6 text-slate-500">
                Brak pająków w zamówieniu.
            </div>
        `;
        return;
    }

    const html = `
        <div class="glass-card rounded-[2rem] p-4">
            <table class="w-full text-left table-fixed whitespace-nowrap">
                <thead>
                    <tr class="text-xs font-black text-slate-500 uppercase tracking-wider border-b border-slate-200">
                        <th class="py-3 w-32">Rodzaj</th>
                        <th class="py-3 w-40">Gatunek</th>
                        <th class="py-3 w-24">Ilość</th>
                        <th class="py-3 w-32">Cena</th>
                        <th class="py-3 w-32">Suma</th>
                        <th class="py-3 text-center w-32">Akcja</th>
                    </tr>
                </thead>
                <tbody>
                    ${cart
        .map(
            (os) => `
                        <tr>
                            <td class="py-3">${os.spider.typeName}</td>
                            <td class="py-3">${os.spider.speciesName}</td>
                            <td class="py-3">${os.quantity}</td>
                            <td class="py-3">${os.spider.price.toFixed(2)} PLN</td>
                            <td class="py-3">${(os.quantity * os.spider.price).toFixed(2)} PLN</td>

                            <td class="py-3 text-center">
                                <button data-remove-spider="${os.spider.id}"
                                    class="px-4 py-2 rounded-xl bg-red-100 text-red-700 font-bold hover:bg-red-200">
                                    Usuń
                                </button>
                            </td>
                        </tr>
                    `
        )
        .join("")}
                </tbody>
            </table>

            <div class="flex justify-end mt-6">
                <h4 class="text-xl font-black">
                    Suma: <span class="text-emerald-600">${calculateOrderTotal().toFixed(2)}</span> PLN
                </h4>
            </div>
        </div>
    `;

    document.getElementById("order-cart").innerHTML = html;

    attachRemoveSpiderEvents();
}
function attachRemoveSpiderEvents() {
    document.querySelectorAll("[data-remove-spider]").forEach((btn) => {
        btn.onclick = () => {
            const id = btn.dataset.removeSpider;

            const updated = state.orderedSpiders.filter((os) => os.spider.id !== id);

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
function attachOrderFormEvents() {
    const form = document.getElementById("order-form");

    form.onsubmit = async (e) => {
        e.preventDefault();

        if (!state.selectedCustomer) {
            alert("Wybierz klienta");
            return;
        }

        if (!state.orderedSpiders.length) {
            alert("Dodaj pająki do zamówienia");
            return;
        }

        const order = {
            customerId: state.selectedCustomer.id,
            orderedSpiders: state.orderedSpiders.map((os) => ({
                spiderId: os.spider.id,
                quantity: os.quantity
            })),
            status: document.getElementById("order-status").value,
            courierCompany: document.getElementById("order-courierCompany").value,
            shipmentNumber: document.getElementById("order-shipmentNumber").value,
            selfCollection: document.getElementById("order-selfCollection").checked,
            price: calculateOrderTotal()
        };

        const id = document.getElementById("order-id").value;

        try {
            if (id) {
                await api.updateOrder(id, order);
            } else {
                await api.saveOrder(order);
            }

            window.closeOrderModal();
            loadOrders(state.pagination.orders.page);

        } catch (e) {
            alert("Błąd zapisu zamówienia");
        }
    };
}
async function editOrder(id) {
    try {
        const order = await api.getOrder(id);

        openOrderModal(renderOrderForm(order));
        initOrderForm();

        // Ustaw dane zamówienia
        document.getElementById("order-status").value = order.status;
        document.getElementById("order-courierCompany").value = order.courierCompany || "DPD";
        document.getElementById("order-shipmentNumber").value = order.shipmentNumber || "";
        document.getElementById("order-selfCollection").checked = order.selfCollection;

        // Ustaw klienta
        setSelectedCustomer(order.customer);

        document.getElementById("order-customer-details").innerHTML = `
            <p><strong>Imię:</strong> ${order.customer.firstName}</p>
            <p><strong>Nazwisko:</strong> ${order.customer.lastName}</p>
            <p><strong>Email:</strong> ${order.customer.email}</p>
            <p><strong>Telefon:</strong> ${order.customer.telephone}</p>
            <p><strong>Adres:</strong> ${order.customer.address}</p>
            <p><strong>Paczkomat:</strong> ${order.customer.parcelLocker || "—"}</p>
        `;

        // Ustaw pająki
        const spiders = order.orderedSpiders.map((os) => ({
            spider: os.spider,
            quantity: os.quantity
        }));

        setOrderedSpiders(spiders);
        renderOrderCart();

    } catch (e) {
        alert("Błąd ładowania zamówienia");
    }
}
async function cancelOrder(id) {
    if (!confirm("Czy na pewno anulować zamówienie?")) return;

    try {
        const order = await api.getOrder(id);
        order.status = "CANCELLED";

        await api.updateOrder(id, order);

        loadOrders(state.pagination.orders.page);
    } catch (e) {
        alert("Błąd anulowania zamówienia");
    }
}
