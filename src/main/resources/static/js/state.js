/* ============================================================
   GLOBALNY STAN APLIKACJI (ES MODULE)
============================================================ */

export const state = {
    customers: [],
    spiders: [],
    orders: [],

    selectedCustomer: null,
    orderedSpiders: [],

    filters: {
        customers: {
            search: ""
        },
        spiders: {
            search: ""
        },
        orders: {
            status: "all"
        }
    },

    ui: {
        currentSection: "customers-section"
    }
};

/* ============================================================
   SETTERY — BEZPOŚREDNIE AKTUALIZACJE STANU
============================================================ */

export function setCustomers(list) {
    state.customers = list;
}

export function setSpiders(list) {
    state.spiders = list;
}

export function setOrders(list) {
    state.orders = list;
}

export function setSelectedCustomer(customer) {
    state.selectedCustomer = customer;
}

export function setOrderedSpiders(list) {
    state.orderedSpiders = list;
}

/* ============================================================
   FILTRY
============================================================ */

export function updateOrderFilters(patch) {
    state.filters.orders = {
        ...state.filters.orders,
        ...patch
    };
}

/* ============================================================
   RESETY
============================================================ */

export function resetOrderState() {
    state.selectedCustomer = null;
    state.orderedSpiders = [];
}
