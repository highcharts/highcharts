# Should `flowchart` be disconnected from `networkgraph`?

> **Temporary decision document.** Companion to
> [OPTIONS-DEEP-DIVE.md](OPTIONS-DEEP-DIVE.md), which enumerates the inherited
> API surface. This one weighs the structural question. No code changed to
> produce it. Delete once a decision is recorded.

Today `FlowchartSeries extends SeriesRegistry.seriesTypes.networkgraph` and
`modules/flowchart` declares `@requires highcharts/modules/networkgraph`.
The question is whether that lineage earns its keep.

Every figure below is a measurement of the current tree, and the method is
stated so it can be re-checked. Byte counts are **uncompressed source**, since
that is what is directly measurable here — the ratios matter more than the
absolute numbers, and minified/gzipped figures will differ.

---

## 1. What flowchart actually inherits

`NetworkgraphSeries` exposes 12 methods, `NetworkgraphPoint` 10. How flowchart
treats each:

### Series

| Member | Flowchart | Verdict |
|---|---|---|
| `pointAttribs` | inherited as-is | **reused** — non-trivial; splits node vs link and resolves the `states.*.link` nesting |
| `render` | `super.render()` | **reused** — the nodes-pass/links-pass render, halo redraw, overlapping-label hiding |
| `generatePoints` | inherited as-is | **reused** — standalone `nodes[]`, `degree`, `key`, `formatPrefix = 'link'`, leftover-node cleanup |
| `destroy` | inherited as-is | **reused** (its `layout` branch is dead but guarded) |
| `getPointsCollection` | inherited as-is | **reused** — one-liner |
| `indexateNodes` | inherited as-is | **reused** — one-liner |
| `init` | inherited as-is | **partly reused** — 2 of its 4 event handlers are live (`afterUpdate`/`resolveColor`, `initDataLabelsDefer`); `updatedData`→`layout.stop()` and `afterSimulation` are dead |
| `translate` | **replaced** | — |
| `drawDataLabels` | **replaced** | — |
| `setState` | **replaced** | copy of networkgraph's, minus its `this.layout.simulation` check |
| `markerAttribs` | **replaced** | defers to `super` only for links / pre-`translate()` |
| `deferLayout` | never called | **dead** |

### Point

| Member | Flowchart | Verdict |
|---|---|---|
| `remove` | inherited as-is | **reused** — ~90 lines; the node-removal cascade over `linksFrom`/`linksTo` |
| `getLinkAttributes` | `super` + reversed styling | **reused** |
| `renderLink` | `super` + arrowhead | **reused** |
| `getDegree` | inherited as-is | **reused** |
| `isValid` | inherited as-is | **reused** — one-liner |
| constructor | inherited as-is | **reused** — the `cursor: move` binding when `draggable` |
| `getLinkPath` | **replaced** | — |
| `redrawLink` | **replaced** | — |
| `destroy` | **replaced** | to skip the layout bookkeeping |
| `getMass` | never called | **dead** |

**Tally:** of 22 inherited methods, flowchart replaces or extends **9**, and
**3** more are dead weight. The 10 it genuinely reuses unchanged are dominated
by four substantial ones — `pointAttribs`, `render`, `generatePoints`,
`Point.remove` — plus five near-trivial ones.

Beyond methods it also inherits the prototype flags (`isCartesian: false`,
`buildKDTree: noop`, `drawGraph: void 0`, `animate: void 0`, `directTouch`,
`noSharedTooltip`, `trackerGroups`, `drawTracker`, `createNode`, the
`DragNodesComposition` handlers) and one **implicit side effect**:
`composeTextPath(SVGElement)` runs when `NetworkgraphSeries.js` loads. A
standalone flowchart would have to call it itself — sankey does exactly that.

---

## 2. What the dependency costs in shipped code

`modules/networkgraph`, by emitting source (excluding `.d.ts`):

| File | Bytes | Usable by flowchart? |
|---|---|---|
| `ReingoldFruchtermanLayout.ts` | 30 000 | no |
| `QuadTreeNode.ts` | 9 118 | no |
| `EulerIntegration.ts` | 7 670 | no |
| `VerletIntegration.ts` | 7 454 | no |
| `QuadTree.ts` | 4 416 | no |
| `GraphLayoutComposition.ts` | 4 887 | no |
| **simulation subtotal** | **63 545** | **none of it** |
| `NetworkgraphSeriesDefaults.ts` | 21 178 | partly (much of it is the `layoutAlgorithm` doclet block) |
| `NetworkgraphSeries.ts` | 17 215 | partly |
| `NetworkgraphPoint.ts` | 13 133 | partly |

**≈55 % of the networkgraph module's emitting source is force-simulation
machinery that a flowchart can never execute.**

Built bundles today:

```
code/modules/networkgraph.src.js   124 343 B
code/modules/flowchart.src.js       96 178 B
                                   ─────────
a flowchart-only page             220 521 B  of module source
```

Rough estimate for a standalone module: flowchart's own authored source is
106 860 B; add `NodesComposition` (14 359 B) and the ~10–12 KB of node/link
logic it would take over from networkgraph, minus nothing — call it
**≈125–135 KB**, replacing 220 KB. On the order of **40 % less code shipped**
for a page that only wants a flowchart.

One coupling already leaks: `DragNodesComposition` (7 920 B) is **already
duplicated** — it appears inline in both bundles, because it is not listed in
`tools/webpacks/externals.json`. So part of the "we share code with
networkgraph" benefit is not actually being realised today.

---

## 3. The choice is not binary

| | Approach | Effort | Touches networkgraph? |
|---|---|---|---|
| **A** | Status quo — keep extending networkgraph | none | no |
| **B** | Status quo **+ neutralise** the inert API (drop `layoutAlgorithm` in `init()`, exclude `afterSimulation`/`fixedDraggable`) | small | no |
| **C** | Extract a shared node/link base (or widen `NodesComposition` to cover `pointAttribs`/`render`/`renderLink`); both series extend it | large | **yes** |
| **D** | Standalone flowchart depending only on `NodesComposition` + `DragNodesComposition` + `TextPath`, duplicating the ~300 lines it needs | medium | no |
| **E** | Lean the other way — register the layered layout in `GraphLayoutComposition.layouts` so `layoutAlgorithm.type: 'flowchart'` becomes real | medium | yes (light) |

Options C, D and E are all "disconnected" to different degrees. The pros/cons
below apply to disconnection generally; where an argument favours one variant
specifically, it says so.

---

## 4. The case FOR disconnecting

### 4.1 It removes a whole class of dishonest API — the strongest argument

[OPTIONS-DEEP-DIVE.md §5](OPTIONS-DEEP-DIVE.md) lists fourteen inherited
options that are present, settable, typed, and inert. Disconnecting deletes
most of them at the root rather than papering over them:

- `layoutAlgorithm` and its 11 sub-options — a fully populated
  Reingold-Fruchterman configuration on a series with no simulation
- `events.afterSimulation` — typed on `FlowchartSeriesOptions` via
  `NetworkgraphEventsOptions`, can never fire
- `fixedDraggable` — silently unconditional, because `onMouseUp` is replaced
- `nodes[].mass`, `forces` — simulation-only concepts

This is not just tidiness. `layoutAlgorithm` is the option a user reaches for
when they want to influence the layout, and it does nothing. B addresses the
symptom; disconnecting removes the cause.

### 4.2 It removes latent breakage

Every override flowchart carries exists because the networkgraph version
assumes a running simulation. `setState` is the clearest case — it is a
verbatim copy minus one `this.layout.simulation` check. Each such override is a
silent fork: if networkgraph's `setState`, `render`, `pointAttribs` or
`generatePoints` changes, flowchart either misses the fix or breaks, and the
thin test coverage (one QUnit file) will not necessarily catch it.

Inheriting from a mature series *and then replacing 9 of its 22 methods* is a
weak fit. That ratio is the real signal here.

### 4.3 The bundle argument, for the common case

A flowchart is a documentation/process diagram — often on a page with no other
chart. Making that page carry a force-simulation engine, a quadtree and two
numerical integrators is hard to justify (§2).

### 4.4 Freedom to name things correctly

While the lineage stands, `marker` means "node shape container" even though
nodes are label-sized shapes and `marker.radius` is inert; `link` carries
networkgraph's semantics; node sizing (`shapePadding`, `minShapeSize`) has no
home because networkgraph has no equivalent. A standalone series can expose
`node: { padding, minWidth, minHeight }` and a `connector` branch without
fighting inherited meaning.

### 4.5 The precedent exists, and it is nearby

**Sankey** is a nodes-and-links series with no networkgraph dependency at all:
it composes `NodesComposition.compose(SankeyPoint, SankeySeries)` and calls
`composeTextPath` itself. `NodesComposition` imports only from `Core` —
verified. So "node/link series without networkgraph" is an established pattern
in this codebase, not a new invention. Option D is essentially "do what sankey
does".

### 4.6 The window is open now

The series is unreleased. Removing `layoutAlgorithm` from a released series is
a breaking change; removing it now costs nothing. **This is the cheapest moment
this decision will ever have**, and that asymmetry should weigh heavily.

---

## 5. The case AGAINST disconnecting

### 5.1 Duplication, unless C is chosen

`pointAttribs`, `render`, `generatePoints`, `Point.remove`,
`getLinkAttributes`, `renderLink`, `isValid` and the drag cursor are real,
tested logic. Option D copies them — two divergent copies of the node/link
render path, and a bug fixed in one will not reach the other. Sankey's
precedent cuts both ways: sankey does not share networkgraph's *link
rendering*, because it draws links as filled shapes. Flowchart draws links as
stroked paths, exactly like networkgraph, so it is the one series that would
genuinely benefit from sharing that code.

### 5.2 Option C is the right fix and the riskiest

Extracting a shared base is the only variant with no duplication, but it
refactors a mature, widely used series to accommodate a new one. That is a real
regression risk for existing networkgraph users, taken on their behalf for
someone else's benefit. It also needs buy-in beyond this series.

### 5.3 Bundle duplication in the both-loaded case

Disconnected, a page with both series ships two copies of `NodesComposition`,
`DragNodesComposition` and `TextPath` — 254 KB against today's 220 KB.
Solvable: `externals.json` exists precisely for this and already shares
`ColorAxis`/`ColorMapComposition` across six modules. But it is extra work, and
today's `DragNodesComposition` duplication shows it is easy to forget.

### 5.4 Losing inherited improvements

Anything landing in networkgraph's shared paths — a hover-state fix, a data
label improvement, an accessibility addition — currently reaches flowchart for
free.

### 5.5 Type-level entanglement does not fully go away

`FlowchartLinkOptions` currently extends `NetworkgraphLinkOptions`, and
networkgraph's options file declares the `StatesOptionsBase.link` union that
Organization and Treegraph already join. A standalone flowchart still wants a
precise type there, so either it joins that union (still touching
networkgraph's file) or it needs its own arrangement.

### 5.6 Conceptual and interop cost

A flowchart *is* a directed graph with a deterministic layout — the lineage is
not a lie, and the shared `[from, to]` data shape means
`series.update({ type: 'networkgraph' })` on flowchart data is coherent. Shared
lineage makes that cleaner than a cross-family cast.

### 5.7 Effort against a still-settling API

The series is a rough cut. Restructuring before the option surface has settled
risks doing the work twice. Option B buys most of the API-honesty win for a
fraction of the effort and leaves the structural decision open.

---

## 6. Option E, briefly

Registering the layered layout as a `GraphLayoutComposition.layouts` entry
would make `layoutAlgorithm.type: 'flowchart'` genuine and let the inherited
API become truthful instead of being hidden. But `GraphLayoutComposition`'s
chart-render hook drives every registered layout through an RF-shaped
interface — `maxIterations--`, `temperature`, `isStable()`, `step()`,
`beforeStep()`, `updateSimulation()`. A one-shot layered layout would have to
impersonate an iterative simulation that reports itself stable immediately.

It also solves none of §4.3: you still ship the whole simulation. Worth
recording as considered and rejected, unless "a networkgraph with pluggable
layouts" is a direction the product wants for its own sake — in which case
flowchart is a good forcing function for it.

---

## 7. Recommendation

**Disconnect — and prefer C, fall back to D. Do B immediately either way.**

Reasoning, in order of weight:

1. **The override ratio is the tell.** Replacing 9 of 22 inherited methods,
   with 3 more dead, means flowchart is not a specialisation of networkgraph;
   it is a different series that borrowed a node/link substrate. Inheritance is
   the wrong tool for that, and §4.2 is the ongoing cost.
2. **The API dishonesty is user-visible and structural** (§4.1). B hides it; a
   disconnect removes it.
3. **Timing** (§4.6). Every month this waits, the `layoutAlgorithm` removal
   gets more expensive, and after release it is breaking.
4. **The substrate already exists and is proven** (§4.5). `NodesComposition` is
   Core-only and sankey uses it standalone, so D is not speculative.

C over D because §5.1 is the one genuinely strong counter-argument: flowchart
is the *only* other series that draws stroked node-to-node links, so
duplicating that path is duplicating the thing most worth sharing. If appetite
for refactoring networkgraph is absent, D is still better than the status quo —
accept the duplication, and note it explicitly so the next node/link series
extracts the base instead of making a third copy.

**Do B this week regardless.** It is small, it is not wasted work under any
later choice, and it stops the series from shipping an inert
`layoutAlgorithm`. If the answer to the structural question turns out to be
"stay connected", B is the mitigation that makes staying defensible.

### What would change my mind

- If networkgraph is itself scheduled for a rewrite, wait and do C as part of
  it rather than ahead of it.
- If "pluggable graph layouts" is already a wanted product direction, E stops
  being a workaround and becomes the coherent design — at the cost of the
  bundle argument.
- If flowchart is meant to stay a study-adjacent experiment rather than a
  supported type, A + B is proportionate and nothing else is worth the effort.

---

## 8. Measurement method

- Option trees: loaded `code/highcharts.src.js` +
  `modules/networkgraph.src.js` + `modules/flowchart.src.js` in jsdom via
  `test/ts-node-unit-tests/test-utils.ts`, dumped
  `getOptions().plotOptions`, deep-diffed. Script was temporary and removed.
- Inheritance tally: `grep` for `public <name>(` in
  `NetworkgraphSeries.ts` / `NetworkgraphPoint.ts` against `super.` calls and
  method declarations in `ts/Series/Flowchart/`.
- Byte counts: `wc -c` on `ts/Series/**` and `ls -la` on `code/modules/**`.
  Uncompressed source; `.d.ts` files excluded from the "emitting source"
  figures.
- Bundle contents: `grep` for `NodesComposition`, `DragNodesComposition`,
  `ReingoldFruchtermanLayout`, `QuadTree`, `composeTextPath` in
  `code/modules/flowchart.src.js`.
- Independence claims: `grep` on the `import` blocks of
  `NodesComposition.ts` and `Sankey/SankeySeries.ts`.
