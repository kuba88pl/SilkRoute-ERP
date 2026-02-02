// /static/js/breeding/breedingApi.js

import { authState } from "../state.js";

/* ============================================================
   HELPER – REQUEST Z JWT (bezpieczne JSON)
============================================================ */
async function authRequest(url, options = {}) {
    const headers = {
        "Content-Type": "application/json",
        ...(options.headers || {})
    };

    if (authState.token) {
        headers["Authorization"] = "Bearer " + authState.token;
    }

    const res = await fetch(url, {
        ...options,
        headers
    });

    if (!res.ok) {
        console.error("Breeding API error:", res.status, res.statusText);
        throw new Error(`Failed request: ${res.status}`);
    }

    // 204 – brak treści
    if (res.status === 204) {
        return null;
    }

    // 🔥 bezpieczna obsługa pustego body przy 200
    const text = await res.text();
    if (!text) {
        return null;
    }

    try {
        return JSON.parse(text);
    } catch (e) {
        console.error("Breeding API JSON parse error:", e, "for url:", url, "raw body:", text);
        throw e;
    }
}

/* ============================================================
   SPIDERS
============================================================ */

export function fetchSpiders() {
    return authRequest("/api/breeding/spiders");
}

export function fetchSpider(id) {
    return authRequest(`/api/breeding/spiders/${id}`);
}

export function createSpider(payload) {
    return authRequest("/api/breeding/spiders", {
        method: "POST",
        body: JSON.stringify(payload)
    });
}

export function updateSpider(id, payload) {
    return authRequest(`/api/breeding/spiders/${id}`, {
        method: "PUT",
        body: JSON.stringify(payload)
    });
}

export function deleteSpider(id) {
    return authRequest(`/api/breeding/spiders/${id}`, {
        method: "DELETE"
    });
}

/* ============================================================
   BREEDING ENTRIES
============================================================ */

export function fetchEntriesForSpider(spiderId) {
    return authRequest(`/api/breeding/entries/spider/${spiderId}`);
}

export function createEntry(spiderId, payload) {
    return authRequest(`/api/breeding/entries/spider/${spiderId}`, {
        method: "POST",
        body: JSON.stringify(payload)
    });
}

export function updateEntry(id, payload) {
    return authRequest(`/api/breeding/entries/${id}`, {
        method: "PUT",
        body: JSON.stringify(payload)
    });
}

export function deleteEntry(entryId) {
    return authRequest(`/api/breeding/entries/${entryId}`, {
        method: "DELETE"
    });
}

/* ============================================================
   EGG SACKS
============================================================ */

export function createEggSack(entryId, payload) {
    return authRequest(`/api/breeding/entries/${entryId}/eggsack`, {
        method: "POST",
        body: JSON.stringify(payload)
    });
}

export function fetchEggSack(id) {
    return authRequest(`/api/breeding/eggsack/${id}`);
}

export function fetchEggSackByEntry(entryId) {
    return authRequest(`/api/breeding/entries/${entryId}/eggsack`);
}

export function updateEggSack(id, payload) {
    return authRequest(`/api/breeding/eggsack/${id}`, {
        method: "PUT",
        body: JSON.stringify(payload)
    });
}

/**
 * DELETE /api/breeding/eggsack/{id}
 */
export function deleteEggSack(id) {
    return authRequest(`/api/breeding/eggsack/${id}`, {
        method: "DELETE"
    });
}
