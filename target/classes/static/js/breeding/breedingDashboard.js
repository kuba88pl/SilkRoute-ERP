// /static/js/breeding/breedingDashboard.js

import { fetchSpiders, fetchEntriesForSpider } from "./breedingApi.js";

/* ============================================================
   MAIN RENDER
============================================================ */

export async function renderBreedingDashboard(root) {
    const spiders = await fetchSpiders();

    // Load entries for each spider
    const spidersWithStats = [];
    for (const s of spiders) {
        const entries = await fetchEntriesForSpider(s.id);

        const pairings = entries.filter(e => e.entryType === "PAIRING").length;
        const eggCreated = entries.filter(e => e.entryType === "EGG_SACK_CREATED").length;
        const eggReceived = entries.filter(e => e.entryType === "EGG_SACK_RECEIVED");

        const totalL1 = eggReceived.reduce((sum, e) => {
            const es = e.eggSack;
            return sum + (es?.numberOfSpiders ?? 0);
        }, 0);

        spidersWithStats.push({
            ...s,
            pairings,
            eggCreated,
            eggReceivedCount: eggReceived.length,
            totalL1
        });
    }

    // Global stats
    const totalFemales = spiders.length;
    const totalPairings = spidersWithStats.reduce((a, s) => a + s.pairings, 0);
    const totalEggSacks = spidersWithStats.reduce((a, s) => a + s.eggCreated, 0);
    const totalSuccessful = spidersWithStats.reduce((a, s) => a + s.eggReceivedCount, 0);
    const totalL1 = spidersWithStats.reduce((a, s) => a + s.totalL1, 0);

    // Sort by productivity (L1 first, then egg sacks)
    const topFemales = [...spidersWithStats].sort((a, b) => {
        if (b.totalL1 !== a.totalL1) return b.totalL1 - a.totalL1;
        return b.eggCreated - a.eggCreated;
    });

    root.innerHTML = `
        <div class="glass-card mb-8">
            <h2 class="text-3xl font-[800] mb-2">Dashboard rozmnożeń</h2>
            <p class="text-slate-500">Podsumowanie wszystkich rozmnożeń w systemie.</p>
        </div>

        <!-- GLOBAL STATS -->
        <div class="grid md:grid-cols-5 gap-6 mb-10">
            ${statCard("SAMICE", totalFemales)}
            ${statCard("DOPUSZCZENIA", totalPairings)}
            ${statCard("KOKONY", totalEggSacks)}
            ${statCard("UDANE ROZMNOŻENIA", totalSuccessful)}
            ${statCard("ŁĄCZNIE L1", totalL1)}
        </div>

        <!-- TOP FEMALES -->
        <div class="glass-card">
            <h3 class="text-2xl font-[800] mb-6">Najbardziej produktywne samice</h3>

            <div class="space-y-4">
                ${topFemales.map(f => topFemaleCard(f)).join("")}
            </div>
        </div>
    `;
}

/* ============================================================
   STAT CARD
============================================================ */

function statCard(label, value) {
    return `
        <div class="glass-card text-center py-6">
            <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">${label}</p>
            <p class="text-3xl font-[800]">${value}</p>
        </div>
    `;
}

/* ============================================================
   TOP FEMALE CARD
============================================================ */

function topFemaleCard(f) {
    return `
        <div class="glass-card p-4">
            <h4 class="text-xl font-[800] mb-1">${f.typeName} ${f.speciesName}</h4>
            <p class="text-slate-500 text-sm mb-3">${f.origin ?? "pochodzenie nieznane"}</p>

            <p class="text-sm"><b>Kokony:</b> ${f.eggCreated}</p>
            <p class="text-sm"><b>L1:</b> ${f.totalL1}</p>
        </div>
    `;
}
