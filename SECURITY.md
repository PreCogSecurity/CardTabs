# Security Policy

## Supported versions

Security fixes land on the latest released version. Older versions are not
patched; upgrade to the newest release before reporting an issue against them.

| Version | Supported |
| ------- | --------- |
| 1.1.x   | yes       |
| 1.0.x   | no        |

## Reporting a vulnerability

Please use **GitHub's private vulnerability reporting** for this repository
(*Security* tab → *Report a vulnerability*). That opens a private advisory that
only the maintainers can see, which is the right channel for anything with an
exploit path.

Please include the CardTabs version, the jQuery version, a minimal HTML snippet
that reproduces the problem, and what an attacker gains.

Please do not open a public issue for an unfixed vulnerability, and please give
the maintainers a reasonable window to ship a fix before disclosing publicly.

## What the library guarantees

CardTabs renders author-supplied `data-tab` values, so these properties are
treated as invariants and are covered by the test suite:

- A `data-tab` value is inserted with `text()`, never as markup. A value such
  as `<img src=x onerror=...>` renders as literal text and cannot execute.
- Tab content is moved into the stack as existing DOM nodes. It is never
  round-tripped through `innerHTML`, so it is not re-parsed and live state
  (typed form values, focus, scroll position) survives initialization.
- Tab names are compared as data, never interpolated into a CSS selector, so
  quotes and other special characters in a tab name are safe.
- The generated links use a placeholder `href` with the default action
  cancelled. The plugin never emits a `javascript:` URL, and `eslint
  no-script-url` fails the build if one is introduced.
- The plugin runs no `eval`, no `new Function` and no inline script, so it
  works under a `script-src 'self'` Content Security Policy. The bundled demo
  ships such a policy.

## Dependency hygiene

- `package-lock.json` is committed, so installs are reproducible.
- CI installs with `npm ci --ignore-scripts` and fails on
  `npm audit --audit-level=high`.
- Dependabot proposes weekly updates for the npm dev dependencies and for the
  GitHub Actions used by CI; every proposal goes through the same tests,
  coverage gate and lint.

## Reporting a non-security bug

Open a regular issue; see [CONTRIBUTING.md](CONTRIBUTING.md).
