# Changelog

## Unreleased

### Bug Fixes

- Added handling for "Reference does not exist" error during rebasing to prevent action failures when a reference (branch or commit) no longer exists

## v0.2.0 (2025-08-05)

### Dependencies Updated

-   Updated Node.js runtime from node12 to node20 in action.yml
-   Updated @actions/core from 1.2.6 to 1.10.1
-   Updated @actions/exec from 1.0.4 to 1.1.1
-   Kept @actions/github at 2.2.0 to maintain compatibility
-   Updated @octokit/types from 4.1.5 to 4.1.10
-   Kept @octokit/webhooks at 7.6.2 to maintain compatibility
-   Replaced @zeit/ncc with @vercel/ncc 0.38.1
-   Updated typescript from 3.9.3 to 3.9.10
-   Updated all dev dependencies to their latest compatible versions:
    -   @typescript-eslint/eslint-plugin from 3.1.0 to 3.10.1
    -   @typescript-eslint/parser from 3.1.0 to 3.10.1
    -   eslint from 7.1.0 to 7.32.0
    -   eslint-config-prettier from 6.11.0 to 6.15.0
    -   husky from 4.2.5 to 4.3.8
    -   jest from 26.0.1 to 26.6.3
    -   jest-each from 26.0.1 to 26.6.2
    -   lint-staged from 10.2.8 to 10.5.4
    -   prettier from 2.0.5 to 2.8.8
    -   ts-jest from 26.1.0 to 26.5.6

### Code Changes

-   Modified the payload type in index.ts to use a more specific interface instead of relying on the specific WebhookPayloadPush type from @octokit/webhooks
-   Fixed linting errors by replacing the `any` type with a more specific `RepositoryPayload` interface

### Test Fixes

-   Updated Jest configuration to handle Node.js built-in modules with 'node:' prefix
-   Added mocks for problematic dependencies (@fastify/busboy, undici, stream) to fix test failures
-   Fixed unhandled promise rejection in rebaser tests by initializing with a resolved promise
-   All tests now pass successfully (33 tests across 5 test suites)
