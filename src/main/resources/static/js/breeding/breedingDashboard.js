// /static/js/breeding/breedingDashboard.js

import { fetchSpiders, fetchEntriesForSpider, fetchEggSackByEntry } from "./breedingApi.js";

/**
 * Renderuje globalny dashboard rozmnożeń
 */
export async function renderBreedingDashboard(root) {
    const spiders = await fetchSpiders();

    const allEntries = [];

    for (const s of spiders) {
        const entries = await fetchEntriesForSpider(s.id);

        const enriched = await Promise.all(
            entries.map(async e => {
                try {
                    const eggSack = await fetchEggSackByEntry(e.id);
                    return { ...e, spider: s, eggSack: eggSack || null };
                } catch {
                    return { ...e, spider: s, eggSack: null };
                }
            })
        );

        allEntries.push(...enriched);
    }

    const stats = computeStats(spiders, allEntries);

    root.innerHTML = `
        <div class="glass-card p-10 rounded-3xl border border-slate-200 mb-10">
            <h2 class="text-4xl font-[800] text-slate-900 tracking-tight mb-6">
                Dashboard rozmnożeń
            </h2>

            ${renderGlobalStats(stats)}
        </div>

        <h3 class="text-2xl font-[800] text-slate-900 tracking-tight mt-12 mb-6">
            Samice z aktywnymi kokonami
        </h3>

        ${renderTopFemales(stats.topFemales)}
    `;

    root.addEventListener("click", (ev) => {
        const el = ev.target.closest("[data-open-spider]");
        if (!el) return;

        const id = el.dataset.openSpider;
        if (id) {
            window.openBreedingDetails?.(id);
        }
    });
}

/* ============================================================================
   STATYSTYKI GLOBALNE
============================================================================ */

function computeStats(spiders, entries) {
    const totalSpiders = spiders.length;
    const totalPairings = entries.length;

    const totalEggSacks = entries.filter(e => e.eggSack).length;

    const totalResults = entries.filter(
        e => e.eggSack && e.eggSack.status === "SUCCESSFUL"
    ).length;

    const totalL1 = entries.reduce((sum, e) => {
        if (!e.eggSack) return sum;
        return sum + (e.eggSack.numberOfSpiders ?? 0);
    }, 0);

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const bySpider = {};
    for (const e of entries) {
        const id = e.spider.id;
        if (!bySpider[id]) {
            bySpider[id] = {
                spider: e.spider,
                l1: 0,
                sacs: 0,
                latestEggSackStatus: null,
                hasLaid: false,
                hasPullSoon: false
            };
        }

        if (e.eggSack) {
            bySpider[id].sacs++;
            bySpider[id].l1 += (e.eggSack.numberOfSpiders ?? 0);
            bySpider[id].latestEggSackStatus = e.eggSack.status;

            if (e.eggSack.status === "LAID") {
                bySpider[id].hasLaid = true;
            }

            const suggested = e.eggSack.suggestedDateOfEggSackPull;
            const pulled = e.eggSack.dateOfEggSackPull;

            if (suggested && !pulled) {
                const pullDate = new Date(suggested);
                pullDate.setHours(0, 0, 0, 0);

                const diffMs = pullDate.getTime() - today.getTime();
                const diffDays = diffMs / (1000 * 60 * 60 * 24);

                if (diffDays >= 0 && diffDays <= 3) {
                    bySpider[id].hasPullSoon = true;
                }
            }
        }
    }

    // 🔥 filtrujemy tylko samice z kokonem LAID
    const topFemales = Object.values(bySpider)
        .filter(f => f.hasLaid === true)
        .sort((a, b) => b.l1 - a.l1)
        .slice(0, 5);

    return {
        totalSpiders,
        totalPairings,
        totalEggSacks,
        totalResults,
        totalL1,
        topFemales
    };
}

function renderGlobalStats(s) {
    return `
        <div class="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-6">

            ${stat("Samice", s.totalSpiders)}
            ${stat("Wpisy", s.totalPairings)}
            ${stat("Kokony", s.totalEggSacks)}
            ${stat("Rozmnożenia", s.totalResults)}
            ${stat("Łącznie L1", s.totalL1)}

        </div>
    `;
}

function stat(label, value) {
    return `
        <div class="glass-card p-6 rounded-2xl border border-slate-200 text-center">
            <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest">${label}</p>
            <p class="text-3xl font-[800] text-slate-900 mt-2">${value}</p>
        </div>
    `;
}

/* ============================================================================
   TOP SAMICE
============================================================================ */

function renderTopFemales(list) {
    if (list.length === 0) {
        return `<p class="text-slate-500 italic">Brak danych.</p>`;
    }

    return `
        <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            ${list.map(f => {

        let blinkClass = "";
        let extraNote = "";

        const isMonocentropus =
            f.spider.typeName?.toLowerCase().includes("monocentropus") ||
            f.spider.speciesName?.toLowerCase().includes("monocentropus");

        // 🔵 wyjątek dla Monocentropus — kokon inkubowany przez samicę
        if (isMonocentropus && f.hasLaid) {
            blinkClass = "blink-blue-bg";
            extraNote = `<p class="text-xs text-blue-700 mt-2 font-semibold">
                            Kokon inkubowany przez samicę
                         </p>`;
        }
        else if (f.hasPullSoon) {
            blinkClass = "blink-red-bg";
        }
        else if (f.hasLaid) {
            blinkClass = "blink-yellow-bg";
        }

        return `
                    <div 
                        class="glass-card p-6 rounded-2xl border border-slate-200 cursor-pointer hover:border-emerald-500 transition ${blinkClass}"
                        data-open-spider="${f.spider.id}"
                    >
                        <p class="text-xl font-bold text-slate-900">
                            ${f.spider.typeName} ${f.spider.speciesName}
                        </p>
                        <p class="text-slate-500 mt-1">${f.spider.origin ?? "pochodzenie nieznane"}</p>

                        <div class="mt-4">
                            <p class="text-sm">Kokony: <b>${f.sacs}</b></p>
                            <p class="text-sm">L1: <b>${f.l1}</b></p>
                            ${extraNote}
                        </div>
                    </div>
                `;
    }).join("")}
        </div>
    `;
}
