// /static/js/breeding/breedingDetails.js

import {
    fetchSpider,
    fetchEntriesForSpider,
    fetchEggSackByEntry,
    createEntry,
    deleteEntry
} from "./breedingApi.js";

import { renderPairingForm } from "./breedingPairingForm.js";
import { openEggSackCreateModal, openEggSackPullModal } from "./breedingEggSackForm.js";
import { openPairingEditModal } from "./breedingPairingEditModal.js";
import { renderTimeline } from "./breedingTimeline.js";
import { openEntryModal } from "./breedingEntryModal.js";

export async function renderBreedingDetails(root, spiderId, onBack) {
    const spider = await fetchSpider(spiderId);
    let entries = await fetchEntriesForSpider(spiderId);

    let sortMode = "desc";
    let filterMode = "all";

    // Dociągamy kokony
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

    function applyFilterAndSort() {
        let list = [...entries];

        if (filterMode === "pairings") {
            list = list.filter(e => !e.eggSack);
        } else if (filterMode === "egg") {
            list = list.filter(e => e.eggSack);
        }

        list.sort((a, b) => {
            const da = new Date(a.pairingDate1 ?? a.createdAt);
            const db = new Date(b.pairingDate1 ?? b.createdAt);
            return sortMode === "asc" ? da - db : db - da;
        });

        return list;
    }

    function render() {
        const filtered = applyFilterAndSort();

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
                <div class="flex justify-between items-center mb-4">
                    <h3 class="text-2xl">Historia rozmnożeń</h3>

                    <div class="flex gap-3">
                        <button id="sortAsc" class="btn-secondary">Sortuj ↑</button>
                        <button id="sortDesc" class="btn-secondary">Sortuj ↓</button>
                    </div>
                </div>

                <div id="timeline-wrapper">
                    ${renderTimeline(filtered, "vertical")}
                </div>
            </div>
        `;

        attachEvents(filtered);
    }

    function attachEvents(filtered) {
        document.getElementById("backToList").onclick = onBack;

        // NOWE DOPUSZCZENIE
        document.getElementById("addPairingBtn").onclick = () => {
            renderPairingForm(root, spiderId, () => renderBreedingDetails(root, spiderId, onBack));
        };

        // NOWY KOKON
        document.getElementById("addEggSackBtn").onclick = async () => {
            const newEntry = await createEntry(spiderId, {
                pairingNotes: "Kokon",
                behaviorNotes: "",
                notes: null
            });

            openEggSackCreateModal(newEntry.id, () =>
                renderBreedingDetails(root, spiderId, onBack)
            );
        };

        // ODBIÓR KOKONU
        document.getElementById("pullEggSackBtn").onclick = async () => {
            const openEggEntries = filtered
                .filter(e => e.eggSack && !e.eggSack.dateOfEggSackPull)
                .sort((a, b) => {
                    const da = new Date(a.eggSack.dateOfEggSack ?? a.createdAt);
                    const db = new Date(b.eggSack.dateOfEggSack ?? b.createdAt);
                    return db - da;
                });

            if (openEggEntries.length === 0) {
                alert("Brak kokonu do odebrania.");
                return;
            }

            openEggSackPullModal(openEggEntries[0].eggSack, () =>
                renderBreedingDetails(root, spiderId, onBack)
            );
        };

        // SORTOWANIE
        document.getElementById("sortAsc").onclick = () => {
            sortMode = "asc";
            render();
        };

        document.getElementById("sortDesc").onclick = () => {
            sortMode = "desc";
            render();
        };

        // FILTROWANIE
        document.getElementById("filter-all").onclick = () => {
            filterMode = "all";
            render();
        };

        document.getElementById("filter-pairings").onclick = () => {
            filterMode = "pairings";
            render();
        };

        document.getElementById("filter-egg").onclick = () => {
            filterMode = "egg";
            render();
        };

        // BLOKOWANIE PROPAGACJI
        document.querySelectorAll(".no-propagation").forEach(el => {
            el.addEventListener("click", ev => ev.stopPropagation());
        });

        // KLIK W WYDARZENIE → MODAL SZCZEGÓŁÓW
        document.querySelectorAll("[data-open-entry]").forEach(el => {
            el.onclick = () => {
                const entryId = el.dataset.openEntry;
                const entry = filtered.find(e => e.id === entryId);
                openEntryModal(entry, () =>
                    renderBreedingDetails(root, spiderId, onBack)
                );
            };
        });

        // EDYCJA DOPUSZCZENIA
        document.querySelectorAll("[data-edit-pairing]").forEach(btn => {
            btn.onclick = () => {
                const entryId = btn.dataset.editPairing;
                const entry = filtered.find(e => e.id === entryId);
                openPairingEditModal(entry, () =>
                    renderBreedingDetails(root, spiderId, onBack)
                );
            };
        });

        // EDYCJA KOKONU
        document.querySelectorAll("[data-edit-egg-sack]").forEach(btn => {
            btn.onclick = () => {
                const entryId = btn.dataset.editEggSack;
                const entry = filtered.find(e => e.id === entryId);
                if (entry?.eggSack) {
                    openEggSackPullModal(entry.eggSack, () =>
                        renderBreedingDetails(root, spiderId, onBack)
                    );
                }
            };
        });

        // USUWANIE WPISU HODOWLANEGO
        document.querySelectorAll("[data-delete-entry]").forEach(btn => {
            btn.onclick = async () => {
                const entryId = btn.dataset.deleteEntry;

                if (!confirm("Czy na pewno chcesz usunąć ten wpis hodowlany?")) return;

                await deleteEntry(entryId);

                renderBreedingDetails(root, spiderId, onBack);
            };
        });
    }

    render();
}
