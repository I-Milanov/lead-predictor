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

  // Calculation engine and chart rendering land in later commits.
  function render() {
    // no-op scaffold: static markup only for now
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
