Here's a POC with new map and using mapbubble for the spatial heatmap. It works
for this case since the points are so dense, but it is slow (1 second) because
it relies on rendring an SVG shape for each bubble. It's acceptible I would say
as long as we don't do too much redrawing or zooming on the chart. Besides, the
existing heatmap chart was slower.

On a side note, adapting the Boost module to maps may not be very hard, we just
need to run the projection first and feed the [x, y] coordinates into the boost
logic.