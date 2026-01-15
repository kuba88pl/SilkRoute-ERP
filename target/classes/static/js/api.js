/* ============================================================
   API CONFIG
============================================================ */

export const API_URL = "http://localhost:8080/api";

/* ============================================================
   HELPER: universal fetch wrapper
============================================================ */

async function request(url, options = {}) {
    const res = await fetch(url, {
        headers: { "Content-Type": "application/json" },
        ...options
    });

    if (!res.ok) {
        const text = await res.text();
        throw new Error(`API error: ${res.status} - ${text}`);
    }

    return res.status !== 204 ? res.json() : null;
}

/* ============================================================
   CUSTOMERS
============================================================ */

export const api = {
    // ---------- CUSTOMERS ----------
    getCustomers: (page = 0, size = 20) =>
        request(`${API_URL}/customers?page=${page}&size=${size}&sortBy=lastName`),

    getAllCustomers: () =>
        request(`${API_URL}/customers?size=1000`),

    saveCustomer: (customer) =>
        request(`${API_URL}/customers`, {
            method: "POST",
            body: JSON.stringify(customer)
        }),

    updateCustomer: (id, customer) =>
        request(`${API_URL}/customers/${id}`, {
            method: "PUT",
            body: JSON.stringify(customer)
        }),

    deleteCustomer: (id) =>
        request(`${API_URL}/customers/${id}`, {
            method: "DELETE"
        }),

    // ---------- SPIDERS ----------
    getSpiders: () =>
        request(`${API_URL}/spiders?size=1000&sortBy=typeName`),

    saveSpider: (spider) =>
        request(`${API_URL}/spiders`, {
            method: "POST",
            body: JSON.stringify(spider)
        }),

    updateSpider: (id, spider) =>
        request(`${API_URL}/spiders/${id}`, {
            method: "PUT",
            body: JSON.stringify(spider)
        }),

    deleteSpider: (id) =>
        request(`${API_URL}/spiders/${id}`, {
            method: "DELETE"
        }),

    // ---------- ORDERS ----------
    getOrders: () =>
        request(`${API_URL}/orders?size=1000`),

    getOrder: (id) =>
        request(`${API_URL}/orders/${id}`),

    saveOrder: (order) =>
        request(`${API_URL}/orders`, {
            method: "POST",
            body: JSON.stringify(order)
        }),

    updateOrder: (id, order) =>
        request(`${API_URL}/orders/${id}`, {
            method: "PUT",
            body: JSON.stringify(order)
        }),

    cancelOrder: (id, order) =>
        request(`${API_URL}/orders/${id}`, {
            method: "PUT",
            body: JSON.stringify(order)
        })
};
