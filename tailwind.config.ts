import type { Config } from "tailwindcss";
import typography from "@tailwindcss/typography";
import plugin from "tailwindcss/plugin";

const skinUtilities = plugin(({ addUtilities }) => {
  const skinMap: Record<string, string> = {
    base: "--color-text-base",
    accent: "--color-accent",
    inverted: "--color-fill",
    fill: "--color-fill",
    card: "--color-card",
    "card-muted": "--color-card-muted",
    line: "--color-border",
    border: "--color-border",
    muted: "--color-card-muted",
  };

  const toColor = (variable: string) => `rgb(var(${variable}))`;

  const utilities = Object.entries(skinMap).reduce<
    Record<string, Record<string, string>>
  >((acc, [name, variable]) => {
    const colorValue = toColor(variable);
    acc[`.text-skin-${name}`] = { color: colorValue };
    acc[`.bg-skin-${name}`] = { "background-color": colorValue };
    acc[`.border-skin-${name}`] = { "border-color": colorValue };
    acc[`.border-l-skin-${name}`] = { "border-left-color": colorValue };
    acc[`.border-r-skin-${name}`] = { "border-right-color": colorValue };
    acc[`.border-t-skin-${name}`] = { "border-top-color": colorValue };
    acc[`.border-b-skin-${name}`] = { "border-bottom-color": colorValue };
    acc[`.outline-skin-${name}`] = { "outline-color": colorValue };
    acc[`.fill-skin-${name}`] = { fill: colorValue };
    acc[`.stroke-skin-${name}`] = { stroke: colorValue };
    acc[`.ring-skin-${name}`] = { "--tw-ring-color": colorValue };
    return acc;
  }, {});

  addUtilities(utilities, {
    variants: [
      "responsive",
      "hover",
      "focus",
      "focus-visible",
      "group-hover",
      "selection",
    ],
  });
});

const config = {
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
  theme: {
    screens: {
      sm: "640px",
    },
    extend: {
      fill: {
        transparent: "transparent",
      },
      fontFamily: {
        mono: ["IBM Plex Mono", "monospace"],
      },
      typography: {
        DEFAULT: {
          css: {
            pre: {
              color: false,
            },
            code: {
              color: false,
            },
          },
        },
      },
    },
  },
  plugins: [typography, skinUtilities],
} satisfies Config;

export default config;
