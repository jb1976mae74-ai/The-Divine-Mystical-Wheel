# AGENTS.md - Custom Instructions & App Preferences

## Project Overview
**App Name:** The Great Wheel of Mysteries
**Description:** Esoteric cipher, ancient records search, mystic symbolism, and AI-powered knowledge discovery engine.

## Core Preferences & Guidelines

### 1. Framework & Architecture
- **Frontend:** React with TypeScript, Vite, Tailwind CSS, Lucide icons, Motion/Framer Motion.
- **Backend:** Express custom server (`server.ts`) running on port 3000 with `@google/genai` server-side proxying.
- **Build & Dev:** Run full-stack using Vite middleware in dev and bundled CommonJS server (`dist/server.cjs`) for production.

### 2. Design & Aesthetic Rules
- **Theme:** Esoteric, high-contrast mystic visual layout. Clean dark/warm neutral tones with precise geometric and symbolic elements.
- **Typography:** High legibility with distinct serif/display headings and clean body typography.
- **Components:** Modular React components cleanly separated in `/src/components/`.

### 3. API & Data Handling
- **Gemini API:** Always call Gemini from server-side routes (`/api/*`) using `process.env.GEMINI_API_KEY`.
- **Firebase / Firestore:** Maintain secure Firestore rules and schema bindings for saved records, ciphers, and history.

### 4. General Principles
- Maintain clean TypeScript types in `/src/types.ts`.
- Avoid unnecessary external UI key prompts (secrets managed via environment variables).
- Ensure fast responsive layouts and instant user feedback.
