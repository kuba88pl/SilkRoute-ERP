// /static/js/breeding/breedingModule.js

import { step1Template, step2Template } from "./breedingEntryForm.js";
import { newEntryTemplate, collectNewEntryPayload } from "./breedingNewEntryForm.js";
import { fetchBreedingSpiders, createSpider, createEntry } from "./breedingApi.js";
import { renderBreedingSpidersList } from "./breedingSpidersList.js";
import { renderBreedingSpiderDetails } from "./breedingSpiderDetails.js";

/* ============================================================
   MODAL
============================================================ */

export function openFullBreedingModal(contentHtml) {
    const modal = document.getElementById("breeding-full-modal");
    const box = document.getElementById("breeding-full-modal-content");

    box.innerHTML = contentHtml;
    modal.classList.remove("hidden");
}

export function closeFullBreedingModal() {
    document.getElementById("breeding-full-modal").classList.add("hidden");
}

/* ============================================================
   INIT
============================================================ */

export function initBreedingModule(root) {
    loadList(root);
}

async function loadList(root) {
    renderBreedingSpidersList(root, {
        onSelectSpider: (id) => loadSpiderDetails(root, id)
    });
}


async function loadSpiderDetails(root, id) {
    renderBreedingSpiderDetails(root, id, {
        onBack: () => loadList(root),

        onAddEntry: (spiderId) => {
            const entries = document.querySelectorAll("[data-entry-id]").length;
            const nextIndex = Math.min(entries + 1, 4); // max 4 dopuszczenia
            openNewEntryModal(spiderId, nextIndex);
        }
    });
}

/* ============================================================
   NOWA SAMICA
============================================================ */

export function openNewBreedingModal() {
    openFullBreedingModal(step1Template());
    attachStep1Handlers();
}

function attachStep1Handlers() {
    document.getElementById("cancel-full").onclick = closeFullBreedingModal;

    document.getElementById("next-full").onclick = () => {
        openFullBreedingModal(step2Template());
        attachStep2Handlers();
    };
}

function attachStep2Handlers() {
    document.getElementById("back-full").onclick = () => {
        openFullBreedingModal(step1Template());
        attachStep1Handlers();
    };

    document.getElementById("save-full").onclick = async () => {
        const payload = collectSpiderPayload();
        await createSpider(payload);
        closeFullBreedingModal();
        location.reload();
    };
}

/* ============================================================
   PAYLOAD SAMICY — zgodny z DTO
============================================================ */

function val(sel) {
    const el = document.querySelector(sel);
    return el ? (el.value === "" ? null : el.value) : null;
}

function collectSpiderPayload() {
    return {
        typeName: val("#new-type-name"),
        speciesName: val("#new-species-name"),
        size: val("#new-size"),
        origin: val("#new-origin"),
        isCites: document.getElementById("new-cites").checked,
        citesDocumentNumber: val("#new-cites-doc"),
        notes: val("#new-notes"),

        breedingStatus: "ACTIVE",
        breedingCount: 0
    };
}

/* ============================================================
   NOWY WPIS
============================================================ */

function openNewEntryModal(spiderId, nextPairingIndex) {
    openFullBreedingModal(newEntryTemplate(nextPairingIndex));

    document.getElementById("cancel-entry").onclick = closeFullBreedingModal;

    document.getElementById("save-entry").onclick = async () => {
        const payload = collectNewEntryPayload(nextPairingIndex);
        await createEntry(spiderId, payload);
        closeFullBreedingModal();
        location.reload();
    };
}


