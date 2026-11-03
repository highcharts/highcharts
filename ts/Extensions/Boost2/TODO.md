# Boost2 - open work

Scope of the current proof of concept: the `line` series, drawn as a
hardware line at `lineWidth: 1`, as a miter-joined ribbon above it, with
optional circular markers.

## Defects

- **Sharp joins collapse the stroke.** The miter is clamped to the SVG
  default `stroke-miterlimit` of 4, but in a shared-vertex strip the
  clamped vertex also defines the edge of both neighbouring segments, so
  the whole segment thins instead of only the corner being cut. Measured
  on a zigzag at `lineWidth: 3`: 0.84 px of actual width. SVG does not
  have this because its fallback is a bevel, which preserves segment
  width. Fix direction: four vertices per point, so each segment carries
  its own normals, with a gap on the outside of sharp turns.

- **The series is missing from a shared tooltip.** `getHoverData`
  collects the other members with `find(s.points, ...)`, and this module
  keeps `series.points` empty on purpose. Measured over 63 cursor
  positions: an all-SVG chart shows `A+B` in 59, the same chart with one
  series on the GPU shows only `B` in 60. Fix direction: a branch in
  `getHoverData` that asks the strategy instead of scanning `points`.

- **No antialiasing on the ribbon.** Edges are hard. The analytic
  approach is already proven on markers, where coverage matches `pi*r^2`
  to 0.02%; it needs a distance-from-centre varying on the ribbon.

- **`lineWidth: 1` is one device pixel.** The hardware line primitive
  ignores the device pixel ratio, so on a 2x display the stroke is half
  the thickness of the SVG one.

## Options that silently render differently

These are not rejected by `isSupported`, so a chart using them is drawn
without them rather than falling back to SVG. Each needs either support
or a guard.

- `step` - steps are ignored; segments are drawn straight.
- `connectNulls` - a null always breaks the strip.
- `negativeColor` - the whole series takes one color. `setOptions` turns
  it into an entry of `series.zones`, while `isSupported` guards on
  `options.zones`, which stays empty. Guarding on `series.zones` instead
  would cover both.
- `dataLabels` - `drawDataLabels` iterates `series.points`, which is
  empty, so no labels appear.
- `linecap` - caps and joins are butt and miter regardless of the option.
- Ordinal axes. The shader maps x linearly between `xAxis.min` and
  `xAxis.max`, while an ordinal axis spaces points by index, so positions
  would diverge wherever the data has gaps. Needs a guard at least.

## Options that fall back to SVG

Already guarded in `isSupported`, listed as the roadmap of what the GPU
path does not yet draw.

- Series types other than `line`; `area` and `column` are the next ones.
- `dashStyle`
- `stacking`
- `zones`
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
- Hover state rendering: `halo` and `states.hover` draw from
  `point.graphic`, which no longer exists.
- Series visibility, legend interaction and the inactive state.
- `series.update` and incremental data: the upload is skipped on column
  array identity, which may be too coarse.
- Crossing `boostThreshold` by zooming destroys the strategy and builds a
  new one, so the whole series is uploaded again on the way back. The
  dirty check lives on the strategy, which no longer exists at that
  point. Caching the buffer across a detach would avoid it.

## Cleanup

- `LineStrategy.stats` is debug instrumentation that nothing in the
  module reads.
- `Boost2.compose` uses `wrap` because a module cannot change the core.
  The branches belong in `Series` itself.
