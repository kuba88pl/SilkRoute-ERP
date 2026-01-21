// /static/js/breeding/breedingDetails.js

import {
    fetchSpider,
    fetchEntriesForSpider,
    deleteEntry,
    fetchEggSackByEntry,
    createEntry
} from "./breedingApi.js";

import { renderPairingForm } from "./breedingPairingForm.js";
import { openEggSackCreateModal, openEggSackPullModal } from "./breedingEggSackForm.js";
import { renderTimeline } from "./breedingTimeline.js";

export async function renderBreedingDetails(root, spiderId, onBack) {
    const spider = await fetchSpider(spiderId);
    let entries = await fetchEntriesForSpider(spiderId);

    // sortowanie wpisów od najnowszego
    entries = entries.sort((a, b) => {
        const da = new Date(a.pairingDate1 ?? a.createdAt);
        const db = new Date(b.pairingDate1 ?? b.createdAt);
        return db - da;
    });

    // dociągamy kokony do wpisów
    entries = await Promise.all(
        entries.map(async e => {
            try {
                const eggSack = await fetchEggSackByEntry(e.id);
                e.eggSack = eggSack || null;
            } catch {
                e.eggSack = null;
            }
            return e;
        })
    );

    // domyślny widok timeline
    let timelineMode = "vertical";

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
                        class="btn-primary bg-green-600 hover:bg-green-700 border-none">
                        <i class="bi bi-egg-fill"></i> Dodaj kokon
                    </button>

                    <button id="pullEggSackBtn"
                        class="btn-secondary border-green-600 text-green-700 hover:bg-green-50">
                        <i class="bi bi-basket-fill"></i> Odbierz kokon
                    </button>
                </div>
            </div>
        </div>

        <div class="glass-card">
            <h3 class="text-2xl mb-4">Historia rozmnożeń</h3>

            <div id="timeline-wrapper">
                ${renderTimeline(entries, timelineMode)}
            </div>
        </div>
    `;

    /* ============================================================
       HANDLERY PRZYCISKÓW
    ============================================================ */

    document.getElementById("backToList").onclick = onBack;

    document.getElementById("addPairingBtn").onclick = () => {
        renderPairingForm(root, spiderId, () => renderBreedingDetails(root, spiderId, onBack));
    };

    // Dodaj kokon → tworzy pusty entry i otwiera modal
    document.getElementById("addEggSackBtn").onclick = async () => {
        const newEntry = await createEntry(spiderId, {
            pairingNotes: "Kokon",
            notes: null
        });

        openEggSackCreateModal(newEntry.id, () => renderBreedingDetails(root, spiderId, onBack));
    };

    // Odbierz kokon → szukamy najnowszego kokonu bez daty odbioru
    document.getElementById("pullEggSackBtn").onclick = async () => {
        const openEggEntries = entries
            .filter(e => e.eggSack && !e.eggSack.dateOfEggSackPull)
            .sort((a, b) => {
                const da = new Date(a.eggSack.dateOfEggSack ?? a.createdAt);
                const db = new Date(b.eggSack.dateOfEggSack ?? b.createdAt);
                return db - da;
            });

        if (openEggEntries.length === 0) {
            alert("Brak kokonu do odebrania (wszystkie odebrane lub brak kokonu).");
            return;
        }

        const target = openEggEntries[0];
        openEggSackPullModal(target.eggSack, () => renderBreedingDetails(root, spiderId, onBack));
    };

    /* ============================================================
       PRZEŁĄCZANIE WIDOKU TIMELINE
    ============================================================ */

    document.getElementById("toggle-timeline").onclick = () => {
        timelineMode = timelineMode === "vertical" ? "horizontal" : "vertical";
        document.getElementById("timeline-wrapper").innerHTML =
            renderTimeline(entries, timelineMode);

        attachTimelineEvents(entries, spiderId, onBack);
    };

    // podpinamy eventy do timeline
    attachTimelineEvents(entries, spiderId, onBack);
}

/* ============================================================
   PODPINANIE EVENTÓW DO TIMELINE
============================================================ */

function attachTimelineEvents(entries, spiderId, onBack) {
    // Edycja kokonu
    document.querySelectorAll("[data-edit-egg-sack]").forEach(btn => {
        btn.onclick = async () => {
            const entryId = btn.dataset.editEggSack;
            const entry = entries.find(e => e.id === entryId);

            if (!entry || !entry.eggSack) return;

            openEggSackPullModal(entry.eggSack, () =>
                renderBreedingDetails(document.getElementById("breeding-root"), spiderId, onBack)
            );
        };
    });
}
