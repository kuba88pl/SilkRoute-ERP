// /static/js/breeding/breedingEntryModal.js

import { openPairingEditModal } from "./breedingPairingEditModal.js";
import { openEggSackPullModal } from "./breedingEggSackForm.js";

export function openEntryModal(entry, onSaved = null) {
    const modal = document.getElementById("breeding-full-modal");
    const box = document.getElementById("breeding-full-modal-content");

    box.innerHTML = template(entry);
    modal.classList.remove("hidden");

    // Zamknięcie
    document.getElementById("closeEntryModal").onclick = () => {
        modal.classList.add("hidden");
        if (onSaved) onSaved();
    };

    // Edycja
    document.getElementById("editEntryModal").onclick = () => {
        modal.classList.add("hidden");

        if (entry.eggSack) {
            openEggSackPullModal(entry.eggSack, onSaved);
        } else {
            openPairingEditModal(entry, onSaved);
        }
    };
}

function template(e) {
    return `
        <h3 class="text-3xl font-black mb-8 text-slate-900 tracking-tight">
            Szczegóły wpisu
        </h3>

        <div class="space-y-10 max-h-[70vh] overflow-y-auto pr-2">

            <section>
                <p class="text-[10px] font-black text-slate-400 uppercase mb-4 tracking-widest">
                    Data
                </p>
                <p class="text-xl font-bold">${entryDate(e)}</p>
            </section>

            ${e.eggSack ? eggSackSection(e) : pairingSection(e)}

        </div>

        <div class="flex gap-4 pt-8">
            <button id="closeEntryModal" class="btn-secondary">Zamknij</button>
            <button id="editEntryModal" class="btn-primary">Edytuj</button>
        </div>
    `;
}

function entryDate(e) {
    if (e.eggSack) {
        return e.eggSack.dateOfEggSackPull
            ?? e.eggSack.dateOfEggSack
            ?? "-";
    }
    return e.pairingDate1 ?? "-";
}

function pairingSection(e) {
    return `
        <section>
            <p class="text-[10px] font-black text-slate-400 uppercase mb-4 tracking-widest">
                Wpis hodowlany
            </p>

            <div class="space-y-2 text-slate-700">
                <p><b>Temperatura:</b> ${e.pairingTemperature ?? "-"}</p>
                <p><b>Wilgotność:</b> ${e.pairingHumidity ?? "-"}</p>
                <p><b>Wydarzenie:</b><br>${e.pairingNotes ?? "-"}</p>
                <p><b>Uwagi:</b><br>${e.behaviorNotes ?? "-"}</p>
            </div>
        </section>
    `;
}

function eggSackSection(e) {
    const s = e.eggSack;

    return `
        <section>
            <p class="text-[10px] font-black text-slate-400 uppercase mb-4 tracking-widest">
                Kokon
            </p>

            <div class="space-y-2 text-slate-700">
                <p><b>Złożony:</b> ${s.dateOfEggSack ?? "-"}</p>
                <p><b>Odebrany:</b> ${s.dateOfEggSackPull ?? "-"}</p>
                <p><b>Sugerowany odbiór:</b> ${s.suggestedDateOfEggSackPull ?? "-"}</p>

                <p><b>Jaja dobre:</b> ${s.numberOfEggs ?? "-"}</p>
                <p><b>Jaja zepsute:</b> ${s.numberOfBadEggs ?? "-"}</p>

                <p><b>Nimfy żywe:</b> ${s.numberOfNymphs ?? "-"}</p>
                <p><b>Nimfy martwe:</b> ${s.numberOfDeadNymphs ?? "-"}</p>

                <p><b>Pająki żywe:</b> ${s.numberOfSpiders ?? "-"}</p>
                <p><b>Pająki martwe:</b> ${s.numberOfDeadSpiders ?? "-"}</p>

                <p><b>Opis:</b><br>${s.eggSackDescription ?? "-"}</p>
            </div>
        </section>
    `;
}
