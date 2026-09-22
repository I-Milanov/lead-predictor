(function () {
  "use strict";

  const el = {
    currency: document.getElementById("currency"),
    revenuePrefix: document.getElementById("revenue-prefix"),
    orderPrefix: document.getElementById("order-prefix"),
    campaignStart: document.getElementById("campaign-start"),
    campaignEnd: document.getElementById("campaign-end"),
    totalRevenue: document.getElementById("total-revenue"),
    avgOrderValue: document.getElementById("avg-order-value"),
    leadRate: document.getElementById("lead-rate"),
    prospectRate: document.getElementById("prospect-rate"),
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

  function render() {
    const { totalRevenue, avgOrderValue, leadRate, prospectRate } =
      readInputs();

    el.leadRateValue.textContent = leadRate.toFixed(2) + "%";
    el.prospectRateValue.textContent = prospectRate.toFixed(2) + "%";

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

    // Funnel chart rendering lands in a later commit.
  }

  [
    el.currency,
    el.campaignStart,
    el.campaignEnd,
    el.totalRevenue,
    el.avgOrderValue,
    el.leadRate,
    el.prospectRate,
  ].forEach((input) => input.addEventListener("input", render));

  render();
})();
