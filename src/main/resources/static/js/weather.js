async function loadWeather() {
    try {
        const res = await fetch("/api/weather?city=Bytom");
        const data = await res.json();

        const container = document.getElementById("weather-grid");
        container.innerHTML = "";

        const translate = {
            "SAFE": "Bezpiecznie",
            "RISKY": "Ryzykownie",
            "TOO_COLD": "Za zimno"
        };

        const tileColor = {
            "SAFE": "bg-green-100 border-green-300",
            "RISKY": "bg-yellow-100 border-yellow-300",
            "TOO_COLD": "bg-red-100 border-red-300"
        };

        const textColor = {
            "SAFE": "text-green-700",
            "RISKY": "text-yellow-700",
            "TOO_COLD": "text-red-700"
        };

        const days = data.days.slice(0, 14);

        days.forEach(day => {

            const dateObj = new Date(day.date);
            const formattedDate = dateObj.toLocaleDateString("pl-PL");
            const weekday = dateObj.toLocaleDateString("pl-PL", { weekday: "long" });

            const colorfulDays = ["poniedziałek", "wtorek", "środa"];
            const isColorful = colorfulDays.includes(weekday.toLowerCase());

            const finalTileColor = isColorful
                ? tileColor[day.level]
                : "bg-gray-100 border-gray-300";

            const finalTextColor = isColorful
                ? textColor[day.level]
                : "text-gray-600";

            // 🔥 ZAOKRĄGLANIE TEMPERATUR
            const min = Math.round(day.minTemp);
            const max = Math.round(day.maxTemp);

            const statusHtml = isColorful
                ? `<p class="text-xs mt-1 ${finalTextColor} font-semibold">${translate[day.level]}</p>`
                : `<p class="text-xs mt-1 text-gray-600 font-semibold">Wysyłki wstrzymane</p>`;

            const card = `
                <div class="glass-card p-2 rounded-xl shadow-sm text-center border ${finalTileColor}">
                    <p class="font-bold text-slate-900 text-sm capitalize">${weekday}</p>
                    <p class="text-xs text-slate-700">${formattedDate}</p>
                    <p class="text-xs text-slate-700 mt-1">${min}°C – ${max}°C</p>
                    ${statusHtml}
                </div>
            `;
            container.innerHTML += card;
        });

    } catch (e) {
        document.getElementById("weather-grid").innerHTML =
            "<span class='text-red-600 text-sm'>Nie udało się pobrać pogody.</span>";
    }
}

loadWeather();
