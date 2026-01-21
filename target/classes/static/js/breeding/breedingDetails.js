// /static/js/breeding/breedingDetails.js

import { fetchSpider, fetchEntriesForSpider, deleteEntry } from "./breedingApi.js";
import { renderPairingForm } from "./breedingPairingForm.js";

export async function renderBreedingDetails(root, spiderId, onBack) {
    const spider = await fetchSpider(spiderId);
    let entries = await fetchEntriesForSpider(spiderId);

    // sort DESC
    entries = entries.sort((a, b) => {
        const da = new Date(a.pairingDate1 ?? a.sacDate ?? a.createdAt);
        const db = new Date(b.pairingDate1 ?? b.sacDate ?? b.createdAt);
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

                <button id="addPairingBtn" class="btn-primary">
                    <i class="bi bi-plus-lg"></i> Dodaj dopuszczenie
                </button>
            </div>
        </div>

        <div class="glass-card">
            <h3 class="text-2xl mb-4">Historia rozmnożeń</h3>

            ${entries.length === 0
        ? `<p class="text-slate-500">Brak wpisów rozmnożeń.</p>`
        : `
                <div class="space-y-4">
                    ${entries.map(e => renderEntryRow(e)).join("")}
                </div>
            `}
        </div>
    `;

    document.getElementById("backToList").onclick = onBack;

    document.getElementById("addPairingBtn").onclick = () => {
        renderPairingForm(root, spiderId, () => renderBreedingDetails(root, spiderId, onBack));
    };

    // kliknięcie wpisu → modal
    document.querySelectorAll("[data-entry-id]").forEach(el => {
        el.onclick = (ev) => {
            if (ev.target.closest(".delete-entry-btn")) return; // kliknięto kosz
            const entry = entries.find(e => e.id === el.dataset.entryId);
            openEntryModal(entry, spiderId, root, onBack);
        };
    });

    // usuwanie wpisu z timeline
    document.querySelectorAll(".delete-entry-btn").forEach(btn => {
        btn.onclick = async (ev) => {
            ev.stopPropagation();

            const id = btn.dataset.entryId;

            if (!confirm("Czy na pewno chcesz usunąć ten wpis?")) return;

            await deleteEntry(id);
            renderBreedingDetails(root, spiderId, onBack);
        };
    });
}

/* ============================================================
   RENDER POJEDYNCZEGO WPISU
============================================================ */

function renderEntryRow(e) {
    const date = e.pairingDate1 ?? e.sacDate ?? e.createdAt;

    const behavior = (e.behaviorNotes && e.behaviorNotes.length > 0)
        ? e.behaviorNotes[0].content
        : null;

    return `
        <div data-entry-id="${e.id}"
             class="flex justify-between items-center border-b border-slate-200 pb-3 last:border-b-0 cursor-pointer hover:bg-slate-50 rounded-xl px-2">

            <div>
                <p class="font-semibold">${date ?? "-"}</p>
                <p class="text-slate-500 text-sm">
                    ${e.pairingNotes ?? "Brak notatek z dopuszczenia"}
                </p>
                ${behavior ? `<p class="text-slate-400 text-xs mt-1">Zachowanie: ${behavior}</p>` : ""}
            </div>

            <div class="flex items-center gap-4 text-right text-sm text-slate-500">
                <span>
                    ${e.pairingTemperature ? `${e.pairingTemperature}°C` : ""}
                    ${e.pairingHumidity ? ` • ${e.pairingHumidity}%` : ""}
                </span>

                <button class="delete-entry-btn text-red-500 hover:text-red-700"
                        data-entry-id="${e.id}">
                    <i class="bi bi-trash"></i>
                </button>
            </div>
        </div>
    `;
}

/* ============================================================
   MODAL
============================================================ */

function openEntryModal(e, spiderId, root, onBack) {
    const modal = document.getElementById("breeding-full-modal");
    const content = document.getElementById("breeding-full-modal-content");

    const behaviorList = (e.behaviorNotes || [])
        .map(b => `
            <li class="mb-1">
                <span class="text-xs text-slate-400">${b.date}</span><br>
                <span>${b.content}</span>
            </li>
        `)
        .join("");

    content.innerHTML = `
        <h2 class="text-2xl font-[800] mb-4">Szczegóły wpisu</h2>

        <div class="space-y-3 text-sm">
            <p><b>Data dopuszczenia:</b> ${e.pairingDate1 ?? "-"}</p>
            <p><b>Temperatura:</b> ${e.pairingTemperature ?? "-"}°C</p>
            <p><b>Wilgotność:</b> ${e.pairingHumidity ?? "-"}%</p>

            <p><b>Notatki z dopuszczenia:</b><br>${e.pairingNotes ?? "Brak"}</p>
            <p><b>Notatki ogólne:</b><br>${e.notes ?? "Brak"}</p>

            <div>
                <b>Zachowanie:</b>
                ${behaviorList ? `<ul class="mt-1">${behaviorList}</ul>` : "<p>Brak</p>"}
            </div>
        </div>

        <div class="mt-8 flex justify-between">
            <button id="deleteEntryModal" class="btn-secondary text-red-600 border-red-300">
                <i class="bi bi-trash mr-2"></i> Usuń wpis
            </button>

            <button id="closeEntryModal" class="btn-secondary">Zamknij</button>
        </div>
    `;

    modal.classList.remove("hidden");

    document.getElementById("closeEntryModal").onclick = () => modal.classList.add("hidden");

    document.getElementById("deleteEntryModal").onclick = async () => {
        if (!confirm("Czy na pewno chcesz usunąć ten wpis?")) return;

        await deleteEntry(e.id);
        modal.classList.add("hidden");
        renderBreedingDetails(root, spiderId, onBack);
    };

    modal.onclick = e2 => {
        if (e2.target === modal) modal.classList.add("hidden");
    };
}
