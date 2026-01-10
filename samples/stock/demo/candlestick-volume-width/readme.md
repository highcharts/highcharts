# Candlestick and volume width calculations
This plugin varies the width of candlestick and column points based on data values, in this case the volume.
The plugin adds a `baseVolume` option to the series. The `baseVolume` in the candlestick series should be set to the `series.id` of the column series on which it will base width calculations. The `baseVolume` option in the column series should refer to its own
`series.id`. With this setup, both series will have the same width calculations.

This series plugin works with the `Candlestick`, `HollowCandlestick`, `Heikin Aishi` and `Column` series types.
