# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Repo overview
This is a “one-time message” app with:
- `frontend/`: React (Vite) SPA using MUI + React Router.
- `backend/`: Node.js (ESM) Express API backed by MySQL.

Note: `backend/` currently appears to be untracked in git (it shows up as `?? backend/` in `git status`). If you expect backend changes to persist, ensure it’s committed (or intentionally ignored).

At a high level, the intended flow is:
1. Frontend encrypts a plaintext message client-side.
2. Backend stores only the encrypted payload and returns a message `id`.
3. Receiver fetches the encrypted payload by `id` and decrypts client-side using either:
   - a random key embedded in the URL fragment (`#key`), or
   - a key derived from a user-provided password.
4. “Burn after read” is implemented by calling the backend delete endpoint after the message is displayed.

## Common commands
### Install dependencies
This repo currently has multiple Node projects.

```sh
# repo root (currently only includes crypto-js)
npm install

# frontend
cd frontend
npm install

# backend
cd ../backend
npm install
```

### Run locally (dev)
Run these in separate terminals:

```sh
# backend API (Express)
cd backend
npm run dev

# frontend SPA (Vite)
cd ../frontend
npm run dev
```

### Build + preview (frontend)
```sh
cd frontend
npm run build
npm run preview
```

### Lint (frontend)
```sh
cd frontend
npm run lint
```

### Tests
There are no real test commands configured yet:
- `frontend/` has no test script.
- `backend/` has a placeholder `npm test` that exits with an error.

## Architecture notes (big picture)
### Frontend (React/Vite)
Entry + routing:
- `frontend/src/main.jsx`: mounts the app.
- `frontend/src/App.jsx`: sets up MUI theming and React Router routes.
  - Key routes: `/sender`, `/receiver`, and `/:id` (receiver-by-id route).

UI structure:
- `frontend/src/components/Layout.jsx`: wraps pages with `Navbar` + `Footer`.
- `frontend/src/theme.js` + `frontend/src/store/useThemeStore.js`: theme generation and persisted theme toggle (zustand).

Encryption helpers:
- `frontend/src/utils/crypto.js`:
  - `generateKey()` creates a random key.
  - `deriveKeyFromPassword(password)` derives a key via PBKDF2.
  - `encryptMessage()` / `decryptMessage()` do AES encryption/decryption.
  - Messages are “signed” by prefixing plaintext with `OTM_SECURE_MSG::` and validating that prefix after decryption.

Sender flow:
- `frontend/src/pages/SenderPage.jsx`:
  - Encrypts the message in-browser.
  - Currently generates a “fake id” and constructs a link; backend integration is marked TODO.
  - Intended URL format:
    - passwordless: `/{id}#{key}` (key in fragment)
    - password-protected: `/{id}` (recipient supplies password to derive key)

Receiver flow:
- `frontend/src/pages/ReceiverPage.jsx`: UI for pasting an OTM code (not yet wired to backend).
- `frontend/src/pages/ReceiverPageQuery.jsx`: placeholder receiver-by-route component (currently not implemented).

### Backend (Express/MySQL)
API entrypoint:
- `backend/server.js`
  - Creates a MySQL connection pool.
  - Runs `initDB()` to ensure the `messages` table exists.
  - REST endpoints:
    - `POST /` creates a message and returns `{ id }`.
    - `GET /:id` returns the encrypted payload for that id.
    - `DELETE /:id` deletes the message (burn).

Database expectations:
- The MySQL connection config and DB name are currently hard-coded in `backend/server.js`.
- `dotenv` is loaded; any future environment-based config is expected to live in `backend/.env`.

Important implementation detail:
- `POST /` expects `encryptedData` (ciphertext) and `expiresAt` (an ISO datetime) in the request body.
- If you modify schema/expiration behavior, update both the `CREATE TABLE` query and the `INSERT` query in `backend/server.js` so they stay consistent.
