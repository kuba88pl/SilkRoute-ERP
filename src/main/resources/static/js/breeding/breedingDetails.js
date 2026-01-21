// /static/js/breeding/breedingDetails.js

import {
    fetchSpider,
    fetchEntriesForSpider,
    deleteEntry,
    fetchEggSackByEntry,
    createEntry
} from "./breedingApi.js";

import { renderPairingForm } from "./breedingPairingForm.js";
import { openEggSackModal, openReceiveEggSackModal } from "./breedingEggSackForm.js";

/* ============================================================
   MAIN RENDER
============================================================ */

export async function renderBreedingDetails(root, spiderId, onBack) {
    const spider = await fetchSpider(spiderId);
    let entries = await fetchEntriesForSpider(spiderId);

    // Sort newest → oldest
    entries = entries.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

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

                    <button id="addEggSackBtn" class="btn-green">
                        🥚 Dodaj kokon
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
        const newEntry = await createEntry(spiderId, {
            entryType: "EGG_SACK_CREATED",
            pairingNotes: "Kokon",
            notes: null,
            behaviorNotes: null
        });

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

            openEntryModal(entry, spiderId, onBack);
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

/* ============================================================
   ENTRY ROW
============================================================ */

function renderEntryRow(e) {
    const date = e.createdAt?.split("T")[0] ?? "-";

    let icon = "🔗";
    let cls = "timeline-entry timeline-entry-pairing";

    if (e.entryType === "EGG_SACK_CREATED") {
        icon = "🥚";
        cls = "timeline-entry timeline-entry-egg-created";
    }

    if (e.entryType === "EGG_SACK_RECEIVED") {
        icon = "🐣";
        cls = "timeline-entry timeline-entry-egg-received";
    }

    return `
        <div data-entry-id="${e.id}" class="${cls}">
            <div class="flex items-center gap-4">
                <div class="timeline-icon ${
        e.entryType === "EGG_SACK_CREATED"
            ? "timeline-icon-egg-created"
            : e.entryType === "EGG_SACK_RECEIVED"
                ? "timeline-icon-egg-received"
                : "timeline-icon-pairing"
    }">
                    ${icon}
                </div>

                <div>
                    <p class="font-semibold">${date}</p>
                    <p class="text-slate-600 text-sm">${e.pairingNotes ?? "-"}</p>
                </div>
            </div>

            <button class="delete-entry-btn text-red-500 hover:text-red-700"
                    data-entry-id="${e.id}">
                <i class="bi bi-trash"></i>
            </button>
        </div>
    `;
}

/* ============================================================
   ENTRY MODAL
============================================================ */

function openEntryModal(e, spiderId, onBack) {
    const modal = document.getElementById("breeding-full-modal");
    const content = document.getElementById("breeding-full-modal-content");

    let html = `
        <h2 class="text-2xl font-[800] mb-4">Szczegóły wpisu</h2>

        <div class="space-y-3 text-sm">
            <p><b>Data:</b> ${e.createdAt?.split("T")[0] ?? "-"}</p>
            <p><b>Wydarzenie:</b><br>${e.pairingNotes ?? "Brak"}</p>
            <p><b>Zachowanie:</b><br>${e.behaviorNotes ?? "Brak"}</p>
            <p><b>Notatki ogólne:</b><br>${e.notes ?? "Brak"}</p>
        </div>
    `;

    if (e.eggSack) {
        html += renderEggSackSection(e);
    }

    html += `
        <div class="mt-8 flex justify-end gap-4">
            ${renderReceiveButton(e)}
            <button id="closeEntryModal" class="btn-secondary">Zamknij</button>
        </div>
    `;

    content.innerHTML = html;
    modal.classList.remove("hidden");

    document.getElementById("closeEntryModal").onclick = () => modal.classList.add("hidden");

    const receiveBtn = document.getElementById("receiveEggSackBtn");
    if (receiveBtn) {
        receiveBtn.onclick = () => {
            openReceiveEggSackModal(e.eggSack, () => {
                modal.classList.add("hidden");
                renderBreedingDetails(document.getElementById("app"), spiderId, onBack);
            });
        };
    }

    modal.onclick = e2 => {
        if (e2.target === modal) modal.classList.add("hidden");
    };
}
/* ============================================================
   EGG SACK SECTION
============================================================ */

function renderEggSackSection(e) {
    const es = e.eggSack;

    return `
        <div class="mt-6 p-4 bg-white rounded-xl border border-slate-200">
            <h3 class="text-xl font-bold mb-2">Kokon</h3>

            <p><b>Data złożenia:</b> ${es.dateOfEggSack ?? "-"}</p>
            <p><b>Sugerowana data odbioru:</b> ${es.suggestedDateOfEggSackPull ?? "-"}</p>

            ${es.dateOfEggSackPull ? `
                <p class="mt-4"><b>Data odebrania:</b> ${es.dateOfEggSackPull}</p>
                <p><b>Jaja:</b> ${es.numberOfEggs ?? "-"}</p>
                <p><b>Złe jaja:</b> ${es.numberOfBadEggs ?? "-"}</p>
                <p><b>Nimfy:</b> ${es.numberOfNymphs ?? "-"}</p>
                <p><b>Martwe nimfy:</b> ${es.numberOfDeadNymphs ?? "-"}</p>
                <p><b>Pająki:</b> ${es.numberOfSpiders ?? "-"}</p>
                <p><b>Martwe pająki:</b> ${es.numberOfDeadSpiders ?? "-"}</p>
                <p><b>Status:</b> ${es.status}</p>
            ` : `
                <p class="mt-4 text-slate-500 italic">Kokon jeszcze nie został odebrany.</p>
            `}

            <p class="mt-4"><b>Uwagi:</b><br>${es.eggSackDescription ?? "Brak"}</p>
        </div>
    `;
}

/* ============================================================
   RECEIVE BUTTON
============================================================ */

function renderReceiveButton(e) {
    if (!e.eggSack) return "";
    if (e.eggSack.dateOfEggSackPull) return "";

    return `
        <button id="receiveEggSackBtn" class="btn-red">
            🐣 Odbierz kokon
        </button>
    `;
}

/* ============================================================
   END OF FILE
============================================================ */
