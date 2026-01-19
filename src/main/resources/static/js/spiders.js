// js/spiders.js

import { getSpiders, createSpider } from "./api.js";
import { state, setSpiders } from "./state.js";
import { openSpiderModal } from "./modals.js";

/* ============================================================
   SEKCJA PAJĄKÓW
============================================================ */

export async function loadSpidersSection() {
    const section = document.getElementById("spiders-section");
    if (!section) return;

    section.innerHTML = `
        <div class="flex items-center justify-between mb-8">
            <div>
                <h2 class="text-3xl font-black tracking-tight text-slate-900">Pająki</h2>
                <p class="text-slate-500 mt-1">Zarządzaj stanem magazynowym pająków.</p>
            </div>

            <button id="addSpiderBtn"
                class="px-6 py-3 rounded-2xl font-bold bg-emerald-600 text-white hover:bg-emerald-700 shadow-xl active:scale-95">
                Nowy pająk
            </button>
        </div>

        <div class="glass-card rounded-[3rem] p-6">
            <div class="overflow-x-auto">
                <table class="w-full text-left table-fixed whitespace-nowrap border-collapse min-w-[700px]">
                    <thead>
                        <tr class="text-xs font-black text-slate-500 uppercase tracking-wider border-b border-slate-200">
                            <th class="py-3 w-32">Rodzaj</th>
                            <th class="py-3 w-40">Gatunek</th>
                            <th class="py-3 w-24">Płeć</th>
                            <th class="py-3 w-24">Rozmiar</th>
                            <th class="py-3 w-24">Stan</th>
                            <th class="py-3 w-32">Cena</th>
                        </tr>
                    </thead>
                    <tbody id="spiders-table" class="divide-y divide-slate-100"></tbody>
                </table>
            </div>
        </div>
    `;

    await loadSpiders();
    renderSpidersTable();
    attachSpiderEvents();
}

/* ============================================================
   ŁADOWANIE I RENDEROWANIE
============================================================ */

async function loadSpiders() {
    const data = await getSpiders();
    setSpiders(data.content || data);
}

function renderSpidersTable() {
    const tbody = document.getElementById("spiders-table");
    if (!tbody) return;

    tbody.innerHTML = state.spiders
        .map(
            (sp) => `
        <tr>
            <td class="py-3">${sp.typeName}</td>
            <td class="py-3">${sp.speciesName}</td>
            <td class="py-3">${sp.gender}</td>
            <td class="py-3">${sp.size}</td>
            <td class="py-3">${sp.quantity}</td>
            <td class="py-3">${sp.price.toFixed(2)} PLN</td>
        </tr>
    `
        )
        .join("");
}

/* ============================================================
   EVENTY
============================================================ */

function attachSpiderEvents() {
    const btn = document.getElementById("addSpiderBtn");
    if (!btn) return;

    btn.onclick = () => {
        openSpiderModal(renderSpiderForm());
        attachSpiderFormEvents();
    };
}

/* ============================================================
   FORMULARZ DODAWANIA PAJĄKA
============================================================ */

function renderSpiderForm() {
    return `
        <div class="bg-white p-10 rounded-[3rem] max-w-xl w-full shadow-2xl border border-slate-100 fade-in max-h-[90vh] overflow-y-auto">

            <h3 class="text-2xl font-black mb-6 text-slate-900 tracking-tight">Nowy pająk</h3>

            <form id="spider-form" class="space-y-6">

                <div>
                    <label class="text-xs font-black text-slate-400 uppercase ml-1">Rodzaj</label>
                    <input id="spider-typeName" type="text" required
                           class="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl outline-none focus:ring-2 focus:ring-emerald-400">
                </div>

                <div>
                    <label class="text-xs font-black text-slate-400 uppercase ml-1">Gatunek</label>
                    <input id="spider-speciesName" type="text" required
                           class="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl outline-none focus:ring-2 focus:ring-emerald-400">
                </div>

                <div class="grid grid-cols-1 md:grid-cols-3 gap-4">

                    <div>
                        <label class="text-xs font-black text-slate-400 uppercase ml-1">Płeć</label>
                        <select id="spider-gender" required
                                class="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl outline-none focus:ring-2 focus:ring-emerald-400">
                            <option value="">— wybierz —</option>
                            <option value="FEMALE">Samica</option>
                            <option value="MALE">Samiec</option>
                            <option value="NS">Nieznana</option>
                        </select>
                    </div>

                    <div>
                        <label class="text-xs font-black text-slate-400 uppercase ml-1">Rozmiar</label>
                        <input id="spider-size" type="text" required
                               placeholder="np. L4, subadult, 2cm"
                               class="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl outline-none focus:ring-2 focus:ring-emerald-400">
                    </div>

                    <div>
                        <label class="text-xs font-black text-slate-400 uppercase ml-1">Stan (ilość)</label>
                        <input id="spider-quantity" type="number" min="1" step="1" required
                               class="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl outline-none focus:ring-2 focus:ring-emerald-400">
                    </div>

                </div>

                <div>
                    <label class="text-xs font-black text-slate-400 uppercase ml-1">Cena (PLN)</label>
                    <input id="spider-price" type="number" min="0.01" step="0.01" required
                           class="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl outline-none focus:ring-2 focus:ring-emerald-400">
                </div>

                <div class="flex justify-end gap-4 pt-4">

                    <button type="button"
                            data-close-modal="spiderModal"
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

function attachSpiderFormEvents() {
    const form = document.getElementById("spider-form");
    if (!form) return;

    form.onsubmit = async (e) => {
        e.preventDefault();

        const payload = {
            typeName: document.getElementById("spider-typeName").value.trim(),
            speciesName: document.getElementById("spider-speciesName").value.trim(),
            gender: document.getElementById("spider-gender").value,
            size: document.getElementById("spider-size").value.trim(),
            quantity: parseInt(document.getElementById("spider-quantity").value, 10),
            price: parseFloat(document.getElementById("spider-price").value)
        };

        // WALIDACJA FRONTENDOWA

        if (!payload.typeName) return alert("Podaj rodzaj");
        if (!payload.speciesName) return alert("Podaj gatunek");
        if (!payload.gender) return alert("Wybierz płeć");
        if (!payload.size) return alert("Podaj rozmiar");
        if (!Number.isFinite(payload.quantity) || payload.quantity < 1)
            return alert("Ilość musi być większa niż 0");
        if (!Number.isFinite(payload.price) || payload.price <= 0)
            return alert("Cena musi być większa niż 0");

        try {
            await createSpider(payload);
            document.querySelector("[data-close-modal='spiderModal']").click();
            await loadSpiders();
            renderSpidersTable();
        } catch (e) {
            console.error("Błąd tworzenia pająka:", e);
            alert("Nie udało się dodać pająka — sprawdź dane.");
        }
    };
}
