// /static/js/breeding/breedingNewSpider.js

import { createSpider } from "./breedingApi.js";

export function openNewSpiderModal(onCreated) {
    const modal = document.getElementById("breeding-full-modal");
    const box = document.getElementById("breeding-full-modal-content");

    box.innerHTML = template();
    modal.classList.remove("hidden");

    document.getElementById("cancel-new-spider").onclick = () => {
        modal.classList.add("hidden");
    };

    document.getElementById("save-new-spider").onclick = async () => {
        const payload = collectPayload();
        const created = await createSpider(payload);
        modal.classList.add("hidden");
        if (onCreated) onCreated(created);
    };
}

function template() {
    return `
      <h3 class="text-3xl font-black mb-8 text-slate-900 tracking-tight">
        Nowa samica rozrodcza
      </h3>

      <div class="space-y-8 max-h-[70vh] overflow-y-auto pr-2">

        <section>
          <p class="text-[10px] font-black text-slate-400 uppercase mb-4 tracking-widest">
            Dane podstawowe
          </p>

          <div class="grid md:grid-cols-2 gap-4">
            <input id="typeName" class="input" placeholder="Rodzaj (np. Brachypelma)" />
            <input id="speciesName" class="input" placeholder="Gatunek (np. hamorii)" />
          </div>

          <div class="grid md:grid-cols-2 gap-4 mt-4">
            <input id="origin" class="input" placeholder="Pochodzenie" />
            <input id="size" class="input" placeholder="Rozmiar (np. subadult)" />
          </div>
        </section>

        <section>
          <p class="text-[10px] font-black text-slate-400 uppercase mb-4 tracking-widest">
            CITES i status
          </p>

          <div class="grid md:grid-cols-2 gap-4">
            <label class="flex items-center gap-2 text-sm">
              <input type="checkbox" id="cites" class="w-4 h-4" />
              CITES
            </label>

            <input id="citesDocumentNumber" class="input" placeholder="Numer dokumentu CITES" />
          </div>

          <div class="grid md:grid-cols-2 gap-4 mt-4">
            <select id="breedingStatus" class="input">
              <option value="ACTIVE">Aktywna</option>
              <option value="RETIRED">Wycofana</option>
              <option value="DEAD">Padła</option>
            </select>
          </div>
        </section>

        <section>
          <p class="text-[10px] font-black text-slate-400 uppercase mb-4 tracking-widest">
            Notatki
          </p>
          <textarea id="notes" class="input h-28" placeholder="Notatki o samicy"></textarea>
        </section>

      </div>

      <div class="flex gap-4 pt-8">
        <button id="cancel-new-spider" class="btn-secondary">Anuluj</button>
        <button id="save-new-spider" class="btn-primary">Zapisz</button>
      </div>
    `;
}

function collectPayload() {
    return {
        typeName: valueOrNull("#typeName"),
        speciesName: valueOrNull("#speciesName"),
        origin: valueOrNull("#origin"),
        size: valueOrNull("#size"),
        cites: document.getElementById("cites").checked,
        citesDocumentNumber: valueOrNull("#citesDocumentNumber"),
        breedingStatus: valueOrNull("#breedingStatus") || "ACTIVE",
        notes: valueOrNull("#notes")
    };
}

function valueOrNull(sel) {
    const el = document.querySelector(sel);
    if (!el) return null;
    const v = el.value?.trim();
    return v === "" ? null : v;
}
