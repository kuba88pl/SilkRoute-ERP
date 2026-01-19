// /static/js/breeding/breedingEggSackForm.js
// Modal „Kokon złożony” — osobny, premium, szeroki modal K1

export function eggSackFormTemplate() {
    return `
    <h3 class="text-3xl font-black mb-8 text-slate-900 tracking-tight">
      Kokon złożony
    </h3>

    <div class="space-y-10 max-h-[70vh] overflow-y-auto pr-2">

      <!-- Sekcja: daty -->
      <section>
        <p class="text-[10px] font-black text-slate-400 uppercase mb-4 tracking-widest">
          Informacje o kokonie
        </p>

        <div class="grid md:grid-cols-2 gap-4">
          <input type="date" id="sacDate" class="input" placeholder="Data złożenia kokonu" />
          <input type="date" id="recommendedPullDate" class="input" placeholder="Data odbioru kokonu" />
        </div>
      </section>

      <!-- Sekcja: liczby -->
      <section>
        <p class="text-[10px] font-black text-slate-400 uppercase mb-4 tracking-widest">
          Wynik kokonu
        </p>

        <div class="grid md:grid-cols-3 gap-4">
          <input type="number" id="totalEggsOrNymphs" class="input" placeholder="Liczba jaj / nimf" />
          <input type="number" id="deadCount" class="input" placeholder="Martwe" />
          <input type="number" id="liveL1Count" class="input" placeholder="Żywe L1" />
        </div>
      </section>

      <!-- Sekcja: status -->
      <section>
        <p class="text-[10px] font-black text-slate-400 uppercase mb-4 tracking-widest">
          Status kokonu
        </p>

        <select id="cocoonStatus" class="input">
          <option value="">Wybierz status</option>
          <option value="HEALTHY">Zdrowy</option>
          <option value="DRIED_OUT">Wyschnięty</option>
          <option value="ROTTEN">Zgniły</option>
          <option value="INFERTILE">Niezapłodniony</option>
          <option value="EATEN">Zjedzony</option>
        </select>
      </section>

      <!-- Sekcja: notatki -->
      <section>
        <p class="text-[10px] font-black text-slate-400 uppercase mb-4 tracking-widest">
          Notatki
        </p>

        <textarea id="cocoonNotes" class="input h-28" placeholder="Notatki o kokonie"></textarea>
      </section>

    </div>

    <div class="flex gap-4 pt-10">
      <button id="cancel-cocoon" class="btn-secondary">Anuluj</button>
      <button id="save-cocoon" class="btn-primary">Zapisz</button>
    </div>
  `;
}

/* ============================================================
   PAYLOAD GENERATOR
============================================================ */

export function collectEggSackPayload() {
    return {
        sacDate: valueOrNull("#sacDate"),
        recommendedPullDate: valueOrNull("#recommendedPullDate"),
        totalEggsOrNymphs: numberOrNull("#totalEggsOrNymphs"),
        deadCount: numberOrNull("#deadCount"),
        liveL1Count: numberOrNull("#liveL1Count"),
        cocoonStatus: valueOrNull("#cocoonStatus"),
        notes: valueOrNull("#cocoonNotes")
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
