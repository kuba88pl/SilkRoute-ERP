// /static/js/breeding/breedingModule.js
import { fetchEntriesForSpider } from './breedingApi.js';
import { renderBreedingSpidersList } from './breedingSpidersList.js';
import { renderBreedingSpiderDetails } from './breedingSpiderDetails.js';
import { renderBreedingEntryForm } from './breedingEntryForm.js';

export function initBreedingModule(rootElement) {
    showSpidersList();

    async function showSpidersList() {
        await renderBreedingSpidersList(rootElement, {
            onSelectSpider: (id) => showSpiderDetails(id),
        });
    }

    async function showSpiderDetails(spiderId) {
        await renderBreedingSpiderDetails(rootElement, spiderId, {
            onBack: () => showSpidersList(),
            onAddEntry: () => showEntryForm(spiderId, null),
            onEditEntry: async (spiderId, entryId) => {
                const entries = await fetchEntriesForSpider(spiderId);
                const entry = entries.find(e => e.id === entryId);
                showEntryForm(spiderId, entry);
            }
        });
    }

    function showEntryForm(spiderId, entry) {
        const modalContent = document.getElementById('breeding-entry-modal-content');
        renderBreedingEntryForm(modalContent, spiderId, entry, {
            onCancel: () => showSpiderDetails(spiderId),
            onSaved: () => showSpiderDetails(spiderId),
        });
    }
}
