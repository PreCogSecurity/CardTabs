
# [CardTabs](https://cardtabs.js.org)
CardTabs is yet another ultra-light jQuery plugin that allows for very simple tabs. The usage is explained below, click [here](https://cardtabs.js.org) for a demo. CardTabs is licensed under MIT.

## Requirements
* jQuery 1.2 or higher

## Simple usage

Make sure that jQuery is loaded. Get a hold of `js/jquery.cardtabs.js` and `css/jquery.cardtabs.css` by cloning the repo or downloading the [latest release](https://github.com/PreCogSecurity/CardTabs/releases), and add them to your page:

```html

<link rel='stylesheet' href='assets_path/css/jquery.cardtabs.css'>
<script type='text/javascript' src='assets_path/js/jquery.cardtabs.js'></script>

```

CardTabs has no runtime dependencies of its own: jQuery is a peer dependency
(`>=1.2`) and the package installs nothing else.

### HTML 

The html is very simple. There is one container, with the actual tabs as divs, the `data-tab` attribute has to contain their name. The links on the top are automatically generated.



```html
<div class='container'>
    <div data-tab="Tab one">
    	/* contents of the first tab...  */
    </div>
    <div data-tab="Tab two">
        /* contents of the second tab...  */
    </div>
    <div data-tab="Tab three">
        /* contents of the third tab...  */
    </div>
</div>

```

### JavaScript

Use the following code to initialize the tabs.

```html
<script type='text/javascript'>
$('.container').cardTabs();
</script>
```

If the selection matches more than one container, each one is initialized
separately, so `$('.container').cardTabs()` is safe to use on a page with
several independent tab groups.

The generated bar is marked up as a tab widget (`role="tablist"` on the bar,
`role="tab"` plus a maintained `aria-selected` on each link), so screen readers
announce the same tab that the stylesheet highlights.

## Options

### Manually set the active tab
It is very simple to load another tab as the active tab. Just give that tab `active` as class:

```html
<div class='active' data-tab='Active tab'></div>
```

### Themes
Some themes are included in card tabs, to use them they have to be defined in the javascript, like this:

```html
$('.container').cardTabs({'theme': 'inset'});
```

## Creating themes

Themes are applied by a single css class (the theme name) on the generated elements. Making your own compatible theme is thus not that hard. You just need to style these elements: `div.card-tabs-bar.yourthemename` (the link bar), `div.card-tabs-bar.yourthemename a` (a link in the link bar), `div.card-tabs-bar.yourthemename a.active` (the active tab in the bar) and `div.card-tabs-stack.yourthemename div[data-tab]` (the shown tab itself).

```css

div.card-tabs-bar.yourthemename{ /* the link bar */
    
}

div.card-tabs-bar.yourthemename a { /* A link in the link bar */

}

div.card-tabs-bar.yourthemename a.active  { /* The active tab link */ 

}

div.card-tabs-stack.yourthemename div[data-tab] { /* The shown tab itself */

}

```

Your theme can be loaded like this then:

```html
$('.container').cardTabs({'theme': 'yourthemename'});
```

## Security

CardTabs renders `data-tab` values supplied by the page, so the plugin is
written to keep them inert:

- A tab name is inserted as **text**, never as markup. A value such as
  `<img src=x onerror=alert(1)>` renders as literal text in the bar.
- Tab content is **moved** into the stack as live DOM nodes. It is never
  re-serialized through `innerHTML`, so it is not re-parsed and values the
  visitor has already typed into a form inside a tab survive initialization.
- Tab names are compared as data, never interpolated into a CSS selector.
- The generated links use a placeholder `href` whose default action is
  cancelled. No `javascript:` URL is ever emitted, and the `no-script-url` lint
  rule fails the build if one is introduced.
- The plugin uses no `eval`, no `new Function` and no inline script, so it runs
  under a `script-src 'self'` Content Security Policy. The bundled demo ships
  exactly such a policy and loads no third-party asset.

See [SECURITY.md](SECURITY.md) for the vulnerability reporting process and the
dependency hygiene guarantees.

## Development

### Requirements
* Node.js 18 or higher (Node 20 is used in CI, see `.nvmrc`)

### Setup

```bash
npm ci
```

`npm ci` installs exactly what `package-lock.json` pins, so everyone and CI get
the same dependency tree. It needs network access the first time; after that the
tree is cached locally.

### Test

```bash
npm test
```

Runs the Jest test suite (jsdom-based) with coverage. It covers tab toggling,
active-tab detection, theme application, multiple and empty containers, tab
names with special characters, content-safety invariants, and the accessibility
markup. The run fails if coverage drops below the 95% threshold configured in
`package.json`, so a new branch without a test cannot be merged quietly.

### Lint

```bash
npm run lint
```

ESLint covers the plugin, the tests, the build script and the demo bootstrap.
Besides the correctness rules, the config enables the injection sinks
(`no-eval`, `no-implied-eval`, `no-new-func`, `no-script-url`, `no-proto`,
`no-with`) across all of them.

### Everything at once

```bash
npm run verify
```

Lint, test with coverage, rebuild the demo, and fail if `docs/` is out of sync —
the same sequence CI runs.

### Demo

The `docs/` directory is the GitHub Pages demo site. It is a static site, not
part of the published npm package:

```
docs/index.html          the demo page
docs/demo.js             the demo bootstrap
docs/jquery.cardtabs.js  generated from js/jquery.cardtabs.js
docs/jquery.cardtabs.css generated from css/jquery.cardtabs.css
docs/jquery.min.js       generated from the locked jquery dev dependency
```

Everything marked "generated" is produced from the authoritative sources:

```bash
npm run build:demo
```

CI regenerates the copies and fails if the committed ones are out of sync, so
the demo always ships exactly the tested code. The generated files carry a
`GENERATED FILE` banner; edit the source, never the copy.

### Serve the static demo locally

Any static file server works, for example:

```bash
npx --yes serve docs
```

Or with Docker, if you prefer to run it in a container:

```bash
docker compose up --build
```

Then open http://localhost:8080.

## CI

`.github/workflows/ci.yml` runs four required checks on every push and pull
request:

| Check | What it enforces |
| ----- | ---------------- |
| Dependency audit | `npm ci --ignore-scripts` and `npm audit --audit-level=high` |
| Tests and coverage | `npm test`, including the 95% coverage gate |
| Lint | `npm run lint` |
| Demo is in sync | `npm run build:demo` leaves no diff in `docs/` |

The workflow runs with `permissions: contents: read`, and Dependabot
(`.github/dependabot.yml`) opens weekly pull requests for the npm dev
dependencies and for the actions CI uses.

## Architecture

```
js/jquery.cardtabs.js   The plugin (single file, no build step, ES5)
css/jquery.cardtabs.css The default styles and included themes
docs/                   GitHub Pages static demo site
tests/                  Jest + jsdom test suite
scripts/build-demo.js   Copies the authoritative sources into docs/
eslint.config.js        One ESLint flat config for all four source sets
```

The plugin is a single jQuery extension (`jQuery.fn.cardTabs`) with no runtime
dependencies beyond jQuery 1.2+. It reads `div[data-tab]` children of the
container, generates a link bar (`.card-tabs-bar`) and a content stack
(`.card-tabs-stack`), and toggles visibility on link clicks. The tab nodes are
looked up once per container, so switching tabs does not re-scan the DOM. Tab
values are compared with filter callbacks rather than string-built CSS
selectors, so tab names containing quotes or other special characters are safe.

## Changelog

See [CHANGELOG.md](CHANGELOG.md).

## Upstream

CardTabs was created by Thomas de Roo and is released under the MIT license
(see [LICENSE](LICENSE)). This repository continues that work; the original
project is at [blekerfeld/CardTabs](https://github.com/blekerfeld/CardTabs),
which is credited in the source header.

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md).
