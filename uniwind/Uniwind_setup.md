> ## Documentation Index
>
> Fetch the complete documentation index at: https://docs.uniwind.dev/llms.txt
> Use this file to discover all available pages before exploring further.

# Quickstart

> Start building with Uniwind in 3 minutes!

### Step 1: Install Uniwind and Tailwind

<Check>
  Uniwind only supports **Tailwind 4**.
</Check>

<AccordionGroup>
  <Accordion icon="terminal" title="Installation" defaultOpen>
    <CodeGroup>
      ```bash bun theme={null}
        bun add uniwind tailwindcss
      ```

      ```bash better-t-stack theme={null}
        bun create better-t-stack@latest --template uniwind
      ```

      ```bash create-expo-app theme={null}
        npx create-expo-app -e with-router-uniwind
      ```
    </CodeGroup>

  </Accordion>

  <Accordion icon="css" title="Create global.css file" defaultOpen>
    This file will serve as your CSS entry point.

    ```css lines theme={null}
    @import 'tailwindcss';
    @import 'uniwind';
    ```

    <Info>
      We recommend keeping this file in the root of your project.

      **Location matters!** The location of `global.css` determines your app root - Tailwind will automatically scan for classNames starting from this directory. If you place `global.css` in a nested folder (like `app/global.css`), classNames in other directories won't be detected unless you explicitly include them using the `@source` directive.
    </Info>

  </Accordion>

  <Accordion icon="file-import" title="Import global.css file" defaultOpen>
    Import the CSS file in your `App.tsx` (main component).

    ```tsx  theme={null}
    import './global.css' // <-- file from previous step

    // other imports

    export const App = () => {} // <-- your app's main component
    ```

    <Danger>Don’t import `global.css` in the root `index.ts`/`index.js` file where you register the Root Component, as any change will trigger a full reload instead of hot reload.</Danger>

    ```tsx  theme={null}
    // ‼️ Don't do that
    import './global.css';

    import { registerRootComponent } from 'expo';
    import { App } from './src';  // <- ✅ import it somewhere in the src folder

    registerRootComponent(App);
    ```

  </Accordion>
</AccordionGroup>

### Step 2: Configure bundler

<Tabs>
  <Tab title="Expo (Metro)">
    <AccordionGroup>
      <Accordion icon="train" title="Modify metro.config.js" defaultOpen>
        <Info>If you don't see a `metro.config.js` file in your project, you can create it with `npx expo customize metro.config.js`.</Info>

        ```js lines metro.config.js theme={null}
        const { getDefaultConfig } = require('expo/metro-config');
        const { withUniwindConfig } = require('uniwind/metro'); // [!code ++]

        const config = getDefaultConfig(__dirname);

        // your metro modifications

        module.exports = withUniwindConfig(config, {  // [!code ++:7]
          // relative path to your global.css file (from previous step)
          cssEntryFile: './src/global.css',
          // (optional) path where we gonna auto-generate typings
          // defaults to project's root
          dtsFile: './src/uniwind-types.d.ts'
        });
        ```

        <Info>We recommend placing the `uniwind-types.d.ts` file in the `src` or `app` directory, as it will be automatically included by TypeScript. For custom paths (e.g., root of your project), please include it in your `tsconfig.json`.</Info>
        <Warning>You need to run metro server to generate typings and fix all TypeScript errors.</Warning>

        <Warning>
          **Important:** `withUniwindConfig` must be the **outermost wrapper** in your Metro config. If you use other Metro config wrappers, make sure `withUniwindConfig` wraps them all.

          ```js  theme={null}
          // ✅ Correct - Uniwind wraps everything
          module.exports = withUniwindConfig(
            withOtherConfig(
              withAnotherConfig(config, options),
              moreOptions
            ),
            { cssEntryFile: './src/global.css' }
          );

          // ❌ Wrong - Uniwind is innermost
          module.exports = withOtherConfig(
            withUniwindConfig(config, { cssEntryFile: './src/global.css' }),
            options
          );
          ```
        </Warning>
      </Accordion>
    </AccordionGroup>

  </Tab>

  <Tab title="Bare React Native (Metro)">
    <AccordionGroup>
      <Accordion icon="train" title="Modify metro.config.js" defaultOpen>
        ```js lines metro.config.js theme={null}
        const { getDefaultConfig } = require('@react-native/metro-config')
        const { withUniwindConfig } = require('uniwind/metro'); // [!code ++]

        const config = getDefaultConfig(__dirname);

        // your metro modifications

        module.exports = withUniwindConfig(config, {  // [!code ++:7]
          // relative path to your global.css file (from previous step)
          cssEntryFile: './src/global.css',
          // (optional) path where we gonna auto-generate typings
          // defaults to project's root
          dtsFile: './src/uniwind-types.d.ts'
        });
        ```

        <Info>We recommend placing the `uniwind-types.d.ts` file in the `src` or `app` directory, as it will be automatically included by TypeScript. For custom paths (e.g., root of your project), please include it in your `tsconfig.json`.</Info>
        <Warning>You need to run metro server to generate typings and fix all TypeScript errors.</Warning>

        <Warning>
          **Important:** `withUniwindConfig` must be the **outermost wrapper** in your Metro config. If you use other Metro config wrappers, make sure `withUniwindConfig` wraps them all.

          ```js  theme={null}
          // ✅ Correct - Uniwind wraps everything
          module.exports = withUniwindConfig(
            withOtherConfig(
              withAnotherConfig(config, options),
              moreOptions
            ),
            { cssEntryFile: './src/global.css' }
          );

          // ❌ Wrong - Uniwind is innermost
          module.exports = withOtherConfig(
            withUniwindConfig(config, { cssEntryFile: './src/global.css' }),
            options
          );
          ```
        </Warning>
      </Accordion>
    </AccordionGroup>

  </Tab>

  <Tab title="Vite">
    <AccordionGroup>
      <Accordion icon="bolt" title="Create vite.config.ts" defaultOpen>
        <Badge>Available in Uniwind 1.2.0+</Badge>

        Add Uniwind and Tailwind plugins alongside React Native Web.

        ```ts lines vite.config.ts theme={null}
        import tailwindcss from '@tailwindcss/vite'
        import { uniwind } from 'uniwind/vite'
        import { defineConfig } from 'vite'
        import { rnw } from 'vite-plugin-rnw'

        // https://vite.dev/config/
        export default defineConfig({
            plugins: [
                rnw(),
                tailwindcss(),
                uniwind({
                    // relative path to your global.css file (from previous step)
                    cssEntryFile: './src/global.css',
                    // (optional) path where we gonna auto-generate typings
                    // defaults to project's root
                    dtsFile: './src/uniwind-types.d.ts'
                }),
            ],
        })
        ```

        <Info>
          Point `cssEntryFile` to the CSS file where you import `tailwindcss` and `uniwind`. Keep it at your app root for className scanning.
        </Info>
      </Accordion>
    </AccordionGroup>

  </Tab>
</Tabs>

### Step 3: (Optional) Enable Tailwind IntelliSense for Uniwind

<Tabs>
  <Tab title="VSCode/ Windsurf /Cursor">
    <Accordion icon="cog" title="settings.json">
      1. Open `settings.json` file in your editor
      2. Add the following configuration:

         ```json  theme={null}
         {
             "tailwindCSS.classAttributes": [
                 "class",
                 "className",
                 "headerClassName",
                 "contentContainerClassName",
                 "columnWrapperClassName",
                 "endFillColorClassName",
                 "imageClassName",
                 "tintColorClassName",
                 "ios_backgroundColorClassName",
                 "thumbColorClassName",
                 "trackColorOnClassName",
                 "trackColorOffClassName",
                 "selectionColorClassName",
                 "cursorColorClassName",
                 "underlineColorAndroidClassName",
                 "placeholderTextColorClassName",
                 "selectionHandleColorClassName",
                 "colorsClassName",
                 "progressBackgroundColorClassName",
                 "titleColorClassName",
                 "underlayColorClassName",
                 "colorClassName",
                 "drawerBackgroundColorClassName",
                 "statusBarBackgroundColorClassName",
                 "backdropColorClassName",
                 "backgroundColorClassName",
                 "ListFooterComponentClassName",
                 "ListHeaderComponentClassName"
             ],
             "tailwindCSS.classFunctions": [
                 "useResolveClassNames"
             ]
         }
         ```
    </Accordion>

  </Tab>

  <Tab title="Zed">
    <Accordion icon="cog" title="settings.json">
      1. Open `settings.json` file in your editor
      2. Add the following configuration:

         ```json  theme={null}
             {
               "lsp": {
                 "tailwindcss-language-server": {
                   "settings": {
                     "classAttributes": [
                       "class",
                       "className",
                       "headerClassName",
                       "contentContainerClassName",
                       "columnWrapperClassName",
                       "endFillColorClassName",
                       "imageClassName",
                       "tintColorClassName",
                       "ios_backgroundColorClassName",
                       "thumbColorClassName",
                       "trackColorOnClassName",
                       "trackColorOffClassName",
                       "selectionColorClassName",
                       "cursorColorClassName",
                       "underlineColorAndroidClassName",
                       "placeholderTextColorClassName",
                       "selectionHandleColorClassName",
                       "colorsClassName",
                       "progressBackgroundColorClassName",
                       "titleColorClassName",
                       "underlayColorClassName",
                       "colorClassName",
                       "drawerBackgroundColorClassName",
                       "statusBarBackgroundColorClassName",
                       "backdropColorClassName",
                       "backgroundColorClassName",
                       "ListFooterComponentClassName",
                       "ListHeaderComponentClassName"
                     ],
                     "classFunctions": ["useResolveClassNames"]
                   }
                 }
               }
             }
         ```
    </Accordion>

  </Tab>
</Tabs>

## Next steps

Now that you have your Uniwind project running, explore these key features:

<CardGroup cols={2}>
  <Card title="API documentation" icon="terminal" href="/api/use-uniwind">
    Explore the complete API reference for Uniwind hooks and utilities.
  </Card>

  <Card title="Theming" icon="palette" href="/theming/basics">
    Customize themes, colors, and design tokens for your React Native app.
  </Card>

  <Card title="React Native components" icon="react" href="/components/activity-indicator">
    Style built-in React Native components with Tailwind classes.
  </Card>

  <Card title="3rd party components" icon="code" href="/components/other-components">
    Integrate Uniwind with third-party component libraries.
  </Card>

  <Card title="Monorepos & @source" icon="folder-tree" href="/monorepos">
    Learn how to include components from multiple directories using @source.
  </Card>
</CardGroup>

<Note>
  **Need help?** Start a discussion on [GitHub](https://github.com/uni-stack/uniwind/discussions).
</Note>
