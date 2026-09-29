# Contributing

Thanks for considering a contribution to CardTabs.

## Development setup

1. Clone the repository.
2. `npm ci` — installs exactly what `package-lock.json` pins. Use this rather
   than `npm install` so your tree matches CI's.
3. `npm run verify` — lints, runs the tests with the coverage gate, rebuilds the
   demo and fails if `docs/` drifted. This is the same sequence CI runs, so a
   green `verify` locally means a green build.

Individual steps, if you want them separately:

```bash
npm run lint
npm test
npm run build:demo
```

Node.js 18 or higher is required; CI uses Node 20 (see `.nvmrc`).

## Making changes

- The authoritative plugin source lives in `js/jquery.cardtabs.js`. Add or
  update tests in `tests/` for any behavior change, in the same commit.
- Run `npm run verify` before opening a pull request.
- Keep commits scoped to one behavior change plus its test, so a reviewer can
  read the code and the proof that it works side by side.
- The plugin targets ES5 and jQuery 1.2+, so no `let`, `const`, arrow functions
  or `Array.prototype` methods in `js/`. `npm run lint` enforces the syntax level.

## Why `docs/` mirrors `js/`

`docs/` is the GitHub Pages site. GitHub Pages serves the `docs/` directory of
the default branch directly from the repository and has no build step, so the
site cannot import `js/jquery.cardtabs.js` from the repository root.

Rather than maintain a second, hand-edited copy of the plugin inside `docs/`
(which drifts silently and ships code that was never tested), `docs/` holds
generated copies produced by `scripts/build-demo.js` from the authoritative
sources in `js/` and `css/`:

```
js/jquery.cardtabs.js   ->  docs/jquery.cardtabs.js
css/jquery.cardtabs.css ->  docs/jquery.cardtabs.css
node_modules/jquery/dist/jquery.min.js -> docs/jquery.min.js
```

The consequences are deliberate:

- The generated files carry a `GENERATED FILE - do not edit` banner. Change the
  source, then run `npm run build:demo`.
- CI regenerates them and runs `git diff --exit-code -- docs/`, so a stale or
  hand-edited copy fails the build instead of shipping.
- `docs/jquery.min.js` is copied byte for byte from the jQuery version pinned in
  `package-lock.json`. The demo therefore loads no third-party asset and makes
  no request to a CDN.
- Only `docs/index.html` and `docs/demo.js` are hand-written demo code, and both
  are linted.

## Security invariants

These properties of the plugin are treated as bugs when they regress, and the
test suite in `tests/` pins each one:

- Tab names are inserted as text, never as markup.
- Tab content is moved as DOM nodes, never re-parsed through `innerHTML`.
- Tab names are compared as data, never interpolated into a CSS selector.
- No `javascript:` URL, `eval`, `new Function` or inline script.

If a change needs to break one of these, open an issue and say why before
writing the code.

## Reporting issues

Please include the jQuery version, the browser (if relevant), and a minimal HTML
snippet that reproduces the problem.

Report vulnerabilities privately instead — see [SECURITY.md](SECURITY.md).
