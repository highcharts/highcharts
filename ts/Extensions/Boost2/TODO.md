# Boost2 - open work

Scope of the current proof of concept: the `line` series on a plain or
ordinal axis, straight or stepped, solid or dashed, drawn at any width as
a ribbon with miter and bevel joins, or as a one pixel hairline under
`boostHairline`, with optional markers of any built-in symbol and data labels. Axes may
be reversed and the chart inverted.

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
- `Series.markerAttribs` snaps a marker's x through `crisp`, which this
  path does not, so a marker can sit half a pixel from the SVG one. The
  width of its outline matches: measured 4.00, 8.01 and 16.01 against
  3.99, 7.99 and 15.99 across a cut.
- Where a marker outline meets its fill sits under a pixel from the SVG
  edge on a cornered symbol, measured at 0.37 px on a diamond. The area
  the symbol covers as a whole matches: 1595 against 1596 there, and
  within 0.4% on every built-in symbol at stroke widths 0 and 6.

## Options that fall back to SVG

Already guarded in `isSupported`, listed as the roadmap of what the GPU
path does not yet draw.

- Series types other than `line`; `area` and `column` are the next ones.
- `stacking`
- Zones carrying more than a color: a `fillColor` or a `dashStyle` of
  their own, and styled mode, where the color lives in a class. Any
  number of y zones is drawn; `zoneAxis: 'x'` falls back, since zone
  values would have to be shifted by the buffer origin.
- Markers drawn from an image, which `symbol: 'url(...)'` asks for and
  no distance field can express.
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
