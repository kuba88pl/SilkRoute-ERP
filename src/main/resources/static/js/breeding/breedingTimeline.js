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

function verticalTimeline(entries) {
    return `
        <div class="relative border-l-4 border-emerald-500 pl-8 space-y-10">

            ${entries.map(e => {
        const color = statusColor(e);
        return `
                <div class="relative">
                    <div class="absolute -left-[14px] top-1 w-6 h-6 ${color.dotBg} rounded-full border-4 border-white"></div>

                    <div class="glass-card p-6 rounded-2xl border ${color.border}">
                        <p class="text-xl font-bold ${color.title}">
                            Dopuszczenie: ${extractPairingDate(e)}
                        </p>

                        <p class="text-slate-500 mt-1">
                            Temp: ${e.pairingTemperature ?? "-"}°C • Wilg: ${e.pairingHumidity ?? "-"}%
                        </p>

                        ${e.behaviorNotes ? `
                            <p class="text-slate-500 mt-2 text-sm italic">
                                Zachowanie: ${e.behaviorNotes}
                            </p>
                        ` : ""}

                        ${e.sacDate ? `
                            <div class="mt-4">
                                <p class="font-semibold text-slate-900">Kokon: ${e.sacDate}</p>
                                <p class="text-slate-500 text-sm">Odbiór: ${e.recommendedPullDate ?? "-"}</p>
                            </div>
                        ` : ""}

                        <div class="mt-4 flex items-center justify-between">
                            <span class="px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-widest ${color.badgeBg} ${color.badgeText}">
                                ${e.status ?? "PAIRING"}
                            </span>

                            <button class="btn-secondary" data-edit-egg-sack="${e.id}">
                                Kokon / wynik
                            </button>
                        </div>
                    </div>
                </div>
            `;
    }).join("")}

        </div>
    `;
}

function horizontalTimeline(entries) {
    return `
        <div class="overflow-x-auto pb-4">
            <div class="flex items-start gap-10 min-w-max">

                ${entries.map(e => {
        const color = statusColor(e);
        return `
                    <div class="flex flex-col items-center">
                        <div class="w-6 h-6 ${color.dotBg} rounded-full mb-4"></div>

                        <div class="glass-card p-6 rounded-2xl border ${color.border} w-64">
                            <p class="text-lg font-bold ${color.title}">
                                ${extractPairingDate(e)}
                            </p>

                            <p class="text-slate-500 mt-1 text-sm">
                                Temp: ${e.pairingTemperature ?? "-"}°C
                            </p>

                            ${e.behaviorNotes ? `
                                <p class="text-slate-500 mt-2 text-xs italic">
                                    ${e.behaviorNotes}
                                </p>
                            ` : ""}

                            ${e.sacDate ? `
                                <div class="mt-3 text-sm">
                                    <p class="font-semibold text-slate-900">Kokon: ${e.sacDate}</p>
                                    <p class="text-slate-500">Odbiór: ${e.recommendedPullDate ?? "-"}</p>
                                </div>
                            ` : ""}

                            <div class="mt-4 flex flex-col gap-2">
                                <span class="px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-widest ${color.badgeBg} ${color.badgeText}">
                                    ${e.status ?? "PAIRING"}
                                </span>

                                <button class="btn-secondary" data-edit-egg-sack="${e.id}">
                                    Kokon / wynik
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

function extractPairingDate(e) {
    return e.pairingDate1 || e.pairingDate2 || e.pairingDate3 || e.pairingDate4 || "-";
}

function statusColor(e) {
    const status = e.status ?? "PAIRING";
    const cocoonStatus = e.cocoonStatus;

    if (["ROTTEN", "DRIED_OUT", "EATEN"].includes(cocoonStatus)) {
        return {
            dotBg: "bg-red-500",
            border: "border-red-200",
            title: "text-red-700",
            badgeBg: "bg-red-100",
            badgeText: "text-red-700"
        };
    }

    if (status === "RESULT") {
        return {
            dotBg: "bg-emerald-500",
            border: "border-emerald-200",
            title: "text-emerald-800",
            badgeBg: "bg-emerald-100",
            badgeText: "text-emerald-800"
        };
    }

    if (status === "EGG_SACK") {
        return {
            dotBg: "bg-amber-400",
            border: "border-amber-200",
            title: "text-amber-800",
            badgeBg: "bg-amber-100",
            badgeText: "text-amber-800"
        };
    }

    return {
        dotBg: "bg-sky-500",
        border: "border-sky-200",
        title: "text-sky-800",
        badgeBg: "bg-sky-100",
        badgeText: "text-sky-800"
    };
}
