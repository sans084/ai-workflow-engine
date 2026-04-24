# AI Workflow Engine

A full-stack AI-powered request intake and triage system built with Next.js 14, NestJS, MongoDB, and OpenRouter AI.

## Live Demo

- **Frontend**: https://ai-workflow-engine-theta.vercel.app
- **Backend API**: https://ai-workflow-engine-unx6.onrender.com/requests

## Features

- Submit requests via a validated form (React Hook Form)
- AI automatically categorises, summarises and assigns urgency to each request
- Async fire-and-forget AI enrichment — API responds 201 immediately
- Dashboard auto-refreshes every 3 seconds until all cards are enriched
- Category filtering reflected in URL (shareable and refreshable)
- Stats bar showing total, high urgency, medium and enriched counts
- Avatar initials with colour coding per user
- Delete requests with 2-click confirmation
- Skeleton loading, empty state and error state with retry
- Graceful degradation — if AI fails, record persists with null fields

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 14 (App Router, TypeScript) |
| Backend | NestJS (Modular, TypeScript) |
| AI | OpenRouter — openrouter/auto |
| Database | MongoDB Atlas + Mongoose |
| Deployment | Vercel (frontend) + Render (backend) |

## Project Structure
```
ai-workflow-engine/
├── client/                         ← Next.js 14 App
│   ├── app/
│   │   ├── submit/page.tsx         ← Submission form
│   │   ├── dashboard/
│   │   │   ├── page.tsx            ← Dashboard with stats
│   │   │   ├── loading.tsx         ← Skeleton fallback
│   │   │   └── error.tsx           ← Error boundary
│   │   ├── layout.tsx              ← Root layout + navbar
│   │   └── globals.css
│   ├── components/
│   │   ├── RequestCard.tsx         ← Card with delete button
│   │   ├── SkeletonCard.tsx        ← Loading placeholder
│   │   ├── CategoryFilter.tsx      ← URL-reflected filter
│   │   ├── AutoRefresh.tsx         ← Auto-polling component
│   │   └── ErrorState.tsx          ← Error with retry
│   └── lib/api.ts                  ← API helpers and types
│
└── server/                         ← NestJS API
└── src/
├── requests/
│   ├── requests.controller.ts
│   ├── requests.service.ts
│   ├── dto/create-request.dto.ts
│   └── schemas/request.schema.ts
├── ai/
│   ├── ai.service.ts       ← OpenRouter integration
│   └── ai.module.ts
├── app.module.ts
└── main.ts
```

## How It Works

1. User submits a request via the form
2. NestJS saves it to MongoDB and immediately returns 201
3. `setImmediate()` triggers AI enrichment in the background
4. OpenRouter AI classifies the request into category, summary and urgency
5. MongoDB record is updated with AI fields
6. Frontend auto-polls every 3 seconds and updates cards in real time

## AI System Prompt

The AI is instructed to respond with only a JSON object:

```json
{
  "category": "billing" | "support" | "feedback" | "general",
  "summary": "<one concise sentence>",
  "urgency": "low" | "medium" | "high"
}
```

Classification rules are explicitly defined for each category and urgency level. The response parser strips markdown fences and validates each field, falling back to safe defaults if parsing fails.

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /requests | Create request, triggers async AI enrichment |
| GET | /requests | List with ?page, ?limit, ?category filters |
| DELETE | /requests/:id | Delete a request |

## Local Setup

```bash
# Backend
cd server
cp .env.example .env      # fill in your values
npm install
npm run start:dev         # runs on http://localhost:4000

# Frontend
cd client
cp .env.example .env.local
npm install
npm run dev               # runs on http://localhost:3000
```

### Environment Variables

**server/.env**
```
MONGODB_URI=mongodb+srv://...
OPENROUTER_API_KEY=sk-or-...
CLIENT_URL=http://localhost:3000
PORT=4000
```

**client/.env.local**
```
NEXT_PUBLIC_API_URL=http://localhost:4000
```

## Trade-offs & Known Limitations

- No authentication — any user can submit and view all requests
- Render free tier sleeps after 15 mins inactivity — first request takes ~30s to wake up
- No real-time WebSocket — dashboard uses polling every 3 seconds instead
- Free AI model may occasionally rate-limit — handled gracefully with null fallback