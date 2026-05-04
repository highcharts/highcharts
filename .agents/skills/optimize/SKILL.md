---
name: optimize
description: Optimize Highcharts code for runtime performance and file-size impact while preserving behavior and API compatibility.
---

# Highcharts Optimize

Use this skill when code is slow, memory-heavy, or larger than necessary.

## Steps

1. Profile and locate hot paths.
2. Apply minimal fixes with unchanged behavior/API.
3. Add or update regression tests.
4. Validate with relevant tests.

## Focus areas

- Merge redundant iterations; avoid O(n^2) loops on data points.
- Reduce redraw/reflow triggers and repeated expensive calculations.
- Reuse SVG/DOM elements when possible; avoid repeated `attr()` churn.
- Cache hot-loop option lookups and computed values.
- Remove dead code and unnecessary imports to reduce size.
- Ensure cleanup in destroy paths to avoid leaks.

## Output format

For each optimization:

- What changed
- Where: `path:line`
- Impact
- Trade-off
