// /static/js/breeding/breedingApi.js

/* ============================================================
   SPIDERS
============================================================ */

export async function fetchSpiders() {
    const res = await fetch("/api/breeding/spiders");
    if (!res.ok) throw new Error("Failed to fetch spiders");
    return res.json();
}

export async function fetchSpider(id) {
    const res = await fetch(`/api/breeding/spiders/${id}`);
    if (!res.ok) throw new Error("Failed to fetch spider");
    return res.json();
}

export async function createSpider(payload) {
    const res = await fetch("/api/breeding/spiders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
    });
    if (!res.ok) throw new Error("Failed to create spider");
    return res.json();
}

export async function updateSpider(id, payload) {
    const res = await fetch(`/api/breeding/spiders/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
    });
    if (!res.ok) throw new Error("Failed to update spider");
    return res.json();
}

export async function deleteSpider(id) {
    const res = await fetch(`/api/breeding/spiders/${id}`, {
        method: "DELETE"
    });
    if (!res.ok) throw new Error("Failed to delete spider");
}

/* ============================================================
   BREEDING ENTRIES
============================================================ */

export async function fetchEntriesForSpider(spiderId) {
    const res = await fetch(`/api/breeding/entries/spider/${spiderId}`);
    if (!res.ok) throw new Error("Failed to fetch entries");
    return res.json();
}

export async function createEntry(spiderId, payload) {
    const res = await fetch(`/api/breeding/entries/spider/${spiderId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
    });
    if (!res.ok) throw new Error("Failed to create entry");
    return res.json();
}

export async function updateEntry(id, payload) {
    const res = await fetch(`/api/breeding/entries/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
    });
    if (!res.ok) throw new Error("Failed to update entry");
    return res.json();
}

export async function deleteEntry(entryId) {
    const res = await fetch(`/api/breeding/entries/${entryId}`, {
        method: "DELETE"
    });

    if (!res.ok) {
        throw new Error("Failed to delete entry");
    }
}

/* ============================================================
   EGG SACKS
============================================================ */

export async function createEggSack(entryId, payload) {
    const res = await fetch(`/api/breeding/entries/${entryId}/eggsack`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
    });
    if (!res.ok) throw new Error("Failed to create egg sack");
    return res.json();
}

export async function fetchEggSack(id) {
    const res = await fetch(`/api/breeding/eggsack/${id}`);
    if (!res.ok) throw new Error("Failed to fetch egg sack");
    return res.json();
}

export async function fetchEggSackByEntry(entryId) {
    const res = await fetch(`/api/breeding/entries/${entryId}/eggsack`);
    if (!res.ok) throw new Error("Failed to fetch egg sack for entry");
    return res.json();
}

export async function updateEggSack(id, payload) {
    const res = await fetch(`/api/breeding/eggsack/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
    });
    if (!res.ok) throw new Error("Failed to update egg sack");
    return res.json();
}

export async function deleteEggSack(entryId) {
    const res = await fetch(`/api/breeding/entries/egg-sack/${entryId}`, {
        method: "DELETE"
    });
    if (!res.ok) throw new Error("Failed to delete egg sack");
}


