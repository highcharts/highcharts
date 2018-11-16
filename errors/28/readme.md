# Fallback to export server disabled

This happens when the offline export module encounters a chart that it can't 
export successfully, and the fallback to the online export server is disabled.
The offline exporting module will fail for certain browsers, and certain 
features (e.g.
[exporting.allowHTML](https://api.highcharts.com/highcharts/exporting.allowHTML)
), depending on the type of image exporting to. For a compatibility overview,
see
[Client Side Export](https://www.highcharts.com/docs/export-module/client-side-export).

For very complex charts, it's possible that exporting fail in browsers that
don't support Blob objects, due to data URL length limits. It's always
recommended to define the
[exporting.error](https://api.highcharts.com/highcharts/exporting.error)
callback when disabling the fallback, so that details can be provided to the end-user
if offline export isn't working for them.
