Center columns with empty points
===============

By default, all the columns from the same series are positioned in the same place per category. If user does not provide data for some points, then empty spaces are created between the columns.
Now, we are providing the feature that centers columns when there are no values between them.

The options responsible for that are:
*   **false** `series.ignoreNulls: false` - old behavior.
*   **normal** `series.ignoreNulls: "normal"` - align columns close to the center of category.
*   **evenlySpaced** `series.ignoreNulls: "evenlySpaced"` - distribute the columns evenly.
*   **fillSpace** `series.ignoreNulls: "fillSpace"` - center the columns and let them fill the whole space in category.

Here is a live demo showing the difference between these four options:
<iframe width="100%" height="400" style="null" src=https://www.highcharts.com/samples/embed/highcharts/plotoptions/column-ignorenulls allow="fullscreen"></iframe>