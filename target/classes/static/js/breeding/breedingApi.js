// /static/js/breeding/breedingApi.js

/* ============================================================
   SPIDERS
============================================================ */

export async function fetchSpiders() {
    const res = await fetch(`/api/breeding/spiders`);
    if (!res.ok) throw new Error("Failed to load spiders");
    return await res.json();
}

export async function fetchSpider(spiderId) {
    const res = await fetch(`/api/breeding/spiders/${spiderId}`);
    if (!res.ok) throw new Error("Failed to load spider");
    return await res.json();
}

export async function createSpider(payload) {
    const res = await fetch(`/api/breeding/spiders`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
    });

    if (!res.ok) throw new Error("Failed to create spider");
    return await res.json();
}

export async function deleteSpider(spiderId) {
    const res = await fetch(`/api/breeding/spiders/${spiderId}`, {
        method: "DELETE"
    });

    if (!res.ok) throw new Error("Failed to delete spider");
}

/* ============================================================
   ENTRIES (TIMELINE EVENTS)
============================================================ */

export async function fetchEntriesForSpider(spiderId) {
    const res = await fetch(`/api/breeding/entries/spider/${spiderId}`);
    if (!res.ok) throw new Error("Failed to load entries");
    return await res.json();
}

export async function fetchEntry(entryId) {
    const res = await fetch(`/api/breeding/entries/${entryId}`);
    if (!res.ok) throw new Error("Failed to load entry");
    return await res.json();
}

export async function createEntry(spiderId, payload) {
    const res = await fetch(`/api/breeding/entries/spider/${spiderId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
    });

    if (!res.ok) throw new Error("Failed to create entry");
    return await res.json();
}

export async function updateEntry(entryId, payload) {
    const res = await fetch(`/api/breeding/entries/${entryId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
    });

    if (!res.ok) throw new Error("Failed to update entry");
    return await res.json();
}

export async function deleteEntry(entryId) {
    const res = await fetch(`/api/breeding/entries/${entryId}`, {
        method: "DELETE"
    });

    if (!res.ok) throw new Error("Failed to delete entry");
}

/* ============================================================
   EGG SACK
============================================================ */

export async function createEggSack(entryId, payload) {
    const res = await fetch(`/api/breeding/entries/${entryId}/eggsack`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
    });

    if (!res.ok) throw new Error("Failed to create egg sack");
    return await res.json();
}

export async function fetchEggSackByEntry(entryId) {
    const res = await fetch(`/api/breeding/entries/${entryId}/eggsack`);

    if (!res.ok) return null;

    const text = await res.text();
    if (!text) return null;

    return JSON.parse(text);
}

export async function updateEggSack(eggSackId, payload) {
    const res = await fetch(`/api/breeding/eggsack/${eggSackId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
    });

    if (!res.ok) throw new Error("Failed to update egg sack");
    return await res.json();
}

export async function deleteEggSack(eggSackId) {
    const res = await fetch(`/api/breeding/eggsack/${eggSackId}`, {
        method: "DELETE"
    });

    if (!res.ok) throw new Error("Failed to delete egg sack");
}
