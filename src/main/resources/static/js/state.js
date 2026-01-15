/* ============================================================
   CENTRALNY STORE APLIKACJI (mini Redux)
============================================================ */

export const state = {
    customers: [],
    spiders: [],
    orders: [],

    selectedCustomer: null,
    orderedSpiders: [],

    filters: {
        customers: { search: "" },
        spiders: { type: "", species: "", gender: "", cites: "" },
        orders: { status: "all" }
    },

    pagination: {
        customers: { page: 0, size: 20 },
        spiders: { page: 0, size: 20 },
        orders: { page: 0, size: 20 }
    }
};

/* ============================================================
   SUBSKRYPCJE (observer pattern)
============================================================ */

const listeners = [];

export function subscribe(callback) {
    listeners.push(callback);
}

function notify() {
    for (const cb of listeners) cb(state);
}

/* ============================================================
   AKTUALIZACJE STANU (immutable updates)
============================================================ */

export function setCustomers(customers) {
    state.customers = [...customers];
    notify();
}

export function setSpiders(spiders) {
    state.spiders = [...spiders];
    notify();
}

export function setOrders(orders) {
    state.orders = [...orders];
    notify();
}

export function setSelectedCustomer(customer) {
    state.selectedCustomer = customer;
    notify();
}

export function setOrderedSpiders(list) {
    state.orderedSpiders = [...list];
    notify();
}

export function updateFilters(section, newFilters) {
    state.filters[section] = { ...state.filters[section], ...newFilters };
    notify();
}

export function updatePagination(section, newPagination) {
    state.pagination[section] = { ...state.pagination[section], ...newPagination };
    notify();
}

/* ============================================================
   RESETY
============================================================ */

export function resetOrderState() {
    state.selectedCustomer = null;
    state.orderedSpiders = [];
    notify();
}
