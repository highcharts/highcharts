# Candlestick and volume width calculations
The plugin adds `baseVolume`, a string option to the series options. The option should refer to the other `series.id` on which it will base width calculations. Note that the column series should refer to its own `series.id`.

This series plugin works with the `Candlestick` and `Column` series types.
