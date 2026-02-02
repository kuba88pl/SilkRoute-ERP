import { renderBreedingList } from "./breedingList.js";
import { renderBreedingDashboard } from "./breedingDashboard.js";

export function initBreedingModule() {
    const root = document.getElementById("breeding-root");

    // start od listy samic
    renderBreedingList(root);

    // TABS
    const tabList = document.getElementById("tab-list");
    const tabDashboard = document.getElementById("tab-dashboard");
    const tabSettings = document.getElementById("tab-settings");

    function activateTab(active, ...inactive) {
        active.classList.remove("tab-inactive");
        active.classList.add("tab-active");

        inactive.forEach(btn => {
            btn.classList.remove("tab-active");
            btn.classList.add("tab-inactive");
        });
    }

    tabList.onclick = () => {
        activateTab(tabList, tabDashboard, tabSettings);
        renderBreedingList(root);
    };

    tabDashboard.onclick = () => {
        activateTab(tabDashboard, tabList, tabSettings);
        renderBreedingDashboard(root);
    };

    tabSettings.onclick = () => {
        activateTab(tabSettings, tabList, tabDashboard);
        root.innerHTML = `
          <div class="glass-card p-10 rounded-3xl border border-slate-200">
            <h2 class="text-3xl font-[800] text-slate-900 mb-6">Ustawienia modułu</h2>
            <p class="text-slate-500">Brak ustawień w tej wersji.</p>
          </div>
        `;
    };
}
