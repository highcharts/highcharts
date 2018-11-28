# Unsupported color format used for color interpolation

Highcharts supports three color formats primarily: hex (`#FFFFFF`), rgb
(`rgba(255,255,255)`) and rgba (`rgba(255,255,255,1)`). If any other format,
like 3-digit colors (`#FFF`), named colors (`white`) or gradient structures are
used in for example a heatmap, Highcharts will fail to interpolate and will 
instead use the end-color with no interpolation applied.

We've chosen to preserve this limitation in order to keep the weight of the
implementation at a minimum.
