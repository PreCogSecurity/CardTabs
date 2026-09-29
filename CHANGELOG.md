# Changelog

All notable changes to this project are documented in this file.

## [1.1.0] - 2026-09-29

### Security
- A `data-tab` value is now inserted into the link bar with `text()` instead of
  being appended as a string. jQuery parses a string that looks like markup, so
  a tab name such as `<img src=x onerror=...>` was turned into a live element
  and executed. It is now rendered as literal text.
- Tab content is moved into the stack as live DOM nodes instead of being
  round-tripped through `innerHTML`. The old copy/re-parse handed the tab
  content to the HTML parser a second time (a second chance for injected markup
  to execute) and discarded live DOM state, so a value the visitor had typed
  into a form inside a tab was lost on initialization.
- The generated links no longer use `href="javascript:void();"`. They use a
  placeholder `href` whose default action is cancelled, which a strict
  `script-src 'self'` Content Security Policy allows and a `javascript:` URL
  does not.
- ESLint now enables `no-eval`, `no-implied-eval`, `no-new-func`,
  `no-script-url`, `no-proto`, `no-with` and `no-template-curly-in-string`
  across the plugin, tests, build script and demo bootstrap, so these sinks stay
  closed.
- The demo page loads jQuery from its own directory instead of a public CDN,
  drops the third-party GitHub buttons script and the Google Fonts import, and
  ships a `Content-Security-Policy` that allows same-origin scripts only.
- `Dockerfile` gained a health check, and a `.dockerignore` keeps `.git`,
  `node_modules` and coverage output out of the build context.
- CI installs with `npm ci --ignore-scripts`, runs with `permissions:
  contents: read`, and fails on `npm audit --audit-level=high`. Dependabot
  (`dependabot.yml`) proposes weekly updates for the npm dev dependencies and
  for the actions CI uses.
- Added `SECURITY.md` with the vulnerability reporting process.

### Fixed
- The first tab is now shown by the plugin itself instead of relying on the
  stylesheet's `:first-child` rule. That rule matches the first child of the
  stack rather than the first tab, so a container that opened with a heading or
  any other element showed no tab content at all.
- Initializing a selection of several containers no longer collapses them onto
  a single shared bar and stack, which left every container after the first
  without any content.
- The tab nodes are looked up once per container instead of re-scanning the
  stack on every interaction.

### Added
- The generated bar is marked up as a tab widget: `role="tablist"` on the bar,
  `role="tab"` on each link, and an `aria-selected` state kept in step with the
  highlighted link.
- Coverage reporting with a 95% threshold on statements, branches, functions and
  lines, enforced by `npm test` and therefore by CI.
- `npm run verify` runs lint, tests with coverage, the demo build and the
  `docs/` drift check in one command.
- Generated demo copies now carry a `GENERATED FILE - do not edit` banner, and
  the build script reports a clear, actionable error when a source is missing
  instead of an `ENOENT` stack trace.
- More tests: empty containers, leading non-tab content, multiple containers,
  content safety, live form state, and accessibility markup.

### Changed
- `docs/jquery.min.js` is generated from the locked jQuery dev dependency by
  `npm run build:demo`.
- The demo bootstrap moved out of `docs/index.html` into `docs/demo.js` so the
  page needs no inline script.
- README and CONTRIBUTING document the `docs/` mirror, the security invariants
  and the CI checks; the demo is described as a static site.
- `.gitattributes` now marks the generated and vendored files specifically
  instead of marking all of `css/` and `docs/` as vendored.

## [1.0.1] - 2026-09-14

### Fixed
- Tab names containing quotes or special characters no longer break the plugin: `data-tab` values are now compared via filter callbacks instead of string-interpolated CSS attribute selectors.
- The plugin no longer depends on the container's `class` attribute. Containers with multiple classes, no class attribute, or special characters in the class name now work correctly.

### Added
- Automated test suite (Jest + jsdom) covering tab toggling, active-tab detection, theme application, and special-character tab names.
- `package.json` manifest with a committed lockfile for reproducible installs.
- GitHub Actions CI workflow that installs dependencies, runs the test suite, lints, and verifies the `docs/` demo copies stay in sync with the authoritative sources on every push.
- ESLint configuration.
- `Dockerfile` and `docker-compose.yml` to run the demo locally with a single command.
- Demo build script (`npm run build:demo`) that generates the `docs/` copies from `js/` and `css/`.
- `CHANGELOG.md` and `CONTRIBUTING.md`.

## [1.0.0] - 2017

- Initial release.