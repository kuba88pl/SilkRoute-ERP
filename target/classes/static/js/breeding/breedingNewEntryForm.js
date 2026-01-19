// /static/js/breeding/breedingNewEntryForm.js
// Modal „Nowy wpis (dopuszczenie)” — dynamiczne pairingDateX

/* ============================================================
   TEMPLATE
============================================================ */

export function newEntryTemplate(nextPairingIndex) {
    const pairingLabel = {
        2: "Drugie dopuszczenie",
        3: "Trzecie dopuszczenie",
        4: "Czwarte dopuszczenie"
    }[nextPairingIndex] || "Dopuszczenie";

    return `
    <h3 class="text-3xl font-black mb-8 text-slate-900 tracking-tight">
      ${pairingLabel}
    </h3>

    <div class="space-y-8 max-h-[70vh] overflow-y-auto pr-2">

      <section>
        <p class="text-[10px] font-black text-slate-400 uppercase mb-4 tracking-widest">
          Nowy wpis dopuszczenia
        </p>

        <div class="grid md:grid-cols-1 gap-4">
          <input type="date" id="pairingDate" class="input" placeholder="Data dopuszczenia" />
        </div>

        <div class="grid md:grid-cols-2 gap-4 mt-4">
          <input type="number" step="0.1" id="pairingTemperature" placeholder="Temperatura (°C)" class="input" />
          <input type="number" step="0.1" id="pairingHumidity" placeholder="Wilgotność (%)" class="input" />
        </div>

        <textarea id="pairingNotes" placeholder="Notatki z dopuszczenia" class="input h-24 mt-4"></textarea>
      </section>

    </div>

    <div class="flex gap-4 pt-8">
      <button id="cancel-entry" class="btn-secondary">Anuluj</button>
      <button id="save-entry" class="btn-primary">Zapisz</button>
    </div>
  `;
}

/* ============================================================
   PAYLOAD GENERATOR
============================================================ */

export function collectNewEntryPayload(nextPairingIndex) {
    const date = document.getElementById("pairingDate").value || null;

    const payload = {
        pairingTemperature: numberOrNull("#pairingTemperature"),
        pairingHumidity: numberOrNull("#pairingHumidity"),
        pairingNotes: valueOrNull("#pairingNotes"),
    };

    // dynamiczne pole pairingDateX
    payload[`pairingDate${nextPairingIndex}`] = date;

    return payload;
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
