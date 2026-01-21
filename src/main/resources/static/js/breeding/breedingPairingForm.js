// /static/js/breeding/breedingPairingForm.js

import { createEntry, updateEntry } from "./breedingApi.js";

export function renderPairingForm(root, spiderId, onBack, existingEntry = null) {
    const isEdit = existingEntry !== null;

    root.innerHTML = `
        <div class="glass-card">
            <button id="backFromPairing" class="btn-secondary mb-6">
                <i class="bi bi-arrow-left"></i> Powrót do szczegółów
            </button>

            <h2 class="text-3xl font-[800] mb-6">
                ${isEdit ? "Edytuj dopuszczenie" : "Nowe dopuszczenie"}
            </h2>

            <div class="grid grid-cols-2 gap-6">

                <div>
                    <label class="block mb-1 font-bold">Data dopuszczenia</label>
                    <input id="pairingDate1" type="date" class="input"
                        value="${existingEntry?.pairingDate1 ?? ""}">
                </div>

                <div>
                    <label class="block mb-1 font-bold">Temperatura (°C)</label>
                    <input id="pairingTemperature" type="number" class="input"
                        value="${existingEntry?.pairingTemperature ?? ""}">
                </div>

                <div>
                    <label class="block mb-1 font-bold">Wilgotność (%)</label>
                    <input id="pairingHumidity" type="number" class="input"
                        value="${existingEntry?.pairingHumidity ?? ""}">
                </div>

                <div class="col-span-2">
                    <label class="block mb-1 font-bold">Wydarzenie</label>
                    <textarea id="pairingNotes" class="input">${existingEntry?.pairingNotes ?? ""}</textarea>
                </div>

                <div class="col-span-2">
                    <label class="block mb-1 font-bold">Uwagi</label>
                    <textarea id="behaviorNotes" class="input">${existingEntry?.behaviorNotes ?? ""}</textarea>
                </div>

            </div>

            <div class="flex gap-4 mt-8">
                <button id="savePairing" class="btn-primary">${isEdit ? "Zapisz zmiany" : "Zapisz"}</button>
                <button id="cancelPairing" class="btn-secondary">Anuluj</button>
            </div>
        </div>
    `;

    document.getElementById("backFromPairing").onclick =
        document.getElementById("cancelPairing").onclick = onBack;

    document.getElementById("savePairing").onclick = async () => {
        const payload = {
            pairingDate1: valueOrNull("pairingDate1"),
            pairingTemperature: numberOrNull("pairingTemperature"),
            pairingHumidity: numberOrNull("pairingHumidity"),
            pairingNotes: valueOrNull("pairingNotes"),
            behaviorNotes: valueOrNull("behaviorNotes"),
        };

        // usuń null-e
        Object.keys(payload).forEach(k => payload[k] === null && delete payload[k]);

        if (isEdit) {
            await updateEntry(existingEntry.id, payload);
        } else {
            await createEntry(spiderId, payload);
        }

        onBack();
    };
}

function valueOrNull(id) {
    const v = document.getElementById(id).value.trim();
    return v === "" ? null : v;
}

function numberOrNull(id) {
    const v = document.getElementById(id).value.trim();
    return v === "" ? null : Number(v);
}
