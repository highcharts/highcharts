Getting Started with Audio Charts
===

Highcharts supports audio charts through the `sonification` module. This tutorial will take you through configuring the module, and go through some key functionality to get you started building audio charts.

Scientifically speaking, sonification is a collective term for conveying information or perceptualizing data using non-speech audio. It is used all around us, imagine for example a grandfather’s clock with has an audible tick every second and chimes every hour.

In data visualization, sonification enables exploring the data without visual aid. It helps people understand the data by using their sense of hearing instead of sight. This can be especially helpful for people with visual disabilities or for situations where visually interpreting the data is difficult, but it can also be used to build more engaging data visualization experiences in general, or to notify users that their attention is needed.

There can be strong accessibility benefits to providing sonification with large datasets, as many blind or low vision users find sonification helpful for getting an overview of the data, as well as identifying trends, patterns, outliers, and points of interest.

In Highcharts, we provide a sonification module to allow you full control of playing your data using sound. The sonification module supports a wide range of different use cases, and is designed with flexibility in mind.

<iframe style="width: 100%; height: 760px; border: none;" src=https://www.highcharts.com/samples/embed/stock/demo/soundscape allow="fullscreen"></iframe>

Installation
------------

Requires the `sonification.js` module. This adds the functions [Chart.sonify](https://api.highcharts.com/class-reference/Highcharts.Chart#sonify), [Chart.toggleSonify](https://api.highcharts.com/class-reference/Highcharts.Chart#toggleSonify), [Series.sonify](https://api.highcharts.com/class-reference/Highcharts.Series#sonify), and [Point.sonify](https://api.highcharts.com/class-reference/Highcharts.Point#sonify), as well as several helper classes, methods, and various functionality for controlling the playback of the chart.

Feature Highlights
----------------------------------------------

* Built-in lightweight synthesizer with several presets for various instruments and sound effects
* Speech support
* Navigation support, including features like timeline filters and scrubbing
* Extended and flexible data mapping to audio and speech parameters
* Use multiple tracks to layer sounds
* Mapping to musical scales
* Multi-axis & logarithmic axis support
* Context tracks / cues
* Conditional tracks and earcons
* MIDI export

Your First Audio Chart
----------------------------------------------

**HTML:**

Let's start with the HTML needed, here we are loading the Highcharts modules from our CDN:

    <script src="https://code.highcharts.com/highcharts.js"></script>
    <script src="https://code.highcharts.com/modules/sonification.js"></script>
    <script src="https://code.highcharts.com/modules/accessibility.js"></script>

    <button id="sonify">Play chart</button>
    <div id="container"></div>

In the HTML above, we define a container where we will create the chart inside (`id="container"`), and a button we will use to trigger playing the chart.

If we had included the [Export module](https://www.highcharts.com/docs/export-module/export-module-overview), we would get a menu item in the chart menu for playing the chart, but here we will keep it simple and just add a button (`id="sonify"`).

**JavaScript:**

We can start with a basic chart with two data series:

    const chart = Highcharts.chart('container', {
        title: {
            text: 'Audio chart'
        },
        series: [{
            data: [4, 5, 6, 5, 7, 9, 11, 13]
        }, {
            data: [1, 3, 4, 2]
        }]
    });

We also need to add a bit of code to handle what happens when the button is clicked:

    document.getElementById('sonify').onclick = () => chart.toggleSonify();

And actually that's all we need! Clicking the "Play chart" button will play back the chart using the default sound configuration.


Setting Basic Configuration Options
----------------------------------------------

<iframe style="width: 100%; height: 455px; border: none;" src=https://www.highcharts.com/samples/embed/highcharts/sonification/chart-sequential allow="fullscreen"></iframe>

**Duration:**

In the above example we have a similar chart to what we defined in the previous section, but we have made a few configuration changes:

    const chart = Highcharts.chart('container', {
        sonification: {
            duration: 3000
        },
        title: {
            text: 'Chart sonified in sequence',
            align: 'left',
            margin: 25
        },
        legend: {
            enabled: false
        },
        series: [{
            data: [4, 5, 6, 5, 7, 9, 11, 13]
        }, {
            data: [1, 3, 4, 2]
        }]
    });

In particular, we have set the sonification [duration](https://api.highcharts.com/highcharts/sonification.duration). This sets the total length of the audio duration in milliseconds, so the chart above will take 3 seconds to play.

**Sequential vs Simultaneous Order:**

The above chart sonifies in sequence, meaning each series plays individually, one after the other. Sometimes you may want to play the data series together, like in this example:

<iframe style="width: 100%; height: 455px; border: none;" src=https://www.highcharts.com/samples/embed/highcharts/sonification/chart-simultaneous allow="fullscreen"></iframe>

This can be achieved by setting the [sonification.order](https://api.highcharts.com/highcharts/sonification.order) option to `simultaneous`.

    sonification: {
        duration: 4000,
        order: 'simultaneous'
    }

The above demo also uses two different sounding instruments, one for each series, which brings us to the next section.

**Tracks:**

The sonification module uses the concept of "Tracks". Each track is a layer of sound, and represents a sequence of sounds played by a single instrument or voice. The demo in the previous section uses two main tracks:

1. The first track plays a piano-like instrument for the first series. 
2. The second track plays a flute-like instrument for the second series.

Each series by default gets one track, with a piano-like instrument sound, but this can easily be changed.

Here is the relevant code from the demo above, where the tracks are defined on each series:

    series: [{
        sonification: {
            tracks: [{
                instrument: 'flute',
                ...
            }]
        },
        data: [ ... ]
    }, {
        sonification: {
            tracks: [{
                instrument: 'piano',
                ...
            }]
        },
        data: [ ... ]
    }]

Here we are using the [series.sonification.tracks](https://api.highcharts.com/highcharts/series.line.sonification.tracks) option to set the tracks that we want for each series.

There are two types of tracks available:

1. Instrument tracks: Tracks that play an instrument sound, using the built-in synthesizer
2. Speech tracks: Tracks that speak announcements using speech synthesis

It is perfectly possible to have multiple tracks for each series, and have them [play at different times](https://www.highcharts.com/docs/sonification/conditional-tracks), or with different configuration options.

**Default Track Options:**

There are a few ways to define tracks using the sonification module.

Firstly, all series get an instrument track by default. You can set default options that apply to all instrument tracks in the chart using the [sonification.defaultInstrumentOptions](https://api.highcharts.com/highcharts/sonification.defaultInstrumentOptions) option.

    sonification: {
        duration: 4000,
        defaultInstrumentOptions: {
            instrument: 'flute'
        }
    }

With the above configuration, all instrument tracks will by default use the flute instrument, unless they explicitly say otherwise - for example in the [series.sonification.tracks](https://api.highcharts.com/highcharts/series.line.sonification.tracks) option.

You can also set default options that apply only to a single series and its tracks:

    sonification: {
        duration: 4000
    },
    series: [{
        data: [1, 2, 3, 4, 5],
        sonification: {
            defaultInstrumentOptions: {
                instrument: 'flute'
            },
            tracks: [{
                // other track configuration goes here
            }, {
                // other track configuration goes here
            }]
        }
    }, {
        data: [5, 7, 7, 5, 3]
    }]

**Global Tracks:**

In addition to setting tracks on each series, you can also configure a set of global tracks that will be added to all series. This is done with the [sonification.globalTracks](https://api.highcharts.com/highcharts/sonification.globalTracks) option.

    sonification: {
        duration: 4000,
        defaultInstrumentOptions: {
            instrument: 'flute'
        },
        globalTracks: [{
            instrument: 'piano'
        }, {
            instrument: 'trumpet'
        }]
    }

You can add both instrument and [speech tracks](https://www.highcharts.com/docs/sonification/speech) to the global tracks.

**Context Tracks:**

[Context tracks](https://www.highcharts.com/docs/sonification/context-cues) are tracks that are not tied to a data series, but play at fixed intervals to provide background context. They are often used to indicate specific values such as maximum, minimum, or zero thresholds. They are also often used or provide rhythm and a sense of time, for example by playing a percussive sound on each X axis tick mark.

**Play marker:**

As the chart plays, the [tooltip](https://www.highcharts.com/docs/chart-concepts/tooltip) is shown by default, as well as any [axis crosshairs](https://api.highcharts.com/highcharts/xAxis.crosshair) defined.

This behavior can be turned on and off on the chart and per track:

    sonification: {
        duration: 4000,
        showCrosshair: false,
        showTooltip: false
    },
    series: [{
        data: [1, 2, 3, 4, 5],
        sonification: {
            defaultInstrumentOptions: {
                showPlayMarker: true
            }
        }
    }, {
        data: [5, 7, 7, 5, 3]
    }]

See [sonification.showTooltip](https://api.highcharts.com/highcharts/sonification.showTooltip), [sonification.showCrosshair](https://api.highcharts.com/highcharts/sonification.showCrosshair), and [series.sonification.defaultInstrumentOptions.showPlayMarker](https://api.highcharts.com/highcharts/series.line.sonification.defaultInstrumentOptions.showPlayMarker).

Next Steps:
-----------
With the basics of configuration handled, we can dive into [how data is mapped to sounds](https://www.highcharts.com/docs/sonification/mapping).
