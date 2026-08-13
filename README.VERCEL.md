Vercel deployment

1. Connect this repository to Vercel (import project).
2. Ensure the Build Command is `npm run vercel-build` and the Output Directory is `dist`.
3. Environment: none required for local demo. For API keys, add them in the Vercel dashboard.

Local test:
```bash
npm install
npm run vercel-build
npx serve dist
```

This project is a Vite + Vue SPA; `vercel.json` ensures all routes fall back to `index.html`.
