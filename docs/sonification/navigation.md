Navigation for Audio Charts
===

<iframe style="width: 100%; height: 635px; border: none;" src=https://www.highcharts.com/samples/embed/highcharts/demo/sonification-navigation allow="fullscreen"></iframe>

There is various functionality available for dealing with navigation of audio charts in Highcharts.

Good navigation is often critical for accessibility, as blind and low vision users may rely on keyboard navigation to explore the chart. Enabling interactive sonification where the user can pause the playback and explore the audio chart in detail takes the accessibility of the experience to a different level. For example, a user may play back the chart, hear something interesting, pause it, and move back to that point to investigate that area in more detail.

The above demo illustrates some of these capabilities, which is easily set up using built-in functions such as [chart.sonification.playAdjacent](https://api.highcharts.com/class-reference/Highcharts.Sonification#playAdjacent) and [chart.sonification.playAdjacentSeries](https://api.highcharts.com/class-reference/Highcharts.Sonification#playAdjacentSeries).

Filtering Events
----------------

Another concept that comes in handy when building navigation experiences with audio charts is audio event filtering.

Several of the playback functions accept an event filter, which filters which audio events to play.

For example:

    chart.sonification.playAdjacent(true, onEndCallback, (e) => {
        const point = e.relatedPoint || {};
        return point.color === 'red';
    });

The above function call will play the next red data point.

Scrubbing
---------

Scrubbing is a term used for drag-playback, where the user is dragging either a control, their mouse, or using touch to control the playback. This enables the user to control the speed of the sonification, and also which part of the chart is being played.

Highcharts has a builtin [chart.sonification.playSegment](https://api.highcharts.com/class-reference/Highcharts.Sonification#playSegment) function that helps facilitate scrubbing interaction.

The below demo illustrates how this can be used.

<iframe style="width: 100%; height: 565px; border: none;" src=https://www.highcharts.com/samples/embed/highcharts/sonification/scrubbing allow="fullscreen"></iframe>
