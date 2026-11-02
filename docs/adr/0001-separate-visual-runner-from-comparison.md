# Separate the visual-test runner from the visual comparison system

**Status:** accepted

Playwright replaces Karma as the visual-test runner — owning spec execution and
browser automation — while Highcharts' existing visual comparison system remains
the sole authority for reference rendering storage, pixel-diff semantics,
reporting, and artifacts.

## Context

Highcharts' visual comparison system defines fixed semantics: reference
renderings are regenerated from `master`, candidate renderings are produced from
the revision under test, both are prepared via canonical SVG processing and
rasterized to 600 × 400, and each outcome is classified as a numeric visual
difference, a sample execution error, or a terminal run error. The completion
signal guards against hidden terminal run errors.

Karma's browser lifecycle management has become a throughput bottleneck. Playwright
provides superior browser automation and parallel execution, making it a natural
replacement for the runner role. However, the runner and the comparison system are
separable concerns.

## Decision

The visual-test runner and the visual comparison system are treated as distinct
bounded roles with a hard boundary between them:

- **Visual-test runner** (Playwright): spec execution, browser automation,
  rendering capture, and completion signal emission.
- **Visual comparison system** (existing): reference rendering authority,
  canonical SVG preparation, 600 × 400 rasterization, exact pixel-count diff,
  outcome classification, reporting, and artifacts.

The comparison system's behavior is extracted into runner-neutral logic and
adapters so that Playwright can invoke it without coupling to Karma internals.
Browser selection is an operational choice and not part of this boundary decision.

## Considered options

**Playwright-native `toMatchSnapshot()` / `toHaveScreenshot()` as visual authority**
— rejected. PR #24071 demonstrated that native snapshots combined with a custom
comparator create dual authorities with incompatible baselines, outcome
classification, and reporting behavior. It would also break attribution continuity
with the existing reference renderings.

## Consequences

- Retaining the visual comparison system requires extracting its runner-neutral
  behavior and writing adapters — more initial work than a clean-slate approach.
- The established outcome classes (numeric visual difference, sample execution
  error, terminal run error) and their reporting remain unchanged, preserving
  existing tooling and artifact contracts during any Karma–Playwright overlap
  period.
- Future runner changes (browser, parallelism strategy, CI integration) are
  isolated to the runner role and do not require changes to comparison semantics.
