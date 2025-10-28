# Usage

## Built with

- **VitePress 1.x** (Vue.js 3)
- Minimalist default theme

## Restrictions

- All documentation content **MUST** be Markdown (`.md`) files.
- All content files **MUST** live in the `docs/` directory.
- Navigation and sidebar menus are configured in `docs/.vitepress/config.ts`.

## Styling

- Uses the default VitePress theme.
- Global style overrides can be added to `docs/.vitepress/theme/custom.css`.
- The theme can be extended by editing `docs/.vitepress/theme/index.ts`.

## Components

- Custom Vue components (e.g., `MyComponent.vue`) should be placed in `docs/.vitepress/theme/components/`.
- Register custom components globally in `docs/.vitepress/theme/index.ts` to use them in Markdown files.
