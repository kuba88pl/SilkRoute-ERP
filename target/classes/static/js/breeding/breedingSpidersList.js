// /static/js/breeding/breedingSpidersList.js

import { fetchBreedingSpiders } from "./breedingApi.js";

/* ============================================================
   LISTA SAMIC ROZRODOWYCH
============================================================ */

export async function renderBreedingSpidersList(container, { onSelectSpider } = {}) {
    const spiders = await fetchBreedingSpiders();

    container.innerHTML = `
    <div class="space-y-10">

      <section class="glass-card rounded-[3rem] p-10">
        <div class="flex justify-between items-center mb-6">
          <div>
            <h3 class="text-xs font-black text-slate-400 uppercase tracking-widest mb-2">
              Samice rozrodcze
            </h3>
            <p class="text-xl font-[800] text-slate-900 tracking-tight">
              Lista samic
            </p>
          </div>
        </div>

        <div class="space-y-4">
          ${
        spiders.length === 0
            ? `<p class="text-slate-400 italic text-center py-10">Brak samic rozrodczych.</p>`
            : spiders.map(spider => renderSpiderCard(spider)).join("")
    }
        </div>
      </section>

    </div>
  `;

    /* ============================================================
       OBSŁUGA KLIKNIĘĆ
    ============================================================= */

    container.querySelectorAll("[data-spider-id]").forEach(card => {
        card.addEventListener("click", () => {
            const id = card.getAttribute("data-spider-id");
            onSelectSpider && onSelectSpider(id);
        });
    });
}

/* ============================================================
   KARTA SAMICY
============================================================ */

function renderSpiderCard(spider) {
    return `
    <div data-spider-id="${spider.id}"
         class="border border-slate-100 rounded-[1.75rem] p-6 flex justify-between items-center hover:bg-slate-50/60 transition cursor-pointer">

      <div>
        <p class="text-lg font-semibold text-slate-900">
          ${spider.typeName ?? ""} ${spider.speciesName ?? ""}
        </p>
        <p class="text-xs text-slate-500 mt-1">
          Rozmiar: ${spider.size ?? "-"} • Wpisy: ${spider.breedingCount ?? 0}
        </p>
      </div>

      <i class="bi bi-chevron-right text-slate-400 text-xl"></i>
    </div>
  `;
}
