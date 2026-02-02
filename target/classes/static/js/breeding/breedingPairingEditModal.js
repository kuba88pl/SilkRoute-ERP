// /static/js/breeding/breedingPairingEditModal.js

import { updateEntry } from "./breedingApi.js";

export function openPairingEditModal(entry, onSaved) {
    const modal = document.getElementById("breeding-full-modal");
    const box = document.getElementById("breeding-full-modal-content");

    box.innerHTML = template(entry);
    modal.classList.remove("hidden");

    document.getElementById("cancelPairingEdit").onclick = () => {
        modal.classList.add("hidden");
    };

    document.getElementById("savePairingEdit").onclick = async () => {
        const payload = {
            pairingDate1: valueOrNull("pairingDate1"),
            pairingTemperature: numberOrNull("pairingTemperature"),
            pairingHumidity: numberOrNull("pairingHumidity"),
            pairingNotes: valueOrNull("pairingNotes"),
            behaviorNotes: valueOrNull("behaviorNotes"),
        };

        Object.keys(payload).forEach(k => payload[k] === null && delete payload[k]);

        await updateEntry(entry.id, payload);

        modal.classList.add("hidden");
        if (onSaved) onSaved();
    };
}

function template(entry) {
    return `
        <h3 class="text-3xl font-black mb-8 text-slate-900 tracking-tight">
            Edytuj dopuszczenie
        </h3>

        <div class="space-y-10 max-h-[70vh] overflow-y-auto pr-2">

            <section>
                <p class="text-[10px] font-black text-slate-400 uppercase mb-4 tracking-widest">
                    Dane dopuszczenia
                </p>

                <div class="grid md:grid-cols-2 gap-4">
                    <input type="date" id="pairingDate1" class="input"
                        value="${entry.pairingDate1 ?? ""}" />

                    <input type="number" id="pairingTemperature" class="input"
                        placeholder="Temperatura"
                        value="${entry.pairingTemperature ?? ""}" />

                    <input type="number" id="pairingHumidity" class="input"
                        placeholder="Wilgotność"
                        value="${entry.pairingHumidity ?? ""}" />
                </div>
            </section>

            <section>
                <p class="text-[10px] font-black text-slate-400 uppercase mb-4 tracking-widest">
                    Wydarzenie
                </p>
                <textarea id="pairingNotes" class="input h-28"
                    placeholder="Opis wydarzenia">${entry.pairingNotes ?? ""}</textarea>
            </section>

            <section>
                <p class="text-[10px] font-black text-slate-400 uppercase mb-4 tracking-widest">
                    Uwagi
                </p>
                <textarea id="behaviorNotes" class="input h-28"
                    placeholder="Uwagi">${entry.behaviorNotes ?? ""}</textarea>
            </section>

        </div>

        <div class="flex gap-4 pt-8">
            <button id="cancelPairingEdit" class="btn-secondary">Anuluj</button>
            <button id="savePairingEdit" class="btn-primary">Zapisz</button>
        </div>
    `;
}

function valueOrNull(id) {
    const v = document.getElementById(id).value.trim();
    return v === "" ? null : v;
}

function numberOrNull(id) {
    const v = document.getElementById(id).value.trim();
    return v === "" ? null : Number(v);
}
