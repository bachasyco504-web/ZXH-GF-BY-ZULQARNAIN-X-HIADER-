# GF AI

Production-oriented AI companion platform scaffold.

## Stack
- React + Vite + Tailwind
- Node.js + Express
- MongoDB + Mongoose
- JWT httpOnly cookie sessions
- Provider-agnostic AI service
- PWA shell
- Security middleware and rate limiting

## Run
1. Copy `.env.example` to `backend/.env`.
2. Install dependencies with `npm install` in root, then `npm run install:all`.
3. Start MongoDB.
4. Run `npm run dev`.

Frontend: http://localhost:5173
Backend: http://localhost:5000

AI/image/voice/payment providers are adapter-based and require real credentials before those capabilities are enabled.
