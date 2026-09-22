# LeadPredictor

A marketing funnel calculator. Given a revenue goal, average order value, and
expected response rates, it works backwards to tell you how many prospects
and leads you need to hit your target — and visualizes how that funnel fills
up over the length of your campaign.

## Formulas

1. **Customers** = Total Revenue / Avg. Order Value
2. **Leads** = Customers &times; 100 / Lead Response Rate
3. **Prospects** = Leads &times; 100 / Prospect Response Rate

## Running locally

This is a static site with no build step. Serve the folder with any static
file server, e.g.:

```bash
npx serve .
```

## Deployment

Deployed on [Netlify](https://www.netlify.com/) as a static site
(see `netlify.toml`).
