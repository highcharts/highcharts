Conditional Tracks
===

Both instrument and speech tracks support the [activeWhen](https://api.highcharts.com/highcharts/sonification.defaultInstrumentOptions.activeWhen) option that determines when the track should play.

This option can either be a function callback or a configuration object. By default a track is always active, but by setting this option it can be configured to only play at certain times.

Below is a demo showing how this can be used to create "zones" in the chart with different configurations for different areas of the chart.

<iframe style="width: 100%; height: 455px; border: none;" src=https://www.highcharts.com/samples/embed/highcharts/sonification/mapping-zones allow="fullscreen"></iframe>

Next Steps
----------
Conditional tracks is also one of the ways to create [audio notifications](https://www.highcharts.com/docs/sonification/notifications) and earcons, which is the topic we will explore next.
