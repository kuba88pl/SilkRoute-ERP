// js/api.js

/* ============================================================
   PODSTAWOWA FUNKCJA REQUEST
============================================================ */

const BASE_URL = "/api";

async function request(path, options = {}) {
    const res = await fetch(BASE_URL + path, {
        headers: { "Content-Type": "application/json" },
        ...options
    });

    if (!res.ok) {
        console.error("API error:", res.status, res.statusText);
        throw new Error(`API error: ${res.status}`);
    }

    // 204 No Content
    if (res.status === 204) return null;

    return res.json();
}

/* ============================================================
   CUSTOMERS
============================================================ */

export function getCustomers() {
    return request("/customers");
}

export function createCustomer(payload) {
    return request("/customers", {
        method: "POST",
        body: JSON.stringify(payload)
    });
}

/* ============================================================
   SPIDERS
============================================================ */

export function getSpiders() {
    return request("/spiders");
}

export function createSpider(payload) {
    return request("/spiders", {
        method: "POST",
        body: JSON.stringify(payload)
    });
}

/* ============================================================
   ORDERS
============================================================ */

export function getOrders() {
    return request("/orders");
}

export function getOrder(id) {
    return request(`/orders/${id}`);
}

export function createOrder(payload) {
    return request("/orders", {
        method: "POST",
        body: JSON.stringify(payload)
    });
}

export function updateOrder(id, payload) {
    return request(`/orders/${id}`, {
        method: "PUT",
        body: JSON.stringify(payload)
    });
}

export function cancelOrder(id) {
    return request(`/orders/${id}/cancel`, {
        method: "POST"
    });
}
