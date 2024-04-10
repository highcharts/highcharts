Context Cues
===

Context tracks are tracks that are not linked to a data series, but play in the background to provide additional context.

Both instrument and speech tracks can be used as context tracks, and like other track they can also be [conditional](https://www.highcharts.com/docs/sonification/conditional-tracks).

Defining Context Tracks
-----------------------

Context tracks can be defined both globally for the chart, using [sonification.globalContextTracks](https://api.highcharts.com/highcharts/sonification.globalContextTracks), and per series, using [series.sonification.contextTracks](https://api.highcharts.com/highcharts/series.line.sonification.contextTracks).

They have a few options that are not found on regular tracks.

First off is [timeInterval](https://api.highcharts.com/highcharts/series.line.sonification.contextTracks.timeInterval). If this option is set, the context track will play at a fixed time interval, for example every 500 milliseconds.

Then there are the [valueInterval](https://api.highcharts.com/highcharts/series.line.sonification.contextTracks.valueInterval) and [valueProp](https://api.highcharts.com/highcharts/series.line.sonification.contextTracks.valueProp) options. If these are set, the context track will play at regular intervals for the `valueProp`. For example, if `valueProp` is set to `x`, and `valueInterval` is set to `10`, the track will play once for every 10th X-value.

The below demo shows how context tracks can be used to signify plot lines and plot bands.

<iframe style="width: 100%; height: 495px; border: none;" src=https://www.highcharts.com/samples/embed/highcharts/demo/plotline-context allow="fullscreen"></iframe>

Next Steps
----------
With most of the configuration handled, the next step is exploring [navigation for audio charts](https://www.highcharts.com/docs/sonification/navigation).
