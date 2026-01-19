import { getSpiders, createSpider, updateSpider, deleteSpider } from "./api.js";
import { state, setSpiders } from "./state.js";
import { openSpiderModal } from "./modals.js";

function mapGender(g) {
    switch (g) {
        case "SAMIEC": return "samiec";
        case "SAMICA": return "samica";
        default: return "brak danych";
    }
}

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
            <table class="w-full max-w-none text-left table-fixed whitespace-nowrap border-collapse">

                <thead>
                    <tr class="text-xs font-black text-slate-500 uppercase tracking-wider border-b border-slate-200">
                        <th class="py-3 w-32">Rodzaj</th>
                        <th class="py-3 w-40">Gatunek</th>
                        <th class="py-3 w-24">Płeć</th>
                        <th class="py-3 w-24">Rozmiar</th>
                        <th class="py-3 w-24">Ilość</th>
                        <th class="py-3 w-32">Cena</th>
                        <th class="py-3 w-40 text-center">Akcje</th>
                    </tr>

                    <!-- FILTRY -->
                    <tr class="border-b border-slate-200 text-xs text-slate-600">

                        <th class="py-2">
                            <select id="filter-typeName"
                                class="w-full bg-slate-50 border border-slate-200 p-2 rounded-lg"></select>
                        </th>

                        <th class="py-2">
                            <select id="filter-speciesName"
                                class="w-full bg-slate-50 border border-slate-200 p-2 rounded-lg"></select>
                        </th>

                        <th class="py-2">
                            <select id="filter-gender"
                                class="w-full bg-slate-50 border border-slate-200 p-2 rounded-lg">
                                <option value="">Wszystkie</option>
                                <option value="SAMIEC">samiec</option>
                                <option value="SAMICA">samica</option>
                                <option value="NS">brak danych</option>
                            </select>
                        </th>

                        <th class="py-2">
                            <select id="filter-size"
                                class="w-full bg-slate-50 border border-slate-200 p-2 rounded-lg"></select>
                        </th>

                        <th class="py-2">
                            <select id="filter-quantity"
                                class="w-full bg-slate-50 border border-slate-200 p-2 rounded-lg"></select>
                        </th>

                        <th class="py-2">
                            <select id="filter-price"
                                class="w-full bg-slate-50 border border-slate-200 p-2 rounded-lg">
                                <option value="">Wszystkie</option>
                                <option value="0-50">0–50 zł</option>
                                <option value="50-100">50–100 zł</option>
                                <option value="100-200">100–200 zł</option>
                                <option value="200-500">200–500 zł</option>
                                <option value="500+">500+ zł</option>
                            </select>
                        </th>

                        <th></th>
                    </tr>
                </thead>

                <tbody id="spiders-table" class="divide-y divide-slate-100"></tbody>
            </table>
        </div>
    `;

    await loadSpiders();
    populateFilters();
    renderSpidersTable();
    attachSpiderEvents();
    attachFilterEvents();
}

async function loadSpiders() {
    const data = await getSpiders();
    setSpiders(data.content || data);
}

function populateFilters() {
    const spiders = state.spiders;

    const unique = (arr) => [...new Set(arr.filter(x => x != null && x !== ""))];

    const typeNames = unique(spiders.map(s => s.typeName));
    const speciesNames = unique(spiders.map(s => s.speciesName));
    const sizes = unique(spiders.map(s => s.size));
    const quantities = unique(spiders.map(s => s.quantity));

    fillSelect("filter-typeName", typeNames);
    fillSelect("filter-speciesName", speciesNames);
    fillSelect("filter-size", sizes);
    fillSelect("filter-quantity", quantities);
}

function fillSelect(id, values) {
    const select = document.getElementById(id);
    if (!select) return;

    select.innerHTML = `<option value="">Wszystkie</option>` +
        values.map(v => `<option value="${v}">${v}</option>`).join("");
}

function getFilteredSpiders() {
    const fType = document.getElementById("filter-typeName").value;
    const fSpecies = document.getElementById("filter-speciesName").value;
    const fGender = document.getElementById("filter-gender").value;
    const fSize = document.getElementById("filter-size").value;
    const fQuantity = document.getElementById("filter-quantity").value;
    const fPrice = document.getElementById("filter-price").value;

    return state.spiders.filter((s) => {

        if (fType && s.typeName !== fType) return false;
        if (fSpecies && s.speciesName !== fSpecies) return false;
        if (fGender && s.gender !== fGender) return false;
        if (fSize && s.size !== fSize) return false;
        if (fQuantity && String(s.quantity) !== fQuantity) return false;

        if (fPrice) {
            const price = s.price;

            if (fPrice === "0-50" && !(price >= 0 && price <= 50)) return false;
            if (fPrice === "50-100" && !(price >= 50 && price <= 100)) return false;
            if (fPrice === "100-200" && !(price >= 100 && price <= 200)) return false;
            if (fPrice === "200-500" && !(price >= 200 && price <= 500)) return false;
            if (fPrice === "500+" && !(price >= 500)) return false;
        }

        return true;
    });
}

function renderSpidersTable() {
    const tbody = document.getElementById("spiders-table");
    if (!tbody) return;

    const spiders = getFilteredSpiders();

    tbody.innerHTML = spiders
        .map(
            (s) => `
        <tr>
            <td class="py-3">${s.typeName}</td>
            <td class="py-3">${s.speciesName}</td>
            <td class="py-3">${mapGender(s.gender)}</td>
            <td class="py-3">${s.size}</td>
            <td class="py-3">${s.quantity}</td>
            <td class="py-3">${s.price.toFixed(2)} PLN</td>
            <td class="py-3">
                <div class="flex justify-center gap-2">
                    <button type="button" data-edit-spider="${s.id}"
                        class="px-3 py-1 rounded-xl bg-yellow-100 text-yellow-700 font-bold hover:bg-yellow-200">
                        Edytuj
                    </button>
                    <button type="button" data-delete-spider="${s.id}"
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

function attachFilterEvents() {
    [
        "filter-typeName",
        "filter-speciesName",
        "filter-gender",
        "filter-size",
        "filter-quantity",
        "filter-price"
    ].forEach(id => {
        document.getElementById(id).addEventListener("change", () => {
            renderSpidersTable();
            attachSpiderEvents();
        });
    });
}

function attachSpiderEvents() {
    const btn = document.getElementById("addSpiderBtn");
    if (btn) {
        btn.onclick = () => {
            openSpiderModal(renderSpiderForm());
            setTimeout(() => attachSpiderFormEvents(), 0);
        };
    }

    document.querySelectorAll("[data-edit-spider]").forEach((btn) => {
        btn.onclick = () => {
            const id = btn.dataset.editSpider;
            const spider = state.spiders.find((s) => String(s.id) === String(id));
            if (!spider) return;

            openSpiderModal(renderSpiderForm(spider));
            setTimeout(() => attachSpiderFormEvents(), 0);
        };
    });

    document.querySelectorAll("[data-delete-spider]").forEach((btn) => {
        btn.onclick = async () => {
            const id = btn.dataset.deleteSpider;
            const spider = state.spiders.find((s) => String(s.id) === String(id));
            if (!spider) return;

            if (!confirm(`Usunąć pająka: ${spider.speciesName}?`)) return;

            await deleteSpider(id);
            await loadSpiders();
            populateFilters();
            renderSpidersTable();
            attachSpiderEvents();
        };
    });
}

function renderSpiderForm(spider = null) {
    return `
        <div class="bg-white p-10 rounded-[3rem] max-w-2xl w-full shadow-2xl border border-slate-100 max-h-[90vh] overflow-y-auto">

            <h3 class="text-2xl font-black mb-6 text-slate-900 tracking-tight">
                ${spider ? "Edytuj pająka" : "Nowy pająk"}
            </h3>

            <form id="spider-form" class="grid grid-cols-2 gap-6">

                <input type="hidden" id="spider-id" value="${spider?.id || ""}">

                <div>
                    <label for="spider-typeName" class="block text-sm font-semibold text-slate-600 mb-1">
                        Rodzaj (np. Brachypelma)
                    </label>
                    <input id="spider-typeName" type="text" required
                        value="${spider?.typeName || ""}"
                        class="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl">
                </div>

                <div>
                    <label for="spider-speciesName" class="block text-sm font-semibold text-slate-600 mb-1">
                        Gatunek (np. hamorii)
                    </label>
                    <input id="spider-speciesName" type="text" required
                        value="${spider?.speciesName || ""}"
                        class="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl">
                </div>

                <div>
                    <label for="spider-gender" class="block text-sm font-semibold text-slate-600 mb-1">
                        Płeć
                    </label>
                    <select id="spider-gender"
                        class="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl">
                        <option value="SAMIEC" ${spider?.gender === "SAMIEC" ? "selected" : ""}>samiec</option>
                        <option value="SAMICA" ${spider?.gender === "SAMICA" ? "selected" : ""}>samica</option>
                        <option value="NS" ${spider?.gender === "NS" ? "selected" : ""}>brak danych</option>
                    </select>
                </div>

                <div>
                    <label for="spider-size" class="block text-sm font-semibold text-slate-600 mb-1">
                        Rozmiar (np. L2, L4, subadult, adult)
                    </label>
                    <input id="spider-size" type="text"
                        value="${spider?.size || ""}"
                        class="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl">
                </div>

                <div>
                    <label for="spider-quantity" class="block text-sm font-semibold text-slate-600 mb-1">
                        Ilość sztuk
                    </label>
                    <input id="spider-quantity" type="number" min="1" required
                        value="${spider?.quantity ?? 1}"
                        class="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl">
                </div>

                <div>
                    <label for="spider-price" class="block text-sm font-semibold text-slate-600 mb-1">
                        Cena (PLN)
                    </label>
                    <input id="spider-price" type="number" step="0.01" min="0" required
                        value="${spider?.price != null ? spider.price : ""}"
                        class="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl">
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

function attachSpiderFormEvents() {
    const form = document.getElementById("spider-form");
    if (!form) return;

    form.onsubmit = async (e) => {
        e.preventDefault();

        const idRaw = document.getElementById("spider-id").value;
        const id = idRaw && idRaw.trim() !== "" ? idRaw : null;

        const payload = {
            id: id,
            typeName: document.getElementById("spider-typeName").value.trim(),
            speciesName: document.getElementById("spider-speciesName").value.trim(),
            gender: document.getElementById("spider-gender").value,
            size: document.getElementById("spider-size").value.trim() || null,
            quantity: parseInt(document.getElementById("spider-quantity").value, 10),
            price: parseFloat(document.getElementById("spider-price").value)
        };

        if (id) {
            await updateSpider(id, payload);
        } else {
            await createSpider(payload);
        }

        const closeBtn = document.querySelector("[data-close-modal='spiderModal']");
        if (closeBtn) closeBtn.click();

        await loadSpiders();
        populateFilters();
        renderSpidersTable();
        attachSpiderEvents();
    };
}
