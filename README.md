# ChemSystem — Vue 3 Conversion

This project is a Vue 3 + Vite conversion of the supplied Figma Make/React dashboard.

## Included
- Vue 3 Composition API
- Vite
- Responsive desktop/tablet/mobile UI
- Login and registration mock flow
- Dashboard
- Learning modules with search and filters
- Module details and lesson flow
- DNA genetics interactive simulation
- AI Tutor mock service, ready to replace with a real API
- Quiz and quiz results
- Progress dashboard
- Profile
- Settings with working toggles
- Lucide icons
- No Tailwind or React dependency

## Run

```bash
npm install
npm run dev
```

Then open the local URL printed by Vite.

## Build

```bash
npm run build
npm run preview
```

## Connect your backend later

The two mock services are intentionally separated:

- `src/services/auth.js` — replace login/register with your backend or Supabase API.
- `src/services/aiTutor.js` — replace `send()` with your AI endpoint.

The data is currently in `src/data.js`, so it can later be replaced with API/database calls.

## Main entry

`src/App.vue`

Shared UI render components are in:

`src/components/ui.js`

Global styling:

`src/styles.css`
