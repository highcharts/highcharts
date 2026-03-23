# Agent Instructions for Highcharts Tests

This document provides context for AI agents working on the Highcharts tests.

## Test System Overview

Highcharts uses two test systems for TypeScript/modern tests:

1. **Node.js native tests** (`test/ts-node-unit-tests/tests/`) - For pure unit tests that don't require a browser
2. **Playwright tests** (`tests/`) - For browser-dependent tests that require DOM access

## Key Directories

| Directory | Purpose |
|-----------|---------|
| `test/ts-node-unit-tests/tests/` | Node.js native tests (unit tests) |
| `tests/` | Playwright tests (browser tests) |

## Decision Criteria: Node.js vs Playwright

### Use Node.js (`test/ts-node-unit-tests/tests/`) when:
- Test doesn't require DOM access
- Test doesn't require browser APIs (fetch with credentials, canvas, etc.)
- Test is pure logic/data manipulation
- Examples: Formula parsing, data modifiers, connectors with static data, serialization helpers

### Use Playwright (`tests/`) when:
- Test requires DOM manipulation (`document.createElement`, etc.)
- Test requires browser rendering (charts, grids, components)
- Test requires network requests with browser context
- Test requires canvas/WebGL
- Examples: HTMLTableConnector (parses DOM), Grid tests, Dashboard components, visual tests

## Running Tests

```bash
# Node.js tests
npm run test-node

# Playwright tests
npx playwright test --project=<project-name>

# Lint tests (run from repo root)
npx --workspace tests eslint
```

## File Organization

### Directory Structure Guidelines

The `tests/highcharts/` folder **always uses subfolders** to organize tests by feature area. This mirrors the structure in `samples/unit-tests/`.

```
tests/
├── dashboards/           # Product folder (flat structure OK)
│   ├── components.spec.ts
│   ├── layout.spec.ts
│   └── ...
└── highcharts/           # Product folder (ALWAYS use subfolders)
    ├── boost/
    │   └── boost.spec.ts
    ├── chart/
    │   └── chart.spec.ts
    ├── globals/
    │   └── globals.spec.ts
    ├── series/
    │   └── series-marker-clusters.spec.ts
    └── ...
```

### Rules for `tests/highcharts/`:
- **Always** place tests in a subfolder named after the feature area
- Follow the naming conventions from `samples/unit-tests/` (e.g., `chart/`, `series/`, `axis/`, `boost/`)
- No loose `.spec.ts` files at the `highcharts/` root level

### Rules for `tests/dashboards/`:
- Keep flat structure until there are more than ~8 test files
- Then organize into subfolders by component type

## Migration Patterns

See the [migrations.md](./migrations.md) file for detailed patterns including:
- Import path transformations
- QUnit to node:test conversions
- Assertion mappings
- Async handling
- Common pitfalls (sparse arrays, formula parsing flags)

## Keeping Documentation Updated

**Important:** When working on tests, always keep these documentation files up to date:

### After adding a new test file:
1. Update `tests/migrations.md` if you discover new patterns or pitfalls

2. Ensure tests are properly organized:
   - `tests/highcharts/` must use subfolders
   - `tests/dashboards/` can stay flat until >8 files

### After adding a new route to fixtures.ts:
1. Update the "Default Rewrites" table in `tests/README.md` to document the new route pattern

### After completing a major milestone:
1. Update this file (`tests/agents.md`) if:
   - Decision criteria change
   - New directories are added
   - New commands are needed

### Example workflow:
```bash
# After adding a new test
# 1. Run tests to verify: npm run test-node && npx playwright test
# 2. Update migrations.md if new patterns discovered
```
