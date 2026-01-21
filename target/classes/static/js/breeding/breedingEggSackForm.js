// /static/js/breeding/breedingEggSackForm.js

import { createEggSack, updateEggSack } from "./breedingApi.js";

/* ============================================================
   MODAL: DODANIE KOKONU (ZŁOŻENIE)
============================================================ */

export function openEggSackCreateModal(entryId, onSaved) {
    const modal = document.getElementById("breeding-full-modal");
    const box = document.getElementById("breeding-full-modal-content");

    box.innerHTML = createTemplate();
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
        const payload = collectCreatePayload();

        await createEggSack(entryId, payload);

        modal.classList.add("hidden");
        if (onSaved) onSaved();
    };
}

/* ============================================================
   MODAL: ODBIÓR KOKONU (WYNIK)
============================================================ */

export function openEggSackPullModal(eggSack, onSaved) {
    const modal = document.getElementById("breeding-full-modal");
    const box = document.getElementById("breeding-full-modal-content");

    box.innerHTML = pullTemplate(eggSack);
    modal.classList.remove("hidden");

    document.getElementById("cancel-egg-sack-pull").onclick = () => {
        modal.classList.add("hidden");
    };

    document.getElementById("save-egg-sack-pull").onclick = async () => {
        const payload = collectPullPayload();

        await updateEggSack(eggSack.id, payload);

        modal.classList.add("hidden");
        if (onSaved) onSaved();
    };
}

/* ============================================================
   TEMPLATE — CREATE
============================================================ */

function createTemplate() {
    return `
      <h3 class="text-3xl font-black mb-8 text-slate-900 tracking-tight">
        Kokon – złożenie
      </h3>

      <div class="space-y-10 max-h-[70vh] overflow-y-auto pr-2">

        <section>
          <p class="text-[10px] font-black text-slate-400 uppercase mb-4 tracking-widest">
            Dane kokonu
          </p>

          <div class="grid md:grid-cols-2 gap-4">
            <input type="date" id="sacDate" class="input" placeholder="Data złożenia kokonu" />
            <input type="date" id="recommendedPullDate" class="input" placeholder="Sugerowana data odbioru" />
          </div>
        </section>

        <section>
          <p class="text-[10px] font-black text-slate-400 uppercase mb-4 tracking-widest">
            Uwagi
          </p>
          <textarea id="notes" class="input h-28" placeholder="Notatki o kokonie"></textarea>
        </section>

      </div>

      <div class="flex gap-4 pt-8">
        <button id="cancel-egg-sack" class="btn-secondary">Anuluj</button>
        <button id="save-egg-sack" class="btn-primary">Zapisz</button>
      </div>
    `;
}

/* ============================================================
   TEMPLATE — PULL
============================================================ */

function pullTemplate(eggSack) {
    const today = new Date().toISOString().split("T")[0];

    return `
      <h3 class="text-3xl font-black mb-8 text-slate-900 tracking-tight">
        Odbiór kokonu
      </h3>

      <div class="space-y-10 max-h-[70vh] overflow-y-auto pr-2">

        <section>
          <p class="text-[10px] font-black text-slate-400 uppercase mb-4 tracking-widest">
            Data odbioru
          </p>

          <input type="date" id="pullDate" class="input"
                 value="${eggSack.dateOfEggSackPull ?? today}" />
        </section>

        <section>
          <p class="text-[10px] font-black text-slate-400 uppercase mb-4 tracking-widest">
            Wynik kokonu
          </p>

          <div class="grid md:grid-cols-3 gap-4">
            <input type="number" id="goodEggs" class="input" placeholder="Jaja dobre"
                   value="${eggSack.numberOfEggs ?? ""}" />
            <input type="number" id="badEggs" class="input" placeholder="Jaja zepsute"
                   value="${eggSack.numberOfBadEggs ?? ""}" />
            <input type="number" id="nymphsLive" class="input" placeholder="Nimfy żywe"
                   value="${eggSack.numberOfNymphs ?? ""}" />
          </div>

          <div class="grid md:grid-cols-3 gap-4 mt-4">
            <input type="number" id="nymphsDead" class="input" placeholder="Nimfy martwe"
                   value="${eggSack.numberOfDeadNymphs ?? ""}" />
            <input type="number" id="spidersLive" class="input" placeholder="Pająki żywe"
                   value="${eggSack.numberOfSpiders ?? ""}" />
            <input type="number" id="spidersDead" class="input" placeholder="Pająki martwe"
                   value="${eggSack.numberOfDeadSpiders ?? ""}" />
          </div>

          <select id="cocoonStatus" class="input mt-4">
            ${statusOptions(eggSack.status)}
          </select>
        </section>

        <section>
          <p class="text-[10px] font-black text-slate-400 uppercase mb-4 tracking-widest">
            Uwagi
          </p>
          <textarea id="notes" class="input h-28" placeholder="Notatki">${eggSack.eggSackDescription ?? ""}</textarea>
        </section>

      </div>

      <div class="flex gap-4 pt-8">
        <button id="cancel-egg-sack-pull" class="btn-secondary">Anuluj</button>
        <button id="save-egg-sack-pull" class="btn-primary">Zapisz</button>
      </div>
    `;
}

/* ============================================================
   STATUSY
============================================================ */

function statusOptions(current) {
    const statuses = ["LAID", "DEVELOPING", "PULLED", "FAILED", "SUCCESSFUL"];
    return statuses
        .map(s => `<option value="${s}" ${current === s ? "selected" : ""}>${s}</option>`)
        .join("");
}

/* ============================================================
   PAYLOADS
============================================================ */

function collectCreatePayload() {
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
        status: "LAID"
    };
}

function collectPullPayload() {
    return {
        dateOfEggSackPull: valueOrNull("#pullDate"),

        numberOfEggs: numberOrNull("#goodEggs"),
        numberOfBadEggs: numberOrNull("#badEggs"),
        numberOfNymphs: numberOrNull("#nymphsLive"),
        numberOfDeadNymphs: numberOrNull("#nymphsDead"),
        numberOfSpiders: numberOrNull("#spidersLive"),
        numberOfDeadSpiders: numberOrNull("#spidersDead"),

        eggSackDescription: valueOrNull("#notes"),
        status: valueOrNull("#cocoonStatus")
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

function addDays(dateStr, days) {
    if (!dateStr) return null;
    const d = new Date(dateStr);
    d.setDate(d.getDate() + days);
    return d.toISOString().split("T")[0];
}
