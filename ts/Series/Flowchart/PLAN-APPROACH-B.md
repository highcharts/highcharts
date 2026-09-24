# Execution plan — Approach B: neutralise the inert inherited API

> ## STATUS: EXECUTED
>
> All of B1–B5 landed. Results:
>
> | Phase | Outcome |
> |---|---|
> | B1.1 `layoutAlgorithm` out of merged defaults | done — `plotOptions.flowchart` went 25 → 24 top-level keys |
> | B1.2 `deferLayout()` no-op | done, landed before B1.1 as planned |
> | B1.3 types | done, variant **(a)** `Omit<…, 'layoutAlgorithm'>`; no `.d.ts` trouble |
> | B2.1 `events?: SeriesEventsOptions` | done |
> | B2.2 + B3 doc exclusions | done — **and empirically confirmed to resolve** |
> | B4 `fixedDraggable` comment, `forces: void 0` | done |
> | B5 tests | done — new `Flowchart inert simulation options` case |
>
> **The §3 open question is resolved: nested `@excluding` works.** Generated
> api-docs for the narrow tree show `series.networkgraph.events` containing
> `afterSimulation` while `series.flowchart.events` does not, and
> `series.networkgraph.nodes` containing `mass` while `series.flowchart.nodes`
> does not (it gains `shape` instead). `layoutAlgorithm` is absent from
> `plotOptions.flowchart` entirely — no child, no nav file.
>
> **§6.3 step 2 turned out to be unnecessary.** Rather than the >20 min full
> `gulp jsdoc-options`, running the jsdoc plugin over a narrow glob (151 files:
> `Core/Series`, `Core/Renderer`, `Series/Line`, `Series/Networkgraph`,
> `Series/Flowchart`, plus the two compositions) and then calling
> `ApiDocs(tree, out, ['highcharts'])` on the result gave the same answer in
> about two minutes. Worth reusing for any future doclet change. Note it
> overwrites the root `tree.json` (gitignored) — back it up and restore.
>
> Verification run: `tsc` clean; `eslint` clean; `gulp scripts` clean;
> flowchart + networkgraph + packedbubble QUnit suites all pass (7 files);
> `npm run test:webpack` passes; all three samples render with arrows,
> waypoints, reversed links and labels intact.
>
> **Deviation from plan:** step 0 (baseline sample SVG capture) was skipped.
> None of B's changes can affect rendering — an inert default removed, an
> unreachable method made explicit, an inert prototype property cleared, plus
> type and doclet changes — and the QUnit layered-position assertions cover the
> layout. The samples were rendered afterwards to confirm no page errors, but
> there is no before/after pixel diff.
>
> Two findings for the open-questions list, not acted on:
> 1. `legendSymbol` **is** present in the generated `plotOptions.flowchart`
>    docs while absent from the runtime merge — independent confirmation of
>    [OPTIONS-DEEP-DIVE §1](OPTIONS-DEEP-DIVE.md). Still networkgraph's to fix.
> 2. `plotOptions.networkgraph.events` never carried `afterSimulation` (it is
>    only declared under `series.*`), so the `plotOptions.flowchart.events`
>    exclusion is harmless but redundant. Left in for symmetry with the
>    `series.*` doclet; drop it if that reads as noise.

> **Temporary plan document.** Approach B from
> [DISCONNECT-FROM-NETWORKGRAPH.md](DISCONNECT-FROM-NETWORKGRAPH.md) §3, with
> the inert surface catalogued in [OPTIONS-DEEP-DIVE.md §5](OPTIONS-DEEP-DIVE.md).
> Delete once executed.

**Goal.** Stop `flowchart` from advertising options it cannot honour, without
touching `networkgraph` and without deciding the structural question. Nothing
here is wasted if the series is later disconnected (C/D) — every change is a
deletion from flowchart's own surface.

**Premise:** `modules/networkgraph` is not modified. If a fix belongs in
networkgraph, it is out of scope by definition (see §7).

---

## 0. Findings that shape the plan

Four things I checked before writing this, because they change what B costs:

1. **`layoutAlgorithm` is already excluded from the docs.** The
   `@excluding` list in `FlowchartSeriesDefaults.ts` and
   `FlowchartSeriesOptions.ts` already names it. B's work on it is *runtime and
   types*, not docs.

2. **Only two places read `options.layoutAlgorithm` on this code path**
   (`grep` over `ts/`): `NetworkgraphSeries.deferLayout()` — never called — and
   `SimulationSeriesUtilities.initDataLabelsDefer()` line 37, which
   optional-chains it (`this.options.layoutAlgorithm?.enableSimulation`).
   Removing the default is therefore safe. `PackedBubbleSeries`,
   `TreemapSeries` and `MarkerClusterScatter` also read a `layoutAlgorithm`,
   but they are unrelated series with their own option.

3. **`fixedDraggable` is undocumented everywhere.** It exists only as
   `DragNodesSeriesOptions.fixedDraggable` and its single reader in
   `DragNodesComposition.onMouseUp`. It is not on `FlowchartSeriesOptions`
   (it lives on `DragNodesSeriesOptions`, which is not in the options
   inheritance chain) and has no doclet in the repo. **There is nothing to
   exclude** — this reduces to a code comment. The pro/con doc overstated it.

4. **Nested `@excluding` is mechanically supported.** In
   `@highcharts/highcharts-documentation-generators/api-docs/lib/index.js`, the
   `merge()` walker reads `node.doclet.exclude` on *every* node, clones
   `@extends` children first, then deletes children by name — so an
   `@excluding` on a child node removes grandchildren. But the exclusion is
   resolved at **api-docs build time**, not when `tree.json` is written, so
   verifying it end-to-end costs a full docs build (§6.3).

Also relevant: `tree.json` is gitignored (`.gitignore:37 /tree*`), so
regenerating it produces no repo churn.

---

## 1. Scope

### In

| # | Target | Level |
|---|---|---|
| B1 | `layoutAlgorithm` (+ 11 sub-options) | runtime defaults, types |
| B2 | `events.afterSimulation` | types, docs |
| B3 | `nodes[].mass` | types, docs |
| B4 | `fixedDraggable`, `forces` | code comment / cosmetic |
| B5 | Regression tests for all of the above | tests |

### Out, deliberately

- **`legendSymbol`** — networkgraph's `@extends plotOptions.line` doclet not
  matching its runtime merge of `Series.defaultOptions`. Fixing it means
  touching networkgraph. File as a separate issue.
- **`states.inactive.linkOpacity`** — deprecated alias owned by networkgraph.
- **Generic inert `Series` options** (`lineWidth`, `turboThreshold`, `crisp`,
  `findNearestPointBy`, `pointRange`) — inert for *every* node-graph series,
  including networkgraph. Not flowchart's to exclude.
- **New options** (`node.padding`, `minWidth`/`minHeight`). B is subtractive
  only; adding API is a separate decision that should wait for the C/D call.

---

## 2. Phase B1 — `layoutAlgorithm`

### B1.1 Runtime: keep it out of the merged defaults

`FlowchartSeries.ts` currently does:

```ts
public static defaultOptions = merge(
    NetworkgraphSeries.defaultOptions,
    FlowchartSeriesDefaults
);
```

Change to a module-scope filtered copy, above the class:

```ts
// `layoutAlgorithm` configures the force simulation this series never runs
// (see `deferLayout` below). Dropping it here keeps it out of
// `getOptions().plotOptions.flowchart`, so it is not offered as the handle
// for influencing a layout it cannot influence.
//
// `merge` with a single argument returns a deep copy, so the delete cannot
// reach `NetworkgraphSeries.defaultOptions` itself.
const inheritedDefaults = merge(NetworkgraphSeries.defaultOptions);
delete inheritedDefaults.layoutAlgorithm;
```

then `defaultOptions = merge(inheritedDefaults, FlowchartSeriesDefaults)`.

**The one correctness rule:** it must be the `merge()` copy that is mutated,
never `NetworkgraphSeries.defaultOptions`. `merge(x)` starts from a fresh `{}`
and deep-copies, so a top-level `delete` on the result is safe — but this is
the single change in B that could break another series, so B5.1 asserts it
directly.

### B1.2 Make the invariant explicit

Removing the default leaves a latent trap: `NetworkgraphSeries.deferLayout()`
reads `layoutOptions.type` **without a guard**, so it would now throw rather
than silently no-op if it were ever reached. It is unreachable today only
because `translate()` is fully replaced — an implicit invariant that a future
edit could break.

Convert it to an explicit one — override in `FlowchartSeries`:

```ts
/**
 * A flowchart computes its positions itself in `translate()`, so there is no
 * graph layout to defer to and no `layoutAlgorithm` to read. Overridden as a
 * no-op rather than left unreachable, so a future `super.translate()` cannot
 * quietly reintroduce a simulation.
 * @internal
 */
public deferLayout(): void {
    // Intentionally empty.
}
```

This is what makes B1.1 safe to land, and it is cheap. Do not skip it.

### B1.3 Types

In `FlowchartSeriesOptions.ts`, stop inheriting the option. Two variants —
**prefer (a)**, fall back to (b):

- **(a)** `extends Omit<NetworkgraphSeriesOptions, 'layoutAlgorithm'>`.
  Cleanest, and the same mechanism handles B2/B3. Risk: `Omit` produces a
  mapped type rather than an interface, which may affect what `gulp jsdoc-dts`
  emits and whether `declare module` merging elsewhere still resolves. Verify
  per §6.2 before committing to it.
- **(b)** keep `extends NetworkgraphSeriesOptions` and add
  `layoutAlgorithm?: undefined;`. Narrowing to `undefined` is a legal
  interface narrowing and makes `layoutAlgorithm: {...}` a compile error, with
  no change to the interface's shape. Lower risk, slightly uglier.

Note honestly in the doclet either way: **removing the default does not make
the option impossible to set.** A user who writes `layoutAlgorithm: {...}` in
JS still gets it on `series.options`; it is simply inert and no longer
advertised. Silently deleting user-supplied options would be worse than
leaving them inert.

---

## 3. Phase B2 — `events.afterSimulation`

Fired only by `ReingoldFruchtermanLayout` (line 233). Can never fire here.

### B2.1 Types

On `FlowchartSeriesOptions`:

```ts
events?: SeriesEventsOptions;
```

**Not** `Omit<NetworkgraphEventsOptions, 'afterSimulation'>`.
`NetworkgraphEventsOptions extends SeriesEventsOptions` and adds *only*
`afterSimulation`, so the `Omit` is structurally identical to
`SeriesEventsOptions` — it would import a type purely to subtract the one
reason that type exists. `SeriesOptions` already declares
`events?: SeriesEventsOptions` (`SeriesOptions.ts:723`), so naming the base
directly reads as what it is: networkgraph widened the base declaration,
flowchart restores it.

The `Omit` form is also future-proof in the wrong direction. If networkgraph
later adds a second simulation event, `Omit<…, 'afterSimulation'>` silently
inherits it and flowchart starts advertising another event that cannot fire.
`SeriesEventsOptions` excludes it automatically.

Verified: `SeriesEventsOptions` has no index signature, so excess-property
checking does fire on an options literal; and it is assignable to
`NetworkgraphEventsOptions` (the extra member is optional), so
`FlowchartSeriesOptions` can keep `extends NetworkgraphSeriesOptions`. Confirm
with `tsc` per §6.1.

**Rule for B1.3/B3:** subtract with `Omit` only when the parent adds more than
the member being dropped. `NetworkgraphSeriesOptions` and
`NetworkgraphPointOptions` both do (the latter contributes `color`,
`colorIndex`, `dashStyle`, `dataLabels`, `id`, `marker`, `name`, `opacity`,
`width` alongside `mass`), so `Omit` stays correct there. B2.1 is the only case
that collapses to a nameable base type.

**Caveat, both forms:** excess-property checks only apply to fresh object
literals. A user assembling options in a variable gets no error. The type change
is a nudge; B2.2 is the real deliverable.

### B2.2 Docs

Add to `FlowchartSeriesDefaults.ts`, in the trailing doclet block:

```
/**
 * @excluding afterSimulation
 * @apioption plotOptions.flowchart.events
 */

/**
 * @excluding afterSimulation
 * @apioption series.flowchart.events
 */
```

Both paths are needed — `plotOptions.*` and `series.*` are separate nodes in
the tree, which is why the existing `@excluding` lists are already duplicated
across the `@optionparent` and `@apioption` doclets.

**Unverified until §6.3:** whether an `@apioption` doclet on a path whose node
is *also* produced by `@extends` cloning attaches its `exclude` to the cloned
node or is overwritten by it. The generator reads `node.doclet.exclude` after
cloning, which suggests it works, but confirm rather than assume. If it does
not work, fall back to documenting the limitation in the `events` description
and keep only the type-level removal.

---

## 4. Phase B3 — `nodes[].mass`

Simulation-only (`node.mass` feeds only the repulsive force). Same two levels:

- **Types:** `FlowchartPointOptions extends Omit<NetworkgraphPointOptions, 'mass'>`.
- **Docs:** `@excluding mass` on `@apioption series.flowchart.nodes`
  (`nodes` has no `plotOptions` counterpart).

Bundle with B2 — identical mechanism, so it shares the one expensive
verification. If B2's doc mechanism turns out not to work, drop B3's doc half
with it.

---

## 5. Phase B4 — code clarity (no API change)

**`fixedDraggable`.** Per §0.3 there is nothing to exclude. Add a comment to
`FlowchartSeries.onMouseUp()` recording that the omission is deliberate:

```ts
// `fixedDraggable` is deliberately not consulted. In a networkgraph it
// keeps a dragged node pinned against the simulation; here a drag is
// already permanent, recorded as `point.dragPos` and reapplied by
// `translate()`, so honouring the option would change nothing and imply a
// distinction that does not exist.
```

**`forces`.** `['barycenter', 'repulsive', 'attractive']` is inherited on the
prototype and read only by the RF layout. Optionally neutralise it in the
existing `extend(FlowchartSeries.prototype, {...})` — `forces: void 0`, matching
how networkgraph itself nulls `animate` and `drawGraph`. Cosmetic; drop it if
it costs any argument.

---

## 6. Verification

Ordered cheapest-first, so failures surface early.

### 6.1 Fast loop (per edit)

```bash
npx tsc --project ts/tsconfig.json --noEmit     # ~2-4 min
npx eslint ts/Series/Flowchart/                  # seconds
```

### 6.2 Type-surface check (after B1.3/B2.1/B3)

The `Omit` variants are the only changes that could disturb generated types:

```bash
npx gulp jsdoc-dts && npx gulp lint-dts
```

Inspect the emitted `flowchart` interfaces for `layoutAlgorithm` /
`afterSimulation` / `mass`. If `Omit` degrades the output, switch B1.3 to
variant (b) and use explicit `?: undefined` members for B2/B3 too.

### 6.3 Docs check (once, at the end)

`tree.json` is gitignored, so regenerating is free — but it records raw
doclets; `@excluding` is only *resolved* during the api-docs build. Two steps:

1. **Cheap:** a throwaway script calling `createTreeJson(globs)` from
   `tools/gulptasks/jsdoc-options.js` with a narrow glob
   (`code/es-modules/Core/Series/**`, `Series/Line/**`, `Series/Networkgraph/**`,
   `Series/Flowchart/**`) and asserting the `plotOptions.flowchart.events` node
   carries `doclet.exclude: ['afterSimulation']`. Confirms the doclet landed on
   the right path.
2. **Expensive, once before merge:** `npx gulp jsdoc-options` in the
   background — it runs `createTreeJson` → `testTreeJson` (network fetch of the
   published tree) → the full HTML build, and took **>20 min** when I tried it,
   so budget for it and do not block on it. Then confirm
   `build/api/highcharts/plotOptions/flowchart` shows no `layoutAlgorithm`, and
   `.../events` no `afterSimulation`.

### 6.4 Runtime regression suite

```bash
npx gulp scripts                                                    # ~13 min
npx playwright test --project=setup-highcharts --project=qunit \
    --grep "series-flowchart"
npx playwright test --project=setup-highcharts --project=qunit \
    --grep "series-networkgraph"
npx playwright test --project=setup-highcharts --project=qunit \
    --grep "series-packedbubble"
npm run test:webpack
```

`series-packedbubble` is not optional: packedbubble shares
`SimulationSeriesUtilities.initDataLabelsDefer`, the one function outside
networkgraph that reads `options.layoutAlgorithm`. Five suites live under
`samples/unit-tests/series-packedbubble/`.

Also re-render the three samples to confirm nothing visual moved:

```bash
npx playwright test --project=setup-highcharts --project=visual \
    --grep "series-flowchart"
```

(Snapshots are gitignored and absent, so it reports "snapshot doesn't exist,
writing actual" — the signal is the absence of page errors, plus a diff of the
written SVGs against the pre-change run. Capture those SVGs *before* starting
B so there is a baseline to compare.)

---

## 7. Test additions (B5)

All into the existing `samples/unit-tests/series-flowchart/flowchart/demo.js`.

**B5.1 — the important one. Networkgraph's defaults must be untouched:**

```js
assert.strictEqual(
    Highcharts.getOptions().plotOptions.flowchart.layoutAlgorithm,
    undefined,
    'flowchart should not carry a force-simulation config'
);
assert.ok(
    Highcharts.getOptions().plotOptions.networkgraph.layoutAlgorithm,
    'networkgraph should keep its own layoutAlgorithm defaults'
);
```

The second assertion is the guard against the one real regression risk in B —
mutating the shared parent defaults instead of a copy.

**B5.2 — a user-supplied `layoutAlgorithm` is inert, not fatal:** build a chart
with `layoutAlgorithm: { enableSimulation: true, type: 'reingold-fruchterman' }`
and assert it still renders, nodes still get layered positions (the existing
`plotY` ordering assertion), and no simulation starts
(`series.layout === undefined`).

**B5.3 — `deferLayout()` is a safe no-op:** call `series.deferLayout()`
directly and assert `series.layout` stays `undefined` and
`chart.graphLayoutsStorage` is not created.

**B5.4 — optional, cross-type cast:** `series.update({ type: 'networkgraph' })`
then back, asserting no throw and that `layoutAlgorithm` reappears while the
series is a networkgraph. Skip if flaky; it is a nice-to-have, not a B
requirement.

---

## 8. Sequencing

| Step | Work | Gate |
|---|---|---|
| 0 | Capture baseline sample SVGs (§6.4) | — |
| 1 | B1.2 `deferLayout()` no-op | 6.1 |
| 2 | B1.1 runtime default removal | 6.1 + B5.1/B5.3 |
| 3 | B1.3 types, decide (a) vs (b) | 6.1 + 6.2 |
| 4 | B2 + B3 (types, then doclets) | 6.1 + 6.2 + 6.3.1 |
| 5 | B4 comments | 6.1 |
| 6 | B5 remaining tests | 6.4 |
| 7 | Full docs build | 6.3.2 |

B1.2 lands **before** B1.1 so the guard exists before the thing it guards.
Steps 1–3 are independently useful and can ship without 4–7 if the doc
mechanism turns out to be a dead end.

---

## 9. Risk register

| Risk | Likelihood | Mitigation |
|---|---|---|
| Mutating `NetworkgraphSeries.defaultOptions` instead of a copy | low, high impact | `merge()` copy; B5.1 asserts it; networkgraph + packedbubble suites |
| `deferLayout()` reached with `layoutAlgorithm` undefined → throw | low | B1.2 no-op override makes it unreachable *by construction* |
| `Omit` disturbs generated `.d.ts` | medium, low impact | §6.2; fall back to `?: undefined` |
| Nested `@excluding` does not resolve | medium, low impact | §6.3.1 verifies cheaply; fall back to type-only removal + a description note |
| `initDataLabelsDefer` behaves differently | very low | Already optional-chained; `dataLabels.defer: false` short-circuits it first. Covered by the existing label assertions |
| Scope creep into networkgraph | medium | §1 "Out" list; any networkgraph fix becomes a separate issue |

**Rollback:** every change is additive-to-flowchart or a deletion from
flowchart's own surface. No migration, no data format change, nothing
released. `git revert` of the single commit is sufficient.

---

## 10. Effort

Roughly **half a day of edits**, dominated by waiting: `tsc` ~2–4 min per loop,
`gulp scripts` ~13 min, the full docs build >20 min once. The code delta is
small — one module-scope block, one no-op method, three type adjustments,
three doclets, two comments, ~30 lines of test.

## 11. What B does *not* fix

Recording this so B is not mistaken for a resolution:

- The 9-of-22 override ratio, and every fork it implies
  ([DISCONNECT §4.2](DISCONNECT-FROM-NETWORKGRAPH.md)).
- ~55 % of `modules/networkgraph` still shipped unused
  ([DISCONNECT §2](DISCONNECT-FROM-NETWORKGRAPH.md)).
- `DragNodesComposition` still duplicated across both bundles.
- `marker` still meaning "node shape container"; node sizing still with no
  option surface.

B makes the API honest. It does not make the lineage right. The C/D decision
stays open, and B is the mitigation that makes *waiting* on it defensible.
