// /static/js/breeding/breedingApi.js

const BASE_URL = "/api/breeding";

/* ============================================================
   GETTERS
============================================================ */

export async function fetchSpiders() {
    const res = await fetch(`${BASE_URL}/spiders`);
    return await res.json();
}

export async function fetchSpider(id) {
    const res = await fetch(`${BASE_URL}/spiders/${id}`);
    return await res.json();
}

export async function fetchEntriesForSpider(spiderId) {
    const res = await fetch(`${BASE_URL}/entries/spider/${spiderId}`);
    return await res.json();
}

/* ============================================================
   CREATE
============================================================ */

export async function createSpider(payload) {
    const res = await fetch(`${BASE_URL}/spiders`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
    });
    return await res.json();
}

export async function createEntry(spiderId, payload) {
    const res = await fetch(`${BASE_URL}/entries/spider/${spiderId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
    });
    return await res.json();
}

/* ============================================================
   UPDATE
============================================================ */

export async function updateEntry(entryId, payload) {
    const res = await fetch(`${BASE_URL}/entries/${entryId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
    });
    return await res.json();
}

/* ============================================================
   DELETE
============================================================ */

export async function deleteSpider(spiderId) {
    await fetch(`${BASE_URL}/spiders/${spiderId}`, {
        method: "DELETE"
    });
}

export async function deleteEntry(entryId) {
    await fetch(`${BASE_URL}/entries/${entryId}`, {
        method: "DELETE"
    });
}
