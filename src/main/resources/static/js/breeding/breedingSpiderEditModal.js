// /static/js/breeding/breedingSpiderEditModal.js

import { updateSpider } from "./breedingApi.js";

export function openSpiderEditModal(spider, onSave) {
    const modal = document.getElementById("breeding-full-modal");
    const content = document.getElementById("breeding-full-modal-content");

    modal.classList.remove("hidden");

    content.innerHTML = `
        <h2 class="text-2xl font-[800] mb-6">Edytuj samicę</h2>

        <div class="flex flex-col gap-4">

            <div>
                <label class="text-sm font-semibold">Rodzaj (typeName)</label>
                <input id="edit-typeName" type="text" 
                       class="input w-full" 
                       value="${spider.typeName ?? ""}">
            </div>

            <div>
                <label class="text-sm font-semibold">Gatunek (speciesName)</label>
                <input id="edit-speciesName" type="text" 
                       class="input w-full" 
                       value="${spider.speciesName ?? ""}">
            </div>

            <div>
                <label class="text-sm font-semibold">Pochodzenie</label>
                <input id="edit-origin" type="text" 
                       class="input w-full" 
                       value="${spider.origin ?? ""}">
            </div>

            <div>
                <label class="text-sm font-semibold">Rozmiar</label>
                <input id="edit-size" type="text" 
                       class="input w-full" 
                       value="${spider.size ?? ""}">
            </div>

            <div>
                <label class="text-sm font-semibold">Numer dokumentu CITES</label>
                <input id="edit-citesDoc" type="text" 
                       class="input w-full" 
                       value="${spider.citesDocumentNumber ?? ""}">
            </div>

            <div>
                <label class="text-sm font-semibold">Notatki</label>
                <textarea id="edit-notes" rows="5" 
                          class="input w-full resize-none">${spider.notes ?? ""}</textarea>
            </div>

        </div>

        <div class="flex justify-end gap-3 mt-8">
            <button id="cancelEditSpider" class="btn-secondary">Anuluj</button>
            <button id="saveEditSpider" class="btn-primary">Zapisz</button>
        </div>
    `;

    // Zamknięcie modala
    document.getElementById("cancelEditSpider").onclick = () => {
        modal.classList.add("hidden");
    };

    // Zapis
    document.getElementById("saveEditSpider").onclick = async () => {
        const updated = {
            ...spider,
            typeName: document.getElementById("edit-typeName").value.trim(),
            speciesName: document.getElementById("edit-speciesName").value.trim(),
            origin: document.getElementById("edit-origin").value.trim(),
            size: document.getElementById("edit-size").value.trim(),
            citesDocumentNumber: document.getElementById("edit-citesDoc").value.trim(),
            notes: document.getElementById("edit-notes").value.trim()
        };

        await updateSpider(spider.id, updated);

        modal.classList.add("hidden");

        onSave?.();
    };
}
