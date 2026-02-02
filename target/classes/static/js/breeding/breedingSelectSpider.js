import { fetchSpiders } from "./breedingApi.js";
import { openNewSpiderModal } from "./breedingNewSpider.js";
import { renderBreedingList } from "./breedingList.js";

export function openSelectSpiderModal() {
    loadSpiderList();
}

async function loadSpiderList() {
    const spiders = await fetchSpiders();

    const listHtml = spiders.length === 0
        ? `<p class="text-slate-500 italic text-center py-10">Brak zarejestrowanych samic.</p>`
        : spiders.map(s => `
            <button 
                class="w-full text-left p-5 border border-slate-200 rounded-2xl hover:bg-slate-50 transition flex justify-between items-center"
                data-spider-id="${s.id}">
                
                <div>
                    <p class="text-xl font-bold text-slate-900">${s.typeName ?? ''} ${s.speciesName ?? ''}</p>
                    <p class="text-slate-500 text-sm mt-1">${s.origin ?? 'pochodzenie nieznane'}</p>
                </div>

                <i class="bi bi-chevron-right text-slate-400 text-2xl"></i>
            </button>
        `).join("");

    openModal(`
        <h3 class="text-3xl font-black mb-8 text-slate-900 tracking-tight">
            Wybierz samicę
        </h3>

        <div class="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
            ${listHtml}
        </div>

        <div class="flex justify-between mt-10">
            <button id="cancel-modal" class="btn-secondary">Anuluj</button>
            <button id="add-new-spider" class="btn-primary">
                <i class="bi bi-plus-lg"></i> Dodaj nową samicę
            </button>
        </div>
    `);

    document.getElementById("cancel-modal").onclick = closeModal;

    document.querySelectorAll("[data-spider-id]").forEach(btn => {
        btn.addEventListener("click", () => {
            const id = btn.getAttribute("data-spider-id");
            closeModal();
            alert("Wybrano samicę: " + id); // później: otwarcie szczegółów / pairing
        });
    });

    document.getElementById("add-new-spider").onclick = () => {
        openNewSpiderModal(async () => {
            // po utworzeniu samicy odświeżamy listę w głównym widoku
            const root = document.getElementById("breeding-root");
            await renderBreedingList(root);
        });
    };
}

/* modal helpers */

function openModal(html) {
    const modal = document.getElementById("breeding-full-modal");
    const box = document.getElementById("breeding-full-modal-content");

    box.innerHTML = html;
    modal.classList.remove("hidden");
}

function closeModal() {
    document.getElementById("breeding-full-modal").classList.add("hidden");
}
