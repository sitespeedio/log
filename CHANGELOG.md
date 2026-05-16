# sitespeed.io log changelog (we do [semantic versioning](https://semver.org))

## 2.0.0 - 2026-05-16
### Breaking
* Require Node.js 22 or later [#9](https://github.com/sitespeedio/log/pull/9). Dropped Node 20.

### Fixed
* Log messages containing `$1`, `$&`, `$$` and similar tokens are now emitted verbatim instead of being mangled as regex backreferences [#8](https://github.com/sitespeedio/log/pull/8).
* `%d` placeholder now consistently returns a string.
* Corrected a "Could create the log message" fallback message that was missing the word "not".
* Pinned GitHub Action versions to SHAs [#7](https://github.com/sitespeedio/log/pull/7).
* Refreshed dev tooling (ava, eslint, prettier and plugins) and migrated to native eslint flat config [#10](https://github.com/sitespeedio/log/pull/10).
* Rewrote the README with install, usage, log levels, configuration and placeholder reference [#10](https://github.com/sitespeedio/log/pull/10).

## 1.0.0 - 2025-10-16
### Breaking
* Removed color coding [#5](https://github.com/sitespeedio/log/pull/5). Errors will now have default output color instead of red.

### Fixed
* Update dependencies [#4](https://github.com/sitespeedio/log/pull/4).

## 0.2.6 - 2025-01-28
### Fixed
* 0.2.5 release was broken.

## 0.2.5 - 2025-01-28
### Fixed
* Fix so both .warn and .warning works [#3](https://github.com/sitespeedio/log/pull/3).

## 0.2.4 - 2025-01-10
### Fixed
* Better safe than sorry: try/catch when logging.

## 0.2.2 - 2025-01-07
### Fixed
* Fixed another mapping log level problem.

## 0.2.1 - 2025-01-07
### Fixed
* Fixed log levels.

## 0.2.0 - 2025-01-07
### Added
* Add warning method.

## 0.1.0 - 2025-01-07
### Added
* You can now set a specific log level (for example log only ERRORS and above) [#1](https://github.com/sitespeedio/log/pull/1).

## 0.0.2 - 2025-01-06
* This is the first release, setting up the basic functionality.