// /static/js/breeding/breedingTimeline.js

/**
 * Renderuje timeline rozmnożeń dla danej samicy.
 * entries – lista wpisów z polem `eggSack` (może być null)
 * mode – "vertical"
 */
export function renderTimeline(entries, mode = "vertical") {
    if (!entries || entries.length === 0) {
        return `
            <div class="flex flex-col gap-4">
                ${renderFilters()}
                <p class="text-slate-500 italic">Brak wpisów hodowlanych.</p>
            </div>
        `;
    }

    return `
        <div class="flex flex-col gap-4">
            ${renderFilters()}
            <div class="relative border-l border-slate-200 ml-4">
                ${entries.map(e => renderTimelineItem(e)).join("")}
            </div>
        </div>
    `;
}

/* ============================================================================
   FILTRY
============================================================================ */

function renderFilters() {
    return `
        <div class="flex flex-wrap gap-3 mb-4">
            <button id="filter-all" class="btn-secondary text-xs no-propagation">
                Wszystko
            </button>
            <button id="filter-pairings" class="btn-secondary text-xs no-propagation">
                Tylko dopuszczenia
            </button>
            <button id="filter-egg" class="btn-secondary text-xs no-propagation">
                Tylko kokony
            </button>
        </div>
    `;
}

/* ============================================================================
   POJEDYNCZY ELEMENT TIMELINE
============================================================================ */

function renderTimelineItem(entry) {
    const date = entry.pairingDate1 ?? entry.createdAt;
    const dateLabel = date ? new Date(date).toLocaleDateString("pl-PL") : "brak daty";

    const hasEggSack = !!entry.eggSack;

    const eggSackBadge = hasEggSack
        ? renderEggSackBadge(entry.eggSack)
        : "";

    const notes = entry.pairingNotes || entry.notes || "";

    // 🔥 NOWOŚĆ — kolor kafelka zależny od statusu
    const cardColor = hasEggSack
        ? getCardColorClass(entry.eggSack.status)
        : "bg-white";

    return `
        <div class="mb-8 ml-4 relative group cursor-pointer" data-open-entry="${entry.id}">
            <!-- Kropka na linii -->
            <div class="absolute -left-[9px] top-2 w-4 h-4 rounded-full bg-emerald-500 border-2 border-white shadow"></div>

            <div class="glass-card p-4 rounded-2xl border border-slate-200 hover:border-emerald-500 transition ${cardColor}">
                <div class="flex justify-between items-start gap-4">
                    <div>
                        <p class="text-xs text-slate-400 font-black uppercase tracking-widest">
                            ${dateLabel}
                        </p>
                        <p class="text-base font-semibold text-slate-900 mt-1">
                            Wpis hodowlany
                        </p>

                        ${notes ? `
                            <p class="text-sm text-slate-600 mt-2 line-clamp-3">
                                ${escapeHtml(notes)}
                            </p>
                        ` : `
                            <p class="text-sm text-slate-400 mt-2 italic">
                                Brak dodatkowych notatek.
                            </p>
                        `}
                    </div>

                    <div class="flex flex-col items-end gap-2 no-propagation">
                        ${eggSackBadge}

                        <div class="flex gap-2 mt-2">
                            <button class="btn-secondary text-xs px-3 py-1"
                                    data-edit-pairing="${entry.id}">
                                Edytuj wpis
                            </button>

                            ${hasEggSack ? `
                                <button class="btn-secondary text-xs px-3 py-1"
                                        data-edit-egg-sack="${entry.id}">
                                    Edytuj kokon
                                </button>
                            ` : ""}

                            <button class="btn-secondary text-xs px-3 py-1 text-red-600 border-red-300"
                                    data-delete-entry="${entry.id}">
                                Usuń
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
}

/* ============================================================================
   BADGE KOKONU – STATUS + LICZBY
============================================================================ */

function renderEggSackBadge(eggSack) {
    const status = eggSack.status || "UNKNOWN";

    const { label, colorClass } = mapStatusToStyle(status);

    const spiders = eggSack.numberOfSpiders ?? 0;
    const nymphs = eggSack.numberOfNymphs ?? 0;

    return `
        <div class="flex flex-col items-end gap-1">
            <span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${colorClass}">
                ${label}
            </span>

            <p class="text-[11px] text-slate-500">
                L1: <b>${spiders}</b> • Nimfy: <b>${nymphs}</b>
            </p>
        </div>
    `;
}

/* ============================================================================
   MAPOWANIE STATUSU NA KOLOR KAFELKA
============================================================================ */

function getCardColorClass(status) {
    switch (status) {
        case "SUCCESSFUL":
            return "bg-emerald-50";
        case "FAILED":
            return "bg-red-50";
        case "LAID":
            return "bg-yellow-50";
        case "DEVELOPING":
            return "bg-amber-50";
        case "PULLED":
            return "bg-blue-50";
        default:
            return "bg-white";
    }
}

/* ============================================================================
   MAPOWANIE STATUSU NA BADGE
============================================================================ */

function mapStatusToStyle(status) {
    switch (status) {
        case "SUCCESSFUL":
            return {
                label: "Udany kokon",
                colorClass: "bg-emerald-100 text-emerald-800 border border-emerald-300"
            };
        case "FAILED":
            return {
                label: "Nieudany kokon",
                colorClass: "bg-red-100 text-red-800 border border-red-300"
            };
        case "PULLED":
            return {
                label: "Odebrany kokon",
                colorClass: "bg-blue-100 text-blue-800 border border-blue-300"
            };
        case "DEVELOPING":
            return {
                label: "Kokon w rozwoju",
                colorClass: "bg-amber-100 text-amber-800 border border-amber-300"
            };
        case "LAID":
            return {
                label: "Złożony kokon",
                colorClass: "bg-yellow-100 text-yellow-800 border border-yellow-300"
            };
        default:
            return {
                label: status,
                colorClass: "bg-slate-100 text-slate-700 border border-slate-300"
            };
    }
}

/* ============================================================================
   HELPERS
============================================================================ */

function escapeHtml(str) {
    if (!str) return "";
    return String(str)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");
}
