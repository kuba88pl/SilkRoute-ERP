// /static/js/breeding/breedingEntryForm.js

export function step1Template() {
    return `
    <h3 class="text-3xl font-black mb-8 text-slate-900 tracking-tight">
      Rejestracja nowej samicy
    </h3>

    <div class="space-y-10 max-h-[70vh] overflow-y-auto pr-2">

      <section>
        <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">
          Dane samicy
        </p>

        <div class="grid md:grid-cols-2 gap-4">
          <input type="text" id="new-type-name" class="input" placeholder="Typ (np. adult, subadult)" />
          <input type="text" id="new-species-name" class="input" placeholder="Gatunek (np. Monocentropus balfouri)" />
        </div>

        <div class="grid md:grid-cols-2 gap-4 mt-4">
          <input type="text" id="new-size" class="input" placeholder="Rozmiar (np. 5 cm)" />
          <input type="text" id="new-origin" class="input" placeholder="Pochodzenie (opcjonalnie)" />
        </div>

        <div class="mt-4">
          <label class="flex items-center gap-3 text-sm font-semibold text-slate-700">
            <input type="checkbox" id="new-cites" class="w-5 h-5">
            Gatunek objęty CITES
          </label>
          <input type="text" id="new-cites-doc" class="input mt-3" placeholder="Numer dokumentu CITES (opcjonalnie)" />
        </div>

        <textarea id="new-notes" class="input h-28 mt-4" placeholder="Notatki (opcjonalnie)"></textarea>
      </section>

    </div>

    <div class="flex gap-4 pt-10">
      <button id="cancel-full" class="btn-secondary">Anuluj</button>
      <button id="next-full" class="btn-primary">Dalej</button>
    </div>
  `;
}

export function step2Template() {
    return `
    <h3 class="text-3xl font-black mb-8 text-slate-900 tracking-tight">
      Warunki początkowe
    </h3>

    <div class="space-y-10 max-h-[70vh] overflow-y-auto pr-2">

      <section>
        <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">
          Parametry środowiskowe
        </p>

        <div class="grid md:grid-cols-2 gap-4">
          <input type="number" step="0.1" id="new-temp" class="input" placeholder="Temperatura (°C)" />
          <input type="number" step="0.1" id="new-humidity" class="input" placeholder="Wilgotność (%)" />
        </div>

        <textarea id="new-env-notes" class="input h-28 mt-4" placeholder="Notatki środowiskowe (opcjonalnie)"></textarea>
      </section>

    </div>

    <div class="flex gap-4 pt-10">
      <button id="back-full" class="btn-secondary">Wstecz</button>
      <button id="save-full" class="btn-primary">Zapisz</button>
    </div>
  `;
}
