// /static/js/breeding/breedingTimeline.js

export function renderTimeline(entries, mode = "vertical") {
    return `
        <div class="flex justify-end mb-6">
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
        return `
                    <div class="relative">
                        <div class="absolute -left-[14px] top-1 w-6 h-6 ${color.dotBg} rounded-full border-4 border-white"></div>

                        <div class="glass-card p-6 rounded-2xl border ${color.border} ${color.bg}">
                            <p class="text-xl font-bold ${color.title}">
                                ${entryTitle(e)}
                            </p>

                            <p class="text-slate-500 mt-1 text-sm">
                                ${entrySubtitle(e)}
                            </p>

                            ${renderEggSackDetails(e)}

                            <div class="mt-4 flex items-center justify-between">
                                <span class="px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-widest ${color.badgeBg} ${color.badgeText}">
                                    ${entryStatusLabel(e)}
                                </span>

                                ${e.eggSack ? `
                                    <button class="btn-secondary" data-edit-egg-sack="${e.id}">
                                        Edytuj kokon
                                    </button>
                                ` : ""}
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
        return `
                        <div class="flex flex-col items-center">
                            <div class="w-6 h-6 ${color.dotBg} rounded-full mb-4"></div>

                            <div class="glass-card p-6 rounded-2xl border ${color.border} ${color.bg} w-64">
                                <p class="text-lg font-bold ${color.title}">
                                    ${entryTitle(e)}
                                </p>

                                <p class="text-slate-500 mt-1 text-sm">
                                    ${entrySubtitle(e)}
                                </p>

                                ${renderEggSackDetails(e)}

                                <div class="mt-4 flex flex-col gap-2">
                                    <span class="px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-widest ${color.badgeBg} ${color.badgeText}">
                                        ${entryStatusLabel(e)}
                                    </span>

                                    ${e.eggSack ? `
                                        <button class="btn-secondary" data-edit-egg-sack="${e.id}">
                                            Edytuj kokon
                                        </button>
                                    ` : ""}
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
   DANE DO WYŚWIETLANIA
============================================================ */

function entryTitle(e) {
    if (e.eggSack) {
        if (!e.eggSack.dateOfEggSackPull) {
            return `Kokon złożony: ${e.eggSack.dateOfEggSack ?? "-"}`;
        }
        return `Kokon odebrany: ${e.eggSack.dateOfEggSackPull ?? "-"}`;
    }

    return `Dopuszczenie: ${e.pairingDate1 ?? "-"}`;
}

function entrySubtitle(e) {
    if (e.eggSack) {
        return `Sugerowany odbiór: ${e.eggSack.suggestedDateOfEggSackPull ?? "-"}`;
    }

    return `Temp: ${e.pairingTemperature ?? "-"}°C • Wilg: ${e.pairingHumidity ?? "-"}%`;
}

function renderEggSackDetails(e) {
    if (!e.eggSack) return "";

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

function entryStatusLabel(e) {
    if (!e.eggSack) return "PAIRING";

    if (!e.eggSack.dateOfEggSackPull) return "EGG SACK (LAID)";

    if (e.eggSack.status === "SUCCESSFUL") return "SUCCESSFUL";
    if (e.eggSack.status === "FAILED") return "FAILED";

    return "EGG SACK";
}

/* ============================================================
   KOLORY
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

    if (s.status === "SUCCESSFUL") {
        return {
            dotBg: "bg-emerald-500",
            border: "border-emerald-200",
            title: "text-emerald-800",
            badgeBg: "bg-emerald-100",
            badgeText: "text-emerald-800",
            bg: "bg-emerald-50"
        };
    }

    if (s.status === "FAILED") {
        return {
            dotBg: "bg-red-500",
            border: "border-red-200",
            title: "text-red-800",
            badgeBg: "bg-red-100",
            badgeText: "text-red-800",
            bg: "bg-red-50"
        };
    }

    return {
        dotBg: "bg-slate-400",
        border: "border-slate-200",
        title: "text-slate-700",
        badgeBg: "bg-slate-100",
        badgeText: "text-slate-700",
        bg: "bg-white"
    };
}
