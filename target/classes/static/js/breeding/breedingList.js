import { fetchSpiders, deleteSpider } from "./breedingApi.js";
import { renderBreedingDetails } from "./breedingDetails.js";
import { renderSpiderForm } from "./breedingSpiderForm.js";

export async function renderBreedingList(root) {
    const spiders = await fetchSpiders();
    const viewMode = localStorage.getItem("breedingViewMode") || "cards";

    root.innerHTML = `
        <div class="flex justify-between items-center mb-8">
            <div class="flex items-center gap-4">
                <h2 class="text-3xl font-[800] text-slate-900 tracking-tight">
                    Lista samic
                </h2>

                <div class="flex items-center gap-2 text-slate-500 text-sm">
                    <button id="viewCards" class="${viewMode === "cards" ? "btn-secondary" : "btn-secondary opacity-60"}">
                        <i class="bi bi-grid"></i>
                    </button>
                    <button id="viewList" class="${viewMode === "list" ? "btn-secondary" : "btn-secondary opacity-60"}">
                        <i class="bi bi-list"></i>
                    </button>
                </div>
            </div>

            <button id="add-spider-btn" class="btn-primary">
                <i class="bi bi-plus-lg"></i> Dodaj samicę
            </button>
        </div>

        <div id="spiders-container"></div>
    `;

    const container = document.getElementById("spiders-container");
    renderSpiders(container, spiders, viewMode, root);

    // 🔥 POPRAWIONE — zawsze pobieramy świeże dane
    document.getElementById("viewCards").onclick = async () => {
        localStorage.setItem("breedingViewMode", "cards");
        const fresh = await fetchSpiders();
        renderSpiders(container, fresh, "cards", root);
    };

    document.getElementById("viewList").onclick = async () => {
        localStorage.setItem("breedingViewMode", "list");
        const fresh = await fetchSpiders();
        renderSpiders(container, fresh, "list", root);
    };

    document.getElementById("add-spider-btn").onclick = () => {
        renderSpiderForm(root, () => renderBreedingList(root));
    };
}

function renderSpiders(container, spiders, mode, root) {
    if (mode === "cards") {
        container.innerHTML = `
            <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                ${spiders.map(s => spiderCard(s)).join("")}
            </div>
        `;
    } else {
        container.innerHTML = `
            <table class="w-full text-sm">
                <thead>
                    <tr class="text-left text-slate-500 border-b">
                        <th class="py-2">Samica</th>
                        <th class="py-2">Pochodzenie</th>
                        <th class="py-2">Rozmiar</th>
                        <th class="py-2">CITES</th>
                        <th class="py-2">Wpisy</th>
                        <th class="py-2 text-right">Akcje</th>
                    </tr>
                </thead>
                <tbody>
                    ${spiders.map(s => spiderRow(s)).join("")}
                </tbody>
            </table>
        `;
    }

    // Kliknięcie → szczegóły
    container.querySelectorAll("[data-spider-id]").forEach(el => {
        el.onclick = () => {
            const id = el.getAttribute("data-spider-id");
            renderBreedingDetails(root, id, () => renderBreedingList(root));
        };
    });

    // Usuwanie samicy
    container.querySelectorAll(".delete-spider-btn").forEach(btn => {
        btn.onclick = async (ev) => {
            ev.stopPropagation();

            const id = btn.dataset.spiderId;

            if (!confirm("Czy na pewno chcesz usunąć tę samicę?")) return;

            await deleteSpider(id);
            renderBreedingList(root);
        };
    });
}

function spiderCard(s) {
    return `
        <div data-spider-id="${s.id}"
             class="glass-card breeding-list-card border border-slate-200 relative">

            <button class="delete-spider-btn absolute top-4 right-4 text-red-500 hover:text-red-700"
                    data-spider-id="${s.id}">
                <i class="bi bi-trash"></i>
            </button>

            <p class="text-xl font-bold text-slate-900">
                ${s.typeName} ${s.speciesName}
            </p>

            <p class="text-slate-500 mt-1 text-sm">
                ${s.origin ?? "pochodzenie nieznane"}
            </p>

            <div class="mt-4 grid grid-cols-3 gap-4 text-sm">
                <div>
                    <p class="text-[10px] font-black text-slate-400 uppercase">Rozmiar</p>
                    <p>${s.size ?? "-"}</p>
                </div>
                <div>
                    <p class="text-[10px] font-black text-slate-400 uppercase">CITES</p>
                    <p>${s.cites ? "Tak" : "Nie"}</p>
                </div>
                <div>
                    <p class="text-[10px] font-black text-slate-400 uppercase">Wpisy</p>
                    <p>${s.breedingCount ?? 0}</p>
                </div>
            </div>
        </div>
    `;
}

function spiderRow(s) {
    return `
        <tr data-spider-id="${s.id}" class="border-b hover:bg-slate-50 cursor-pointer">

            <td class="py-2 font-semibold">${s.typeName} ${s.speciesName}</td>
            <td class="py-2 text-slate-500">${s.origin ?? "pochodzenie nieznane"}</td>
            <td class="py-2">${s.size ?? "-"}</td>
            <td class="py-2">${s.cites ? "Tak" : "Nie"}</td>
            <td class="py-2">${s.breedingCount ?? 0}</td>

            <td class="py-2 text-right">
                <button class="delete-spider-btn text-red-500 hover:text-red-700"
                        data-spider-id="${s.id}">
                    <i class="bi bi-trash"></i>
                </button>
            </td>
        </tr>
    `;
}
