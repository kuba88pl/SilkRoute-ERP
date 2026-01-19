// /static/js/breeding/breedingEntryForm.js
import { createEntry, updateEntry } from './breedingApi.js';

export function renderBreedingEntryForm(modalContainer, spiderId, existingEntry, { onCancel, onSaved } = {}) {
    const isEdit = !!existingEntry;

    modalContainer.innerHTML = `
    <h3 class="text-3xl font-black mb-8 text-slate-900 tracking-tight">
      ${isEdit ? 'Edytuj rozmnożenie' : 'Nowe rozmnożenie'}
    </h3>
    <div class="space-y-8 max-h-[70vh] overflow-y-auto pr-2">
      <section>
        <p class="text-[10px] font-black text-slate-400 uppercase mb-4 tracking-widest">Kopulacje</p>
        <div class="grid md:grid-cols-4 gap-4">
          ${[1,2,3,4].map(i => `
            <div>
              <label class="text-[11px] font-black text-slate-500 uppercase mb-1 block">Kopulacja ${i}</label>
              <input type="date" id="pairingDate${i}"
                     value="${existingEntry?.[`pairingDate${i}`] ?? ''}"
                     class="w-full bg-slate-50 border border-slate-200 p-3 rounded-2xl outline-none focus:border-emerald-500 text-sm">
            </div>
          `).join('')}
        </div>
        <div class="grid md:grid-cols-2 gap-4 mt-4">
          <div>
            <label class="text-[11px] font-black text-slate-500 uppercase mb-1 block">Temperatura (°C)</label>
            <input type="number" step="0.1" id="pairingTemperature"
                   value="${existingEntry?.pairingTemperature ?? ''}"
                   class="w-full bg-slate-50 border border-slate-200 p-3 rounded-2xl outline-none focus:border-emerald-500 text-sm">
          </div>
          <div>
            <label class="text-[11px] font-black text-slate-500 uppercase mb-1 block">Wilgotność (%)</label>
            <input type="number" step="0.1" id="pairingHumidity"
                   value="${existingEntry?.pairingHumidity ?? ''}"
                   class="w-full bg-slate-50 border border-slate-200 p-3 rounded-2xl outline-none focus:border-emerald-500 text-sm">
          </div>
        </div>
        <div class="mt-4">
          <label class="text-[11px] font-black text-slate-500 uppercase mb-1 block">Notatki z kopulacji</label>
          <textarea id="pairingNotes"
                    class="w-full bg-slate-50 border border-slate-200 p-3 rounded-2xl outline-none focus:border-emerald-500 text-sm h-24">${existingEntry?.pairingNotes ?? ''}</textarea>
        </div>
      </section>

      <section>
        <p class="text-[10px] font-black text-slate-400 uppercase mb-4 tracking-widest">Kokon</p>
        <div class="grid md:grid-cols-2 gap-4">
          <div>
            <label class="text-[11px] font-black text-slate-500 uppercase mb-1 block">Data złożenia kokonu</label>
            <input type="date" id="sacDate"
                   value="${existingEntry?.sacDate ?? ''}"
                   class="w-full bg-slate-50 border border-slate-200 p-3 rounded-2xl outline-none focus:border-emerald-500 text-sm">
          </div>
          <div>
            <label class="text-[11px] font-black text-slate-500 uppercase mb-1 block">Sugerowana data odbioru</label>
            <input type="date" id="recommendedPullDate"
                   value="${existingEntry?.recommendedPullDate ?? ''}"
                   class="w-full bg-slate-50 border border-slate-200 p-3 rounded-2xl outline-none focus:border-emerald-500 text-sm">
          </div>
        </div>
      </section>

      <section>
        <p class="text-[10px] font-black text-slate-400 uppercase mb-4 tracking-widest">Wynik kokonu</p>
        <div class="grid md:grid-cols-3 gap-4">
          <div>
            <label class="text-[11px] font-black text-slate-500 uppercase mb-1 block">Ilość jaj / nimf</label>
            <input type="number" id="totalEggsOrNymphs"
                   value="${existingEntry?.totalEggsOrNymphs ?? ''}"
                   class="w-full bg-slate-50 border border-slate-200 p-3 rounded-2xl outline-none focus:border-emerald-500 text-sm">
          </div>
          <div>
            <label class="text-[11px] font-black text-slate-500 uppercase mb-1 block">Ilość martwych</label>
            <input type="number" id="deadCount"
                   value="${existingEntry?.deadCount ?? ''}"
                   class="w-full bg-slate-50 border border-slate-200 p-3 rounded-2xl outline-none focus:border-emerald-500 text-sm">
          </div>
          <div>
            <label class="text-[11px] font-black text-slate-500 uppercase mb-1 block">Ilość żywych L1</label>
            <input type="number" id="liveL1Count"
                   value="${existingEntry?.liveL1Count ?? ''}"
                   class="w-full bg-slate-50 border border-slate-200 p-3 rounded-2xl outline-none focus:border-emerald-500 text-sm">
          </div>
        </div>
        <div class="mt-4">
          <label class="text-[11px] font-black text-slate-500 uppercase mb-1 block">Status kokonu</label>
          <select id="cocoonStatus"
                  class="w-full bg-slate-50 border border-slate-200 p-3 rounded-2xl outline-none focus:border-emerald-500 text-sm">
            <option value="">-</option>
            <option value="HEALTHY">Zdrowy</option>
            <option value="DRIED_OUT">Wyschnięty</option>
            <option value="ROTTEN">Zgniły</option>
            <option value="INFERTILE">Niezapłodniony</option>
            <option value="EATEN">Zjedzony</option>
          </select>
        </div>
      </section>

      <section>
        <p class="text-[10px] font-black text-slate-400 uppercase mb-4 tracking-widest">Notatki</p>
        <textarea id="notes"
                  class="w-full bg-slate-50 border border-slate-200 p-3 rounded-2xl outline-none focus:border-emerald-500 text-sm h-24">${existingEntry?.notes ?? ''}</textarea>
      </section>
    </div>

    <div class="flex gap-4 pt-8">
      <button id="breeding-entry-cancel-btn"
              class="flex-1 bg-slate-100 text-slate-500 p-4 rounded-2xl font-bold hover:bg-slate-200 transition">
        Anuluj
      </button>
      <button id="breeding-entry-save-btn"
              class="flex-1 bg-emerald-600 text-white p-4 rounded-2xl font-black hover:bg-emerald-500 transition shadow-lg shadow-emerald-100">
        Zapisz
      </button>
    </div>
  `;

    if (existingEntry?.cocoonStatus) {
        modalContainer.querySelector('#cocoonStatus').value = existingEntry.cocoonStatus;
    }

    const modalWrapper = document.getElementById('breeding-entry-modal');
    modalWrapper.classList.remove('hidden');

    modalContainer.querySelector('#breeding-entry-cancel-btn')
        .addEventListener('click', () => {
            modalWrapper.classList.add('hidden');
            onCancel && onCancel();
        });

    modalContainer.querySelector('#breeding-entry-save-btn')
        .addEventListener('click', async () => {
            const payload = collectPayload(modalContainer);
            let saved;
            if (isEdit) {
                saved = await updateEntry(existingEntry.id, payload);
            } else {
                saved = await createEntry(spiderId, payload);
            }
            modalWrapper.classList.add('hidden');
            onSaved && onSaved(saved);
        });
}

function collectPayload(root) {
    const val = sel => root.querySelector(sel).value || null;
    const num = sel => {
        const v = root.querySelector(sel).value;
        return v === '' ? null : Number(v);
    };

    return {
        pairingDate1: val('#pairingDate1'),
        pairingDate2: val('#pairingDate2'),
        pairingDate3: val('#pairingDate3'),
        pairingDate4: val('#pairingDate4'),
        pairingTemperature: num('#pairingTemperature'),
        pairingHumidity: num('#pairingHumidity'),
        pairingNotes: val('#pairingNotes'),
        sacDate: val('#sacDate'),
        recommendedPullDate: val('#recommendedPullDate'),
        totalEggsOrNymphs: num('#totalEggsOrNymphs'),
        deadCount: num('#deadCount'),
        liveL1Count: num('#liveL1Count'),
        cocoonStatus: val('#cocoonStatus'),
        notes: val('#notes'),
    };
}
