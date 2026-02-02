// /static/js/breeding/breedingDashboard.js

import { fetchSpiders, fetchEntriesForSpider, fetchEggSackByEntry } from "./breedingApi.js";

/**
 * Renderuje globalny dashboard rozmnożeń
 */
export async function renderBreedingDashboard(root) {
    const spiders = await fetchSpiders();

    // Pobieramy wszystkie wpisy rozmnożeń + ich kokony
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
            Najbardziej produktywne samice
        </h3>

        ${renderTopFemales(stats.topFemales)}
    `;
}

/* ============================================================================
   STATYSTYKI GLOBALNE
============================================================================ */

function computeStats(spiders, entries) {
    const totalSpiders = spiders.length;
    const totalPairings = entries.length;

    // Kokon = istnieje eggSack
    const totalEggSacks = entries.filter(e => e.eggSack).length;

    // Udane rozmnożenia – przyjmijmy SUCCESSFUL jako udany kokon
    const totalResults = entries.filter(e => e.eggSack && e.eggSack.status === "SUCCESSFUL").length;

    // L1 – przyjmujemy numberOfSpiders jako L1 (wyklute pająki)
    const totalL1 = entries.reduce((sum, e) => {
        if (!e.eggSack) return sum;
        return sum + (e.eggSack.numberOfSpiders ?? 0);
    }, 0);

    // Grupowanie po samicy
    const bySpider = {};
    for (const e of entries) {
        const id = e.spider.id;
        if (!bySpider[id]) {
            bySpider[id] = {
                spider: e.spider,
                l1: 0,
                sacs: 0
            };
        }

        if (e.eggSack) {
            bySpider[id].sacs++;
            bySpider[id].l1 += (e.eggSack.numberOfSpiders ?? 0);
        }
    }

    const topFemales = Object.values(bySpider)
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
            ${stat("Dopuszczenia", s.totalPairings)}
            ${stat("Kokony", s.totalEggSacks)}
            ${stat("Udane rozmnożenia", s.totalResults)}
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
            ${list.map(f => `
                <div class="glass-card p-6 rounded-2xl border border-slate-200">
                    <p class="text-xl font-bold text-slate-900">
                        ${f.spider.typeName} ${f.spider.speciesName}
                    </p>
                    <p class="text-slate-500 mt-1">${f.spider.origin ?? "pochodzenie nieznane"}</p>

                    <div class="mt-4">
                        <p class="text-sm">Kokony: <b>${f.sacs}</b></p>
                        <p class="text-sm">L1: <b>${f.l1}</b></p>
                    </div>
                </div>
            `).join("")}
        </div>
    `;
}
