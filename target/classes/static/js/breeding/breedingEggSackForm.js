// /static/js/breeding/breedingEggSackForm.js

import { createEggSack, updateEggSack } from "./breedingApi.js";

/* ============================================================
   OPEN: ADD EGG SACK (CREATION)
============================================================ */

export function openEggSackModal(entryId, onSaved) {
    const modal = document.getElementById("breeding-full-modal");
    const box = document.getElementById("breeding-full-modal-content");

    box.innerHTML = templateAdd();

    modal.classList.remove("hidden");

    const sacDateInput = document.getElementById("sacDate");
    const recommendedPullInput = document.getElementById("recommendedPullDate");

    sacDateInput.addEventListener("change", () => {
        const v = sacDateInput.value;
        if (!v) return;

        const d = new Date(v);
        d.setDate(d.getDate() + 30);

        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, "0");
        const day = String(d.getDate()).padStart(2, "0");

        recommendedPullInput.value = `${year}-${month}-${day}`;
    });

    document.getElementById("cancel-egg-sack").onclick = () => {
        modal.classList.add("hidden");
    };

    document.getElementById("save-egg-sack").onclick = async () => {
        const payload = collectAddPayload();

        await createEggSack(entryId, payload);

        modal.classList.add("hidden");
        if (onSaved) onSaved();
    };
}

/* ============================================================
   OPEN: RECEIVE EGG SACK (RESULT)
============================================================ */

export function openReceiveEggSackModal(eggSack, onSaved) {
    const modal = document.getElementById("breeding-full-modal");
    const box = document.getElementById("breeding-full-modal-content");

    box.innerHTML = templateReceive(eggSack);

    modal.classList.remove("hidden");

    document.getElementById("cancel-receive-egg-sack").onclick = () => {
        modal.classList.add("hidden");
    };

    document.getElementById("save-receive-egg-sack").onclick = async () => {
        const payload = collectReceivePayload();

        await updateEggSack(eggSack.id, payload);

        modal.classList.add("hidden");
        if (onSaved) onSaved();
    };
}

/* ============================================================
   TEMPLATE: ADD EGG SACK
============================================================ */

function templateAdd() {
    return `
      <h3 class="text-3xl font-black mb-8 text-slate-900 tracking-tight">
        Dodaj kokon
      </h3>

      <div class="space-y-10 max-h-[70vh] overflow-y-auto pr-2">

        <!-- KOKON -->
        <section>
          <p class="text-[10px] font-black text-slate-400 uppercase mb-4 tracking-widest">
            Dane kokonu
          </p>

          <div class="grid md:grid-cols-2 gap-4">
            <input type="date" id="sacDate" class="input" placeholder="Data złożenia" />
            <input type="date" id="recommendedPullDate" class="input" placeholder="Sugerowana data odbioru" />
          </div>

          <textarea id="notes" class="input h-28 mt-4" placeholder="Uwagi"></textarea>
        </section>

      </div>

      <div class="flex gap-4 pt-8">
        <button id="cancel-egg-sack" class="btn-secondary">Anuluj</button>
        <button id="save-egg-sack" class="btn-green">Zapisz</button>
      </div>
    `;
}

/* ============================================================
   TEMPLATE: RECEIVE EGG SACK
============================================================ */

function templateReceive(eggSack) {
    return `
      <h3 class="text-3xl font-black mb-8 text-slate-900 tracking-tight">
        Odbierz kokon
      </h3>

      <div class="space-y-10 max-h-[70vh] overflow-y-auto pr-2">

        <!-- ODBIÓR -->
        <section>
          <p class="text-[10px] font-black text-slate-400 uppercase mb-4 tracking-widest">
            Dane odbioru
          </p>

          <input type="date" id="dateOfEggSackPull" class="input" placeholder="Data odebrania"
                 value="${eggSack.dateOfEggSackPull ?? ""}" />

          <div class="grid md:grid-cols-3 gap-4 mt-4">
            <input type="number" id="numberOfEggs" class="input" placeholder="Jaja"
                   value="${eggSack.numberOfEggs ?? ""}" />
            <input type="number" id="numberOfBadEggs" class="input" placeholder="Złe jaja"
                   value="${eggSack.numberOfBadEggs ?? ""}" />
            <input type="number" id="numberOfNymphs" class="input" placeholder="Nimfy"
                   value="${eggSack.numberOfNymphs ?? ""}" />
          </div>

          <div class="grid md:grid-cols-3 gap-4 mt-4">
            <input type="number" id="numberOfDeadNymphs" class="input" placeholder="Martwe nimfy"
                   value="${eggSack.numberOfDeadNymphs ?? ""}" />
            <input type="number" id="numberOfSpiders" class="input" placeholder="Pająki"
                   value="${eggSack.numberOfSpiders ?? ""}" />
            <input type="number" id="numberOfDeadSpiders" class="input" placeholder="Martwe pająki"
                   value="${eggSack.numberOfDeadSpiders ?? ""}" />
          </div>

          <select id="status" class="input mt-4">
            <option value="SUCCESSFUL" ${eggSack.status === "SUCCESSFUL" ? "selected" : ""}>SUCCESSFUL</option>
            <option value="FAILED" ${eggSack.status === "FAILED" ? "selected" : ""}>FAILED</option>
          </select>

          <textarea id="eggSackDescription" class="input h-28 mt-4" placeholder="Uwagi">${
        eggSack.eggSackDescription ?? ""
    }</textarea>
        </section>

      </div>

      <div class="flex gap-4 pt-8">
        <button id="cancel-receive-egg-sack" class="btn-secondary">Anuluj</button>
        <button id="save-receive-egg-sack" class="btn-red">Zapisz</button>
      </div>
    `;
}

/* ============================================================
   PAYLOADS
============================================================ */

function collectAddPayload() {
    return {
        dateOfEggSack: valueOrNull("#sacDate"),
        suggestedDateOfEggSackPull: valueOrNull("#recommendedPullDate"),
        dateOfEggSackPull: null,

        numberOfEggs: null,
        numberOfBadEggs: null,
        numberOfNymphs: null,
        numberOfDeadNymphs: null,
        numberOfSpiders: null,
        numberOfDeadSpiders: null,

        eggSackDescription: valueOrNull("#notes"),
        status: "DEVELOPING"
    };
}

function collectReceivePayload() {
    return {
        dateOfEggSackPull: valueOrNull("#dateOfEggSackPull"),

        numberOfEggs: numberOrNull("#numberOfEggs"),
        numberOfBadEggs: numberOrNull("#numberOfBadEggs"),
        numberOfNymphs: numberOrNull("#numberOfNymphs"),
        numberOfDeadNymphs: numberOrNull("#numberOfDeadNymphs"),
        numberOfSpiders: numberOrNull("#numberOfSpiders"),
        numberOfDeadSpiders: numberOrNull("#numberOfDeadSpiders"),

        eggSackDescription: valueOrNull("#eggSackDescription"),
        status: valueOrNull("#status")
    };
}

/* ============================================================
   HELPERS
============================================================ */

function valueOrNull(sel) {
    const el = document.querySelector(sel);
    if (!el) return null;
    const v = el.value;
    return v === "" ? null : v;
}

function numberOrNull(sel) {
    const el = document.querySelector(sel);
    if (!el) return null;
    const v = el.value;
    return v === "" ? null : Number(v);
}
