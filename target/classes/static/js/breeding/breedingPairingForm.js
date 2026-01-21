// /static/js/breeding/breedingPairingForm.js

import { createEntry } from "./breedingApi.js";

export function renderPairingForm(root, spiderId, onBack) {
    root.innerHTML = `
        <div class="glass-card">
            <button id="backFromPairing" class="btn-secondary mb-6">
                <i class="bi bi-arrow-left"></i> Powrót do szczegółów
            </button>

            <h2 class="text-3xl font-[800] mb-6">Nowe dopuszczenie</h2>

            <div class="grid grid-cols-2 gap-6">
                <div>
                    <label class="block mb-1 font-bold">Data dopuszczenia</label>
                    <input id="pairingDate1" type="date" class="input">
                </div>

                <div>
                    <label class="block mb-1 font-bold">Temperatura (°C)</label>
                    <input id="pairingTemperature" type="number" class="input">
                </div>

                <div>
                    <label class="block mb-1 font-bold">Wilgotność (%)</label>
                    <input id="pairingHumidity" type="number" class="input">
                </div>

                <div class="col-span-2">
                    <label class="block mb-1 font-bold">Notatki z dopuszczenia</label>
                    <textarea id="pairingNotes" class="input"></textarea>
                </div>

                <div class="col-span-2">
                    <label class="block mb-1 font-bold">Zachowanie</label>
                    <textarea id="behaviorNotes" class="input"></textarea>
                </div>
            </div>

            <div class="flex gap-4 mt-8">
                <button id="savePairing" class="btn-primary">Zapisz</button>
                <button id="cancelPairing" class="btn-secondary">Anuluj</button>
            </div>
        </div>
    `;

    document.getElementById("backFromPairing").onclick =
        document.getElementById("cancelPairing").onclick = onBack;

    document.getElementById("savePairing").onclick = async () => {
        const behavior = document.getElementById("behaviorNotes").value.trim();

        const payload = {
            pairingDate1: valueOrNull("pairingDate1"),
            pairingTemperature: numberOrNull("pairingTemperature"),
            pairingHumidity: numberOrNull("pairingHumidity"),
            pairingNotes: valueOrNull("pairingNotes"),
            behaviorNotes: behavior
                ? [{ date: new Date().toISOString().split("T")[0], content: behavior }]
                : [],
            notes: null
        };

        Object.keys(payload).forEach(k => payload[k] === null && delete payload[k]);

        await createEntry(spiderId, payload);
        onBack();
    };
}

function valueOrNull(id) {
    const v = document.getElementById(id).value;
    return v === "" ? null : v;
}

function numberOrNull(id) {
    const v = document.getElementById(id).value;
    return v === "" ? null : Number(v);
}
