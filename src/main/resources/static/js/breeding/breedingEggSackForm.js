// /static/js/breeding/breedingEggSackForm.js

import { createEggSack } from "./breedingApi.js";

/**
 * Otwiera modal dodawania kokonu
 */
export function openEggSackModal(entryId, onSaved) {
    const modal = document.getElementById("breeding-full-modal");
    const box = document.getElementById("breeding-full-modal-content");

    box.innerHTML = template();
    modal.classList.remove("hidden");

    const sacInput = document.getElementById("sacDate");
    const pullInput = document.getElementById("recommendedPullDate");

    let userEditedPullDate = false;

    pullInput.addEventListener("input", () => userEditedPullDate = true);

    sacInput.addEventListener("input", () => {
        if (!userEditedPullDate && sacInput.value) {
            pullInput.value = addDays(sacInput.value, 30);
        }
    });

    document.getElementById("cancel-egg-sack").onclick = () => {
        modal.classList.add("hidden");
    };

    document.getElementById("save-egg-sack").onclick = async () => {
        const payload = collectPayload();

        await createEggSack(entryId, payload);

        modal.classList.add("hidden");
        if (onSaved) onSaved();
    };
}

/* ============================================================
   TEMPLATE
============================================================ */

function template() {
    return `
      <h3 class="text-3xl font-black mb-8 text-slate-900 tracking-tight">
        Kokon / Wynik rozmnożenia
      </h3>

      <div class="space-y-10 max-h-[70vh] overflow-y-auto pr-2">

        <!-- KOKON -->
        <section>
          <p class="text-[10px] font-black text-slate-400 uppercase mb-4 tracking-widest">
            Kokon
          </p>

          <div class="grid md:grid-cols-2 gap-4">
            <input type="date" id="sacDate" class="input" placeholder="Data złożenia" />
            <input type="date" id="recommendedPullDate" class="input" placeholder="Sugerowana data wyciągnięcia" />
          </div>
        </section>

        <!-- WYNIK KOKONU -->
        <section>
          <p class="text-[10px] font-black text-slate-400 uppercase mb-4 tracking-widest">
            Wynik kokonu
          </p>

          <div class="grid md:grid-cols-3 gap-4">
            <input type="number" id="totalEggsOrNymphs" class="input" placeholder="Łącznie jaj / nimf" />
            <input type="number" id="deadCount" class="input" placeholder="Martwe" />
            <input type="number" id="liveL1Count" class="input" placeholder="Żywe L1" />
          </div>

          <select id="cocoonStatus" class="input mt-4">
            ${statusOptions()}
          </select>
        </section>

        <!-- NOTATKI -->
        <section>
          <p class="text-[10px] font-black text-slate-400 uppercase mb-4 tracking-widest">
            Uwagi
          </p>
          <textarea id="notes" class="input h-28" placeholder="Opis, uwagi, zachowanie"></textarea>
        </section>

      </div>

      <div class="flex gap-4 pt-8">
        <button id="cancel-egg-sack" class="btn-secondary">Anuluj</button>
        <button id="save-egg-sack" class="btn-primary">Zapisz</button>
      </div>
    `;
}

/* ============================================================
   STATUSY
============================================================ */

function statusOptions() {
    const statuses = ["LAID", "DEVELOPING", "PULLED", "FAILED", "SUCCESSFUL"];
    return statuses
        .map(s => `<option value="${s}">${s}</option>`)
        .join("");
}

/* ============================================================
   PAYLOAD
============================================================ */

function collectPayload() {
    return {
        dateOfEggSack: valueOrNull("#sacDate"),
        suggestedDateOfEggSackPull: valueOrNull("#recommendedPullDate"),
        dateOfEggSackPull: null,

        numberOfEggs: numberOrNull("#totalEggsOrNymphs"),
        numberOfBadEggs: numberOrNull("#deadCount"),
        numberOfNymphs: numberOrNull("#liveL1Count"),

        numberOfDeadNymphs: null,
        numberOfSpiders: null,
        numberOfDeadSpiders: null,

        eggSackDescription: valueOrNull("#notes"),
        status: valueOrNull("#cocoonStatus")
    };
}

/* ============================================================
   HELPERS
============================================================ */

function valueOrNull(sel) {
    const v = document.querySelector(sel).value;
    return v === "" ? null : v;
}

function numberOrNull(sel) {
    const v = document.querySelector(sel).value;
    return v === "" ? null : Number(v);
}

function addDays(dateStr, days) {
    if (!dateStr) return null;
    const d = new Date(dateStr);
    d.setDate(d.getDate() + days);
    return d.toISOString().split("T")[0];
}
