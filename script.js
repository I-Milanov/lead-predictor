(function () {
  "use strict";

  const el = {
    languageSelect: document.getElementById("language-select"),
    languageTrigger: document.getElementById("language-trigger"),
    languageTriggerText: document.getElementById("language-trigger-text"),
    languageMenu: document.getElementById("language-menu"),
    currency: document.getElementById("currency"),
    revenuePrefix: document.getElementById("revenue-prefix"),
    orderPrefix: document.getElementById("order-prefix"),
    campaignStart: document.getElementById("campaign-start"),
    campaignStartDisplay: document.getElementById("campaign-start-display"),
    campaignEnd: document.getElementById("campaign-end"),
    campaignEndDisplay: document.getElementById("campaign-end-display"),
    totalRevenue: document.getElementById("total-revenue"),
    avgOrderValue: document.getElementById("avg-order-value"),
    leadRate: document.getElementById("lead-rate"),
    prospectRate: document.getElementById("prospect-rate"),
    leadRateFill: document.getElementById("lead-rate-fill"),
    prospectRateFill: document.getElementById("prospect-rate-fill"),
    leadRateValue: document.getElementById("lead-rate-value"),
    prospectRateValue: document.getElementById("prospect-rate-value"),
    chart: document.getElementById("chart"),
    chartWrap: document.querySelector(".chart-wrap"),
    prospectsValue: document.getElementById("prospects-value"),
    leadsValue: document.getElementById("leads-value"),
    customersValue: document.getElementById("customers-value"),
    prospectsPct: document.getElementById("prospects-pct"),
    leadsPct: document.getElementById("leads-pct"),
    customersPct: document.getElementById("customers-pct"),
    prospectsBar: document.getElementById("prospects-bar"),
    leadsBar: document.getElementById("leads-bar"),
    customersBar: document.getElementById("customers-bar"),
  };

  function monthsBetween(startStr, endStr) {
    const start = new Date(startStr);
    const end = new Date(endStr);
    if (isNaN(start) || isNaN(end) || end <= start) return 1;
    let months =
      (end.getFullYear() - start.getFullYear()) * 12 +
      (end.getMonth() - start.getMonth());
    if (end.getDate() >= start.getDate()) months += 1;
    return Math.max(1, months);
  }

  // Formula 01: Customers = Total Revenue / Avg Order Value
  function calcCustomers(totalRevenue, avgOrderValue) {
    if (!avgOrderValue) return 0;
    return totalRevenue / avgOrderValue;
  }

  // Formula 02: Leads = Customers * 100 / Lead Response Rate
  function calcLeads(customers, leadRate) {
    if (!leadRate) return 0;
    return (customers * 100) / leadRate;
  }

  // Formula 03: Prospects = Leads * 100 / Prospect Response Rate
  function calcProspects(leads, prospectRate) {
    if (!prospectRate) return 0;
    return (leads * 100) / prospectRate;
  }

  function readInputs() {
    const currencyOpt = el.currency.options[el.currency.selectedIndex];
    const symbol = currencyOpt.dataset.symbol || "$";
    el.revenuePrefix.textContent = symbol;
    el.orderPrefix.textContent = symbol;

    const totalRevenue = Math.max(0, Number(el.totalRevenue.value) || 0);
    const avgOrderValue = Math.max(1, Number(el.avgOrderValue.value) || 1);
    const leadRate = Number(el.leadRate.value);
    const prospectRate = Number(el.prospectRate.value);
    const months = monthsBetween(el.campaignStart.value, el.campaignEnd.value);

    return { totalRevenue, avgOrderValue, leadRate, prospectRate, months };
  }

  function formatNumber(n) {
    return Math.round(n).toLocaleString("en-US");
  }

  const MONTH_ABBR = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
  ];

  function formatDateDisplay(isoValue) {
    if (!isoValue) return "";
    const [year, month, day] = isoValue.split("-");
    return `${day}-${MONTH_ABBR[Number(month) - 1]}-${year}`;
  }

  function syncSliderFill(input, fillEl) {
    const min = Number(input.min) || 0;
    const max = Number(input.max) || 100;
    const percent = ((Number(input.value) - min) / (max - min)) * 100;
    fillEl.style.width = Math.max(0, Math.min(100, percent)) + "%";
  }

  function syncDateDisplays() {
    el.campaignStartDisplay.textContent = formatDateDisplay(
      el.campaignStart.value
    );
    el.campaignEndDisplay.textContent = formatDateDisplay(el.campaignEnd.value);
  }

  const svgNS = "http://www.w3.org/2000/svg";

  let tooltipEl = null;
  function getTooltip() {
    if (!tooltipEl) {
      tooltipEl = document.createElement("div");
      tooltipEl.className = "chart-tooltip";
      el.chartWrap.appendChild(tooltipEl);
    }
    return tooltipEl;
  }

  function drawChart(prospectsTotal, leadsTotal, customersTotal, months) {
    const svg = el.chart;
    svg.innerHTML = "";

    const width = svg.clientWidth || 640;
    const height = svg.clientHeight || 320;
    const leftPad = 30;
    const rightPad = 10;
    const topPad = 10;
    const bottomPad = 26;

    svg.setAttribute("viewBox", `0 0 ${width} ${height}`);

    const plotWidth = width - leftPad - rightPad;
    const plotHeight = height - topPad - bottomPad;
    const rowGap = 8;
    const barHeight = Math.max(
      10,
      (plotHeight - rowGap * (months - 1)) / months
    );

    const maxProspects = Math.max(1, prospectsTotal);
    const scale = plotWidth / maxProspects;

    const tooltip = getTooltip();

    for (let m = 1; m <= months; m++) {
      const fraction = m / months;
      const rowProspects = prospectsTotal * fraction;
      const rowLeads = leadsTotal * fraction;
      const rowCustomers = customersTotal * fraction;

      const y = topPad + (m - 1) * (barHeight + rowGap);

      const group = document.createElementNS(svgNS, "g");
      group.setAttribute("class", "chart-bar");

      const bg = document.createElementNS(svgNS, "rect");
      bg.setAttribute("class", "chart-bar-bg");
      bg.setAttribute("x", leftPad);
      bg.setAttribute("y", y);
      bg.setAttribute("width", Math.max(0, rowProspects * scale));
      bg.setAttribute("height", barHeight);
      bg.setAttribute("rx", 3);
      group.appendChild(bg);

      const leadsBar = document.createElementNS(svgNS, "rect");
      leadsBar.setAttribute("class", "chart-bar-leads");
      leadsBar.setAttribute("x", leftPad);
      leadsBar.setAttribute("y", y);
      leadsBar.setAttribute("width", Math.max(0, rowLeads * scale));
      leadsBar.setAttribute("height", barHeight);
      leadsBar.setAttribute("rx", 3);
      group.appendChild(leadsBar);

      const custBar = document.createElementNS(svgNS, "rect");
      custBar.setAttribute("class", "chart-bar-customers");
      custBar.setAttribute("x", leftPad);
      custBar.setAttribute("y", y);
      custBar.setAttribute("width", Math.max(0, rowCustomers * scale));
      custBar.setAttribute("height", barHeight);
      custBar.setAttribute("rx", 3);
      group.appendChild(custBar);

      const label = document.createElementNS(svgNS, "text");
      label.setAttribute("class", "chart-axis-text");
      label.setAttribute("x", leftPad - 8);
      label.setAttribute("y", y + barHeight / 2 + 4);
      label.setAttribute("text-anchor", "end");
      label.textContent = String(m);
      group.appendChild(label);

      group.addEventListener("mousemove", (evt) => {
        const rect = svg.getBoundingClientRect();
        tooltip.style.display = "block";
        tooltip.style.left = evt.clientX - rect.left + leftPad + "px";
        tooltip.style.top = evt.clientY - rect.top + "px";
        tooltip.innerHTML =
          `<strong>Month #${m}</strong><br>` +
          `Prospects: ${formatNumber(rowProspects)}<br>` +
          `Leads: ${formatNumber(rowLeads)}<br>` +
          `Customers: ${formatNumber(rowCustomers)}`;
      });
      group.addEventListener("mouseleave", () => {
        tooltip.style.display = "none";
      });

      svg.appendChild(group);
    }

    const axisLine = document.createElementNS(svgNS, "line");
    axisLine.setAttribute("class", "chart-axis-line");
    axisLine.setAttribute("x1", leftPad);
    axisLine.setAttribute("y1", topPad);
    axisLine.setAttribute("x2", leftPad);
    axisLine.setAttribute("y2", height - bottomPad + 6);
    svg.appendChild(axisLine);

    const ticks = 6;
    for (let t = 0; t <= ticks; t++) {
      const val = Math.round((maxProspects / ticks) * t);
      const x = leftPad + val * scale;
      const tickText = document.createElementNS(svgNS, "text");
      tickText.setAttribute("class", "chart-axis-text");
      tickText.setAttribute("x", x);
      tickText.setAttribute("y", height - bottomPad + 20);
      tickText.setAttribute("text-anchor", "middle");
      tickText.textContent = formatNumber(val) + " people";
      svg.appendChild(tickText);
    }
  }

  function render() {
    syncDateDisplays();

    const { totalRevenue, avgOrderValue, leadRate, prospectRate, months } =
      readInputs();

    el.leadRateValue.textContent = leadRate.toFixed(2) + "%";
    el.prospectRateValue.textContent = prospectRate.toFixed(2) + "%";
    syncSliderFill(el.leadRate, el.leadRateFill);
    syncSliderFill(el.prospectRate, el.prospectRateFill);

    const customers = calcCustomers(totalRevenue, avgOrderValue);
    const leads = calcLeads(customers, leadRate);
    const prospects = calcProspects(leads, prospectRate);

    el.prospectsValue.textContent = formatNumber(prospects);
    el.leadsValue.textContent = formatNumber(leads);
    el.customersValue.textContent = formatNumber(customers);

    const leadsPct = prospects ? (leads / prospects) * 100 : 0;
    const customersPct = prospects ? (customers / prospects) * 100 : 0;

    el.prospectsPct.textContent = "100%";
    el.leadsPct.textContent = Math.round(leadsPct) + "%";
    el.customersPct.textContent = Math.round(customersPct) + "%";

    el.prospectsBar.style.width = "100%";
    el.leadsBar.style.width = Math.min(100, leadsPct) + "%";
    el.customersBar.style.width = Math.min(100, customersPct) + "%";

    drawChart(prospects, leads, customers, months);
  }

  function setupLanguageDropdown() {
    const trigger = el.languageTrigger;
    const menu = el.languageMenu;
    const triggerFlag = trigger.querySelector(".flag-icon");

    function close() {
      menu.hidden = true;
      trigger.setAttribute("aria-expanded", "false");
    }

    function open() {
      menu.hidden = false;
      trigger.setAttribute("aria-expanded", "true");
    }

    trigger.addEventListener("click", () => {
      menu.hidden ? open() : close();
    });

    menu.querySelectorAll("li").forEach((option) => {
      option.addEventListener("click", () => {
        menu
          .querySelectorAll("li")
          .forEach((li) => li.setAttribute("aria-selected", "false"));
        option.setAttribute("aria-selected", "true");
        el.languageTriggerText.textContent = option.dataset.label;
        triggerFlag.src = `https://flagcdn.com/24x18/${option.dataset.flag}.png`;
        close();
      });
    });

    document.addEventListener("click", (evt) => {
      if (!el.languageSelect.contains(evt.target)) close();
    });

    document.addEventListener("keydown", (evt) => {
      if (evt.key === "Escape") close();
    });
  }

  setupLanguageDropdown();

  [
    el.currency,
    el.campaignStart,
    el.campaignEnd,
    el.totalRevenue,
    el.avgOrderValue,
    el.leadRate,
    el.prospectRate,
  ].forEach((input) => input.addEventListener("input", render));

  window.addEventListener("resize", render);

  render();
})();
