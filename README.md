# OmniChannel Agent Studio

A Next.js application for designing, simulating, and managing customer support agents across Messenger and WhatsApp. Teams can shape persona tone, configure automations, outline routing policies, and preview conversations before going live.

## Features

- Messenger and WhatsApp launchpad with platform-specific guidance
- Persona builder covering tone, availability, and supported languages
- Automation composer for keyword, schedule, sentiment, and handoff triggers
- Conversational flow drafting with reusable response blocks and overrides
- Real-time simulator to trial the agent experience with sample prompts
- Persistent state (via local storage) seeded with production-style demo agents

## Tech Stack

- Next.js 14 (App Router) + React 18
- Tailwind CSS for styling
- Zustand for client-side state management
- TypeScript for end-to-end type safety

## Local Development

```bash
npm install
npm run dev
```

Visit `http://localhost:3000` to explore the workspace.

## Production Build

```bash
npm run build
npm start
```

## Deployment

This project is optimized for Vercel. Use the provided deployment automation:

```bash
vercel deploy --prod --yes --token $VERCEL_TOKEN --name agentic-47aeca88
```

Once deployed, verify with:

```bash
curl https://agentic-47aeca88.vercel.app
```

## Testing Checklist

- `npm run lint`
- `npm run build`

## Roadmap Ideas

- Export agent definitions as JSON/CSV for CRM ingest
- Integrations with Meta Workplace, Twilio Flex, and Zendesk Sunshine
- Analytics dashboard for CSAT trends, automation deflection, and queue health
- Role-based workspace access with audit logging
