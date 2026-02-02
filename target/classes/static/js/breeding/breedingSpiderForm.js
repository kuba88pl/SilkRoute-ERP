// /static/js/breeding/breedingSpiderForm.js

import { createSpider } from "./breedingApi.js";
import { renderBreedingList } from "./breedingList.js";

export function renderSpiderForm(root, onBack) {
    root.innerHTML = `
        <div class="glass-card">
            <button id="backFromSpiderForm" class="btn-secondary mb-6">
                <i class="bi bi-arrow-left"></i> Powrót do listy
            </button>

            <h2 class="text-3xl font-[800] mb-6">Nowa samica</h2>

            <div class="grid grid-cols-2 gap-6">
                <div>
                    <label class="block mb-1 font-bold">Rodzaj</label>
                    <input id="typeName" class="input">
                </div>
                <div>
                    <label class="block mb-1 font-bold">Gatunek</label>
                    <input id="speciesName" class="input">
                </div>
                <div>
                    <label class="block mb-1 font-bold">Pochodzenie</label>
                    <input id="origin" class="input">
                </div>
                <div>
                    <label class="block mb-1 font-bold">Rozmiar</label>
                    <input id="size" class="input">
                </div>
                <div>
                    <label class="block mb-1 font-bold">CITES</label>
                    <select id="isCites" class="input">
                        <option value="false">Nie</option>
                        <option value="true">Tak</option>
                    </select>
                </div>
                <div>
                    <label class="block mb-1 font-bold">Nr dokumentu CITES</label>
                    <input id="citesDocumentNumber" class="input">
                </div>
                <div class="col-span-2">
                    <label class="block mb-1 font-bold">Notatki</label>
                    <textarea id="notes" class="input"></textarea>
                </div>
            </div>

            <div class="flex gap-4 mt-8">
                <button id="saveSpider" class="btn-primary">Zapisz</button>
                <button id="cancelSpider" class="btn-secondary">Anuluj</button>
            </div>
        </div>
    `;

    document.getElementById("backFromSpiderForm").onclick =
        document.getElementById("cancelSpider").onclick = onBack;

    document.getElementById("saveSpider").onclick = async () => {
        const payload = {
            typeName: val("typeName"),
            speciesName: val("speciesName"),
            origin: val("origin") || null,
            size: val("size") || null,
            isCites: document.getElementById("isCites").value === "true",
            citesDocumentNumber: val("citesDocumentNumber") || null,
            notes: val("notes") || null
        };

        await createSpider(payload);
        renderBreedingList(root);
    };
}

function val(id) {
    return document.getElementById(id).value.trim();
}
