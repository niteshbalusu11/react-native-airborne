> ## Documentation Index
>
> Fetch the complete documentation index at: https://docs.uniwind.dev/llms.txt
> Use this file to discover all available pages before exploring further.

# Monorepos

> Configure Uniwind to work seamlessly in monorepo setups

## Overview

When working with monorepos or shared component libraries, you may need to include source files from outside your main application directory. Uniwind leverages Tailwind CSS v4's automatic content detection, which intelligently scans your project for class names without manual configuration.

<Info>
  **Not using a monorepo?** This guide also applies to standard projects! If your `global.css` is in a nested folder (like `app/global.css` for Expo Router) and you have components in other directories, you'll need to use `@source` to include them.
</Info>

<Info>
  Tailwind v4 automatically excludes files listed in `.gitignore` and binary file types, so you don't need to worry about scanning `node_modules` or generated files.
</Info>

## Including External Sources

If you're using shared UI components from other packages in your monorepo, you can explicitly include them using the `@source` directive in your `global.css` file.

### Using the @source Directive

Add the `@source` directive to your CSS entry file to include additional directories:

```css global.css theme={null}
@import "tailwindcss";
@import "uniwind";

@source '../packages/ui-components';
@source '../packages/shared-components';
```

<Tip>
  The `@source` directive uses the same smart detection rules as automatic scanning, so it will skip binary files and respect `.gitignore` entries.
</Tip>

## Common Use Cases

### Expo Router with Components Outside App Directory

If you're using Expo Router and your `global.css` is in the `app` directory, but you have components in a separate `components` folder:

```css app/global.css theme={null}
@import "tailwindcss";
@import "uniwind";

/* Include components directory at the root level */
@source '../components';
```

<Tip>
  This is a common setup for Expo Router projects where routes live in `app` but shared components live in `components`.
</Tip>

### Shared Component Library

If your monorepo has a shared UI library that other apps consume:

```css global.css theme={null}
@import "tailwindcss";
@import "uniwind";

/* Include your shared component library */
@source '../../packages/ui-library';
```

### Multiple Package Sources

For complex monorepos with multiple component packages:

```css global.css theme={null}
@import "tailwindcss";
@import "uniwind";

@source '../packages/design-system';
@source '../packages/feature-components';
@source '../packages/marketing-components';
```

### Third-Party UI Libraries

Include custom UI libraries from `node_modules` that aren't automatically detected:

```css global.css theme={null}
@import "tailwindcss";
@import "uniwind";

@source '../node_modules/@my-company/ui-kit';
```

## How Automatic Detection Works

Tailwind v4 (and by extension, Uniwind) automatically discovers template files in your project using intelligent heuristics:

1. **Respects .gitignore** - Files in `.gitignore` are automatically excluded
2. **Skips binary files** - Images, videos, archives, and other binary formats are ignored
3. **Scans relevant files** - Focuses on source files where className attributes are likely to appear

<Info>
  **Important:** The `cssEntryFile` path in your `metro.config.js` determines the app root. Tailwind scans for classNames starting from the directory containing your `global.css` file. Files outside this directory require the `@source` directive.
</Info>

<Info>
  In most cases, you won't need to configure anything. Automatic detection works out of the box for standard project structures.
</Info>

## When to Use @source

You typically only need the `@source` directive when:

- Your `global.css` is in a nested folder and you have components in sibling or parent directories (common with Expo Router)
- Using shared components from other packages in a monorepo
- Consuming a custom UI library that's outside your main app directory
- Working with Yarn/pnpm workspaces where packages are symlinked
- Including components from a private npm package that contains Uniwind classes

<Tip>
  If your components are already within your app directory or workspace, you don't need `@source` - automatic detection handles it.
</Tip>

## Troubleshooting

### Classes Not Being Detected

If classes from your shared library or components aren't being detected:

1. **Check your `cssEntryFile` path** in `metro.config.js` - make sure it points to the correct `global.css` location
2. Verify the path in your `@source` directive is correct and relative to your `global.css` file
3. Check that the files aren't excluded by `.gitignore`
4. Ensure the source directories contain actual source files, not just compiled JavaScript
5. Restart your Metro bundler after adding `@source` directives

### Performance Concerns

If build times increase after adding `@source`:

- Make sure you're not accidentally including large directories like `node_modules`
- Verify your `.gitignore` is properly configured to exclude build artifacts
- Only include specific package directories rather than entire workspace roots

## Related

<CardGroup cols={2}>
  <Card title="Quickstart" icon="laptop" href="/quickstart">
    Set up Uniwind in your React Native project
  </Card>

  <Card title="Global CSS" icon="css3" href="/theming/global-css">
    Learn more about configuring your global.css file
  </Card>

  <Card title="Metro Config" icon="train" href="/api/metro-config">
    Configure Metro bundler for Uniwind
  </Card>
</CardGroup>
