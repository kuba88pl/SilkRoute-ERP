// ============================================================
// IMPORTY
// ============================================================

import {
    getSpiders,
    getSpider,
    createSpider,
    updateSpider,
    deleteSpider
} from "./api.js";

import {
    state,
    setSpiders
} from "./state.js";

import {
    openSpiderModal
} from "./modals.js";


// ============================================================
// GŁÓWNA SEKCJA — LISTA PAJĄKÓW
// ============================================================

export async function loadSpidersSection() {
    const section = document.getElementById("spiders-section");
    if (!section) return;

    section.innerHTML = `
        <div class="flex items-center justify-between mb-8">
            <div>
                <h2 class="text-3xl font-black tracking-tight text-slate-900">Pająki</h2>
                <p class="text-slate-500 mt-1">Zarządzaj stanami magazynowymi.</p>
            </div>

            <button id="addSpiderBtn"
                class="px-6 py-3 rounded-2xl font-bold bg-emerald-600 text-white hover:bg-emerald-700 shadow-xl active:scale-95">
                Dodaj pająka
            </button>
        </div>

        <div id="spiders-filters"></div>
        <div id="spiders-table"></div>
    `;

    await loadSpiders();
    renderSpidersFilters();
    renderSpidersTable();
    attachSpiderEvents();
}


// ============================================================
// POBIERANIE PAJĄKÓW + SORTOWANIE
// ============================================================

async function loadSpiders() {
    const data = await getSpiders();
    const list = data.content || data;

    list.sort((a, b) =>
        (a.typeName || "").localeCompare(b.typeName || "", "pl", { sensitivity: "base" }) ||
        (a.speciesName || "").localeCompare(b.speciesName || "", "pl", { sensitivity: "base" })
    );

    setSpiders(list);
}


// ============================================================
// FILTRY — LISTY ROZWIJALNE
// ============================================================

function renderSpidersFilters() {
    const container = document.getElementById("spiders-filters");
    if (!container) return;

    const spiders = state.spiders;

    const unique = (arr) => [...new Set(arr.filter(Boolean))];

    const types = unique(spiders.map((s) => s.typeName));
    const species = unique(spiders.map((s) => s.speciesName));
    const genders = unique(spiders.map((s) => s.gender));
    const sizes = unique(spiders.map((s) => s.size));

    const makeSelect = (id, label, values) => `
        <div class="flex flex-col">
            <label class="text-sm font-semibold text-slate-600 mb-1">${label}</label>
            <select id="${id}" class="bg-slate-50 border border-slate-200 p-2 rounded-xl">
                <option value="">Wszystkie</option>
                ${values.map((v) => `<option value="${v}">${v}</option>`).join("")}
            </select>
        </div>
    `;

    container.innerHTML = `
        <div class="glass-card rounded-[2rem] p-4 mb-6 grid grid-cols-4 gap-6">
            ${makeSelect("filter-type", "Rodzaj", types)}
            ${makeSelect("filter-species", "Gatunek", species)}
            ${makeSelect("filter-gender", "Płeć", genders)}
            ${makeSelect("filter-size", "Rozmiar", sizes)}
        </div>
    `;

    ["filter-type", "filter-species", "filter-gender", "filter-size"].forEach((id) => {
        document.getElementById(id).onchange = () => renderSpidersTable();
    });
}


// ============================================================
// TABELA PAJĄKÓW
// ============================================================

function renderSpidersTable() {
    const container = document.getElementById("spiders-table");
    if (!container) return;

    const fType = document.getElementById("filter-type")?.value || "";
    const fSpecies = document.getElementById("filter-species")?.value || "";
    const fGender = document.getElementById("filter-gender")?.value || "";
    const fSize = document.getElementById("filter-size")?.value || "";

    const spiders = state.spiders.filter((s) => {
        return (
            (fType === "" || s.typeName === fType) &&
            (fSpecies === "" || s.speciesName === fSpecies) &&
            (fGender === "" || s.gender === fGender) &&
            (fSize === "" || s.size === fSize)
        );
    });

    if (spiders.length === 0) {
        container.innerHTML = `
            <div class="glass-card rounded-[2rem] p-6 text-slate-500 text-sm">
                Brak pająków do wyświetlenia.
            </div>
        `;
        return;
    }

    container.innerHTML = `
        <div class="glass-card rounded-[2rem] p-6 overflow-x-auto">
            <table class="w-full text-left table-fixed whitespace-nowrap">
                <thead>
                    <tr class="text-xs font-black text-slate-500 uppercase tracking-wider border-b border-slate-200">
                        <th class="py-3 w-32">Rodzaj</th>
                        <th class="py-3 w-40">Gatunek</th>
                        <th class="py-3 w-24">Płeć</th>
                        <th class="py-3 w-24">Rozmiar</th>
                        <th class="py-3 w-24">Ilość</th>
                        <th class="py-3 w-24">Cena</th>
                        <th class="py-3 w-32 text-center">Akcje</th>
                    </tr>
                </thead>

                <tbody>
                    ${spiders
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
                                <div class="flex justify-center gap-2">
                                    <button data-edit-spider="${sp.id}"
                                        class="px-3 py-1 rounded-xl bg-yellow-100 text-yellow-700 font-bold hover:bg-yellow-200">
                                        Edytuj
                                    </button>

                                    <button data-delete-spider="${sp.id}"
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

    attachSpiderRowEvents();
}


// ============================================================
// EVENTY W WIERSZACH
// ============================================================

function attachSpiderRowEvents() {
    document.querySelectorAll("[data-edit-spider]").forEach((btn) => {
        btn.onclick = async () => {
            const id = btn.dataset.editSpider;
            const spider = await getSpider(id);
            openSpiderModal(renderSpiderForm(spider));
            attachSpiderFormEvents(spider);
        };
    });

    document.querySelectorAll("[data-delete-spider]").forEach((btn) => {
        btn.onclick = async () => {
            const id = btn.dataset.deleteSpider;

            if (!confirm("Czy na pewno chcesz usunąć tego pająka?")) return;

            try {
                await deleteSpider(id);
                await loadSpiders();
                renderSpidersTable();
            } catch (e) {
                console.error("Błąd usuwania pająka:", e);
                alert("Nie udało się usunąć pająka");
            }
        };
    });
}


// ============================================================
// FORMULARZ
// ============================================================

export function renderSpiderForm(spider = null) {
    return `
        <div class="bg-white p-10 rounded-[3rem] max-w-3xl w-full shadow-2xl border border-slate-100">

            <h3 class="text-2xl font-black mb-6 text-slate-900 tracking-tight">
                ${spider ? "Edytuj pająka" : "Dodaj pająka"}
            </h3>

            <form id="spider-form" class="grid grid-cols-2 gap-6">

                <input type="hidden" id="spider-id" value="${spider?.id || ""}">

                <div>
                    <label class="block text-sm font-semibold text-slate-600 mb-1">Rodzaj</label>
                    <input id="spider-type" type="text"
                        class="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl"
                        value="${spider?.typeName || ""}" required>
                </div>

                <div>
                    <label class="block text-sm font-semibold text-slate-600 mb-1">Gatunek</label>
                    <input id="spider-species" type="text"
                        class="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl"
                        value="${spider?.speciesName || ""}" required>
                </div>

                <div>
                    <label class="block text-sm font-semibold text-slate-600 mb-1">Płeć</label>
                    <select id="spider-gender"
                        class="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl">
                        <option value="SAMIEC" ${spider?.gender === "SAMIEC" ? "selected" : ""}>Samiec</option>
                        <option value="SAMICA" ${spider?.gender === "SAMICA" ? "selected" : ""}>Samica</option>
                        <option value="NS" ${spider?.gender === "NS" ? "selected" : ""}>Nieznana</option>
                    </select>
                </div>

                <div>
                    <label class="block text-sm font-semibold text-slate-600 mb-1">Rozmiar</label>
                    <input id="spider-size" type="text"
                        class="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl"
                        value="${spider?.size || ""}" required>
                </div>

                <div>
                    <label class="block text-sm font-semibold text-slate-600 mb-1">Cena (PLN)</label>
                    <input id="spider-price" type="number" step="0.01" min="0"
                        class="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl"
                        value="${spider ? spider.price.toFixed(2) : ""}" required>
                </div>

                <div>
                    <label class="block text-sm font-semibold text-slate-600 mb-1">Ilość</label>
                    <input id="spider-quantity" type="number" min="0"
                        class="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl"
                        value="${spider?.quantity ?? ""}" required>
                </div>

                <div class="col-span-2 flex justify-end gap-4 pt-4">
                    <button type="button" data-close-modal="spiderModal"
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

export function attachSpiderFormEvents(existingSpider = null) {
    const form = document.getElementById("spider-form");
    if (!form) return;

    form.onsubmit = async (e) => {
        e.preventDefault();

        const id = document.getElementById("spider-id").value;
        const typeName = document.getElementById("spider-type").value.trim();
        const speciesName = document.getElementById("spider-species").value.trim();
        const gender = document.getElementById("spider-gender").value;
        const size = document.getElementById("spider-size").value.trim();
        const price = parseFloat(document.getElementById("spider-price").value);
        const quantity = parseInt(document.getElementById("spider-quantity").value);

        if (!typeName || !speciesName || !size || isNaN(price) || isNaN(quantity)) {
            alert("Uzupełnij wszystkie pola.");
            return;
        }

        const payload = {
            id: id || null,
            typeName,
            speciesName,
            gender,
            size,
            price,
            quantity
        };

        try {
            if (id) {
                await updateSpider(id, payload);
            } else {
                await createSpider(payload);
            }

            document.querySelector("[data-close-modal='spiderModal']").click();
            await loadSpiders();
            renderSpidersTable();

        } catch (e) {
            console.error("Błąd zapisu pająka:", e);
            alert("Nie udało się zapisać pająka");
        }
    };
}


// ============================================================
// GŁÓWNE EVENTY
// ============================================================

function attachSpiderEvents() {
    const addBtn = document.getElementById("addSpiderBtn");
    if (addBtn) {
        addBtn.onclick = () => {
            openSpiderModal(renderSpiderForm());
            attachSpiderFormEvents();
        };
    }
}

document.addEventListener("click", (e) => {
    const closeBtn = e.target.closest("[data-close-modal='spiderModal']");
    if (!closeBtn) return;
});
