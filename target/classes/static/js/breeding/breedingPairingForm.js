// /static/js/breeding/breedingPairingForm.js

import { createEntry } from "./breedingApi.js";

/* ============================================================
   RENDER PAIRING FORM
============================================================ */

export function renderPairingForm(root, spiderId, onSaved) {
    root.innerHTML = `
        <div class="glass-card mb-8">
            <button id="backBtn" class="btn-secondary mb-6">
                <i class="bi bi-arrow-left"></i> Powrót
            </button>

            <h2 class="text-3xl font-[800] mb-6">Dodaj wpis</h2>

            <div class="space-y-10 max-w-2xl">

                <!-- WYDARZENIE -->
                <section>
                    <p class="text-[10px] font-black text-slate-400 uppercase mb-4 tracking-widest">
                        Wydarzenie
                    </p>
                    <textarea id="pairingNotes" class="input h-28" placeholder="Opis wydarzenia"></textarea>
                </section>

                <!-- ZACHOWANIE -->
                <section>
                    <p class="text-[10px] font-black text-slate-400 uppercase mb-4 tracking-widest">
                        Zachowanie
                    </p>
                    <textarea id="behaviorNotes" class="input h-28" placeholder="Opis zachowania"></textarea>
                </section>

                <!-- NOTATKI OGÓLNE -->
                <section>
                    <p class="text-[10px] font-black text-slate-400 uppercase mb-4 tracking-widest">
                        Notatki ogólne
                    </p>
                    <textarea id="notes" class="input h-28" placeholder="Dodatkowe informacje"></textarea>
                </section>

                <div class="flex gap-4 pt-4">
                    <button id="cancelBtn" class="btn-secondary">Anuluj</button>
                    <button id="saveBtn" class="btn-primary">Zapisz</button>
                </div>
            </div>
        </div>
    `;

    document.getElementById("backBtn").onclick = onSaved;
    document.getElementById("cancelBtn").onclick = onSaved;

    document.getElementById("saveBtn").onclick = async () => {
        const payload = {
            entryType: "PAIRING",
            pairingNotes: valueOrNull("#pairingNotes"),
            behaviorNotes: valueOrNull("#behaviorNotes"),
            notes: valueOrNull("#notes")
        };

        await createEntry(spiderId, payload);
        onSaved();
    };
}

/* ============================================================
   HELPERS
============================================================ */

function valueOrNull(sel) {
    const el = document.querySelector(sel);
    if (!el) return null;
    const v = el.value.trim();
    return v === "" ? null : v;
}
