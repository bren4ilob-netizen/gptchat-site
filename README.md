# Chat Multiregion Site (Demo)

This repository contains a demo React frontend (Vite) and a minimal Express server with mock endpoints so you can run and test locally.

## Structure
- client/ - Vite + React app
- server/ - minimal Express server with mock /api endpoints

## Run locally
1. Install root dependencies:
   ```
   npm install
   cd client
   npm install
   cd ../server
   npm install express body-parser
   cd ..
   ```

2. Start frontend and server separately:
   - `cd client && npm run dev` (Vite)
   - `cd server && node server.js`

Or use your own process manager.

## Notes
- Chat endpoint is a mock. Replace `/api/chat` server logic with OpenAI server-side calls and store your API keys in environment variables.
- Payment endpoints are placeholders. Integrate with DenizBank or PSP of your choice for real payments and webhooks.

