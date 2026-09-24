# `flowchart` series — options deep dive

> **Temporary document.** Working notes on what the `flowchart` series type
> actually exposes, what it inherits, and what it inherits *in name only*.
> Delete once the findings have been folded into the API docs / review.

Every option tree in here was read out of a live chart rather than inferred
from source, by loading `code/highcharts.src.js` +
`modules/networkgraph.src.js` + `modules/flowchart.src.js` in jsdom and
dumping `Highcharts.getOptions().plotOptions`. Behavioural claims ("inert",
"overridden") were then traced back to the consuming code, and the file/line
references below are where that consumption happens.

One caveat on method: the dump collapses every function to `"[Function]"`, so
option *identity* changes to callbacks (`dataLabels.formatter`,
`dataLabels.linkFormatter`) are invisible in the diffs and were confirmed from
source instead.

---

## 1. The inheritance chain

```
Series.defaultOptions                 (18 top-level keys)
        │  merge
        ▼
NetworkgraphSeries.defaultOptions     (23 top-level keys)
        │  merge
        ▼
FlowchartSeries.defaultOptions        (25 top-level keys)
```

`FlowchartSeries.defaultOptions = merge(NetworkgraphSeries.defaultOptions,
FlowchartSeriesDefaults)` — [FlowchartSeries.ts](FlowchartSeries.ts).

### The chain is not what the doclets say

`NetworkgraphSeriesDefaults` is documented `@extends plotOptions.line`, but at
runtime `NetworkgraphSeries.defaultOptions` merges **`Series.defaultOptions`**,
not `LineSeries.defaultOptions`
([NetworkgraphSeries.ts:101](../Networkgraph/NetworkgraphSeries.ts#L101)).

The one option `LineSeries` adds on top of `Series` is `legendSymbol`
(`'rectangle'`). It is therefore **absent** from
`plotOptions.networkgraph` and from `plotOptions.flowchart` — confirmed in the
dump. So the API docs will show a `legendSymbol` on `plotOptions.flowchart`
inherited through the documented `line` ancestry that does not exist in the
merged defaults.

`flowchart`'s own doclet says `@extends plotOptions.networkgraph`, which *does*
match runtime. The discrepancy is inherited, not introduced here.

---

## 2. Options defined natively by `flowchart`

Two new top-level branches. Both are declared in
[FlowchartSeriesOptions.ts](FlowchartSeriesOptions.ts) and defaulted in
[FlowchartSeriesDefaults.ts](FlowchartSeriesDefaults.ts).

| Option | Default | Read by |
|---|---|---|
| `nodeShape` | `'rectangle'` | `FlowchartSeries.nodeShape()` |
| `waypoints.enabled` | `false` | `FlowchartSeries.renderWaypoints()` |
| `waypoints.radius` | `5` | `renderWaypoints()` |
| `waypoints.color` | *unset* → falls back to `link.color` | `renderWaypoints()` |

Plus four additions inside the inherited `link` branch:

| Option | Default | Read by |
|---|---|---|
| `link.arrowLength` | `10` | `FlowchartPoint.getArrowPath()` |
| `link.arrowWidth` | `8` | `getArrowPath()` |
| `link.dataLabels` | `{ style: { color, fontSize, fontWeight, textOutline } }` | `FlowchartSeries.drawDataLabels()` |
| `link.reversed` | `{ dashStyle: 'Dash' }` | `FlowchartPoint.getLinkAttributes()` |

`link.reversed` also accepts `color`; it has no default, so a reversed link
keeps `link.color` unless one is given.

### Point-level native options

| Option | Applies to | Read by |
|---|---|---|
| `nodes[].shape` | nodes | `FlowchartSeries.nodeShape()` |
| `data[].text` | links | `dataLabels.linkFormatter` (default) |

`text` is the third slot of `pointArrayMap`, so `['A', 'B', 'Yes']` array
notation feeds it. `shape` is validated against the shape→symbol table and
silently falls back (see §7).

---

## 3. Inherited options whose *default value* `flowchart` changes

Full deep diff of `plotOptions.networkgraph` → `plotOptions.flowchart`:

| Path | networkgraph | flowchart | Why |
|---|---|---|---|
| `dataLabels.enabled` | *unset* | `true` | Text inside the shape is a node's whole point |
| `dataLabels.verticalAlign` | `'bottom'` | `'middle'` | `'bottom'` was tuned for a label under a small circular marker; boxes here are label-sized and vary a lot in height |
| `dataLabels.defer` | `true` | `false` | Nothing to wait for — no simulation |
| `dataLabels.animation.defer` | `1000` | `0` | ditto |
| `dataLabels.linkTextPath.enabled` | `true` | `false` | Text-on-path rotates the label with the curve and disables its background/border; wrong for short branch labels |
| `dataLabels.style.color` | `'contrast'` | `'#FFFFFF'` | `contrast` resolves via a CSS relative-color expression some browsers compute for `getComputedStyle()` but fail to paint with |
| `dataLabels.style.textOutline` | `'1px contrast'` | `'1.5px rgba(0, 0, 0, 0.6)'` | same |
| `dataLabels.style.fontSize` | `'0.7em'` | `'12px'` | An absolute size is measurable; `measureLabel()` has to size the shape around it |
| `dataLabels.style.transition` | `'opacity 2000ms'` | `'opacity 50ms'` | The 2000ms value paired with a settling simulation; `states.inactive` animates in 50ms, so the label lagged 40× behind its own shape |
| `link.color` | `'rgba(100, 100, 100, 0.5)'` | `'var(--highcharts-neutral-color-60)'` | Fixed grey vanishes on a dark background |
| `link.width` | `1` | `1.5` | |

### Restatements that change nothing

`FlowchartSeriesDefaults` also sets `dataLabels.align: 'center'`,
`dataLabels.x: 0`, `dataLabels.y: 0` and `dataLabels.style.fontWeight: 'bold'`.
All four are already the `Series.defaultOptions` values, so they do not appear
in the diff above. They are kept as an explicit statement of the geometry the
node label depends on (dead-centre in its shape) and of the font
`measureLabel()` measures with — but they are documentation, not behaviour.

### `marker.radius` — deliberately *not* set

An earlier revision defaulted `marker.radius: 16`, commented as sizing the
hover halo. That was wrong, and it has been removed. Tracing every reader of a
node's radius:

- `Point.haloPath(size)` takes its size from `states.hover.halo.size` only
  ([Point.ts:1884](../../Core/Series/Point.ts#L1884)) — `marker.radius` is not
  involved.
- `NetworkgraphSeries.generatePoints()` assigns `node.radius` from it
  ([NetworkgraphSeries.ts:277](../Networkgraph/NetworkgraphSeries.ts#L277)),
  and `NodesComposition` derives `node.mass` from it
  ([NodesComposition.ts:267](../NodesComposition.ts#L267)). The only consumer of
  either is `ReingoldFruchtermanLayout`'s repulsive force
  ([ReingoldFruchtermanLayout.ts:671](../Networkgraph/ReingoldFruchtermanLayout.ts#L671)),
  which never runs.
- `Series.drawPoints()`' `globallyEnabled` calculation reads
  `marker.radius`, but only when `marker.enabled` is `undefined` — networkgraph
  sets it `true`, short-circuiting that branch.
- `FlowchartSeries.markerAttribs()` overrides the node box entirely; it defers
  to `super` (and hence to `radius`) only when `shapeWidth`/`shapeHeight` are
  missing, i.e. before `translate()` has run — unreachable in the normal
  render order.

So the merged default is now the inherited `radius: 4`, and it is inert.
`plotOptions.flowchart.marker.radius` is **not** the handle for node size;
nodes size themselves to their label.

---

## 4. Inherited options that are live

### From `networkgraph`

| Option | Status |
|---|---|
| `draggable` | Live. Gates the chart-level mousedown handler (`DragNodesComposition.onChartLoad`) and, additionally here, whether waypoint markers get drag handles (`renderWaypoints()`) |
| `link.color` / `link.width` / `link.dashStyle` / `link.opacity` | Live via `NetworkgraphPoint.getLinkAttributes()`, which `FlowchartPoint` extends rather than replaces |
| `inactiveOtherPoints` (`true`) | Live — drives the dim-everything-else hover behaviour |
| `showInLegend` (`false`) | Live |
| `stickyTracking` (`false`) | Live |
| `marker.enabled` (`true`) | Live — set it `false` and no node shapes are drawn |
| `marker.states.inactive.opacity` (`0.3`) / `.animation.duration` (`50`) | Live — how a node dims |
| `states.inactive.link.opacity` (`0.3`) | Live — how a link dims |
| `states.inactive.animation.duration` (`50`) | Live |
| `dataLabels.formatter` | Live for **nodes** (networkgraph's, returns `point.key`) |
| `dataLabels.linkFormat` / `linkFormatter` | Live for **links**. `linkFormat` — even `''` — wins over `linkFormatter`, which is why flowchart's default reads `point.options.text` through the formatter |
| `dataLabels.textPath` | Live for node labels |
| `dataLabels.linkTextPath` | Live for link labels — `drawDataLabels()` hands it to `textPath` for the link pass, same as networkgraph |
| `nodes[]` (id, name, color, colorIndex, dataLabels, opacity) | Live |
| `data[].color`, `data[].dashStyle`, `data[].width`, `data[].opacity` | Live, and `color`/`dashStyle` now take precedence over `link.reversed` |

### From `Series`

Live and generic: `allowPointSelect`, `enableMouseTracking`, `events`,
`opacity`, `point.events`, `showCheckbox`, `states.hover.halo`,
`states.hover.lineWidthPlus`, `states.select.*`, `states.normal.*`,
`dataLabels.*` (borderWidth, distance, padding, align, x, y, …), `visible`,
`className`, `custom`, `keys`, `zIndex`, `colorIndex`, `name`, `id`, `index`,
`legendIndex`, `tooltip.*`.

Note on tooltips: `generatePoints()` sets `formatPrefix = 'link'` on every
link, so `tooltip.linkFormat` / `tooltip.linkFormatter` address links
specifically ([Tooltip.ts:299](../../Core/Tooltip.ts#L299)), while nodes use
the plain `pointFormat` / `pointFormatter`.

`keys` is still honoured by core, but is no longer *needed*: `pointArrayMap` is
`['from', 'to', 'text']` on the prototype, so `[from, to, text]` array rows
parse without it. (The study version had `pointArrayMap` inside its options
object, where it never reached the prototype, which is why it needed
`keys: ['from', 'to', 'text']` to defeat `optionsToObject()`'s leading-`x`
special case.)

---

## 5. Inherited options that are inert

> **Updated after Approach B.** The first four rows below have since been
> neutralised — see [PLAN-APPROACH-B.md](PLAN-APPROACH-B.md). They are kept
> here with their reasoning, marked, because the *why* still explains the
> current shape of the series. Everything from `marker.radius` down is
> unchanged: still inherited, still inert.

Nothing in this section was ever *broken*; these options are simply readable on
`series.options` with nothing reading them on this code path.

| Option | Default carried in | Why it does nothing |
|---|---|---|
| ~~`layoutAlgorithm` **and its whole subtree**~~ — `type`, `integration`, `approximation`, `enableSimulation`, `initialPositions`, `initialPositionRadius`, `maxIterations`, `maxSpeed`, `theta`, `friction`, `gravitationalConstant`, `linkLength`, `repulsiveForce`, `attractiveForce` | **REMOVED by B1** — no longer in the merged defaults or the docs | `FlowchartSeries.translate()` never calls `deferLayout()`, so no layout is ever constructed and `series.layout` stays `undefined`. `deferLayout()` is now an explicit no-op. The layered solver in [FlowchartLayout.ts](FlowchartLayout.ts) has no tunables exposed as options at all. **A value the user sets explicitly is still accepted and still inert** — B removed the advertisement, not the ability to set it. |
| ~~`events.afterSimulation`~~ | **REMOVED by B2** — off the type (`events?: SeriesEventsOptions`) and out of the docs | Fired only by `ReingoldFruchtermanLayout` ([ReingoldFruchtermanLayout.ts:233](../Networkgraph/ReingoldFruchtermanLayout.ts#L233)). Never fires here. (Networkgraph's own listener for it, added in `init()`, is likewise never called.) |
| `fixedDraggable` | typed on `DragNodesSeriesOptions`; **not** on `FlowchartSeriesOptions`, and undocumented everywhere | Read only in `DragNodesComposition.onMouseUp` ([DragNodesComposition.ts:273](../DragNodesComposition.ts#L273)), which `FlowchartSeries.onMouseUp()` replaces. A flowchart persists drags through `point.dragPos` instead, so the effect it would have had is unconditional. B4 recorded that omission as deliberate in a comment; there was nothing to exclude, since it has no doclet. |
| ~~`nodes[].mass`~~ | **REMOVED by B3** — off the type (`Omit<…, 'mass'>`) and out of the docs | Only the force simulation consumes mass. |
| `nodes[].marker.symbol`, `marker.symbol` | — | `translate()` does `node.marker = merge(node.marker, { symbol })` with the shape-derived symbol last, so it wins over both. Use `nodes[].shape` / `nodeShape`. |
| `marker.radius` (`4`, inherited) | — | See §3. |
| `lineWidth` (`2`) | from `Series` | Networkgraph sets `drawGraph: void 0` on the prototype — there is no series line. |
| `turboThreshold` (`1000`) | from `Series` | Turbo parsing requires the first array element to be a number (`isShortArray` in `setDataFromArray`). A link's first element is a node id string, so turbo mode never engages regardless of data size. |
| `findNearestPointBy` (`'x'`) | from `Series` | `buildKDTree: noop` on the networkgraph prototype — there is no kd-tree to search. |
| `cropThreshold` (`300`), `softThreshold` (`true`), `pointRange` (`0`) | from `Series` | `isCartesian: false`; no axes, no cropping, no threshold. |
| `crisp` (`true`) | from `Series` | Node boxes come from `markerAttribs()` un-crisped; links are paths. |
| `animation` (`{duration: 1000}`) | from `Series` | Networkgraph sets `animate: void 0` on the prototype — no initial series animation. |
| `states.inactive.linkOpacity` (`0.3`) | from networkgraph | Deprecated alias for `states.inactive.link.opacity`; both are in the defaults, the nested one is the live one. |
| `states.inactive.opacity` (`0.2`) | from `Series` | Series-level dim. Nodes and links are dimmed by the more specific `marker.states.inactive.opacity` and `states.inactive.link.opacity` (both `0.3`). |

---

## 6. Options excluded from the API docs only

`@excluding` suppresses an option from the generated reference; it does **not**
remove it from the merged defaults or stop it working. Both the
`@optionparent plotOptions.flowchart` doclet
([FlowchartSeriesDefaults.ts](FlowchartSeriesDefaults.ts)) and the
`FlowchartSeriesOptions` interface doclet carry:

```
layoutAlgorithm, boostThreshold, animation, animationLimit, connectEnds,
colorAxis, colorKey, connectNulls, cropThreshold, dragDrop,
getExtremesFromAll, label, linecap, negativeColor, pointInterval,
pointIntervalUnit, pointPlacement, pointStart, softThreshold, stack, stacking,
step, threshold, xAxis, yAxis, zoneAxis, dataSorting, boostBlending
```

The `@apioption series.flowchart` doclet carries the same list minus
`colorAxis` and `colorKey` — mirroring how networkgraph splits its two lists.

All of it is inherited verbatim from networkgraph's exclusion list **except
`layoutAlgorithm`**, which flowchart adds. That one entry is the only
documentation-level "removal" this series introduces, and §5 explains why.

`data[]` additionally excludes `drilldown, marker, x, y, dragDrop`, and
`nodes[]` inherits networkgraph's `nodes` doclet.

Worth flagging for review: most of that list names cartesian/boost options
that were never in the merged defaults to begin with (`boostThreshold`,
`connectNulls`, `stacking`, `xAxis`, …) — the exclusions exist because the docs
generator walks the documented `line` ancestry, not the runtime merge. Only
`animation`, `cropThreshold`, `softThreshold` and `layoutAlgorithm` are both
excluded *and* actually present at runtime.

---

## 7. Shape → symbol mapping

`nodes[].shape` and `nodeShape` accept eight values. Six register new symbols
on the global `SVGRenderer.prototype.symbols` registry through
`FlowchartSymbols.compose()`; two reuse core symbols.

| `shape` | symbol | origin |
|---|---|---|
| `rectangle` | `square` | core |
| `diamond` | `diamond` | core |
| `oval` | `oval` | **new** — `modules/flowchart` |
| `parallelogram` | `parallelogram` | **new** |
| `hexagon` | `hexagon` | **new** |
| `subroutine` | `subroutine` | **new** |
| `cylinder` | `cylinder` | **new** |
| `document` | `document` | **new** |

Registry after loading the module (verified):
`arc, callout, circle, cylinder, diamond, document, hexagon, oval,
parallelogram, rect, roundedRect, square, subroutine, triangle,
triangle-down`. No collisions with core or with any other module.

Resolution is defensive — `FlowchartSeries.nodeShape()` falls back from an
unknown `nodes[].shape` to `nodeShape`, and from an unknown `nodeShape` to
`'rectangle'`, so a typo degrades to a plain box rather than to a missing
symbol lookup.

Three geometry concerns stay in sync inside
[FlowchartSymbols.ts](FlowchartSymbols.ts) because they share constants: the
symbol path, `shapeSize()` (how much bigger than its text box a shape must be),
and `shapeBoundaryDistance()` (where its outline is, for trimming a link end
and placing an arrow tip).

### Sizing constants — internal, not options

`shapePadding` (`{x: 16, y: 10}`), `minShapeSize` (`{width: 60, height: 36}`)
and the per-shape ratios (`parallelogramSlant`, `hexagonInset`,
`subroutineBar`/`Gap`, `cylinderCap`/`Gap`, `documentWave`) are module
constants with no option surface. Likewise the solver's
`crossingReductionSweeps` (8), `coordinateSweeps` (12) and `minSeparation` (1).
Candidates for promotion to API if node sizing turns out to need tuning.

---

## 8. Styled-mode / CSS hooks

| Class | Applied to |
|---|---|
| `highcharts-flowchart-arrow` | the arrowhead path on every link |
| `highcharts-flowchart-waypoint` | a waypoint marker (also how the previous render's markers are found and cleared) |
| `highcharts-link-reversed` | appended by `FlowchartPoint.getClassName()` to a back edge |

Presentational attributes are skipped under `chart.styledMode` in
`renderWaypoints()` and `redrawLink()`, so the above are the styling surface
there.

One known gap: `measureLabel()` applies `dataLabels.style` to its throwaway
text element even in styled mode, where that style does not affect the rendered
label. It is the best available estimate of the label's font, and a shape
slightly too big is far less visible than one its text spills out of — but a
styled-mode chart with a substantially different CSS font size will get boxes
sized for the default one.

---

## 9. Prototype-level behaviour (not options, but it decides which options bite)

Inherited from networkgraph and left alone: `isCartesian: false`,
`directTouch: true`, `noSharedTooltip: true`, `requireSorting: false`,
`hasDraggableNodes: true`, `trackerGroups: ['group', 'markerGroup',
'dataLabelsGroup']`, `buildKDTree: noop`, `drawGraph: void 0`,
`animate: void 0`, `drawTracker` from column, `createNode` from
`NodesComposition`, `onMouseDown` + `redrawHalo` from `DragNodesComposition`.

~~Still carried but meaningless: `forces: ['barycenter', 'repulsive',
'attractive']`~~ — cleared to `void 0` by B4, the same way networkgraph itself
clears `animate` and `drawGraph`.

Set by flowchart: `pointArrayMap: ['from', 'to', 'text']`,
`pointClass: FlowchartPoint`, and `deferDataLabels = false` (a class *field*,
so per instance, not on the prototype).

Overridden methods, each because the networkgraph version assumes a running
simulation: `translate`, `setState`, `render`, `markerAttribs`,
`drawDataLabels`, `onMouseMove`, `onMouseUp`, and (since B1.2) `deferLayout`.
On the point:
`getLinkAttributes`, `getLinkPath`, `renderLink`, `redrawLink`, `destroy`,
`getClassName`.

---

## Appendix — full merged `plotOptions.flowchart`

Read out of a live chart; functions collapsed, keys sorted.

```json
{
  "allowPointSelect": false,
  "animation": { "duration": 1000 },
  "crisp": true,
  "cropThreshold": 300,
  "dataLabels": {
    "align": "center",
    "animation": { "defer": 0 },
    "borderWidth": 0,
    "defer": false,
    "distance": 4,
    "enabled": true,
    "formatter": "[Function]",
    "linkFormatter": "[Function]",
    "linkTextPath": { "enabled": false },
    "padding": [1, 3],
    "style": {
      "color": "#FFFFFF",
      "fontSize": "12px",
      "fontWeight": "bold",
      "textOutline": "1.5px rgba(0, 0, 0, 0.6)",
      "transition": "opacity 50ms"
    },
    "textPath": { "enabled": false },
    "verticalAlign": "middle",
    "x": 0,
    "y": 0
  },
  "draggable": true,
  "enableMouseTracking": true,
  "events": {},
  "findNearestPointBy": "x",
  "inactiveOtherPoints": true,
  "layoutAlgorithm": {
    "approximation": "none",
    "enableSimulation": false,
    "friction": -0.981,
    "gravitationalConstant": 0.0625,
    "initialPositionRadius": 1,
    "initialPositions": "circle",
    "integration": "euler",
    "maxIterations": 1000,
    "maxSpeed": 10,
    "theta": 0.5,
    "type": "reingold-fruchterman"
  },
  "lineWidth": 2,
  "link": {
    "arrowLength": 10,
    "arrowWidth": 8,
    "color": "var(--highcharts-neutral-color-60)",
    "dataLabels": {
      "style": {
        "color": "var(--highcharts-neutral-color-100)",
        "fontSize": "11px",
        "fontWeight": "normal",
        "textOutline": "none"
      }
    },
    "reversed": { "dashStyle": "Dash" },
    "width": 1.5
  },
  "marker": {
    "enabled": true,
    "enabledThreshold": 2,
    "lineColor": "var(--highcharts-background-color)",
    "lineWidth": 0,
    "radius": 4,
    "states": {
      "hover": {
        "animation": { "duration": 150 },
        "enabled": true,
        "lineWidthPlus": 1,
        "radiusPlus": 2
      },
      "inactive": { "animation": { "duration": 50 }, "opacity": 0.3 },
      "normal": { "animation": true },
      "select": {
        "fillColor": "var(--highcharts-neutral-color-20)",
        "lineColor": "var(--highcharts-neutral-color-100)",
        "lineWidth": 2
      }
    }
  },
  "nodeShape": "rectangle",
  "opacity": 1,
  "point": { "events": {} },
  "pointRange": 0,
  "showCheckbox": false,
  "showInLegend": false,
  "softThreshold": true,
  "states": {
    "hover": {
      "animation": { "duration": 150 },
      "halo": { "opacity": 0.25, "size": 10 },
      "lineWidthPlus": 1,
      "marker": {}
    },
    "inactive": {
      "animation": { "duration": 50 },
      "link": { "opacity": 0.3 },
      "linkOpacity": 0.3,
      "opacity": 0.2
    },
    "normal": { "animation": true },
    "select": { "animation": { "duration": 0 } }
  },
  "stickyTracking": false,
  "turboThreshold": 1000,
  "waypoints": { "enabled": false, "radius": 5 }
}
```

`marker.radius: 4` above is the inherited value, and is inert — see §3.

---

## Open questions for review

Items 2–4 of the original list were resolved by
[Approach B](PLAN-APPROACH-B.md). What remains:

1. **`legendSymbol`** — networkgraph's `@extends plotOptions.line` doclet does
   not match its runtime merge of `Series.defaultOptions`. Confirmed from the
   generated docs: `plotOptions.flowchart` lists a `legendSymbol` that is not in
   the merged defaults. Fix the doclet, or merge `LineSeries.defaultOptions`?
   Pre-existing and networkgraph's to own; deliberately out of B's scope.
2. **Node sizing** (`shapePadding`, `minShapeSize`) is the most likely thing a
   user will want to change and currently has no option surface. Left for after
   the C/D structural decision, since B is subtractive only.
3. **Styled mode** label measurement, per §8.
4. **The structural question itself** — see
   [DISCONNECT-FROM-NETWORKGRAPH.md](DISCONNECT-FROM-NETWORKGRAPH.md). B makes
   the API honest; it does not change the 9-of-22 override ratio or the ~55 % of
   `modules/networkgraph` still shipped unused.

Resolved by B: ~~`layoutAlgorithm` settable but inert~~ (removed from the merged
defaults and the type); ~~`events.afterSimulation` not excluded~~ (excluded from
both, and the exclusion verified against the generated docs);
~~`fixedDraggable` silently unconditional~~ (deliberate, now documented in
`onMouseUp` — it has no doclet anywhere, so there was nothing to exclude).
