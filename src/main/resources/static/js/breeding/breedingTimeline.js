// /static/js/breeding/breedingTimeline.js

export function renderTimeline(entries, mode = "vertical") {
    return `
        <div class="flex justify-between mb-6">
            <div class="flex gap-3">
                <button id="filter-all" class="btn-secondary">Wszystkie</button>
                <button id="filter-pairings" class="btn-secondary">Dopuszczenia</button>
                <button id="filter-egg" class="btn-secondary">Kokony</button>
            </div>

            <button id="toggle-timeline" class="btn-secondary">
                <i class="bi bi-shuffle"></i> Zmień widok
            </button>
        </div>

        <div id="timeline-container">
            ${mode === "vertical"
        ? verticalTimeline(entries)
        : horizontalTimeline(entries)}
        </div>
    `;
}

/* ============================================================
   WIDOK PIONOWY
============================================================ */

function verticalTimeline(entries) {
    return `
        <div class="relative border-l-4 border-slate-300 pl-8 space-y-10">

            ${entries.map(e => {
        const color = statusColor(e);
        const icon = statusIcon(e);

        return `
                    <div class="relative timeline-entry cursor-pointer" data-open-entry="${e.id}">
                        <div class="absolute -left-[14px] top-1 w-6 h-6 ${color.dotBg} rounded-full border-4 border-white flex items-center justify-center text-white text-xs">
                            ${icon}
                        </div>

                        <div class="glass-card p-6 rounded-2xl border ${color.border} ${color.bg}">
                            <p class="text-xl font-bold ${color.title}">
                                ${entryTitle(e)}
                            </p>

                            <p class="text-slate-500 mt-1 text-sm">
                                ${entrySubtitleSafe(e)}
                            </p>

                            ${e.eggSack ? renderEggSackDetails(e) : renderPairingDetails(e)}

                            <div class="mt-4 flex items-center justify-between">

                                <span class="px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-widest ${color.badgeBg} ${color.badgeText}">
                                    ${entryStatusLabel(e)}
                                </span>

                                <div class="flex gap-2 no-propagation">
                                    ${e.eggSack ? `
                                        <button class="btn-secondary" data-edit-egg-sack="${e.id}">
                                            <i class="bi bi-basket"></i>
                                        </button>
                                    ` : `
                                        <button class="btn-secondary" data-edit-pairing="${e.id}">
                                            <i class="bi bi-pencil"></i>
                                        </button>
                                    `}

                                    <button class="btn-secondary text-red-600" data-delete-entry="${e.id}">
                                        <i class="bi bi-trash"></i>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                `;
    }).join("")}

        </div>
    `;
}

/* ============================================================
   WIDOK POZIOMY
============================================================ */

function horizontalTimeline(entries) {
    return `
        <div class="overflow-x-auto pb-4">
            <div class="flex items-start gap-10 min-w-max">

                ${entries.map(e => {
        const color = statusColor(e);
        const icon = statusIcon(e);

        return `
                        <div class="flex flex-col items-center timeline-entry cursor-pointer" data-open-entry="${e.id}">
                            <div class="w-10 h-10 ${color.dotBg} rounded-full mb-4 flex items-center justify-center text-white text-xl">
                                ${icon}
                            </div>

                            <div class="glass-card p-6 rounded-2xl border ${color.border} ${color.bg} w-64">
                                <p class="text-lg font-bold ${color.title}">
                                    ${entryTitle(e)}
                                </p>

                                <p class="text-slate-500 mt-1 text-sm">
                                    ${entrySubtitleSafe(e)}
                                </p>

                                ${e.eggSack ? renderEggSackDetails(e) : renderPairingDetails(e)}

                                <div class="mt-4 flex flex-col gap-2 no-propagation">
                                    <span class="px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-widest ${color.badgeBg} ${color.badgeText}">
                                        ${entryStatusLabel(e)}
                                    </span>

                                    ${e.eggSack ? `
                                        <button class="btn-secondary" data-edit-egg-sack="${e.id}">
                                            <i class="bi bi-basket"></i> Edytuj
                                        </button>
                                    ` : `
                                        <button class="btn-secondary" data-edit-pairing="${e.id}">
                                            <i class="bi bi-pencil"></i> Edytuj
                                        </button>
                                    `}

                                    <button class="btn-secondary text-red-600" data-delete-entry="${e.id}">
                                        <i class="bi bi-trash"></i> Usuń
                                    </button>
                                </div>
                            </div>
                        </div>
                    `;
    }).join("")}

            </div>
        </div>
    `;
}

/* ============================================================
   Tytuł wpisu — DATA + WYDARZENIE
============================================================ */

function entryTitle(e) {
    const date = e.eggSack
        ? (e.eggSack.dateOfEggSackPull ?? e.eggSack.dateOfEggSack ?? "-")
        : (e.pairingDate1 ?? "-");

    const text = e.eggSack
        ? (e.eggSack.eggSackDescription ?? "")
        : (e.pairingNotes ?? "");

    return text && text.trim() !== ""
        ? `${date} — ${text}`
        : date;
}

/* ============================================================
   Podtytuł
============================================================ */

function entrySubtitleSafe(e) {
    if (e.eggSack) {
        return `Sugerowany odbiór: ${e.eggSack.suggestedDateOfEggSackPull ?? "-"}`;
    }

    return `Temp: ${e.pairingTemperature ?? "-"}°C • Wilg: ${e.pairingHumidity ?? "-"}%`;
}

/* ============================================================
   Szczegóły dopuszczenia
============================================================ */

function renderPairingDetails(e) {
    return `
        <div class="mt-3 text-sm text-slate-600">
            <p><b>Temperatura:</b> ${e.pairingTemperature ?? "-"}</p>
            <p><b>Wilgotność:</b> ${e.pairingHumidity ?? "-"}</p>
            <p><b>Wydarzenie:</b> ${e.pairingNotes ?? "-"}</p>
            <p><b>Uwagi:</b> ${e.behaviorNotes ?? "-"}</p>
        </div>
    `;
}

/* ============================================================
   Szczegóły kokonu
============================================================ */

function renderEggSackDetails(e) {
    const s = e.eggSack;

    return `
        <div class="mt-3 text-sm text-slate-600">
            <p><b>Jaja dobre:</b> ${s.numberOfEggs ?? "-"}</p>
            <p><b>Jaja zepsute:</b> ${s.numberOfBadEggs ?? "-"}</p>

            <p class="mt-1"><b>Nimfy żywe:</b> ${s.numberOfNymphs ?? "-"}</p>
            <p><b>Nimfy martwe:</b> ${s.numberOfDeadNymphs ?? "-"}</p>

            <p class="mt-1"><b>Pająki żywe:</b> ${s.numberOfSpiders ?? "-"}</p>
            <p><b>Pająki martwe:</b> ${s.numberOfDeadSpiders ?? "-"}</p>

            <p class="mt-2 italic">${s.eggSackDescription ?? ""}</p>
        </div>
    `;
}

/* ============================================================
   Status wpisu
============================================================ */

function entryStatusLabel(e) {
    if (!e.eggSack) return "WPIS HODOWLANY";

    if (!e.eggSack.dateOfEggSackPull) return "KOKON (ZŁOŻONY)";

    if (e.eggSack.status === "HEALTHY") return "KOKON UDANY";

    return "KOKON NIEUDANY";
}

/* ============================================================
   Ikony
============================================================ */

function statusIcon(e) {
    if (!e.eggSack) return "❤️";
    if (!e.eggSack.dateOfEggSackPull) return "🥚";
    if (e.eggSack.status === "HEALTHY") return "🟢";
    return "🔴";
}

/* ============================================================
   Kolory
============================================================ */

function statusColor(e) {
    if (!e.eggSack) {
        return {
            dotBg: "bg-sky-500",
            border: "border-sky-200",
            title: "text-sky-800",
            badgeBg: "bg-sky-100",
            badgeText: "text-sky-800",
            bg: "bg-white"
        };
    }

    const s = e.eggSack;

    if (!s.dateOfEggSackPull) {
        return {
            dotBg: "bg-amber-400",
            border: "border-amber-200",
            title: "text-amber-800",
            badgeBg: "bg-amber-100",
            badgeText: "text-amber-800",
            bg: "bg-amber-50"
        };
    }

    if (s.status === "HEALTHY") {
        return {
            dotBg: "bg-emerald-500",
            border: "border-emerald-200",
            title: "text-emerald-800",
            badgeBg: "bg-emerald-100",
            badgeText: "text-emerald-800",
            bg: "bg-emerald-50"
        };
    }

    return {
        dotBg: "bg-red-500",
        border: "border-red-200",
        title: "text-red-800",
        badgeBg: "bg-red-100",
        badgeText: "text-red-800",
        bg: "bg-red-50"
    };
}
