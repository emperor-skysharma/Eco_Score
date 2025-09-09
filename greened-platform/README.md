# GreenED Platform

Gamified environmental education platform for Punjab schools & colleges.

## Quick Start

```bash
# install workspace deps
npm install

# run dev servers (API + React)
npm run dev
```

Ensure you have PostgreSQL running (or set DATABASE_URL to SQLite). Seed initial data:

```bash
npm --workspace=server run seed
```