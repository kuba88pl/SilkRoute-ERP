// /static/js/breeding/breedingSpidersList.js
import { fetchSpiders, createSpider } from './breedingApi.js';

export async function renderBreedingSpidersList(container, { onSelectSpider } = {}) {
    const spiders = await fetchSpiders();

    container.innerHTML = `
    <section class="glass-card rounded-[3rem] p-8 md:p-10">
      <div class="flex justify-between items-center mb-8">
        <div>
          <h2 class="text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Samice rozrodowe</h2>
          <p class="text-2xl font-[800] text-slate-900 tracking-tight">Lista samic w hodowli</p>
        </div>
      </div>

      <div class="overflow-x-auto">
        <table class="min-w-full text-sm">
          <thead>
            <tr class="text-left text-[11px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-200">
              <th class="py-3 pr-6">Typ</th>
              <th class="py-3 pr-6">Gatunek</th>
              <th class="py-3 pr-6">Rozmiar</th>
              <th class="py-3 pr-6">CITES</th>
              <th class="py-3 pr-6">Rozmnożenia</th>
              <th class="py-3 pr-6"></th>
            </tr>
          </thead>
          <tbody>
            ${spiders.map(s => `
              <tr class="border-b border-slate-100 hover:bg-slate-50/60 cursor-pointer transition"
                  data-id="${s.id}">
                <td class="py-4 pr-6 text-sm font-semibold text-slate-800">${s.typeName ?? '-'}</td>
                <td class="py-4 pr-6 text-sm font-semibold text-slate-900">${s.speciesName ?? '-'}</td>
                <td class="py-4 pr-6 text-sm text-slate-600">${s.size ?? '-'}</td>
                <td class="py-4 pr-6 text-sm">
                  ${s.cites ? '<span class="px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-[11px] font-black uppercase tracking-widest">CITES</span>' : '-'}
                </td>
                <td class="py-4 pr-6 text-sm font-semibold text-slate-800">${s.breedingCount ?? 0}</td>
                <td class="py-4 pr-2 text-right">
                  <button class="px-4 py-2 rounded-2xl bg-slate-900 text-white text-xs font-black uppercase tracking-widest hover:bg-emerald-600 transition">
                    Szczegóły
                  </button>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    </section>
  `;

    container.querySelectorAll('tbody tr').forEach(row => {
        row.addEventListener('click', () => {
            const id = row.getAttribute('data-id');
            onSelectSpider && onSelectSpider(id);
        });
    });

    // obsługa eventu z breeding.html (nowa samica)
    window.addEventListener('breeding:createSpider', async (e) => {
        const { speciesName, typeName } = e.detail;
        await createSpider({
            speciesName,
            typeName,
            size: null,
            cites: false,
            citesDocumentNumber: null,
            breedingStatus: 'ACTIVE',
            breedingCount: 0
        });
        renderBreedingSpidersList(container, { onSelectSpider });
    }, { once: true });
}
