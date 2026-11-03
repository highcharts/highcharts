# Boost2 - open work

Scope of the current proof of concept: the `line` series, drawn at any
width as a ribbon with miter and bevel joins, or as a one pixel hairline
under `boostHairline`, with optional circular markers.

## Defects

- **The series is missing from a shared tooltip.** `getHoverData`
  collects the other members with `find(s.points, ...)`, and this module
  keeps `series.points` empty on purpose. Measured over 63 cursor
  positions: an all-SVG chart shows `A+B` in 59, the same chart with one
  series on the GPU shows only `B` in 60. Fix direction: a branch in
  `getHoverData` that asks the strategy instead of scanning `points`.

## Options that silently render differently

These are not rejected by `isSupported`, so a chart using them is drawn
without them rather than falling back to SVG. Each needs either support
or a guard.

- `step` - steps are ignored; segments are drawn straight.
- `connectNulls` - a null always breaks the strip.
- `dataLabels` - `drawDataLabels` iterates `series.points`, which is
  empty, so no labels appear.
- `linecap` - caps and joins are butt and miter regardless of the option.
- `clip: false` applies to the graph, which inherits the series group
  clip, but not to markers, which are drawn whole or not at all by their
  own coordinate.
- Ordinal axes. The shader maps x linearly between `xAxis.min` and
  `xAxis.max`, while an ordinal axis spaces points by index, so positions
  would diverge wherever the data has gaps. Needs a guard at least.

## Options that fall back to SVG

Already guarded in `isSupported`, listed as the roadmap of what the GPU
path does not yet draw.

- Series types other than `line`; `area` and `column` are the next ones.
- `dashStyle`
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
- Inverted charts.
- Logarithmic axes.

## Unverified

- Null gaps. A NaN point discards the triangles around it, so the gap may
  be a few pixels wider than the SVG one. Not measured.
- `hitAt` searches every point, while the core k-d tree is built from
  `series.points`, the cropped set. A point just outside the view can
  therefore win here and not there, though the distance bound keeps the
  difference to the plot edge.
- Hover state rendering: `halo` and `states.hover` draw from
  `point.graphic`, which no longer exists.
- Series visibility, legend interaction and the inactive state.
- `series.update` and incremental data: the upload is skipped on column
  array identity, which may be too coarse.
- Crossing `boostThreshold` by zooming destroys the strategy and builds a
  new one, so the whole series is uploaded again on the way back. The
  dirty check lives on the strategy, which no longer exists at that
  point. Caching the buffer across a detach would avoid it.

## Accepted differences

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
