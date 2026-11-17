# Karutag

The React application lives in `karutag/src`. The root `index.html` is a Webpack entry that loads `main.tsx`, which forwards to the app's `karutag/src/main.tsx` entry. The nested Vite project can also be run on its own.

## Requirements

- Node.js `^20.19.0` or `>=22.12.0`
- npm `>=10`

Vite 8 requires Node 20.19 or later in the Node 20 series.

## Install

Install dependencies for both package roots:

```bash
npm install
npm --prefix karutag install
```

## Run and build

Build the root Webpack entry:

```bash
npm run build
```

Run the standalone Vite development server or build it:

```bash
npm --prefix karutag run dev
npm --prefix karutag run build
```

Run the root TypeScript check across the app source:

```bash
npm run check:types
```

