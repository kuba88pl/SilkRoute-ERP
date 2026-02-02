/* ============================================================
   IMPORT STANU AUTORYZACJI
============================================================ */
import { authState } from "./state.js";

/* ============================================================
   PODSTAWOWA FUNKCJA REQUEST — TERAZ Z JWT
============================================================ */

const BASE_URL = "/api";

async function request(path, options = {}) {
    const headers = {
        "Content-Type": "application/json",
        ...(options.headers || {})
    };

    // AUTOMATYCZNE DODANIE JWT
    if (authState.token) {
        headers["Authorization"] = "Bearer " + authState.token;
    }

    const res = await fetch(BASE_URL + path, {
        ...options,
        headers
    });

    if (!res.ok) {
        console.error("API error:", res.status, res.statusText);
        throw new Error(`API error: ${res.status}`);
    }

    if (res.status === 204) return null;

    return res.json();
}

/* ============================================================
   CUSTOMERS
============================================================ */

export function getCustomers() {
    return request("/customers");
}

export function getCustomer(id) {
    return request(`/customers/${id}`);
}

export function createCustomer(payload) {
    return request("/customers", {
        method: "POST",
        body: JSON.stringify(payload)
    });
}

export function updateCustomer(id, payload) {
    return request(`/customers/${id}`, {
        method: "PUT",
        body: JSON.stringify(payload)
    });
}

export function deleteCustomer(id) {
    return request(`/customers/${id}`, {
        method: "DELETE"
    });
}

/* ============================================================
   SPIDERS
============================================================ */

export function getSpiders() {
    return request("/spiders");
}

export function getSpider(id) {
    return request(`/spiders/${id}`);
}

export function createSpider(payload) {
    return request("/spiders", {
        method: "POST",
        body: JSON.stringify(payload)
    });
}

export function updateSpider(id, payload) {
    return request(`/spiders/${id}`, {
        method: "PUT",
        body: JSON.stringify(payload)
    });
}

export function deleteSpider(id) {
    return request(`/spiders/${id}`, {
        method: "DELETE"
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

/* ============================================================
   AUTH — LOGOWANIE
============================================================ */

export async function login(username, password) {
    const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password })
    });

    if (!response.ok) {
        throw new Error("Błędny login lub hasło");
    }

    const data = await response.json();
    authState.setToken(data.token);
    return data.token;
}
