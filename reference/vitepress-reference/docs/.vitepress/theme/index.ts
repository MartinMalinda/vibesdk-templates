import DefaultTheme from "vitepress/theme";
import { defineComponent, h } from "vue";
import { errorReporter } from "./error-reporting";

// Import the errorReporter singleton.
// The constructor of the errorReporter runs immediately upon import,
// setting up all the global window.onerror and console listeners.

// Ensure the reporter is available globally (optional, but good for debugging)
if (typeof window !== "undefined") {
  (window as any).errorReporter = errorReporter;
}

// Access the default theme's Layout component
const ThemeLayout = DefaultTheme.Layout;

// The reference theme file is minimal, but provides a pre-wrapped Layout
// component to make future template customization easier. This is where
// templates will inject content into slots like 'nav-bar-content-before'.

export default {
  ...DefaultTheme,

  // Provide a custom Layout component that wraps the default one.
  Layout: defineComponent({
    name: "ReferenceLayout",
    setup(_, { slots }) {
      return () =>
        h(ThemeLayout, null, {
          // Pass all slots through by default.
          // Templates will override specific slots here.
          ...slots,

          // Example slot extension point (currently commented out):
          // 'doc-before': () => h('div', { style: 'padding: 1rem; border: 1px solid #ccc;' }, 'CONTENT BEFORE DOC')
        });
    },
  }),

  // The enhanceApp method is available for global component registration or router adjustments
  // enhanceApp({ app, router, siteData }) {
  //   // app.component('MyGlobalComponent', MyGlobalComponent);
  // },
};
