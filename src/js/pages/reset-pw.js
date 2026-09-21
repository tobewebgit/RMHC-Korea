document.addEventListener("DOMContentLoaded", () => {
  const tabs = document.querySelector(".reset-member-tabs");
  if (!tabs) return;

  const buttons = [...tabs.querySelectorAll(".btn-tab")];
  const panels = [...document.querySelectorAll(".reset-member-panel")];

  const syncMemberTab = (activeType) => {
    const isCorporate = activeType === "corporate";

    tabs.classList.toggle("is-second-active", isCorporate);

    buttons.forEach((button) => {
      const isActive = button.dataset.tab === activeType;
      button.classList.toggle("disabled", !isActive);
      button.setAttribute("aria-selected", String(isActive));
    });

    panels.forEach((panel) => {
      const isActive = panel.id === `${activeType}ResetPanel`;
      panel.hidden = !isActive;
      panel.classList.toggle("active", isActive);
    });
  };

  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      syncMemberTab(button.dataset.tab);
    });
  });

  syncMemberTab(
    buttons.find((button) => button.getAttribute("aria-selected") === "true")
      ?.dataset.tab || "individual",
  );
});
