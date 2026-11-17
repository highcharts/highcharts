# Boost2 - open work

Scope of the current proof of concept: the `line` series on a plain or
ordinal axis, straight or stepped, solid or dashed, drawn at any width as
a ribbon with miter and bevel joins, or as a one pixel hairline under
`boostHairline`, with optional circular markers and data labels. Axes may
be reversed and the chart inverted.

## Defects

- **The series is missing from a shared tooltip.** `getHoverData`
  collects the other members with `find(s.points, ...)`, and this module
  keeps `series.points` empty on purpose. Measured over 63 cursor
  positions: an all-SVG chart shows `A+B` in 59, the same chart with one
  series on the GPU shows only `B` in 60. Fix direction: a branch in
  `getHoverData` that asks the strategy instead of scanning `points`.

- **The hover marker appears at full size instead of growing into it.**
  A point without its own marker element gets the shared
  `stateMarkerGraphic` of the core, which is placed with `attr` on the
  normal hover path, since `move` is a parameter of `Point.setState` and
  only the tooltip-follow callers pass it. SVG animates `point.graphic`
  from the plain radius to the hover one instead.

  Only applies while markers are visible: with them off the points carry
  no graphic in SVG either, so both paths take the same element and look
  the same. Measured on a series of 2000 points, markers on and off.

  Fix direction: wrap `Point.setState`, branch on `series.gpu`, place the
  state marker at the plain size and animate it to the hover one. No
  frame loop is involved, the element is SVG. Worth measuring whether the
  GPU marker underneath shows through while the two sizes are close.

## Options that silently render differently

These are not rejected by `isSupported`, so a chart using them is drawn
without them rather than falling back to SVG. Each needs either support
or a guard.

- `linecap` - caps and joins are butt and miter regardless of the option.
- `clip: false` applies to the graph, which inherits the series group
  clip, but not to markers, which are drawn whole or not at all by their
  own coordinate.
- `boostHairline` draws one device pixel, so it thins as the pixel ratio
  rises: measured 0.8 CSS px at 1.25 and 0.33 at 3, where SVG holds one
  CSS pixel throughout.

## Options that fall back to SVG

Already guarded in `isSupported`, listed as the roadmap of what the GPU
path does not yet draw.

- Series types other than `line`; `area` and `column` are the next ones.
- `stacking`
- Zones carrying more than a color: a `fillColor` or a `dashStyle` of
  their own, and styled mode, where the color lives in a class. Any
  number of y zones is drawn; `zoneAxis: 'x'` falls back, since zone
  values would have to be shifted by the buffer origin.
- Markers: any symbol other than `circle`, `marker.fillColor`,
  `marker.lineWidth`. The guard follows the automatic enabling rule, so
  such a series stays on the GPU while its markers are hidden and falls
  back once zooming would show them. Since the default symbol cycles per
  series index, the second and later line series of a chart leave the GPU
  path at that zoom level until the other symbols are drawn.
- Unsorted data (`requireSorting` false), which also rules out `scatter`:
  `hitAt` is a binary search over the x column, so an unsorted series
  needs a different hit test.
- A `dashStyle` of more than eight runs, or of an odd number of them,
  which repeats with on and off swapped. Every style the core names is
  six or fewer and even, so this guards hand-written patterns.
- Logarithmic axes.
- An ordinal axis shared with another series, or one whose table of
  positions is shorter than the rows in view, which means duplicate x.
  A series that fills the table alone is drawn on the GPU: its row
  index is its position in the table, so `slope * index + offset`
  replaces the value. `connectNulls` also falls back there, since it
  compacts the buffer and breaks the row-to-index match.
- Grouped data. Grouping replaces the table the core reads, while this
  path reads the raw columns; `extremes` would also index the raw column
  with a count taken from the grouped table.

## Unverified

- Data labels are kept for the rows in view, as SVG keeps them for its
  cropped points. Nothing bounds that set, so labels on a series zoomed
  fully out carry the point objects the module exists to avoid. SVG has
  the same ceiling, but it is worth knowing where it is.

- `hitAt` searches every point, while the core k-d tree is built from
  `series.points`, the cropped set. A point just outside the view can
  therefore win here and not there, though the distance bound keeps the
  difference to the plot edge.
- Series visibility, legend interaction and the inactive state.
- `series.update` and incremental data: the upload is skipped on column
  array identity, which may be too coarse.
- Crossing `boostThreshold` by zooming destroys the strategy and builds a
  new one, so the whole series is uploaded again on the way back. The
  dirty check lives on the strategy, which no longer exists at that
  point. Caching the buffer across a detach would avoid it.

## Accepted differences

- Coordinates reach the shader as an offset from the origin of their
  block of 1024 rows, which only helps while rows next to each other in
  the buffer are also close in value. Sorted x with even spacing and a
  y that moves slowly both qualify. A block straddling a long gap in x,
  or a scatter whose y jumps over a wide range, falls back to the
  precision of a plain float, which is what the module had before. The
  upload records the largest offset it wrote on each axis, so whether a
  given series is served well is a measurement rather than a guess.

- A gap left by nulls is about two pixels wider than the SVG one, since
  a NaN vertex discards every triangle that touches it. Measured on a run
  of ten nulls at four hundred points across a 660 pixel plot: 17 empty
  columns against 15.

- A series with more than one zone blends source-over rather than with
  `max`, because the latter mixes channels where two colors overlap and
  produced a color belonging to neither. Dense zoned data therefore
  carries the overlap of its own antialiased edges, measured at 8% above
  SVG on an unzoned series before the switch.

## Unmeasured

- `boostHairline` cuts the vertex count to a quarter, but the GPU draw
  measured 0.2 ms of a 159 ms frame, so the saving has no established
  effect on frame time. It needs a measurement across many charts before
  being presented as a performance option rather than a visual one.

## Cleanup

- `LineStrategy.stats` is debug instrumentation that nothing in the
  module reads.
- `Boost2.compose` uses `wrap` because a module cannot change the core.
  The branches belong in `Series` itself.
