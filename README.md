# wfh

Activities for work-from-home teams — icebreakers, dumb little games, and
team-building exercises. Everything runs entirely in the browser: the site is
prerendered to static HTML at build time, so there's no backend server to run
or deploy.

## Stack

- [Astro](https://astro.build) (static output) for fast, SSR-friendly pages
- [React](https://react.dev) islands only where a page needs interactivity
- [`@noahwright/design`](https://github.com/noahWright87/design) for UI components and theming

## Development

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
npm run preview
```

`npm run build` regenerates `public/theme.css` from `theme.ts` (via
`@noahwright/design`'s `buildThemeCss`) before running `astro build`. The
output in `dist/` is fully static and can be hosted anywhere that serves
files (Netlify, GitHub Pages, S3, etc.) — no server runtime required.

## Adding an activity

Activities are listed on the landing page from `src/data/activities.ts`. Add
an entry there; each activity will eventually get its own page under
`src/pages/activities/`.
