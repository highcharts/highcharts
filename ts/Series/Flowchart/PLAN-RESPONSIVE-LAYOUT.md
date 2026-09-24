# Plan — size-aware, responsive flowchart layout

> ## STATUS: R1-R6 DONE. R7 (public options) PENDING A DECISION.
>
> ### SUPERSEDED: the two axes are now fitted independently
>
> Everything below describes the fit as *tighten, then shrink*, on gaps that
> only ever close. That was replaced after a follow-up question about making the
> x and y fit independent. What the code does now:
>
> 1. **Space.** Each axis' gap is searched between the 4 px floor and a ceiling
>    of `1.5 x` the median node height, so a gap now *grows* to fill an axis with
>    room to spare as well as closing to fit one that is short. Where the old
>    code left 386 px of height unused at 320x640, both axes now fill.
> 2. **Wrap.** A diagram short of width caps its label width so the text wraps,
>    trading height it has spare for width it has run out of. At 560 px this
>    removes the need to shrink at all (scale 0.852 -> 1.000).
> 3. **Shrink.** Unchanged, and now the last resort rather than the second step.
>
> Consequences worth knowing:
>
> - A gap may **grow** as the chart narrows, at the point where labels re-wrap
>   and hand horizontal room back. Monotonic gap behaviour now only holds within
>   a constant label width; the test asserts it that way.
> - The default look changed: a chart with room to spare fills its plot area
>   instead of sitting centred with fixed 20 px gaps.
> - A chart that fits without shrinking is never re-wrapped, so configs that
>   were already comfortable keep their labels exactly as they were.
> - Cost is now a flat 9 geometry passes (11 with the wrap ladder) rather than
>   1 to 8, measured at 3.7 ms of a 20.5 ms resize on a 105-node graph.
>
> ### R5 resolved: tighten, then shrink (superseded, see above)
>
> `fit` is no longer an option with a default to pick - the behaviour is
> two-stage and unconditional, per direction given after the plan was written:
>
> 1. **Tighten.** Gaps close from 20 px toward a 4 px floor as the plot area
>    narrows. Nothing shrinks while there is gap left to give back.
> 2. **Shrink.** Once the gaps bottom out, the whole diagram scales - node
>    boxes, gaps, label text and arrowheads on one factor.
>
> Measured on the `order-fulfillment` data at height 700:
>
> | plot width | gap | scale | widest node | label font | overflow |
> |---|---|---|---|---|---|
> | 800 | 20.0 | 1.000 | 235 | 12px | 0 |
> | 720 | 20.0 | 1.000 | 235 | 12px | 0 |
> | 700 | 18.0 | 1.000 | 235 | 12px | 0 |
> | 680 | 13.5 | 1.000 | 235 | 12px | 0 |
> | 660 | 9.5 | 1.000 | 235 | 12px | 0 |
> | 640 | 5.0 | 1.000 | 235 | 12px | 0 |
> | 620 | 3.9 | 0.978 | 230 | 11.74px | 0 |
> | 580 | 3.7 | 0.915 | 215 | 10.98px | 0 |
>
> **Overflow is now 0 at every size**, so the clipping problem the previous
> revision left open is closed. The top-left anchor is kept for the case where
> the shrink floor is reached, which no realistic chart size hits.
>
> ### Spacing is searched, not modelled
>
> First attempt interpolated the spacing linearly between the roomy and tight
> measurements, then verified. It failed: the room a graph needs is monotonic in
> its spacing but *not* linear, because the coordinate sweeps redistribute nodes
> within whatever room they are given. The estimate overshot nearly every time,
> the verify-and-fallback discarded it, and stage 1 collapsed into an abrupt
> jump from 20 px straight to 4 px.
>
> Replaced with a 5-step bisection. Both axes converge in the same passes, since
> `nodeSpacing` sets only the width and `layerSpacing` only the height. Cost is
> one geometry pass when the diagram already fits - the common case on resize -
> and eight at worst.
>
> ### Label scaling
>
> Font size is scaled in `drawDataLabels()` for both the node and link passes,
> not by re-measuring at the smaller size: re-measuring would change the node
> boxes, which would change the layout, which is what produced the scale. The
> size is resolved off a throwaway element via `renderer.fontMetrics()` so `em`
> and `rem` come back as real pixels, and cached per style.
>
> Known limit: the override is series-level, so a node with its own
> `dataLabels.style.fontSize` keeps it unscaled. Rare, and it still fits - the
> box around it is sized from that same style.
>
> ---
>
> ## Previous status (R1-R4 + R6)
>
> | Phase | State |
> |---|---|
> | R1 split `solve()` into `solveTopology` / `solveGeometry` | **done** |
> | R2 reorder `translate()` to measure before solving | **done** |
> | R3 width-aware phase 4, `horizontalInset` deleted | **done** |
> | R4 height-aware layer placement | **done** |
> | R5 pixel output + centring | **done**; `fit` / `minScale` **not done** |
> | R6 topology cache | **done** |
> | R7 public `node.*` options | **not done** |
>
> R1/R2 were folded into the R3/R4 commit rather than landed as separate no-op
> refactors - the same code moved either way, and keeping them apart would have
> meant two extra full rebuild-and-verify cycles for no added signal, since the
> baseline capture below already pins the before state.
>
> ### Result: overlap is gone at every size tested
>
> | size | min gap X | overlapping pairs | min gap Y | overflow |
> |---|---|---|---|---|
> | 1000x500 | +20.0 | 0 / 6 | +19.8 | 4 |
> | 800x500 | +20.0 | 0 / 6 | +19.8 | 4 |
> | 600x500 | +20.0 | 0 / 6 | +19.8 | 64 |
> | 480x500 | +20.0 | 0 / 6 | +19.8 | 124 |
> | 375x500 | +20.0 | 0 / 6 | +19.8 | 176 |
> | 320x500 | +20.0 | 0 / 6 | +19.8 | 204 |
> | 1000x800 | +20.0 | 0 / 6 | +19.8 | 0 |
> | 1000x320 | +20.0 | 0 / 6 | +19.8 | 94 |
>
> Against the §1.2/§1.3 before-numbers, which ran to −122 px horizontally and
> −36 px vertically. Gaps now sit exactly on `nodeSpacing` / `layerSpacing`
> whatever the plot size, which is the intended invariant.
>
> ### The remaining problem is overflow, and it is now the binding one
>
> A graph bigger than the plot area is **anchored top left and clipped**.
> `Series.setClip()` runs unless `clip: false`, so overflow is *lost content*,
> not spill. At 375x500 that is 176 px cut off the right.
>
> Anchoring rather than centring is deliberate: centring an oversized graph
> loses content off both ends, so the start of the flow would go too. This is a
> mitigation, not a fix, and closing it is R5's `fit` work - which is exactly
> what §8 decision 1 gates. See "Recommendation" below.
>
> ### Verification
>
> `tsc` clean, `eslint` clean, `gulp scripts` clean, `test:webpack` clean.
> Flowchart + networkgraph + packedbubble QUnit suites pass (7 files, 13 s -
> an 8.9 min run was contention with a concurrent build, not a regression;
> re-measured at 5.0 s for the flowchart suite alone).
>
> Baseline node positions and waypoint chains were captured at 1000x500 and
> 375x500 *before* any edit, per the plan - the step that was skipped during
> Approach B.
>
> Structural SVG diff of the `order-fulfillment` sample, pre-R3 vs now: 54 point
> elements, 15 arrows, 45 paths - all identical; data labels 41 -> **42**, one
> more label surviving `hideOverlappingLabels` now that nodes do not collide.
>
> ### Finding: the `visual` project is not a regression gate
>
> `tests/visual/visual.spec.ts:413`'s `expect(svgContent).toMatchSnapshot()`
> sits inside a `try { ... } catch { // noop }`, so a mismatch is swallowed and
> the test reports **passed** regardless. It "passed" here against baselines
> that provably differ from current output. Any visual claim has to come from
> diffing the SVGs by hand, as above. Worth raising separately - it means visual
> regressions in *any* series pass silently.
>
> ### Recommendation for R5
>
> Do not build `fit: 'scale'` yet. Uniform scaling has to scale the font too,
> or text overflows its shrunken box - which needs either a two-pass
> measure-layout-remeasure, or injecting a scaled `fontSize` during the node
> data-label pass. Both are tractable, but §2.4's arithmetic says scaling buys
> 9.4 px text at 375 px and 7.9 px at 320 px for *this* graph, and less for a
> wider one. §8 decision 3 (`rankDir: 'LR'`) would make narrow viewports a
> different problem altogether and may be the better investment. Deciding
> between them changes what gets built, so it should be decided, not assumed.

> **Temporary plan document.** Delete once executed.
>
> Companions: [OPTIONS-DEEP-DIVE.md](OPTIONS-DEEP-DIVE.md),
> [DISCONNECT-FROM-NETWORKGRAPH.md](DISCONNECT-FROM-NETWORKGRAPH.md),
> [PLAN-APPROACH-B.md](PLAN-APPROACH-B.md).

---

## 1. Diagnosis

Measured in a real browser (Playwright + QUnit, so real text metrics) against
the `order-fulfillment` dataset — 12 nodes, 15 links, 6 layers, mixed shapes.
Harness was temporary and has been removed.

### 1.1 One premise needs correcting

**Nodes do reposition and edges do reroute on resize.** `Chart.redraw()` sets
`isDirtyBox` on `setSize`/reflow, which makes every visible series run
`Series.redraw()` → `translate()` → `render()`
([Chart.ts:1438](../../Core/Chart/Chart.ts#L1438),
[Series.ts](../../Core/Series/Series.ts)). `translate()` re-solves the layout,
recomputes `plotX`/`plotY` from fractional coordinates × the new
`plotWidth`/`plotHeight`, rebuilds every link's `waypoints`, and
`renderWaypoints()` redraws the bend handles.

So the symptom the report describes is real, but the mechanism is not a missing
resize hook. It is this: **node sizes are computed in pixels from label text and
never consulted by the layout, which works in dimensionless units.** The two
halves of the geometry never meet.

### 1.2 Horizontal overlap — height fixed at 500px

| chart width | plotWidth | min gap between adjacent nodes | overlapping pairs | widest node |
|---|---|---|---|---|
| 1000 | 980 | **+31 px** | 0 / 6 | 235 |
| 800 | 780 | **−8 px** | 1 / 6 | 235 |
| 600 | 580 | **−47 px** | 3 / 6 | 235 |
| 480 | 460 | **−71 px** | 5 / 6 | 235 |
| 375 | 355 | **−91 px** | 6 / 6 | 235 |
| 320 | 300 | **−122 px** | 6 / 6 | 235 |

Two things to read off this:

- **Overlap starts at ~800 px, not at mobile widths.** This is a desktop bug
  too; 1000 px leaves only 31 px of slack.
- **`widestNode` is 235 px at every width.** Node size is entirely independent
  of the plot area, exactly as `shapeSize()` is written.

### 1.3 Vertical overlap — width fixed at 1000px

| chart height | plotHeight | min gap between layer rows |
|---|---|---|
| 800 | 734 | +59.8 px |
| 600 | 534 | +19.8 px |
| 500 | 434 | **−0.2 px** |
| 400 | 334 | **−20.2 px** |
| 320 | 254 | **−36.2 px** |

Layers begin touching at ~500 px chart height and overlap below it.

### 1.4 The decisive number

The graph's **intrinsic** requirement — widest layer's total node width plus a
nominal 20 px between neighbours, and the sum of per-layer max heights plus
20 px between layers:

```
needW = 453 px      needH = 442 px
```

At a 800 px chart the layout band is `0.8 × 780 = 624 px` — **171 px more than
the 453 px the widest layer needs** — and a pair *still* overlaps by 8 px.

**That is the whole story: the failure at desktop sizes is not lack of room, it
is that the solver does not know how wide anything is.** Lack of room only
becomes the binding constraint below roughly a 475 px chart width or a 510 px
chart height.

### 1.5 Root cause, in code

- [FlowchartLayout.ts](FlowchartLayout.ts) `assignCoordinates()` seeds
  `xMap.set(id, i)` — the node's *slot index* — and enforces a uniform
  `minSeparation = 1` **slot unit** between neighbours. Widths never enter.
- `positionsFromCoordinates()` normalises those slot coordinates into a fixed
  `[0.1, 0.9]` fractional band and places layer `l` at `(l + 1) / (maxLayer + 2)`
  of the plot height. Heights never enter.
- The `horizontalInset = 0.1` band is itself a symptom: it exists to keep the
  outermost nodes roughly on-screen precisely *because* their widths are
  unknown. It throws away 20 % of the usable width to do it.
- [FlowchartSeries.ts](FlowchartSeries.ts) `translate()` calls
  `FlowchartLayout.solve()` **before** measuring labels and computing
  `shapeWidth`/`shapeHeight`. Even if the solver wanted widths, it is called too
  early to have them.

---

## 2. Design

### 2.1 Split the solver into topology and geometry

Phases 1–3 — cycle removal, layering, crossing reduction — are **pure ordering**
and have no dependence on pixel sizes. Only phase 4 (coordinate assignment) and
the final coordinate mapping need widths and heights.

```
solveTopology(edges)            → { layers, up, down, dummies, routes }
solveGeometry(topology, sizes, plotSize) → { positions, intrinsic }
```

This buys two things at once:

1. **Correctness** — `solveGeometry` can take real node sizes.
2. **Resize performance** — crossing counting is O(sweeps · E²) and currently
   re-runs on every resize frame. Cache `solveTopology` keyed on the edge list
   and re-run only `solveGeometry`, which is O(sweeps · V).

### 2.2 Width-aware coordinate assignment

Replace the scalar `minSeparation` with a per-pair minimum centre distance. For
a layer ordered `0..n-1` with widths `w[]`:

```
sep(i) = (w[i] + w[i + 1]) / 2 + nodeSpacing
```

and a prefix sum `cum[]` so the minimum distance from `i` to `k` is
`cum[k] − cum[i]` in O(1). Then in `placeNode()`:

- wall, moving right: `x[k] − (cum[k] − cum[i])`
- follower push right: `x[k] = max(x[k], x[k − 1] + sep(k − 1))`
- wall, moving left: `x[k] + (cum[i] − cum[k])`
- follower push left: `x[k] = min(x[k], x[k + 1] − sep(k))`

Seed positions from `cum[i]` rather than the slot index `i`, so the *initial*
arrangement is already non-overlapping and the sweeps only improve it.

Dummy waypoints get width 0; `nodeSpacing` alone then gives a routed edge
half a gap of clearance either side. If that reads too tight in practice, give
them a nominal width instead of adding another option.

### 2.3 Height-aware layer placement

```
h[l]   = max node height in layer l
y[0]   = h[0] / 2
y[l+1] = y[l] + h[l] / 2 + layerSpacing + h[l+1] / 2
needH  = y[last] + h[last] / 2
```

Replaces the uniform `(l + 1) / (maxLayer + 2)` fractions. Layers with only
short nodes stop reserving as much room as layers with tall diamonds.

### 2.4 Output pixels, then fit

`solveGeometry` returns positions in **pixels relative to the graph's own
bounding box**, plus `intrinsic = { width, height }`. The series then decides
how to place that box in the plot area — and `horizontalInset` is deleted,
because the outermost node's real half-width is now known.

If `intrinsic` fits: centre it. If not, a new `fit` option:

| `fit` | Behaviour | Trade-off |
|---|---|---|
| `'scale'` (proposed default) | uniform factor `min(1, plotW/needW, plotH/needH)` applied to positions, node boxes and font size | preserves proportions; text shrinks |
| `'spacing'` | compress only the gaps, floor at 0 | keeps text legible; bounded, cannot fix much |
| `'none'` | overflow the plot area | current behaviour minus the overlap bug |

With a `minScale` floor (proposed 0.6) so `'scale'` degrades to overflow rather
than to illegibility.

**How far scaling actually gets us,** using the measured `needW = 453`:

| chart width | plotW | required scale | 12 px font becomes |
|---|---|---|---|
| 480 | 460 | 1.00 | 12.0 px |
| 375 | 355 | 0.78 | 9.4 px |
| 320 | 300 | 0.66 | 7.9 px |

So scaling covers phones for a graph of this shape, and runs out for wider
graphs. **Label wrapping is the real answer for narrow viewports** — it reduces
`needW` at a readable font size instead of trading one for the other — but it
needs wrapped-height measurement and belongs in a follow-up (§6).

### 2.5 Reorder `translate()`

Measure first, then solve:

1. `generatePoints()`
2. resolve each node's shape, measure its label, compute `shapeWidth`/`shapeHeight`
3. `solveTopology()` (from cache when the edge list is unchanged)
4. `solveGeometry()` with those sizes and the plot size
5. apply `dragPos` / `waypointDragPos` overrides
6. assign `plotX`/`plotY`, build `waypoints`, set label anchors

Note step 5 stays *after* geometry, as today, so a dragged node still wins.

---

## 3. API additions

Minimal, and named to survive the C/D decision:

```js
node: {
    padding: { x: 16, y: 10 },   // was shapePadding
    minWidth: 60,                // was minShapeSize.width
    minHeight: 36,
    spacing: 20,                 // horizontal gap, was minSeparation
    layerSpacing: 20             // vertical gap between layers
},
fit: 'scale',                    // 'scale' | 'spacing' | 'none'
minScale: 0.6
```

This reverses the earlier "B is subtractive, defer new API" stance — but only
because responsiveness cannot be implemented without exposing *some* spacing
control, and because these five values already exist as hard-coded constants in
`FlowchartSymbols.ts` and `FlowchartLayout.ts`. Flagging for review: if the
series is later disconnected (approach C/D), `node`/`fit` are exactly the kind of
names that would be revisited, so an argument exists for shipping this with the
constants still private and only `fit`/`minScale` public.

---

## 4. Phases

| # | Change | Files | Gate |
|---|---|---|---|
| **R1** | Split `solve()` into `solveTopology` / `solveGeometry`; no behaviour change, still dimensionless | `FlowchartLayout.ts` | existing suite green, byte-identical positions |
| **R2** | Reorder `translate()` to measure before solving; pass sizes into `solveGeometry` but ignore them | `FlowchartSeries.ts` | existing suite green, positions unchanged |
| **R3** | **Width-aware phase 4** + delete `horizontalInset` | `FlowchartLayout.ts` | overlap gone at ≥ 475 px; new overlap test |
| **R4** | **Height-aware layer placement** | `FlowchartLayout.ts` | overlap gone at ≥ 510 px |
| **R5** | Pixel output + centring + `fit`/`minScale` | both + defaults/options | overlap gone at *all* widths ≥ 320 px |
| **R6** | Topology cache keyed on the edge list | `FlowchartSeries.ts` | resize does not re-run phases 1–3 |
| **R7** | `node.*` options replacing the constants | symbols/options/defaults | docs build clean |

**R3 is the highest-value, lowest-risk step and should land first if the phases
are split across PRs** — on its own it removes every overlap measured at 480 px
and above, with no scaling, no new API and no visual change on wide charts.

R1 and R2 are deliberately no-op refactors so that R3's diff is purely the
algorithm change.

---

## 5. Verification

**Regression harness to add** (permanent, not throwaway) — a unit test that
renders the `order-fulfillment` data at 320/375/480/600/800/1000 × 320/500/800
and asserts:

- no two nodes in a layer overlap horizontally
- no two adjacent layer rows overlap vertically
- every node box lies within the plot area when `fit: 'scale'`
- node ordering within layers is unchanged from the pre-R3 baseline (guards
  against the width-aware sweeps disturbing crossing reduction)

The measurement script from §1 is the seed for this; it just needs its
deliberately-failing assertion turned into real ones.

**Per phase:** `tsc`, `eslint`, `gulp scripts` (~13 min), then
`--grep "series-flowchart|series-networkgraph|series-packedbubble"`.

**Capture baseline sample SVGs before R3** — unlike Approach B, these changes
*will* move pixels, so the before/after diff is the point. This was skipped
during B and should not be skipped here.

**Specifically worth checking:** node boxes now change *size* on resize under
`fit: 'scale'`, so `graphic.animate({ width, height })` has to regenerate the
symbol path, not just move it. `SVGElement` does re-run
`renderer.symbols[symbolName]` on a width/height change
([SVGElement.ts:2221](../../Core/Renderer/SVG/SVGElement.ts#L2221)) — confirm
it fires for every one of the six custom symbols, since a stale path here would
look like a shape that changes box but not outline.

---

## 6. Deliberately out of scope

- **Label wrapping / abbreviation.** The real fix for narrow viewports (§2.4).
  Needs `dataLabels.style.width` plumbed into `measureLabel()` and wrapped-height
  measurement. Follow-up.
- **Scrolling / panning** an overflowing diagram.
- **Per-layer alignment** (left/centre/justify within a layer).
- **Orientation** (`rankDir: 'LR'`), which would make narrow viewports a
  fundamentally different problem — arguably the better mobile answer, and worth
  raising before investing much in `fit: 'scale'`.

## 7. Risks

| Risk | Mitigation |
|---|---|
| Width-aware sweeps change node ordering and increase crossings | R1/R2 are no-ops, so R3's effect is isolated; assert ordering against a pre-R3 baseline |
| `fit: 'scale'` font scaling explodes `labelSizeCache` during a resize drag | quantise the scale factor before it reaches the cache key, or cap the cache |
| `intrinsic` recomputation makes resize janky | R6's topology cache; only O(sweeps · V) re-runs |
| Fractional `dragPos` interacts oddly with a scaled, centred layout | keep storing fractions of the plot area; add a drag-then-resize test |
| Nodes drawn outside the plot area under `fit: 'none'` | decide clip vs overflow explicitly; `isInside = true` is currently unconditional |

## 8. Decisions needed before starting

1. **`fit` default** — `'scale'` (always fits, text shrinks) or `'none'`
   (predictable, may overflow)? I lean `'scale'` with `minScale: 0.6`.
2. **Public `node.*` spacing options now, or keep the constants private and ship
   only `fit`/`minScale`?** (§3)
3. **Is `rankDir: 'LR'` the intended mobile story?** If so, R5's `fit` work is
   lower value and the effort is better spent there.
