# TiresDash API server

Express/TypeScript backend for TiresDash. Supports appointment booking, fleet/vehicle workflows, catalog/order-related APIs, and payment integration endpoints used by the custom client application.

## What I worked on

Backend implementation for the TiresDash modernization path: API modules, booking/fleet-related routes, and supporting server configuration. This repository documents the API surface — not business strategy ownership or unverified commercial results.

Public delivery boundary: [TiresDash case study](https://shafinsadnan.com/case-studies/tiresdash-wordpress-to-nextjs-migration)

## Core functionality

- Appointment booking APIs
- Fleet auth, vehicles, appointments, support, and related fleet modules
- Catalog/product, order, cart, and review-related routes
- Auth/user routes
- Payment-related integrations (Stripe / PayPal client libraries present in dependencies)

## Tech

- Node.js
- TypeScript
- Express
- MongoDB / Mongoose
- JWT auth helpers
- Dotenv-based configuration

## Architecture / implementation notes

- Modular routes under `src/app/modules`
- Central route registration in `src/app/routes`
- TypeScript build output to `dist/` for `npm start`

## Running locally

Prerequisites: Node.js and a MongoDB instance.

```bash
git clone https://github.com/shshafin/tiresdash-app-server.git
cd tiresdash-app-server
npm install
```

Create a `.env` file with the variables your local setup requires (MongoDB URI, JWT secret, client URLs, payment keys as needed). Do not commit secrets.

```bash
npm run dev
```

Production-style run after compile:

```bash
npm run build
npm start
```

## Related proof

- Case study: https://shafinsadnan.com/case-studies/tiresdash-wordpress-to-nextjs-migration
- Client repository: https://github.com/shshafin/tiresdash-client-app
