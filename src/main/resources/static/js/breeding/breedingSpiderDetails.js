// /static/js/breeding/breedingSpiderDetails.js

import {
    fetchSpider,
    fetchEntriesForSpider
} from './breedingApi.js';

/* ============================================================
   SZCZEGÓŁY SAMICY ROZRODOWEJ
============================================================ */

export async function renderBreedingSpiderDetails(container, spiderId, {
    onBack,
    onAddEntry,
    onAddEggSack,
    onEditEggSack
} = {}) {

    const [spider, entries] = await Promise.all([
        fetchSpider(spiderId),
        fetchEntriesForSpider(spiderId)
    ]);

    // Sortowanie od najnowszego do najstarszego (S1)
    entries.sort((a, b) => {
        const da = extractLatestDate(a);
        const db = extractLatestDate(b);
        return db - da;
    });

    container.innerHTML = `
    <div class="space-y-10">

      <!-- KARTA SAMICY -->
      <section class="glass-card rounded-[3rem] p-10">
        <div class="flex justify-between items-start gap-6 mb-6">

          <div>
            <button id="breeding-back-btn"
                    class="mb-4 inline-flex items-center gap-2 text-xs font-black text-slate-500 uppercase tracking-widest hover:text-slate-900 transition">
              <i class="bi bi-arrow-left"></i> Powrót
            </button>

            <h2 class="text-4xl font-[800] text-slate-900 tracking-tight">
              ${spider.typeName ?? ''} ${spider.speciesName ?? ''}
            </h2>

            <p class="text-slate-500 mt-2 text-sm">
              Samica rozrodowa • ${spider.origin ?? 'pochodzenie nieznane'}
            </p>
          </div>

          <div class="flex flex-col items-end gap-3">
            <span class="px-4 py-1 rounded-full bg-emerald-50 text-emerald-700 text-[11px] font-black uppercase tracking-widest">
              ${spider.breedingStatus ?? 'ACTIVE'}
            </span>

            <p class="text-xs text-slate-400 uppercase font-black tracking-widest">
              Wpisy: <span class="text-slate-900">${entries.length}</span>
            </p>
          </div>

        </div>

        <div class="grid md:grid-cols-3 gap-8 mt-6">
          <div>
            <p class="text-[10px] font-black text-slate-400 uppercase mb-1">Rozmiar</p>
            <p class="text-lg font-semibold text-slate-900">${spider.size ?? '-'}</p>
          </div>

          <div>
            <p class="text-[10px] font-black text-slate-400 uppercase mb-1">Ostatnia wylinka</p>
            <p class="text-lg font-semibold text-slate-900">${spider.lastMoltDate ?? '-'}</p>
          </div>

          <div>
            <p class="text-[10px] font-black text-slate-400 uppercase mb-1">CITES</p>
            <p class="text-lg font-semibold text-slate-900">
              ${spider.cites ? `Tak (${spider.citesDocumentNumber ?? 'brak numeru'})` : 'Nie'}
            </p>
          </div>
        </div>

        <div class="mt-8">
          <p class="text-[10px] font-black text-slate-400 uppercase mb-2">Notatki</p>
          <p class="text-sm text-slate-700 leading-relaxed">
            ${spider.notes ?? 'Brak notatek dla tej samicy.'}
          </p>
        </div>
      </section>

      <!-- LISTA WPISÓW -->
      <section class="glass-card rounded-[3rem] p-10">

        <div class="flex justify-between items-center mb-6">
          <div>
            <h3 class="text-xs font-black text-slate-400 uppercase tracking-widest mb-2">
              Wpisy rozmnożeniowe
            </h3>
            <p class="text-xl font-[800] text-slate-900 tracking-tight">
              Historia wpisów
            </p>
          </div>

          <button id="breeding-add-entry-btn"
                  class="flex items-center gap-2 px-6 py-3 rounded-2xl bg-slate-900 text-white text-xs font-black uppercase tracking-widest hover:bg-emerald-600 transition">
            <i class="bi bi-plus-lg"></i> Nowy wpis
          </button>
        </div>

        <div class="space-y-4">
          ${entries.length === 0 ? `
            <p class="text-slate-400 italic text-center py-10">
              Brak zarejestrowanych wpisów.
            </p>
          ` : entries.map(e => renderEntryCard(e)).join('')}
        </div>

      </section>

    </div>
  `;

    /* ============================================================
       OBSŁUGA PRZYCISKÓW
    ============================================================= */

    document.getElementById('breeding-back-btn')
        .addEventListener('click', () => onBack && onBack());

    document.getElementById('breeding-add-entry-btn')
        .addEventListener('click', () => onAddEntry && onAddEntry(spiderId));

    container.querySelectorAll('[data-action="add-cocoon"]').forEach(btn => {
        btn.addEventListener('click', () => {
            const entryId = btn.getAttribute('data-entry-id');
            onAddEggSack && onAddEggSack(entryId, spiderId);
        });
    });

    container.querySelectorAll('[data-action="edit-cocoon"]').forEach(btn => {
        btn.addEventListener('click', () => {
            const entryId = btn.getAttribute('data-entry-id');
            onEditEggSack && onEditEggSack(entryId, spiderId);
        });
    });
}

/* ============================================================
   RENDER KARTY WPISU
============================================================ */

function renderEntryCard(e) {
    const hasCocoon =
        e.sacDate ||
        e.totalEggsOrNymphs ||
        e.liveL1Count ||
        e.deadCount ||
        e.cocoonStatus;

    return `
    <div class="border border-slate-100 rounded-[1.75rem] p-6 flex flex-col md:flex-row justify-between gap-6 hover:bg-slate-50/60 transition">

      <div class="space-y-2">
        <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest">Dopuszczenie</p>
        <p class="text-sm font-semibold text-slate-900">
          ${extractPairingDate(e) ?? 'Brak daty'}
        </p>

        <p class="text-xs text-slate-500">
          Temp: ${e.pairingTemperature ?? '-'} °C • Wilg: ${e.pairingHumidity ?? '-'} %
        </p>

        <p class="text-xs text-slate-500 mt-2">${e.pairingNotes ?? ''}</p>
      </div>

      <div class="flex flex-col items-end gap-2 min-w-[220px]">

        ${hasCocoon ? renderCocoonSection(e) : ''}

        <div class="flex gap-2 mt-3">
          ${
        hasCocoon
            ? `<button class="px-4 py-2 rounded-2xl bg-slate-900 text-white text-[11px] font-black uppercase tracking-widest hover:bg-emerald-600 transition"
                         data-entry-id="${e.id}" data-action="edit-cocoon">
                   Edytuj kokon
                 </button>`
            : `<button class="px-4 py-2 rounded-2xl bg-slate-900 text-white text-[11px] font-black uppercase tracking-widest hover:bg-emerald-600 transition"
                         data-entry-id="${e.id}" data-action="add-cocoon">
                   Kokon złożony
                 </button>`
    }
        </div>

      </div>

    </div>
  `;
}

/* ============================================================
   RENDER SEKCJI KOKONU
============================================================ */

function renderCocoonSection(e) {
    return `
    <div class="text-right">
      <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Kokon</p>
      <p class="text-sm font-semibold text-slate-900">Złożony: ${e.sacDate ?? '-'}</p>
      <p class="text-xs text-slate-500">Odbiór: ${e.recommendedPullDate ?? '-'}</p>
      <p class="text-xs text-slate-500 mt-1">
        L1: ${e.liveL1Count ?? '-'} / ${e.totalEggsOrNymphs ?? '-'} • Martwe: ${e.deadCount ?? '-'}
      </p>
      <span class="px-3 py-1 mt-2 inline-block rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-black uppercase tracking-widest">
        ${e.cocoonStatus ?? 'BRAK STATUSU'}
      </span>
    </div>
  `;
}

/* ============================================================
   WYCIĄGANIE DATY DO SORTOWANIA
============================================================ */

function extractLatestDate(e) {
    const dates = [
        e.pairingDate1,
        e.pairingDate2,
        e.pairingDate3,
        e.pairingDate4,
        e.sacDate,
        e.recommendedPullDate
    ].filter(Boolean);

    if (dates.length === 0) return 0;
    return new Date(dates.sort().reverse()[0]).getTime();
}

function extractPairingDate(e) {
    return e.pairingDate1 || e.pairingDate2 || e.pairingDate3 || e.pairingDate4 || null;
}
