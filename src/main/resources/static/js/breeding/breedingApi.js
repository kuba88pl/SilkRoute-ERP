// /static/js/breeding/breedingApi.js

const BASE_SPIDERS = '/api/breeding/spiders';
const BASE_ENTRIES = '/api/breeding/entries';

async function handle(res, msg) {
    if (!res.ok) throw new Error(msg || 'Request failed');
    if (res.status === 204) return null;
    return res.json();
}

export async function fetchSpiders() {
    return handle(await fetch(BASE_SPIDERS), 'Nie udało się pobrać samic');
}

export async function fetchSpider(id) {
    return handle(await fetch(`${BASE_SPIDERS}/${id}`), 'Nie udało się pobrać samicy');
}

export async function createSpider(payload) {
    return handle(await fetch(BASE_SPIDERS, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
    }), 'Nie udało się utworzyć samicy');
}

export async function updateSpider(id, payload) {
    return handle(await fetch(`${BASE_SPIDERS}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
    }), 'Nie udało się zaktualizować samicy');
}

export async function deleteSpider(id) {
    await handle(await fetch(`${BASE_SPIDERS}/${id}`, { method: 'DELETE' }), 'Nie udało się usunąć samicy');
}

export async function fetchEntriesForSpider(spiderId) {
    return handle(await fetch(`${BASE_ENTRIES}/spider/${spiderId}`), 'Nie udało się pobrać rozmnożeń');
}

export async function createEntry(spiderId, payload) {
    return handle(await fetch(`${BASE_ENTRIES}/spider/${spiderId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
    }), 'Nie udało się utworzyć rozmnożenia');
}

export async function updateEntry(id, payload) {
    return handle(await fetch(`${BASE_ENTRIES}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
    }), 'Nie udało się zaktualizować rozmnożenia');
}

export async function deleteEntry(id) {
    await handle(await fetch(`${BASE_ENTRIES}/${id}`, { method: 'DELETE' }), 'Nie udało się usunąć rozmnożenia');
}
