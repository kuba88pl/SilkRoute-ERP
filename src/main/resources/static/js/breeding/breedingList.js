// /static/js/breeding/breedingList.js

import { fetchSpiders } from "./breedingApi.js";
import { renderBreedingDetails } from "./breedingDetails.js";

export async function renderBreedingList(root) {
    const spiders = await fetchSpiders();

    root.innerHTML = `
        <div class="glass-card mb-8">
            <h2 class="text-3xl font-[800] mb-2">Samice</h2>
            <p class="text-slate-500">Lista wszystkich samic w systemie.</p>
        </div>

        <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            ${spiders.map(s => spiderCard(s)).join("")}
        </div>
    `;

    document.querySelectorAll("[data-spider-id]").forEach(card => {
        card.onclick = () => {
            const spiderId = card.dataset.spiderId;
            renderBreedingDetails(root, spiderId, () => renderBreedingList(root));
        };
    });
}

function spiderCard(spider) {
    return `
        <div data-spider-id="${spider.id}"
             class="glass-card breeding-list-card cursor-pointer">

            <h3 class="text-xl font-[800] mb-1">
                ${spider.typeName} ${spider.speciesName}
            </h3>

            <p class="text-slate-500 text-sm mb-4">
                ${spider.origin ?? "pochodzenie nieznane"}
            </p>

            <p class="text-slate-500 text-sm">
                Rozmiar: <b>${spider.size ?? "-"}</b> • 
                CITES: <b>${spider.cites ? "TAK" : "NIE"}</b>
            </p>
        </div>
    `;
}
