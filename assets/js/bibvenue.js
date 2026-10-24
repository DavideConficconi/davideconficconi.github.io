document.addEventListener("DOMContentLoaded", function () {
  const container = document.getElementById("venue-filters");
  const venueGroups = new Map([
    ["RAW", "Workshops"],
    ["HCW", "Workshops"],
    ["EuroSec", "Workshops"],
    ["EUROCON", "Others"],
    ["RTSI", "Others"],
    ["JPDC", "Others"],
    ["Quantum", "Others"],
    ["QCE", "Others"],
    ["ICCD", "Others"],
    ["IISWC", "Others"],
    ["Springer", "Others"],
  ]);
  const venueAliases = new Map([["SIGMTERICS", "SIGMETRICS"]]);
  const venueOrder = [
    "SIGMETRICS",
    "DAC",
    "FPGA",
    "CGO",
    "FCCM",
    "EuroSys",
    "TRETS",
    "CSUR",
    "TECS",
    "TPDS",
    "TCAD",
    "TETC",
    "JBHI",
    "DATE",
    "FPL",
    "ISCAS",
    "BioCAS",
  ];
  const venueOrderIndex = new Map(venueOrder.map((venue, index) => [venue, index]));
  const finalGroups = new Map([
    ["Workshops", 0],
    ["Others", 1],
  ]);
  const entries = Array.from(document.querySelectorAll(".publications ol.bibliography > li")).map((element) => ({
    element,
    venue: venueAliases.get(element.querySelector("[data-venue]")?.dataset.venue.trim()) || element.querySelector("[data-venue]")?.dataset.venue.trim() || "Other",
  }));

  if (!container || entries.length === 0) {
    return;
  }

  const venueCounts = new Map();
  entries.forEach(({ venue }) => {
    const group = venueGroups.get(venue) || venue;
    venueCounts.set(group, (venueCounts.get(group) || 0) + 1);
  });
  let selectedGroup = null;
  const venueButtons = new Map();
  const status = document.createElement("span");
  status.className = "venue-filter-status";
  status.setAttribute("role", "status");

  const allButton = document.createElement("button");
  allButton.type = "button";
  allButton.className = "venue-filter";
  allButton.textContent = `All (${entries.length})`;
  allButton.addEventListener("click", function () {
    selectedGroup = null;
    updateFilters();
  });

  Array.from(venueCounts.keys())
    .sort((first, second) => {
      const firstOrder = venueOrderIndex.get(first);
      const secondOrder = venueOrderIndex.get(second);
      if (firstOrder !== undefined || secondOrder !== undefined) {
        if (firstOrder === undefined) return 1;
        if (secondOrder === undefined) return -1;
        return firstOrder - secondOrder;
      }

      const firstFinal = finalGroups.get(first);
      const secondFinal = finalGroups.get(second);
      if (firstFinal !== undefined || secondFinal !== undefined) {
        if (firstFinal === undefined) return -1;
        if (secondFinal === undefined) return 1;
        return firstFinal - secondFinal;
      }

      return first.localeCompare(second);
    })
    .forEach((venue) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "venue-filter";
      button.textContent = `${venue} (${venueCounts.get(venue)})`;
      button.addEventListener("click", function () {
        selectedGroup = venue;
        updateFilters();
      });
      venueButtons.set(venue, button);
    });

  function updateFilters() {
    entries.forEach(({ element, venue }) => {
      const group = venueGroups.get(venue) || venue;
      element.classList.toggle("venue-hidden", selectedGroup !== null && group !== selectedGroup);
    });
    venueButtons.forEach((button, venue) => {
      button.setAttribute("aria-pressed", String(selectedGroup === venue));
    });
    allButton.setAttribute("aria-pressed", String(selectedGroup === null));
    const visibleCount = selectedGroup === null ? entries.length : venueCounts.get(selectedGroup);
    status.textContent = `${visibleCount} of ${entries.length} publications`;
  }

  container.replaceChildren(allButton, ...venueButtons.values(), status);
  updateFilters();
});