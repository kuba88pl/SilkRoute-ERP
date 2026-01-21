// /static/js/breeding/breedingDetails.js

import {
    fetchSpider,
    fetchEntriesForSpider,
    deleteEntry,
    fetchEggSackByEntry,
    createEntry,
    createEggSack
} from "./breedingApi.js";

import { renderPairingForm } from "./breedingPairingForm.js";
import { openEggSackModal } from "./breedingEggSackForm.js";

export async function renderBreedingDetails(root, spiderId, onBack) {
    const spider = await fetchSpider(spiderId);
    let entries = await fetchEntriesForSpider(spiderId);

    entries = entries.sort((a, b) => {
        const da = new Date(a.pairingDate1 ?? a.createdAt);
        const db = new Date(b.pairingDate1 ?? b.createdAt);
        return db - da;
    });

    root.innerHTML = `
        <div class="glass-card mb-8">
            <button id="backToList" class="btn-secondary mb-6">
                <i class="bi bi-arrow-left"></i> Powrót do listy
            </button>

            <div class="flex justify-between items-start gap-8">
                <div>
                    <h2 class="text-3xl font-[800] mb-2">
                        ${spider.typeName} ${spider.speciesName}
                    </h2>
                    <p class="text-slate-500 mb-1">${spider.origin ?? "pochodzenie nieznane"}</p>
                    <p class="text-slate-500 text-sm">
                        Rozmiar: <b>${spider.size ?? "-"}</b> • 
                        CITES: <b>${spider.cites ? "TAK" : "NIE"}</b>
                    </p>
                </div>

                <div class="flex gap-3">
                    <button id="addPairingBtn" class="btn-primary">
                        <i class="bi bi-plus-lg"></i> Dodaj wpis
                    </button>

                    <button id="addEggSackBtn"
                        class="px-4 py-2 rounded-lg font-semibold text-white bg-green-600 hover:bg-green-700 transition">
                        <i class="bi bi-egg-fill"></i> Dodaj kokon
                    </button>
                </div>
            </div>
        </div>

        <div class="glass-card">
            <h3 class="text-2xl mb-4">Historia rozmnożeń</h3>

            ${entries.length === 0
        ? `<p class="text-slate-500">Brak wpisów rozmnożeń.</p>`
        : `
                <div id="timeline" class="space-y-4">
                    ${entries.map(e => renderEntryRow(e)).join("")}
                </div>
            `}
        </div>
    `;

    document.getElementById("backToList").onclick = onBack;

    document.getElementById("addPairingBtn").onclick = () => {
        renderPairingForm(root, spiderId, () => renderBreedingDetails(root, spiderId, onBack));
    };

    document.getElementById("addEggSackBtn").onclick = async () => {
        // 1. Tworzymy NOWY wpis w timeline
        const newEntry = await createEntry(spiderId, {
            pairingNotes: "Kokon",
            notes: null
        });

        // 2. Otwieramy modal kokonu
        openEggSackModal(newEntry.id, () => renderBreedingDetails(root, spiderId, onBack));
    };

    document.querySelectorAll("[data-entry-id]").forEach(el => {
        el.addEventListener("click", async (ev) => {
            if (ev.target.closest(".delete-entry-btn")) return;

            const entryId = el.dataset.entryId;
            const entry = entries.find(e => e.id === entryId);

            let eggSack = null;
            try {
                eggSack = await fetchEggSackByEntry(entryId);
            } catch (e) {
                eggSack = null;
            }

            entry.eggSack = eggSack || null;

            openEntryModal(entry);
        });
    });

    document.querySelectorAll(".delete-entry-btn").forEach(btn => {
        btn.addEventListener("click", async (ev) => {
            ev.stopPropagation();

            const id = btn.dataset.entryId;

            if (!confirm("Czy na pewno chcesz usunąć ten wpis?")) return;

            await deleteEntry(id);
            renderBreedingDetails(root, spiderId, onBack);
        });
    });
}

function renderEntryRow(e) {
    const date = e.pairingDate1 ?? e.createdAt;

    return `
        <div data-entry-id="${e.id}"
             class="flex justify-between items-center border-b border-slate-200 pb-3 last:border-b-0 cursor-pointer hover:bg-slate-50 rounded-xl px-2">

            <div>
                <p class="font-semibold">${date ?? "-"}</p>
                <p class="text-slate-500 text-sm">
                    ${e.pairingNotes ?? "Brak notatek"}
                </p>
            </div>

            <div class="flex items-center gap-4 text-right text-sm text-slate-500">
                <button class="delete-entry-btn text-red-500 hover:text-red-700"
                        data-entry-id="${e.id}">
                    <i class="bi bi-trash"></i>
                </button>
            </div>
        </div>
    `;
}

function openEntryModal(e) {
    const modal = document.getElementById("breeding-full-modal");
    const content = document.getElementById("breeding-full-modal-content");

    let html = `
        <h2 class="text-2xl font-[800] mb-4">Szczegóły wpisu</h2>

        <div class="space-y-3 text-sm">
            <p><b>Data:</b> ${e.pairingDate1 ?? e.createdAt ?? "-"}</p>
            <p><b>Wydarzenie:</b><br>${e.pairingNotes ?? "Brak"}</p>
            <p><b>Notatki ogólne:</b><br>${e.notes ?? "Brak"}</p>
        </div>
    `;

    if (e.eggSack) {
        html += `
            <div class="mt-6 p-4 bg-amber-50 rounded-xl border border-amber-200">
                <h3 class="text-xl font-bold mb-2">Kokon</h3>

                <p><b>Data złożenia:</b> ${e.eggSack.dateOfEggSack ?? "-"}</p>
                <p><b>Sugerowana data wyciągnięcia:</b> ${e.eggSack.suggestedDateOfEggSackPull ?? "-"}</p>
                <p><b>Data wyciągnięcia:</b> ${e.eggSack.dateOfEggSackPull ?? "-"}</p>

                <p class="mt-2"><b>Jaja:</b> ${e.eggSack.numberOfEggs ?? "-"}</p>
                <p><b>Złe jaja:</b> ${e.eggSack.numberOfBadEggs ?? "-"}</p>

                <p class="mt-2"><b>Nimfy:</b> ${e.eggSack.numberOfNymphs ?? "-"}</p>
                <p><b>Martwe nimfy:</b> ${e.eggSack.numberOfDeadNymphs ?? "-"}</p>

                <p class="mt-2"><b>Pająki:</b> ${e.eggSack.numberOfSpiders ?? "-"}</p>
                <p><b>Martwe pająki:</b> ${e.eggSack.numberOfDeadSpiders ?? "-"}</p>

                <p class="mt-2"><b>Status:</b> ${e.eggSack.status}</p>

                <p class="mt-2"><b>Opis:</b><br>${e.eggSack.eggSackDescription ?? "Brak"}</p>
            </div>
        `;
    }

    html += `
        <div class="mt-8 flex justify-end">
            <button id="closeEntryModal" class="btn-secondary">Zamknij</button>
        </div>
    `;

    content.innerHTML = html;
    modal.classList.remove("hidden");

    document.getElementById("closeEntryModal").onclick = () => modal.classList.add("hidden");

    modal.onclick = e2 => {
        if (e2.target === modal) modal.classList.add("hidden");
    };
}
