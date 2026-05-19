# Missing **highcharts.css** file

This error occurs if you enable [styled mode](https://api.highcharts.com/highcharts/chart.styledMode)
(`chart.styledMode = true`) without including the required
**highcharts.css** file. Without this stylesheet, charts cannot be
rendered correctly.

To fix this, make sure to load the official stylesheet in your page:
[Style by CSS](https://www.highcharts.com/docs/chart-design-and-style/style-by-css).
