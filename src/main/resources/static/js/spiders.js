import { api } from "./api.js";
import { state, setSpiders, updateFilters, updatePagination } from "./state.js";
import { openSpiderModal, renderSpiderModal } from "./modals.js";

/* ============================================================
   INICJALIZACJA
============================================================ */

export async function loadSpiders(page = 0) {
    updatePagination("spiders", { page });

    try {
        const data = await api.getSpiders();
        setSpiders(data.content);
        renderSpidersSection();
    } catch (e) {
        console.error("Błąd ładowania pająków:", e);
    }
}

/* ============================================================
   RENDEROWANIE SEKCJI
============================================================ */

function renderSpidersSection() {
    const section = document.getElementById("spiders-section");

    section.innerHTML = `
        <div class="glass-card rounded-[3rem] p-10 mb-10 flex justify-between items-center">
            <h2 class="text-3xl font-[800] text-slate-900 tracking-tight">Pająki</h2>

            <button id="addSpiderBtn"
                class="px-6 py-3 rounded-2xl font-bold bg-slate-900 text-white hover:bg-emerald-600 transition shadow-xl active:scale-95">
                Dodaj pająka
            </button>
        </div>

        ${renderFilters()}

        <div class="glass-card rounded-[3rem] p-8 overflow-hidden">
            <table class="w-full text-left table-fixed whitespace-nowrap border-collapse">
                <thead>
                    <tr class="text-xs font-black text-slate-500 uppercase tracking-wider border-b border-slate-200">
                        <th class="py-4 w-32">Rodzaj</th>
                        <th class="py-4 w-40">Gatunek</th>
                        <th class="py-4 w-24">Płeć</th>
                        <th class="py-4 w-24">Rozmiar</th>
                        <th class="py-4 w-24">Ilość</th>
                        <th class="py-4 w-32">Cena</th>
                        <th class="py-4 w-24">CITES</th>
                        <th class="py-4 text-center w-40">Akcje</th>
                    </tr>
                </thead>

                <tbody id="spiders-table" class="divide-y divide-slate-100"></tbody>
            </table>
        </div>

        <div id="spiders-pagination" class="flex justify-center mt-8"></div>
    `;

    renderSpiderRows();
    renderSpiderPagination();
    attachSpiderEvents();
}

/* ============================================================
   FILTRY
============================================================ */

function renderFilters() {
    const types = [...new Set(state.spiders.map(s => s.typeName))];
    const species = [...new Set(state.spiders.map(s => s.speciesName))];

    return `
        <div class="glass-card rounded-[3rem] p-8 mb-10">
            <h3 class="text-xs font-black text-slate-500 uppercase tracking-wider mb-6">Filtry</h3>

            <div class="grid grid-cols-1 md:grid-cols-4 gap-6">

                ${renderSelect("Rodzaj", "filter-type", types)}
                ${renderSelect("Gatunek", "filter-species", species)}

                <div>
                    <label class="text-xs font-black text-slate-400 uppercase ml-1">Płeć</label>
                    <select id="filter-gender"
                            class="w-full bg-slate-50 border border-slate-200 p-4 rounded-2xl outline-none focus:border-emerald-500 font-semibold text-slate-700">
                        <option value="">Wszystkie</option>
                        <option value="MALE">MALE</option>
                        <option value="FEMALE">FEMALE</option>
                        <option value="NS">NS</option>
                    </select>
                </div>

                <div>
                    <label class="text-xs font-black text-slate-400 uppercase ml-1">CITES</label>
                    <select id="filter-cites"
                            class="w-full bg-slate-50 border border-slate-200 p-4 rounded-2xl outline-none focus:border-emerald-500 font-semibold text-slate-700">
                        <option value="">Wszystkie</option>
                        <option value="Tak">Tak</option>
                        <option value="Nie">Nie</option>
                    </select>
                </div>

            </div>
        </div>
    `;
}

function renderSelect(label, id, values) {
    return `
        <div>
            <label class="text-xs font-black text-slate-400 uppercase ml-1">${label}</label>
            <select id="${id}"
                    class="w-full bg-slate-50 border border-slate-200 p-4 rounded-2xl outline-none focus:border-emerald-500 font-semibold text-slate-700">
                <option value="">Wszystkie</option>
                ${values.map(v => `<option value="${v}">${v}</option>`).join("")}
            </select>
        </div>
    `;
}

/* ============================================================
   FILTROWANIE
============================================================ */

function getFilteredSpiders() {
    const f = state.filters.spiders;

    return state.spiders.filter(sp => {
        return (!f.type || sp.typeName === f.type)
            && (!f.species || sp.speciesName === f.species)
            && (!f.gender || sp.gender === f.gender)
            && (!f.cites || (f.cites === "Tak" ? sp.cites : !sp.cites));
    });
}

function attachFilterEvents() {
    document.getElementById("filter-type").onchange = e => {
        updateFilters("spiders", { type: e.target.value });
        renderSpidersSection();
    };

    document.getElementById("filter-species").onchange = e => {
        updateFilters("spiders", { species: e.target.value });
        renderSpidersSection();
    };

    document.getElementById("filter-gender").onchange = e => {
        updateFilters("spiders", { gender: e.target.value });
        renderSpidersSection();
    };

    document.getElementById("filter-cites").onchange = e => {
        updateFilters("spiders", { cites: e.target.value });
        renderSpidersSection();
    };
}

/* ============================================================
   RENDEROWANIE WIERSZY
============================================================ */

function renderSpiderRows() {
    const table = document.getElementById("spiders-table");
    table.innerHTML = "";

    const spiders = getFilteredSpiders();
    const { page, size } = state.pagination.spiders;

    const start = page * size;
    const end = start + size;

    spiders.slice(start, end).forEach(sp => {
        const tr = document.createElement("tr");

        tr.innerHTML = `
            <td class="py-4">${sp.typeName}</td>
            <td class="py-4">${sp.speciesName}</td>
            <td class="py-4">${sp.gender}</td>
            <td class="py-4">${sp.size}</td>
            <td class="py-4">${sp.quantity}</td>
            <td class="py-4">${sp.price.toFixed(2)} PLN</td>
            <td class="py-4">${sp.cites ? "Tak" : "Nie"}</td>

            <td class="py-4 text-center">
                <button data-edit="${sp.id}"
                    class="px-4 py-2 rounded-xl bg-yellow-100 text-yellow-700 font-bold hover:bg-yellow-200">
                    Edytuj
                </button>

                <button data-delete="${sp.id}"
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

function renderSpiderPagination() {
    const container = document.getElementById("spiders-pagination");
    container.innerHTML = "";

    const spiders = getFilteredSpiders();
    const { page, size } = state.pagination.spiders;

    const totalPages = Math.ceil(spiders.length / size);
    if (totalPages <= 1) return;

    const createBtn = (p, label, disabled = false, active = false) => {
        const btn = document.createElement("button");
        btn.textContent = label;
        btn.className =
            "px-4 py-2 mx-1 rounded-xl font-bold " +
            (active ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-700 hover:bg-slate-200") +
            (disabled ? " opacity-40 cursor-not-allowed" : "");

        if (!disabled) btn.onclick = () => {
            updatePagination("spiders", { page: p });
            renderSpidersSection();
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

function attachSpiderEvents() {
    attachFilterEvents();

    document.getElementById("addSpiderBtn").onclick = () => {
        openSpiderModal(renderSpiderModal());
        attachSpiderFormEvents();
    };

    document.querySelectorAll("[data-edit]").forEach(btn => {
        btn.onclick = () => {
            const id = btn.dataset.edit;
            const spider = state.spiders.find(s => s.id === id);
            openSpiderModal(renderSpiderModal(spider));
            attachSpiderFormEvents(spider);
        };
    });

    document.querySelectorAll("[data-delete]").forEach(btn => {
        btn.onclick = () => deleteSpider(btn.dataset.delete);
    });
}

/* ============================================================
   ZAPIS / USUWANIE
============================================================ */

function attachSpiderFormEvents(existing = null) {
    const form = document.getElementById("spider-form");

    form.onsubmit = async (e) => {
        e.preventDefault();

        const spider = {
            typeName: document.getElementById("spider-typeName").value,
            speciesName: document.getElementById("spider-speciesName").value,
            gender: document.getElementById("spider-gender").value,
            quantity: parseInt(document.getElementById("spider-quantity").value),
            size: document.getElementById("spider-size").value,
            price: parseFloat(document.getElementById("spider-price").value)
        };

        try {
            if (existing) {
                await api.updateSpider(existing.id, spider);
            } else {
                await api.saveSpider(spider);
            }

            window.closeSpiderModal();
            loadSpiders(state.pagination.spiders.page);

        } catch (e) {
            alert("Błąd zapisu pająka");
        }
    };
}

async function deleteSpider(id) {
    if (!confirm("Usunąć pająka?")) return;

    try {
        await api.deleteSpider(id);
        loadSpiders(state.pagination.spiders.page);
    } catch {
        alert("Błąd usuwania pająka");
    }
}
