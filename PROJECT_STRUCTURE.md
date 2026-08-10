# Project Structure Guide

## Purpose of the Project
FarmChain Assist is a farmer-friendly agricultural platform that combines personalized AI insights (Digital Twin), voice-first multilingual interaction, and a blockchain-based agricultural marketplace to support modern farmers.

## Folder Contents

- **frontend/**: Contains all user interface code. React components and pages are stored here.
  - UI for Digital Twin is at `frontend/src/pages/DigitalTwin/` (logic in `components/digitalTwin`).
  - Marketplace UI is at `frontend/src/pages/Marketplace/`.
- **backend/**: Contains all server-side code, business logic, API controllers, and REST routes.
  - Digital Twin business logic is at `backend/src/services/digitalTwin/`.
  - Marketplace services are at `backend/src/services/marketplace/`.
- **ai/**: Contains the core AI models and logic.
  - AI predictions and digital twin logic are found inside `ai/digital_twin/` and other AI subfolders.
- **blockchain/**: Stores all smart contracts, blockchain scripts, ABI JSON files, and related config.
- **database/**: Contains schema designs, migration scripts, and seed data.
- **docs/**: Architecture diagrams, API specs, database diagrams, and testing guides.
- **tests/**: Divided by component (frontend, backend, AI, integration).

## Environment Variables
- Configuration placeholders are stored in `.env.example`.
- **NEVER** push the actual `.env` file containing secrets, API keys, database credentials, or blockchain private keys.
