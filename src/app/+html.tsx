import { ScrollViewStyleReset, useServerDocumentContext } from 'expo-router/html';
import type { PropsWithChildren } from 'react';

import { darkTheme, lightTheme, type AppTheme } from '@/constants/app-theme-values';

function themeVariables(theme: AppTheme) {
  return Object.entries(theme)
    .map(([name, value]) => `--japanex-${name}: ${value};`)
    .join(' ');
}

// @ref LLP 0000#application-shell-and-navigation
const themeCss = `
  :root { ${themeVariables(lightTheme)} color-scheme: light; }
  @media (prefers-color-scheme: dark) {
    :root { ${themeVariables(darkTheme)} color-scheme: dark; }
  }
  body { background-color: var(--japanex-background); }
  html:root:not([data-theme]) {
    --expo-ui-background: var(--japanex-surface);
    --expo-ui-foreground: var(--japanex-text);
    --expo-ui-gray-50: var(--japanex-surfaceMuted);
    --expo-ui-gray-100: var(--japanex-surfaceMuted);
    --expo-ui-gray-200: var(--japanex-border);
    --expo-ui-gray-300: var(--japanex-border);
    --expo-ui-gray-500: var(--japanex-secondaryText);
    --expo-ui-gray-900: var(--japanex-text);
  }
`;

export default function RootHtml({ children }: PropsWithChildren) {
  const { bodyAttributes, bodyNodes, htmlAttributes, headNodes } = useServerDocumentContext();

  return (
    <html lang="en" {...htmlAttributes}>
      <head>
        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
        <ScrollViewStyleReset />
        {headNodes}
        <style>{themeCss}</style>
      </head>
      <body {...bodyAttributes}>
        {children}
        {bodyNodes}
      </body>
    </html>
  );
}
