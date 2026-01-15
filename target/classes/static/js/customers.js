import { api } from "./api.js";
import { state, setCustomers, updatePagination } from "./state.js";
import { openCustomerModal, renderCustomerModal } from "./modals.js";

/* ============================================================
   INICJALIZACJA
============================================================ */

export async function loadCustomers(page = 0) {
    updatePagination("customers", { page });

    const { size } = state.pagination.customers;

    try {
        const data = await api.getCustomers(page, size);
        setCustomers(data.content);
        renderCustomersTable(data);
    } catch (e) {
        console.error("Błąd ładowania klientów:", e);
    }
}

/* ============================================================
   RENDEROWANIE TABELI
============================================================ */

function renderCustomersTable(data) {
    const section = document.getElementById("customers-section");

    section.innerHTML = `
        <div class="glass-card rounded-[3rem] p-10 mb-10 flex justify-between items-center">
            <h2 class="text-3xl font-[800] text-slate-900 tracking-tight">Klienci</h2>

            <button id="addCustomerBtn"
                class="px-6 py-3 rounded-2xl font-bold bg-slate-900 text-white hover:bg-emerald-600 transition shadow-xl active:scale-95">
                Dodaj klienta
            </button>
        </div>

        <div class="glass-card rounded-[3rem] p-8 overflow-hidden">
            <table class="w-full text-left table-fixed whitespace-nowrap border-collapse">
                <thead>
                    <tr class="text-xs font-black text-slate-500 uppercase tracking-wider border-b border-slate-200">
                        <th class="py-4 w-32">Imię</th>
                        <th class="py-4 w-40">Nazwisko</th>
                        <th class="py-4 w-48">Adres</th>
                        <th class="py-4 w-32">Paczkomat</th>
                        <th class="py-4 w-32">Telefon</th>
                        <th class="py-4 w-48">Email</th>
                        <th class="py-4 text-center w-40">Akcje</th>
                    </tr>
                </thead>

                <tbody id="customers-table" class="divide-y divide-slate-100"></tbody>
            </table>
        </div>

        <div id="customers-pagination" class="flex justify-center mt-8"></div>
    `;

    renderRows();
    renderPagination(data);
    attachEvents();
}

function renderRows() {
    const table = document.getElementById("customers-table");
    table.innerHTML = "";

    state.customers.forEach(c => {
        const tr = document.createElement("tr");

        tr.innerHTML = `
            <td class="py-4">${c.firstName}</td>
            <td class="py-4">${c.lastName}</td>
            <td class="py-4">${c.address}</td>
            <td class="py-4">${c.parcelLocker}</td>
            <td class="py-4">${c.telephone}</td>
            <td class="py-4">${c.email}</td>

            <td class="py-4 text-center">
                <button data-edit="${c.id}"
                    class="px-4 py-2 rounded-xl bg-yellow-100 text-yellow-700 font-bold hover:bg-yellow-200">
                    Edytuj
                </button>

                <button data-delete="${c.id}"
                    class="px-4 py-2 rounded-xl bg-red-100 text-red-700 font-bold hover:bg-red-200 ml-2">
                    Usuń
                </button>
            </td>
        `;

        table.appendChild(tr);
    });
}

/* ============================================================
   PAGINACJA
============================================================ */

function renderPagination(data) {
    const container = document.getElementById("customers-pagination");
    container.innerHTML = "";

    if (data.totalPages <= 1) return;

    const { page } = state.pagination.customers;

    const createBtn = (p, label, disabled = false, active = false) => {
        const btn = document.createElement("button");
        btn.textContent = label;
        btn.className =
            "px-4 py-2 mx-1 rounded-xl font-bold " +
            (active ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-700 hover:bg-slate-200") +
            (disabled ? " opacity-40 cursor-not-allowed" : "");

        if (!disabled) btn.onclick = () => loadCustomers(p);
        return btn;
    };

    container.appendChild(createBtn(page - 1, "«", page === 0));

    for (let i = 0; i < data.totalPages; i++) {
        container.appendChild(createBtn(i, i + 1, false, i === page));
    }

    container.appendChild(createBtn(page + 1, "»", page === data.totalPages - 1));
}

/* ============================================================
   EVENTY
============================================================ */

function attachEvents() {
    document.getElementById("addCustomerBtn").onclick = () => {
        openCustomerModal(renderCustomerModal());
        attachCustomerFormEvents();
    };

    document.querySelectorAll("[data-edit]").forEach(btn => {
        btn.onclick = () => {
            const id = btn.dataset.edit;
            const customer = state.customers.find(c => c.id === id);
            openCustomerModal(renderCustomerModal(customer));
            attachCustomerFormEvents(customer);
        };
    });

    document.querySelectorAll("[data-delete]").forEach(btn => {
        btn.onclick = () => deleteCustomer(btn.dataset.delete);
    });
}

/* ============================================================
   ZAPIS / USUWANIE
============================================================ */

function attachCustomerFormEvents(existing = null) {
    const form = document.getElementById("customer-form");

    form.onsubmit = async (e) => {
        e.preventDefault();

        const customer = {
            firstName: document.getElementById("customer-firstName").value,
            lastName: document.getElementById("customer-lastName").value,
            telephone: document.getElementById("customer-telephone").value,
            email: document.getElementById("customer-email").value,
            address: document.getElementById("customer-address").value,
            parcelLocker: document.getElementById("customer-parcelLocker").value
        };

        try {
            if (existing) {
                await api.updateCustomer(existing.id, customer);
            } else {
                await api.saveCustomer(customer);
            }

            window.closeCustomerModal();
            loadCustomers(state.pagination.customers.page);

        } catch (e) {
            alert("Błąd zapisu klienta");
        }
    };
}

async function deleteCustomer(id) {
    if (!confirm("Usunąć klienta?")) return;

    try {
        await api.deleteCustomer(id);
        loadCustomers(state.pagination.customers.page);
    } catch {
        alert("Nie można usunąć klienta — ma aktywne zamówienia.");
    }
}
