# Changelog

All notable changes to this project are documented in this file.

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