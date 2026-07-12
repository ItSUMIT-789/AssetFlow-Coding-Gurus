# AssetFlow Frontend

Enterprise asset and resource management frontend built with React, Vite, Tailwind CSS v4, React Router DOM, and Lucide React.

## Run locally

```bash
npm install
npm run dev
```

Production verification:

```bash
npm run lint
npm run build
npm run preview
```

## Routes

- `/` — responsive landing page
- `/login` — mock employee login
- `/register` — employee-only account registration
- `/dashboard` — protected temporary dashboard

Mock user and authentication data are stored in the browser's `localStorage`. New registrations always receive the `EMPLOYEE` role.

## Structure

```text
src/
├── components/    Reusable navigation, form, card, and route components
├── data/          Home page content
├── pages/         Home, Login, Register, and Dashboard pages
├── utils/         Form validation helpers
├── App.jsx        Router configuration
├── index.css      Tailwind import, theme tokens, and global styles
└── main.jsx       React entry point
```

Tailwind v4 is configured through `@tailwindcss/vite` in `vite.config.js`; design tokens live in the `@theme` block in `src/index.css`.
