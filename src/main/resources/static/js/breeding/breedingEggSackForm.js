// /static/js/breeding/breedingEggSackForm.js

import { updateEntry } from "./breedingApi.js";

export function openEggSackModal(entry, onSaved) {
    const modal = document.getElementById("breeding-full-modal");
    const box = document.getElementById("breeding-full-modal-content");

    box.innerHTML = template(entry);
    modal.classList.remove("hidden");

    const sacInput = document.getElementById("sacDate");
    const pullInput = document.getElementById("recommendedPullDate");

    let userEditedPullDate = false;

    pullInput.addEventListener("input", () => userEditedPullDate = true);

    sacInput.addEventListener("input", () => {
        if (!userEditedPullDate) {
            pullInput.value = addDays(sacInput.value, 30);
        }
    });

    document.getElementById("cancel-egg-sack").onclick = () => {
        modal.classList.add("hidden");
    };

    document.getElementById("save-egg-sack").onclick = async () => {
        const payload = collectPayload();
        await updateEntry(entry.id, payload);
        modal.classList.add("hidden");
        if (onSaved) onSaved();
    };
}

function template(e) {
    return `
      <h3 class="text-3xl font-black mb-8 text-slate-900 tracking-tight">Kokon / Wynik rozmnożenia</h3>

      <div class="space-y-10 max-h-[70vh] overflow-y-auto pr-2">

        <section>
          <p class="text-[10px] font-black text-slate-400 uppercase mb-4 tracking-widest">Kokon</p>

          <div class="grid md:grid-cols-2 gap-4">
            <input type="date" id="sacDate" class="input" value="${e.sacDate ?? ""}" />
            <input type="date" id="recommendedPullDate" class="input" value="${e.recommendedPullDate ?? ""}" />
          </div>
        </section>

        <section>
          <p class="text-[10px] font-black text-slate-400 uppercase mb-4 tracking-widest">Wynik kokonu</p>

          <div class="grid md:grid-cols-3 gap-4">
            <input type="number" id="totalEggsOrNymphs" class="input" value="${e.totalEggsOrNymphs ?? ""}" placeholder="Łącznie jaj / nimf" />
            <input type="number" id="deadCount" class="input" value="${e.deadCount ?? ""}" placeholder="Martwe" />
            <input type="number" id="liveL1Count" class="input" value="${e.liveL1Count ?? ""}" placeholder="Żywe L1" />
          </div>

          <select id="cocoonStatus" class="input mt-4">
            ${statusOptions(e.cocoonStatus)}
          </select>
        </section>

        <section>
          <p class="text-[10px] font-black text-slate-400 uppercase mb-4 tracking-widest">Zachowanie / uwagi</p>
          <textarea id="notes" class="input h-28">${e.notes ?? ""}</textarea>
        </section>

      </div>

      <div class="flex gap-4 pt-8">
        <button id="cancel-egg-sack" class="btn-secondary">Anuluj</button>
        <button id="save-egg-sack" class="btn-primary">Zapisz</button>
      </div>
    `;
}

function statusOptions(current) {
    const statuses = ["HEALTHY", "DRIED_OUT", "ROTTEN", "INFERTILE", "EATEN"];
    return statuses.map(s => `<option value="${s}" ${current === s ? "selected" : ""}>${s}</option>`).join("");
}

function collectPayload() {
    const sacDate = valueOrNull("#sacDate");
    const total = numberOrNull("#totalEggsOrNymphs");
    const dead = numberOrNull("#deadCount");
    const live = numberOrNull("#liveL1Count");

    let status = null;

    if (sacDate && (total || dead || live)) status = "RESULT";
    else if (sacDate) status = "EGG_SACK";

    return {
        sacDate,
        recommendedPullDate: valueOrNull("#recommendedPullDate"),
        totalEggsOrNymphs: total,
        deadCount: dead,
        liveL1Count: live,
        cocoonStatus: valueOrNull("#cocoonStatus"),
        notes: valueOrNull("#notes"),
        status
    };
}

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
